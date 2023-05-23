import { defineStore } from "pinia";
import init, { IbeWrapper } from 'faceless-wasm-wrapper';
import { platform_id, derive_pk_id } from "@/utils/account";
import { faceless_dfinity_backend } from "../../../faceless_dfinity_backend_declarations";
import { ledger } from "../../../ledger_declarations";
import { FacelessClient } from "../client";
import {AuthClient} from '@dfinity/auth-client';
import {Principal} from '@dfinity/principal';
import {hexToBytes, principalToAccountDefaultIdentifier} from '@/utils/helper';


class DfinityFacelessClient implements FacelessClient {
  ibe: IbeWrapper;
  ibe_keypair: null | [string, string];
  faceless_deposit_address: any;
  principal: Principal;

  constructor() {
    this.ibe = undefined;
    this.ibe_keypair = null;
    this.faceless_deposit_address = null;
    this.principal = Principal.anonymous();
  }

  wallet_address(): string {
    return this.principal.toString();
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
    console.log("key pair: ", this.ibe_keypair);

    this.faceless_deposit_address = await faceless_dfinity_backend.getDepositAddress();
    // Delegate enough ICP to the faceless canister for testing. 
    // In reality, the user should first delegate ICP to faceless.
    // ERROR: This doesn't work because the API doesn't allow to call transfer from anonymous principal...
    // let ledger_receipt = await ledger.transfer({
    //     memo: BigInt(0x1),
    //     amount: { e8s: 1000000 }, // 1 million ICP e8s
    //     fee: { e8s: 10000},
    //     to: this.deposit_address,
    //     from_subaccount: [],
    //     created_at_time: [],
    // });
    // console.log("Ledger->Faceless deposit result: ", ledger_receipt);
    console.log("anonymous principal: ", Principal.anonymous().toString());

    let default_balance = await ledger.account_balance({
      account: hexToBytes(principalToAccountDefaultIdentifier(Principal.fromText("xicnf-rbdmk-5rhhn-3puot-grqn7-ec6tz-hkdpd-ev7tq-p2wk4-27j7h-hqe")))
    });
    console.log("ledger balance of default: ", default_balance);
    let anonymous_balance = await ledger.account_balance({
      account: hexToBytes(principalToAccountDefaultIdentifier(Principal.fromText("2vxsx-fae")))
    });
    console.log("ledger balance of anonymous: ", anonymous_balance);

    let anonymous_delegate_balance = await faceless_dfinity_backend.getDelegateBalance(Principal.fromText("2vxsx-fae"));
    console.log("anonymous delegate balance: ", anonymous_delegate_balance);
  }

  async balance(platform: string, id: string) {
    if (!this.is_initialized())
      return 0;

    // `!` is a non-null assertion operator:
    //  https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-
    
    const pk_id = derive_pk_id(platform, id, this.ibe_keypair![1]);
    let enc_balance = await faceless_dfinity_backend.getBalance(pk_id);
    console.log("Encrypted balance: ", enc_balance);
    if (enc_balance == "InvalidAccount") {
      console.error("Failed to read account balance");
      return 0;
    }
    else {
      // Remember to use the platform+id to extract the key
      let sk = this.ibe.extract(platform_id(platform, id), this.ibe_keypair![0]);
      // Decrypt the balance
      let balance = this.ibe.decrypt(enc_balance, id, sk, 1000);
      console.log("Decrypted balance: ", balance);
      return balance;
    }
  }

  async register(platform: string, id: string) {

    const pk_id = derive_pk_id(platform, id, this.ibe_keypair?.[1]);

    await faceless_dfinity_backend.register(pk_id);
    console.log("registered id: ", pk_id);
  }

  async deposit(value: number, platform: string, id: string) {
    let value_ = Number(value);
  
    const pk_id = derive_pk_id(platform, id, this.ibe_keypair?.[1]);
    let receipt = await faceless_dfinity_backend.deposit(pk_id, value_);
    if (receipt.hasOwnProperty("Err")) {
      console.error("Deposit error:, ", JSON.stringify(receipt));
    }
  }
  
  async withdraw(destination: string, value: number, platform: string, id: string) {
    console.log("destination: ", destination);
    let value_ = Number(value);

    const pk_id = derive_pk_id(platform, id, this.ibe_keypair?.[1]);
    let receipt = await faceless_dfinity_backend.withdraw(pk_id, value_, Principal.fromText(destination));
    if (receipt.hasOwnProperty("Err")) {
      console.error("Withdraw error:, ", JSON.stringify(receipt));
    }
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

    let receipt = await faceless_dfinity_backend.transfer(sender_pk_id, receiver_pk_id, amount1, amount2);
    if (receipt.hasOwnProperty("Err")) {
      console.error("Transfer error:, ", JSON.stringify(receipt));
    }
  }
}

const initDfinityFaceless = async () => {
  let client = new DfinityFacelessClient();
  await client.initialize();
  return client;
}

// const useDfinity = defineStore("dfinity", {
//   state: () => ({
//     client: {} as FacelessClient,
//   }),

//   getters: {},

//   actions: {},
// });



export { initDfinityFaceless };
