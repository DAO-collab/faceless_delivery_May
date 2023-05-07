#[derive(Clone, Debug, Eq, PartialEq)]
pub enum IbeError {
    GtInverseError,
    OutOfBoundError,
}

pub enum ZkError {
    ProofError,
    VerificationError,
}
