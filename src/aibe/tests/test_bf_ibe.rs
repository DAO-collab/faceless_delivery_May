
use aibe::traits::{IdentityBasedEncryption};
use aibe::bf_ibe::{BFIbe};
use aibe::utils::{u64_to_scalar};
use rand::Rng;


#[test]
fn test_bf_ibe() {
    use std::time::Instant;

    let mut rng = rand::thread_rng(); 
    let bound: u64 = 100;
    let plain: u64 = rng.gen_range(0..bound);

    println!("Groud truth: {:?}", plain);

    let mut ibe = BFIbe::new(rng);

    let now = Instant::now();
    let (msk, mpk) = ibe.generate_key();
    let elapsed = now.elapsed();
    println!("[IBE key gen]: {:.2?}", elapsed);

    let now = Instant::now();
    let sk = ibe.extract("zico", &msk);
    let elapsed = now.elapsed();
    println!("[IBE extract]: {:.2?}", elapsed);

    let now = Instant::now();
    let cipher = ibe.encrypt(&u64_to_scalar(plain), "zico", &mpk);
    let elapsed = now.elapsed();
    println!("[IBE encrypt]: {:.2?}", elapsed);

    let now = Instant::now();
    let result = ibe.decrypt(&cipher, "zico", &sk, bound); 
    let elapsed = now.elapsed();
    println!("[IBE Decrypt]: {:.2?}", elapsed);

    assert!(result.is_ok());
    assert_eq!(result.unwrap(), u64_to_scalar(plain));
}


