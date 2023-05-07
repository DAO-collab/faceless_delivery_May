
use aibe::traits::{IdentityBasedEncryption};
use aibe::bf_ibe::{BFIbe};
use aibe::utils::{u64_to_scalar, hash_to_g2};
use aibe::zk::burn::{BurnStatement, BurnWitness, BurnProver, BurnVerifier};
use rand::Rng;
use borsh::ser::BorshSerialize;

extern crate base64;


fn main() {
    use std::time::Instant;

    let mut rng = rand::thread_rng(); 
    let bound: u64 = 100;
    let plain = u64_to_scalar(rng.gen_range(0..bound));

    println!("Groud truth: {:?}", plain);

    let mut ibe = BFIbe::new(rng.clone());

    let now = Instant::now();
    let (msk, mpk) = ibe.generate_key();
    let elapsed = now.elapsed();
    println!("[IBE key gen]: {:.2?}", elapsed);

    let now = Instant::now();
    let sk = ibe.extract("zico", &msk);
    let elapsed = now.elapsed();
    println!("[IBE extract]: {:.2?}", elapsed);

    let now = Instant::now();
    let cipher = ibe.encrypt(&plain, "zico", &mpk);
    let elapsed = now.elapsed();
    println!("[IBE encrypt]: {:.2?}", elapsed);

    let now = Instant::now();
    let result = ibe.decrypt(&cipher, "zico", &sk, bound); 
    let elapsed = now.elapsed();
    println!("[IBE Decrypt]: {:.2?}", elapsed);

    assert!(result.is_ok());
    assert_eq!(result.unwrap(), plain);


    let statement = BurnStatement {
        y: mpk,
        c1_id: cipher.0,
        c2_id: cipher.1,
    };
    let witness = BurnWitness {
        b: plain,
        s: msk,
        h_id: hash_to_g2("zico".as_bytes()),
        sk_id: sk,
    };

    let mut prover = BurnProver::new(rng.clone());
    let proof = prover.generate_proof(statement.clone(), witness);

    println!("Burn proof:\n{}", base64::encode(proof.try_to_vec().unwrap()));
    println!("Burn statement:\n{}", base64::encode(statement.try_to_vec().unwrap()));

    //let result = BurnVerifier::verify_proof(statement, proof);
    //assert!(result.is_ok());
}



