use borsh::{BorshDeserialize, BorshSerialize};
use bn::{Fr as Scalar, G1, G2, Gt, pairing, Group};
use crate::errors::ZkError;
use crate::traits::ToBytes;
use crate::utils::{hash_to_scalar};
use rand::Rng;
use core::ops::Neg;
use borsh::maybestd::vec::Vec;

#[derive(Eq, PartialEq, BorshDeserialize, BorshSerialize, Clone)]
pub struct TransferStatement {
    pub h1: G1,
    pub y: G1,
    pub y_bar: G1, 
    pub c1: G1,
    pub c2: Gt,
    pub c2_bar: Gt,
    pub c1_tilde: G1,
    pub c2_tilde: Gt,
    pub c_b_star: G1,
    pub c_b_prime: G1,
}

#[derive(Eq, PartialEq, BorshDeserialize, BorshSerialize, Clone, Debug)]
pub struct TransferWitness {
    pub r: Scalar,
    pub s: Scalar,
    pub r_star: Scalar,
    pub r_prime: Scalar,
    pub b_star: Scalar,
    pub b_prime: Scalar,
    pub h_id: G2,
    pub h_id_bar: G2,
    pub sk_id: G2,

}

#[derive(Eq, PartialEq, BorshDeserialize, BorshSerialize, Clone, Debug)]
pub struct TransferProof {
    pub x: Scalar,
    pub zr: Scalar,
    pub zs: Scalar,
    pub zr_star: Scalar,
    pub zr_prime: Scalar,
    pub zb_star: Scalar,
    pub zb_prime: Scalar,
    pub z_id: G2,
    pub z_id_prime: G2,
    pub z_id_bar: G2,
    pub z_id_bar_prime: G2,
    pub z_sk: G2,
}

pub struct TransferProver<R> {
    rng: R
}


impl<R> TransferProver<R> 
where R: Rng {
    pub fn new(rng: R) -> Self {
        Self {
            rng
        }
    }

    pub fn generate_proof(&mut self, statement: TransferStatement, witness: TransferWitness) -> TransferProof {
        let mr = Scalar::random(&mut self.rng); 
        let ms = Scalar::random(&mut self.rng);
        let mr_star = Scalar::random(&mut self.rng);
        let mr_prime = Scalar::random(&mut self.rng);
        let mb_star = Scalar::random(&mut self.rng);
        let mb_prime = Scalar::random(&mut self.rng);

        let m_id = G2::random(&mut self.rng);
        let m_id_prime = G2::random(&mut self.rng);
        let m_id_bar = G2::random(&mut self.rng);
        let m_id_bar_prime = G2::random(&mut self.rng);
        let m_sk = G2::random(&mut self.rng);


        let d_y = G1::one() * ms;
        let d_1 = G1::one() * mr;
        let d_b_star = G1::one() * mb_star + statement.h1 * mr_star; 
        let d_b_prime = G1::one() * mb_prime + statement.h1 * mr_prime;

        let r = pairing(statement.c1, m_id) * pairing(G1::one().neg(), m_id_prime);
        let r_bar = pairing(statement.c1, m_id_bar) * pairing(G1::one().neg(), m_id_bar_prime);
        let r_sk = pairing(statement.y, m_id) * pairing(G1::one().neg(), m_sk);
        
        let gt = pairing(G1::one(), G2::one());
        let d_2 = gt.pow(mb_star) * pairing(statement.y, m_id_prime);
        let d_2_bar = gt.pow(mb_star) * pairing(statement.y_bar, m_id_bar_prime);
        let d_2_tilde = gt.pow(mb_prime) * pairing(statement.c1_tilde, m_sk);
        
        let script = d_y.to_bytes().iter()
            .chain(d_1.to_bytes().iter())
            .chain(d_b_star.to_bytes().iter())
            .chain(d_b_prime.to_bytes().iter())
            .chain(r.to_bytes().iter())
            .chain(r_bar.to_bytes().iter())
            .chain(r_sk.to_bytes().iter())
            .chain(d_2.to_bytes().iter())
            .chain(d_2_bar.to_bytes().iter())
            .chain(d_2_tilde.to_bytes().iter())
            .map(|x| *x)
            .collect::<Vec<_>>();
        let x = hash_to_scalar(&script);

        let zr = x * witness.r + mr;
        let zs = x * witness.s + ms;
        let zr_star = x * witness.r_star + mr_star;
        let zr_prime = x * witness.r_prime + mr_prime;
        let zb_star = x * witness.b_star + mb_star;
        let zb_prime = x * witness.b_prime + mb_prime;

        let h_id_prime = witness.h_id * witness.r;
        let h_id_bar_prime = witness.h_id_bar * witness.r;

        let z_id = witness.h_id * x + m_id; 
        let z_id_prime = h_id_prime * x + m_id_prime;
        let z_id_bar = witness.h_id_bar * x + m_id_bar;
        let z_id_bar_prime = h_id_bar_prime * x + m_id_bar_prime;
        let z_sk = witness.sk_id * x + m_sk;

        TransferProof {
            x,
            zr,
            zs,
            zr_star,
            zr_prime,
            zb_star,
            zb_prime,
            z_id,
            z_id_prime,
            z_id_bar,
            z_id_bar_prime,
            z_sk,
        }
    }
}


pub struct TransferVerifier;

impl TransferVerifier {
    pub fn verify_proof(statement: TransferStatement, proof: TransferProof) -> Result<(), ZkError> {
        let d_y = G1::one() * proof.zs - statement.y * proof.x;
        let d_1 = G1::one() * proof.zr - statement.c1 * proof.x;
        let d_b_star = G1::one() * proof.zb_star + statement.h1 * proof.zr_star - statement.c_b_star * proof.x;
        let d_b_prime = G1::one() * proof.zb_prime + statement.h1 * proof.zr_prime - statement.c_b_prime * proof.x;

        let r = pairing(statement.c1, proof.z_id) * pairing(G1::one().neg(), proof.z_id_prime);
        let r_bar = pairing(statement.c1, proof.z_id_bar) * pairing(G1::one().neg(), proof.z_id_bar_prime);
        let r_sk = pairing(statement.y, proof.z_id) * pairing(G1::one().neg(), proof.z_sk);

        let gt = pairing(G1::one(), G2::one());
        let d_2 = gt.pow(proof.zb_star) * 
            pairing(statement.y, proof.z_id_prime) *
            statement.c2.pow(proof.x).inverse().unwrap();
        let d_2_bar = gt.pow(proof.zb_star) *
            pairing(statement.y_bar, proof.z_id_bar_prime) *
            statement.c2_bar.pow(proof.x).inverse().unwrap();
        let d_2_tilde = gt.pow(proof.zb_prime) * 
            pairing(statement.c1_tilde, proof.z_sk) *
            statement.c2_tilde.pow(proof.x).inverse().unwrap();

        let script = d_y.to_bytes().iter()
            .chain(d_1.to_bytes().iter())
            .chain(d_b_star.to_bytes().iter())
            .chain(d_b_prime.to_bytes().iter())
            .chain(r.to_bytes().iter())
            .chain(r_bar.to_bytes().iter())
            .chain(r_sk.to_bytes().iter())
            .chain(d_2.to_bytes().iter())
            .chain(d_2_bar.to_bytes().iter())
            .chain(d_2_tilde.to_bytes().iter())
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

