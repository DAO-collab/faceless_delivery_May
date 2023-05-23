/// Takes inspiration from the Defi example code:
/// https://internetcomputer.org/docs/current/samples/dex
/// https://github.com/dfinity/examples/blob/master/rust/defi/src/defi_dapp/lib.rs

use std::cell::RefCell;
use candid::{candid_method, export_service, Nat, Principal};
use ic_cdk::caller;
use ic_cdk_macros::*;
use ic_ledger_types::{
    AccountIdentifier, Memo, Tokens, DEFAULT_SUBACCOUNT, MAINNET_LEDGER_CANISTER_ID,
};
use aibe::zk::burn::{BurnStatement, BurnProof, BurnVerifier};
use aibe::zk::transfer::{TransferStatement, TransferProof, TransferVerifier};
use aibe::bf_ibe::{BFIbe, CipherText, PlainData, MasterSecretKey, MasterPublicKey, IdSecretKey, G1, G2, Gt, pairing, Group};
use aibe::utils::{u64_to_scalar};
use borsh::de::BorshDeserialize;
use borsh::ser::BorshSerialize;

mod exchange;
mod types;
mod utils;
mod ibe_wrapper;

use exchange::Balances;
use types::*;
use utils::{principal_to_subaccount, nat_to_u64};
use ibe_wrapper::IbeWrapper;

const ICP_FEE: u64 = 10_000;

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::default());
}

#[derive(Default)]
pub struct State {
    owner: Option<Principal>,
    ledger: Option<Principal>,
    balances: Balances,
}

#[update]
#[candid_method(oneway)]
pub fn clear() {
    STATE.with(|s| {
        let mut state = s.borrow_mut();

        assert!(state.owner.unwrap() == caller());
        state.balances.0.clear();
    })
}

#[init]
fn init(ledger: Option<Principal>) {
    ic_cdk::setup();
    STATE.with(|s| {
        s.borrow_mut().owner = Some(caller());
        s.borrow_mut().ledger = ledger;
    });
}

#[update]
fn register(pk_id: String) {
    // Create encryption of 0
    let ct_0 = G1::one();
    let ct_1 = Gt::try_from_slice(base64::decode(pk_id.clone()).unwrap().as_slice()).unwrap();
    let zero_ct = (ct_0, ct_1);

    STATE.with(|s| {
        s.borrow_mut()
            .balances
            .add_balance(pk_id.clone(), zero_ct)
    });

    ic_cdk::println!(
        "Account registered for PK-ID: {}",
        pk_id
    );
}

#[update]
#[candid_method(update)]
pub async fn deposit(pk_id: String, amount: Nat) -> FacelessReceipt {

    let caller = caller();
    deposit_icp(caller, &amount).await?;

    // Add the encryption of amount to current encrypted balance
    let u64_amount = nat_to_u64(&amount).ok_or(FacelessErr::TransferFailure)?;
    let addend = pairing(G1::one(), G2::one()).pow(u64_to_scalar(u64_amount));

    STATE.with(|s| {
        let mut state = s.borrow_mut();
        let mut balance = state.balances.get_balance_mut(pk_id).unwrap();
        balance.1 = balance.1 * addend;
    });    
    
    FacelessReceipt::Ok(amount)
}

async fn deposit_icp(caller: Principal, amount: &Nat) -> Result<Nat, FacelessErr> {
    let canister_id = ic_cdk::api::id();
    let ledger_canister_id = STATE
        .with(|s| s.borrow().ledger)
        .unwrap_or(MAINNET_LEDGER_CANISTER_ID);

    let u64_amount = nat_to_u64(amount).ok_or(FacelessErr::TransferFailure)?;
    let account = AccountIdentifier::new(&canister_id, &principal_to_subaccount(&caller));

    let balance_args = ic_ledger_types::AccountBalanceArgs { account };
    let balance = ic_ledger_types::account_balance(ledger_canister_id, balance_args)
        .await
        .map_err(|_| FacelessErr::TransferFailure)?;

    if balance.e8s() < u64_amount + ICP_FEE {
        return Err(FacelessErr::BalanceLow);
    }

    let transfer_args = ic_ledger_types::TransferArgs {
        memo: Memo(0),
        amount: Tokens::from_e8s(u64_amount), 
        fee: Tokens::from_e8s(ICP_FEE),
        // When we call the `transfer` function, the caller is this canister, hence the
        // transfer is from "(canister_id, caller)", which is the `account` variable above.
        from_subaccount: Some(principal_to_subaccount(&caller)),
        to: AccountIdentifier::new(&canister_id, &DEFAULT_SUBACCOUNT),
        created_at_time: None,
    };
    ic_ledger_types::transfer(ledger_canister_id, transfer_args)
        .await
        .map_err(|_| FacelessErr::TransferFailure)?
        .map_err(|_| FacelessErr::TransferFailure)?;

    ic_cdk::println!(
        "Deposit of {} ICP in account {:?}",
        Tokens::from_e8s(u64_amount),
        &account
    );

    Ok(amount.to_owned())
}

#[update]
#[candid_method(update)]
pub async fn withdraw(
    pk_id: String,
    amount: Nat,
    address: Principal,
) -> FacelessReceipt {
    // Verify withdraw ZK proof here

    // Substract the encryption of amount from current encrypted balance
    let u64_amount = nat_to_u64(&amount).ok_or(FacelessErr::TransferFailure)?;
    let deduction = pairing(G1::one(), G2::one()).pow(-u64_to_scalar(u64_amount));

    STATE.with(|s| {
        let mut state = s.borrow_mut();
        let mut balance = state.balances.get_balance_mut(pk_id).unwrap();
        balance.1 = balance.1 * deduction;
    });    

    let account_id = AccountIdentifier::new(&address, &DEFAULT_SUBACCOUNT);
    withdraw_icp(&amount, account_id).await
}

async fn withdraw_icp(amount: &Nat, account_id: AccountIdentifier) -> Result<Nat, FacelessErr> {
    let caller = caller();
    let ledger_canister_id = STATE
        .with(|s| s.borrow().ledger)
        .unwrap_or(MAINNET_LEDGER_CANISTER_ID);

    let u64_amount = nat_to_u64(amount).ok_or(FacelessErr::TransferFailure)?;

    let transfer_amount = Tokens::from_e8s(u64_amount);

    ic_cdk::println!("Transfering of {} ICP to account {:?}", 
        transfer_amount,
        &account_id);

    let transfer_args = ic_ledger_types::TransferArgs {
        memo: Memo(0),
        amount: transfer_amount,
        fee: Tokens::from_e8s(ICP_FEE), // Issue: The fee is paid by this canister, but not the initial caller outside
        from_subaccount: Some(DEFAULT_SUBACCOUNT),
        to: account_id,
        created_at_time: None,
    };
    // ic_ledger_types::transfer(ledger_canister_id, transfer_args)
    //     .await
    //     .map_err(|_| FacelessErr::TransferFailure)
    //     .and_then(|v| v.map_err(|_| FacelessErr::TransferFailure))?;
    if let Err(e) = ic_ledger_types::transfer(ledger_canister_id, transfer_args).await {
        ic_cdk::println!("Transfer error: {:?}", e);
        return Err(FacelessErr::TransferFailure);
    }

    ic_cdk::println!("Withdrawal of {} ICP to account {:?}", 
        Tokens::from_e8s(u64_amount), 
        &account_id);

    Ok(amount.to_owned())
}

#[update]
#[candid_method(update)]
pub async fn transfer(
    pk_id1: String,
    pk_id2: String,
    enc_amount1: String,
    enc_amount2: String,
) -> Result<Nat, FacelessErr> {
    // Verify transfer ZK proof here

    STATE.with(|s| s.borrow().balances.get_balance(pk_id1.clone()))
        .ok_or(FacelessErr::InvalidAccount)?;
    STATE.with(|s| s.borrow().balances.get_balance(pk_id2.clone()))
        .ok_or(FacelessErr::InvalidAccount)?;

    let enc_amount1 = CipherText::try_from_slice(base64::decode(enc_amount1).unwrap().as_slice()).unwrap();
    let enc_amount2 = CipherText::try_from_slice(base64::decode(enc_amount2).unwrap().as_slice()).unwrap();

    STATE.with(|s| {
        let mut state = s.borrow_mut();
        state.balances.add_balance(pk_id1, enc_amount1);
        state.balances.add_balance(pk_id2, enc_amount2);
    });

    Ok(0.into())
}

#[query(name = "verifyWithdraw")]
#[candid_method(query, rename = "verifyWithdraw")]
pub fn verify_withdraw(statement: String, proof: String) -> bool {
    let bs = BurnStatement::try_from_slice(base64::decode(statement).unwrap().as_slice()).unwrap();
    let bp = BurnProof::try_from_slice(base64::decode(proof).unwrap().as_slice()).unwrap();

    let result = BurnVerifier::verify_proof(bs, bp);

    match result {
        Ok(()) => {
            true
        },
        Err(_) => {
            false
        }
    }
}

#[query(name = "verifyTransfer")]
#[candid_method(query, rename = "verifyTransfer")]
pub fn verify_transfer(statement: String, proof: String) -> bool {
    let ts = TransferStatement::try_from_slice(base64::decode(statement).unwrap().as_slice()).unwrap();
    let tp = TransferProof::try_from_slice(base64::decode(proof).unwrap().as_slice()).unwrap();

    let result = TransferVerifier::verify_proof(ts, tp);

    match result {
        Ok(()) => {
            true
        },
        Err(_) => {
            false
        }
    }
}


#[query(name = "getBalance")]
#[candid_method(query, rename = "getBalance")]
pub fn get_balance(pk_id: String) -> String {
    STATE.with(|s| s.borrow().balances.get_balance(pk_id))
        .map(|ct| base64::encode(ct.try_to_vec().unwrap()))
        .unwrap_or("InvalidAccount".to_string())
}

#[update(name = "getDepositAddress")]
#[candid_method(update, rename = "getDepositAddress")]
pub fn get_deposit_address() -> AccountIdentifier {
    let canister_id = ic_cdk::api::id();
    let subaccount = principal_to_subaccount(&caller());

    AccountIdentifier::new(&canister_id, &subaccount)
}

#[update(name = "getAnonymousDepositAddress")]
#[candid_method(update, rename = "getAnonymousDepositAddress")]
pub fn get_anonymous_deposit_address() -> AccountIdentifier {
    let canister_id = ic_cdk::api::id();
    let subaccount = principal_to_subaccount(&Principal::from_text("2vxsx-fae").unwrap());

    AccountIdentifier::new(&canister_id, &subaccount)
}

#[update(name = "getAgentDepositAddress")]
#[candid_method(update, rename = "getAgentDepositAddress")]
pub fn get_agent_deposit_address() -> AccountIdentifier {
    let canister_id = ic_cdk::api::id();

    AccountIdentifier::new(&canister_id, &DEFAULT_SUBACCOUNT)
}

#[update(name = "getDelegateBalance")]
#[candid_method(update, rename = "getDelegateBalance")]
pub async fn get_delegate_balance(owner: Principal) -> i64 {
    let ledger_canister_id = STATE
        .with(|s| s.borrow().ledger)
        .unwrap_or(MAINNET_LEDGER_CANISTER_ID);
    let canister_id = ic_cdk::api::id();
    let subaccount = principal_to_subaccount(&owner);

    let account = AccountIdentifier::new(&canister_id, &subaccount);

    let balance_args = ic_ledger_types::AccountBalanceArgs { account };
    let balance = ic_ledger_types::account_balance(ledger_canister_id, balance_args)
        .await.unwrap();

    return balance.e8s() as i64;
}

#[query]
#[candid_method(query)]
pub fn whoami() -> Principal {
    caller()
}

#[query]
#[candid_method(query)]
pub fn ledger() -> Option<Principal> {
    STATE.with(|s| s.borrow().ledger)
}


/// === Testing utility apis ===

#[query]
#[candid_method(query)]
pub fn generate_key() -> (String, String) {
    IbeWrapper::new().generate_key()
}

#[query]
#[candid_method(query)]
pub fn pk_id(mpk: String, id: String) -> String {
    IbeWrapper::pk_id(mpk, id)
}

#[query]
#[candid_method(query)]
pub fn encrypt_with_randomness(msg: i32, id: String, mpk: String, r: String) -> String {
    IbeWrapper::new().encrypt_with_randomness(msg, id, mpk, r)
}

#[query]
#[candid_method(query)]
pub fn random_scalar() -> String {
    IbeWrapper::new().random_scalar()
}

#[query]
#[candid_method(query)]
pub fn extract(id: String, msk: String) -> String {
    IbeWrapper::new().extract(id, msk)
}

#[query]
#[candid_method(query)]
pub fn decrypt(ct: String, id: String, sk: String, bound: i32) -> i32 {
    IbeWrapper::new().decrypt(ct, id, sk, bound as u32) as i32
}