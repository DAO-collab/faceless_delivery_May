use bn::{G1, Fr as Scalar};
use borsh::BorshSerialize;
use borsh::maybestd::vec::Vec;

pub trait ScalarToBytes {
    fn to_bytes_le(&self) -> Vec<u8>; 
}

impl ScalarToBytes for Scalar {
    fn to_bytes_le(&self) -> Vec<u8> {
        // BorshSerialize is already little endian
        self.try_to_vec().unwrap()
    }
}

pub trait PointToBytes {
    fn to_compressed(&self) -> Vec<u8>;
}

impl PointToBytes for G1 {
    fn to_compressed(&self) -> Vec<u8> {
        // TODO: for now, this implementation is fake. It doesn't actually compress the point.
        self.try_to_vec().unwrap()
    }
}
