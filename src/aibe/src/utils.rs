use crate::errors::IbeError;
use rand::Rng;
use bn::{G1, G2, Gt, Fr as Scalar, Group, pairing};
use bn::arith::U256;
use sha2::Digest;
use borsh::maybestd::collections::HashMap;
use crate::traits::IdentityBasedEncryption;
use crate::traits::ToBytes;
use libm::sqrt;
use borsh::BorshSerialize;
use borsh::BorshDeserialize;


pub fn hash_to_scalar(msg: &[u8]) -> Scalar {
    let hash = sha2::Sha256::digest(msg);
    Scalar::new_mul_factor(U256::from_slice(&hash).unwrap())
}

pub fn hash_to_g2(msg: &[u8]) -> G2 {
    G2::one() * hash_to_scalar(msg) 
}

pub fn u64_to_scalar(x: u64) -> Scalar {
    Scalar::new_mul_factor(U256::from(x))
}

pub fn scalar_to_u64(x: Scalar) -> u64 {
    U256::try_from_slice(&x.try_to_vec().unwrap()).unwrap().0[0] as u64
}

pub fn i32_to_scalar(x: i32) -> Scalar {
    let mut y: i32 = x;
    if x < 0 {
        y = -x;
    }
    let mut y = u64_to_scalar(y as u64);
    if x < 0 {
        y = -y;
    }
    y
}

pub fn baby_step_giant_step(h: Gt, g: Gt, bound: u64) -> Result<Scalar, IbeError> {
    let mut table = HashMap::new();

    let m = (sqrt(bound as f64) as u64) + 1;

    // precompute the table
    let mut x = Gt::one();
    let mut i = 0;
    while i <= m {
        table.insert(x.to_bytes(), i);
        x = x * g;
		i = i + 1;
    }

    // search for solution
	let z = g.pow(-u64_to_scalar(m));
    //z.inverse();
    x = h;
	i = 0;
    while i <= m {
        // positive solution
        match table.get(&x.to_bytes()) {
            Some(value) => {
                let temp = i * m + value;
                return Ok(u64_to_scalar(temp));
            }
            None => {
                x = x * z;
            }
        }
        // negative solution
        //match table.get(&x_neg.tostring()) {
            //Some(value) => {
                //let mut temp = BigNum::modmul(&i, &m, &CURVE_ORDER);
                //temp = BigNum::modadd(&value, &temp, &CURVE_ORDER);
                //temp = BigNum::modneg(&temp, &CURVE_ORDER);
                //let temp = BigInt::from_str_radix(&temp.tostring(), 16).unwrap() - (&*MODULUS);
                //return Some(temp);
            //}
            //None => {
                //x_neg.mul(&z);
                //x_neg.reduce();
            //}
        //}
        i = i + 1
    }
	Err(IbeError::OutOfBoundError)
}

pub fn pedersen_commitment<R: Rng>(m: Scalar, h1: G1, rng: &mut R) -> (Scalar, G1) {
    let r = Scalar::random(rng);
    (r, G1::one() * m + h1 * r)
}
