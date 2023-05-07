use candid::{CandidType, Nat, Principal};


#[derive(CandidType)]
pub enum FacelessErr {
    InvalidAccount,
    BalanceLow,
    TransferFailure,
}

pub type FacelessReceipt = Result<Nat, FacelessErr>;

#[derive(CandidType)]
pub struct Balance {
    pub owner: Principal,
    pub token: Principal,
    pub amount: Nat,
}