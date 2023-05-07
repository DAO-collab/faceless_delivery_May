use candid::{CandidType, Nat, Principal};


#[derive(CandidType)]
pub enum DepositErr {
    InvalidAccount,
    BalanceLow,
    TransferFailure,
}

pub type DepositReceipt = Result<Nat, DepositErr>;

#[derive(CandidType)]
pub struct Balance {
    pub owner: Principal,
    pub token: Principal,
    pub amount: Nat,
}

pub type WithdrawReceipt = Result<Nat, WithdrawErr>;

#[derive(CandidType)]
pub enum WithdrawErr {
    InvalidAccount,
    BalanceLow,
    TransferFailure,
}

