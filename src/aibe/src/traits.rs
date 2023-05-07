use crate::errors::IbeError;
use bn::{G1, G2, Gt};
use borsh::{BorshSerialize};
use borsh::maybestd::vec::Vec;

pub trait IdentityBasedEncryption {
    type CipherText;
    type PlainData;
	type MasterSecretKey;
	type MasterPublicKey;
	type IdSecretKey;
    type Scalar;

	fn generate_key(&mut self) -> (Self::MasterSecretKey, Self::MasterPublicKey);
    fn encrypt(&mut self, msg: &Self::PlainData, id: &str, mpk: &Self::MasterPublicKey) -> Self::CipherText;
    fn encrypt_with_randomness(&mut self, msg: &Self::PlainData, id: &str, mpk: &Self::MasterPublicKey, r: Self::Scalar) -> Self::CipherText;
    fn encrypt_correlated(&mut self, msg: &Self::PlainData, ids: (&str, &str), mpks: (&Self::MasterPublicKey, &Self::MasterPublicKey)) -> (Self::CipherText, Self::CipherText);
    fn extract(&mut self, id: &str, msk: &Self::MasterSecretKey) -> Self::IdSecretKey;
    fn decrypt(&mut self, cipher: &Self::CipherText, id: &str, sk: &Self::IdSecretKey, bound: u64) -> Result<Self::PlainData, IbeError>;
}

pub trait ToBytes {
	fn to_bytes(&self) -> Vec<u8>;
}

impl ToBytes for Gt {
	fn to_bytes(&self) -> Vec<u8> {
        self.try_to_vec().unwrap()
    }
}

impl ToBytes for G1 {
	fn to_bytes(&self) -> Vec<u8> {
        self.try_to_vec().unwrap()
    }
}

impl ToBytes for G2 {
	fn to_bytes(&self) -> Vec<u8> {
        self.try_to_vec().unwrap()
    }
}
