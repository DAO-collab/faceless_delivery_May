import { defineStore } from "pinia";
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import type { KeyringPair } from '@polkadot/keyring/types';
import init, { IbeWrapper } from 'faceless-wasm-wrapper';
import { platform_id, derive_pk_id } from "@/utils/account";
import { useConfig } from "../config";

class SubstrateFacelessClient {
  api: ApiPromise;
  account: KeyringPair;
  ibe: IbeWrapper;
  ibe_keypair: null | [string, string];

  constructor(api: ApiPromise, account: KeyringPair) {
    this.api = api;
    this.account = account;
    this.ibe = undefined;
    this.ibe_keypair = null;
  }

  wallet_address() {
    return this.account.address;
  }

  keypair(): [string, string] | null {
      return this.ibe_keypair;
  }

  is_initialized() {
    return this.ibe_keypair;
  }

  // Optional parameter `msk`
  async initialize(msk?: string) {
    await init();
    this.ibe = IbeWrapper.new();
    console.log("IBE: ", this.ibe);
    if (msk === undefined) {
      const kp = this.ibe.generate_key();
      this.ibe_keypair = [kp.msk(), kp.mpk()];
    }
    else {
      const mpk = IbeWrapper.msk_to_mpk(msk);
      this.ibe_keypair = [msk, mpk];
    }
  }

  async balance(platform: string, id: string) {
    if (!this.is_initialized())
      return 0;

    // `!` is a non-null assertion operator:
    //  https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-
    
    const pk_id = derive_pk_id(platform, id, this.ibe_keypair![1]);
    let balance = await this.api.query.faceless.accounts(pk_id);
    if (balance.isNone) {
      console.error("Failed to read account balance");
      return 0;
    }
    else {
      // Convert byte array to string
      balance = String.fromCharCode(...(balance.unwrap()));
      // Remember to use the platform+id to extract the key
      let sk = this.ibe.extract(platform_id(platform, id), this.ibe_keypair![0]);
      // Decrypt the balance
      balance = this.ibe.decrypt(balance, id, sk, 1000);
      console.log("Decrypted balance: ", balance);
      return balance;
    }
  }

  async register(platform: string, id: string) {

    const hashed_id = derive_pk_id(platform, id, this.ibe_keypair?.[1]);
    console.log("registered id: ", hashed_id);

    const unsub = await this.api.tx.faceless
    .register(hashed_id)
    .signAndSend(this.account, async ({ events = [], status, txHash }) => {
      if (status.isFinalized || status.isInBlock) {

        // Loop through Vec<EventRecord> to display all events
        events.forEach(({ phase, event: { data, method, section } }) => {
          console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
        });

        unsub();
      }

    });
  }

  async deposit(value: number, platform: string, id: string) {
  
    const hashed_id = derive_pk_id(platform, id, this.ibe_keypair?.[1]);
  
    const unsub = await this.api.tx.faceless
      .deposit(hashed_id, value)
      .signAndSend(this.account, async ({ events = [], status, txHash }) => {
        if (status.isFinalized || status.isInBlock) {
  
          // Loop through Vec<EventRecord> to display all events
          events.forEach(({ phase, event: { data, method, section } }) => {
            console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
          });
  
          unsub();
        }
  
      });
      
  }
  
  async withdraw(destination: string, value: number, platform: string, id: string) {
    const hashed_id = derive_pk_id(platform, id, this.ibe_keypair?.[1]);
  
    const unsub = await this.api.tx.faceless
      .withdraw(hashed_id, destination, value)
      .signAndSend(this.account, async ({ events = [], status, txHash }) => {
        if (status.isFinalized || status.isInBlock) {  
          // Loop through Vec<EventRecord> to display all events
          events.forEach(({ phase, event: { data, method, section } }) => {
            console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
          });
  
          unsub();
        }
  
      });
      
  }

  async self_transfer(
    value: number, 
    sender_platform: string, 
    sender_id: string,
    receiver_platform: string,
    receiver_id: string) {
    if (!this.ibe_keypair) {
      console.log("Faceless client is not initialized. Call initialize() first.");
      return;
    }
    await this.transfer(value, sender_platform, sender_id, receiver_platform, receiver_id, this.ibe_keypair[1]);
  }

  async transfer(
    value: number, 
    sender_platform: string, 
    sender_username: string,
    receiver_platform: string,
    receiver_username: string,
    receiver_mpk: string) {
    const mpk = this.ibe_keypair![1];
    const sender_pk_id = derive_pk_id(sender_platform, sender_username, mpk);
    const receiver_pk_id = derive_pk_id(receiver_platform, receiver_username, receiver_mpk);
    
    const r = this.ibe.random_scalar();
    const amount1 = this.ibe.encrypt_with_randomness(-value, platform_id(sender_platform, sender_username), mpk, r);
    const amount2 = this.ibe.encrypt_with_randomness(value, platform_id(receiver_platform, receiver_username), receiver_mpk, r);
  
    const unsub = await this.api.tx.faceless
      .transfer(sender_pk_id, receiver_pk_id, amount1, amount2)
      .signAndSend(this.account, async ({ events = [], status, txHash }) => {
        if (status.isFinalized) {
          // Loop through Vec<EventRecord> to display all events
          events.forEach(({ phase, event: { data, method, section } }) => {
            console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
          });
  
          unsub();
        }
  
      });
      
  }
}

const initSubstrateFaceless = async () => {
  const config = useConfig();
  // Initialise the provider to connect to the local node
  const provider = new WsProvider(config.substrate_wss);

  // Create the API and wait until ready
  const api = await ApiPromise.create({ provider });
  console.log("genesis: ", api.genesisHash.toHex());

  // Use a dev account for the demo
  const keyring = new Keyring({type: 'sr25519'});
  const alice = keyring.createFromUri('//Alice');
  const {data: balance} = await api.query.system.account(alice.address);
  console.log(`Alice balance: ${balance.free}`);

  let client = new SubstrateFacelessClient(api, alice);
  await client.initialize();
  return client;
}

// const useSubstrate = defineStore("substrate", {
//   state: () => ({
//     client: {} as FacelessClient,
//   }),

//   getters: {},

//   actions: {},
// });



export { initSubstrateFaceless };
