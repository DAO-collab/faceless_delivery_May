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

mod exchange;
mod types;
mod utils;

use exchange::Exchange;
use types::*;
use utils::{principal_to_subaccount, nat_to_u64};

const ICP_FEE: u64 = 10_000;

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::default());
}

#[derive(Default)]
pub struct State {
    owner: Option<Principal>,
    ledger: Option<Principal>,
    exchange: Exchange,
}

#[update]
#[candid_method(oneway)]
pub fn clear() {
    STATE.with(|s| {
        let mut state = s.borrow_mut();

        assert!(state.owner.unwrap() == caller());
        state.exchange.balances.0.clear();
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

#[query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

// #[update]
// fn register() {
//     // Create encryption of 0
//     let ct_0 = G1::one();
//     let ct_1 = Gt::try_from_slice(base64::decode(pk_id.as_slice()).unwrap().as_slice()).unwrap();
//     let zero_ct = base64::encode((ct_0, ct_1).try_to_vec().unwrap()).into_bytes();

//     Accounts::<T>::insert::<Vec<u8>, Vec<u8>>(pk_id.clone(), zero_ct);
// }

#[update]
#[candid_method(update)]
pub async fn deposit(amount: Nat) -> DepositReceipt {
    let caller = caller();

    deposit_icp(caller, &amount).await?;

    STATE.with(|s| {
        s.borrow_mut()
            .exchange
            .balances
            .add_balance(&caller, amount.to_owned())
    });
    DepositReceipt::Ok(amount)
}

async fn deposit_icp(caller: Principal, amount: &Nat) -> Result<Nat, DepositErr> {
    let canister_id = ic_cdk::api::id();
    let ledger_canister_id = STATE
        .with(|s| s.borrow().ledger)
        .unwrap_or(MAINNET_LEDGER_CANISTER_ID);

    let u64_amount = nat_to_u64(amount).ok_or(DepositErr::TransferFailure)?;
    let account = AccountIdentifier::new(&canister_id, &principal_to_subaccount(&caller));

    let balance_args = ic_ledger_types::AccountBalanceArgs { account };
    let balance = ic_ledger_types::account_balance(ledger_canister_id, balance_args)
        .await
        .map_err(|_| DepositErr::TransferFailure)?;

    if balance.e8s() < u64_amount + ICP_FEE {
        return Err(DepositErr::BalanceLow);
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
        .map_err(|_| DepositErr::TransferFailure)?
        .map_err(|_| DepositErr::TransferFailure)?;

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
    amount: Nat,
    address: Principal,
) -> WithdrawReceipt {
    let caller = caller();
    let ledger_canister_id = STATE
        .with(|s| s.borrow().ledger)
        .unwrap_or(MAINNET_LEDGER_CANISTER_ID);

    let account_id = AccountIdentifier::new(&address, &DEFAULT_SUBACCOUNT);
    withdraw_icp(&amount, account_id).await
}

async fn withdraw_icp(amount: &Nat, account_id: AccountIdentifier) -> Result<Nat, WithdrawErr> {
    let caller = caller();
    let ledger_canister_id = STATE
        .with(|s| s.borrow().ledger)
        .unwrap_or(MAINNET_LEDGER_CANISTER_ID);

    let u64_amount = nat_to_u64(amount).ok_or(WithdrawErr::TransferFailure)?;

    let sufficient_balance = STATE.with(|s| {
        s.borrow_mut().exchange.balances.subtract_balance(
            &caller,
            amount.to_owned() + ICP_FEE,
        )
    });
    if !sufficient_balance {
        return Err(WithdrawErr::BalanceLow);
    }

    let transfer_amount = Tokens::from_e8s(u64_amount);

    let transfer_args = ic_ledger_types::TransferArgs {
        memo: Memo(0),
        amount: transfer_amount,
        fee: Tokens::from_e8s(ICP_FEE), // Issue: The fee is paid by this canister, but not the initial caller outside
        from_subaccount: Some(DEFAULT_SUBACCOUNT),
        to: account_id,
        created_at_time: None,
    };
    let icp_reciept = ic_ledger_types::transfer(ledger_canister_id, transfer_args)
        .await
        .map_err(|_| WithdrawErr::TransferFailure)
        .and_then(|v| v.map_err(|_| WithdrawErr::TransferFailure));

    if let Err(e) = icp_reciept {
        STATE.with(|s| {
            s.borrow_mut().exchange.balances.add_balance(
                &caller,
                amount.to_owned() + ICP_FEE,
            )
        });

        return Err(e);
    }

    ic_cdk::println!("Withdrawal of {} ICP to account {:?}", 
        Tokens::from_e8s(u64_amount), 
        &account_id);

    Ok(amount.to_owned())
}

#[query(name = "getBalance")]
#[candid_method(query, rename = "getBalance")]
pub fn get_balance() -> Nat {
    STATE.with(|s| s.borrow().exchange.get_balance())
}

#[update(name = "getDepositAddress")]
#[candid_method(update, rename = "getDepositAddress")]
pub fn get_deposit_address() -> AccountIdentifier {
    let canister_id = ic_cdk::api::id();
    let subaccount = principal_to_subaccount(&caller());

    AccountIdentifier::new(&canister_id, &subaccount)
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