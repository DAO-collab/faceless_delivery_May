use borsh::{BorshDeserialize, BorshSerialize};
use bn::{Fr as Scalar, G1, G2, Gt, pairing, Group};
use crate::errors::ZkError;
use crate::traits::ToBytes;
use crate::utils::{hash_to_scalar};
use rand::Rng;
use core::ops::Neg;
use borsh::maybestd::vec::Vec;

#[derive(Eq, PartialEq, BorshDeserialize, BorshSerialize, Clone)]
pub struct BurnStatement {
    pub y: G1,
    pub c1_id: G1,
    pub c2_id: Gt,
}

#[derive(Eq, PartialEq, BorshDeserialize, BorshSerialize, Clone, Debug)]
pub struct BurnWitness {
    pub b: Scalar,
    pub s: Scalar,
    pub h_id: G2,
    pub sk_id: G2, 
}

#[derive(Eq, PartialEq, BorshDeserialize, BorshSerialize, Clone, Debug)]
pub struct BurnProof {
    pub x: Scalar,
    pub zb: Scalar,
    pub zs: Scalar,
    pub z_id: G2,
    pub z_sk: G2,
}

pub struct BurnProver<R> {
    rng: R
}


impl<R> BurnProver<R> 
where R: Rng {
    pub fn new(rng: R) -> Self {
        Self {
            rng
        }
    }

    pub fn generate_proof(&mut self, statement: BurnStatement, witness: BurnWitness) -> BurnProof {
        let mb = Scalar::random(&mut self.rng); 
        let ms = Scalar::random(&mut self.rng);
        let m_id = G2::random(&mut self.rng);
        let m_sk = G2::random(&mut self.rng);

        let d_y = G1::one() * ms;
        let r = pairing(statement.y, m_id) * pairing(G1::one().neg(), m_sk);
        let d_id = pairing(G1::one(), G2::one()).pow(mb) * pairing(statement.c1_id, m_sk);
        
        let script = d_y.to_bytes()
            .iter()
            .chain(r.to_bytes().iter())
            .chain(d_id.to_bytes().iter())
            .map(|x| *x)
            .collect::<Vec<_>>();
        let x = hash_to_scalar(&script);

        let zb = x * witness.b + mb;
        let zs = x * witness.s + ms;
        let z_id = witness.h_id * x + m_id;
        let z_sk = witness.sk_id * x + m_sk;

        BurnProof {
            x,
            zb,
            zs,
            z_id,
            z_sk,
        }
    }
}


pub struct BurnVerifier;

impl BurnVerifier {
    pub fn verify_proof(statement: BurnStatement, proof: BurnProof) -> Result<(), ZkError> {
        let d_y = G1::one() * proof.zs - statement.y * proof.x;
        let r = pairing(statement.y, proof.z_id) * pairing(G1::one().neg(), proof.z_sk);
        let d_id = pairing(G1::one(), G2::one()).pow(proof.zb) *
            pairing(statement.c1_id, proof.z_sk) *
            statement.c2_id.pow(proof.x).inverse().unwrap();

        let script = d_y.to_bytes()
            .iter()
            .chain(r.to_bytes().iter())
            .chain(d_id.to_bytes().iter())
            .map(|x| *x)
            .collect::<Vec<_>>();
        let x = hash_to_scalar(&script);

        if x == proof.x {
            Ok(())
        }
        else {
            Err(ZkError::VerificationError)
        }
    }
}
