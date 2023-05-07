use aibe::traits::{IdentityBasedEncryption};
use aibe::bf_ibe::{BFIbe, CipherText, PlainData, MasterSecretKey, MasterPublicKey, IdSecretKey, Scalar};
use aibe::utils::{u64_to_scalar, scalar_to_u64, hash_to_g2, i32_to_scalar};
use rand::Rng;
use borsh::ser::BorshSerialize;
use rand_chacha::ChaCha20Rng;
use rand::SeedableRng;
use borsh::BorshDeserialize;


pub struct IbeWrapper  {
    ibe: BFIbe<ChaCha20Rng>,
}

impl IbeWrapper {
    pub fn new() -> Self {
        let mut rng = ChaCha20Rng::seed_from_u64(342); 
        Self {
            ibe: BFIbe::new(rng)
        }
    }

    pub fn random_scalar(&mut self) -> String {
        let r = self.ibe.random_scalar();
        base64::encode(r.try_to_vec().unwrap())
    }

    /// Convert a master secret key to its master public key.
    pub fn msk_to_mpk(msk: String) -> String {
        let msk = MasterSecretKey::try_from_slice(base64::decode(msk).unwrap().as_slice()).unwrap();
        let mpk = BFIbe::<ChaCha20Rng>::msk_to_mpk(&msk);
        base64::encode(mpk.try_to_vec().unwrap())
    }

    pub fn generate_key(&mut self) -> (String, String) {
        let (msk, mpk) = self.ibe.generate_key();
        (
            base64::encode(msk.try_to_vec().unwrap()),
            base64::encode(mpk.try_to_vec().unwrap())
        )
    }

    pub fn extract(&mut self, id: String, msk: String) -> String {
        let msk = MasterSecretKey::try_from_slice(base64::decode(msk).unwrap().as_slice()).unwrap();
		let sk = self.ibe.extract(id.as_str(), &msk);
        base64::encode(sk.try_to_vec().unwrap())
    }

    /// Seems that u64 does not work on the JS side, don't know why it converts it to bigint
    pub fn encrypt(&mut self, msg: i32, id: String, mpk: String) -> String {
        let plain = i32_to_scalar(msg);
        let mpk = MasterPublicKey::try_from_slice(base64::decode(mpk).unwrap().as_slice()).unwrap();
        let ct = self.ibe.encrypt(&plain, id.as_str(), &mpk);
        base64::encode(ct.try_to_vec().unwrap())
    }

    pub fn encrypt_with_randomness(&mut self, msg: i32, id: String, mpk: String, r: String) -> String {
        let plain = i32_to_scalar(msg);
        let mpk = MasterPublicKey::try_from_slice(base64::decode(mpk).unwrap().as_slice()).unwrap();
        let r = Scalar::try_from_slice(base64::decode(r).unwrap().as_slice()).unwrap();

        let ct = self.ibe.encrypt_with_randomness(&plain, id.as_str(), &mpk, r);
        base64::encode(ct.try_to_vec().unwrap())
    }

    pub fn decrypt(&mut self, ct: String, id: String, sk: String, bound: u32) -> u32 {
        let ct = CipherText::try_from_slice(base64::decode(ct).unwrap().as_slice()).unwrap();
        let sk = IdSecretKey::try_from_slice(base64::decode(sk).unwrap().as_slice()).unwrap();

        let pt = self.ibe.decrypt(&ct, id.as_str(), &sk, bound as u64).unwrap();
        scalar_to_u64(pt) as u32
    }

    pub fn add_ciphers(ct1: String, ct2: String) -> String {
        let ct1 = CipherText::try_from_slice(base64::decode(ct1).unwrap().as_slice()).unwrap();
        let ct2 = CipherText::try_from_slice(base64::decode(ct2).unwrap().as_slice()).unwrap();
        let ct = BFIbe::<ChaCha20Rng>::add_ciphers(&ct1, &ct2);
        base64::encode(ct.try_to_vec().unwrap())
    }

    pub fn pk_id(mpk: String, id: String) -> String {
        let mpk = MasterPublicKey::try_from_slice(base64::decode(mpk).unwrap().as_slice()).unwrap();
        let pk_id = BFIbe::<ChaCha20Rng>::pk_id(&mpk, id.as_str());
        base64::encode(pk_id.try_to_vec().unwrap())
    }
}
