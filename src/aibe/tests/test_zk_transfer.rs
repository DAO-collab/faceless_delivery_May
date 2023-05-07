
use aibe::traits::{IdentityBasedEncryption};
use aibe::bf_ibe::{BFIbe};
use aibe::utils::{u64_to_scalar, hash_to_g2, pedersen_commitment};
use aibe::zk::transfer::{TransferStatement, TransferWitness, TransferProver, TransferVerifier};
use rand::Rng;
use bn::{G1, Group};


#[test]
fn test_zk_transfer() {
    use std::time::Instant;

    let mut rng = rand::thread_rng(); 
    let bound: u64 = 100;
    // Balance
    let b = u64_to_scalar(60);
    // Transfer amount
    let b_star = u64_to_scalar(40);
    // Remaining balance
    let b_prime = b - b_star;

    let mut ibe = BFIbe::new(rng.clone());

    let now = Instant::now();
    let (msk1, mpk1) = ibe.generate_key();
    let (msk2, mpk2) = ibe.generate_key();
    let elapsed = now.elapsed();
    println!("[IBE key gen]: {:.2?}", elapsed);

    let now = Instant::now();
    let sk1 = ibe.extract("zico1", &msk1);
    let elapsed = now.elapsed();
    println!("[IBE extract]: {:.2?}", elapsed);

    let now = Instant::now();
    // Encryption of balance for key 1
    let c_balance = ibe.encrypt(&b, "zico1", &mpk1);
    // Encryption of transfer amount for key 1 and key 2
    let ((c_transfer, c_transfer_bar), (h_id, h_id_bar), r) = ibe.encrypt_correlated_internal(&b_star, ("zico1", "zico2"), (&mpk1, &mpk2));
    let elapsed = now.elapsed();
    println!("[IBE encrypt]: {:.2?}", elapsed);

    let h1 = G1::random(&mut rng);

    let now = Instant::now();
    let (r_star, c_b_star) = pedersen_commitment(b_star, h1, &mut rng); 
    let (r_prime, c_b_prime) = pedersen_commitment(b_prime, h1, &mut rng); 
    let elapsed = now.elapsed();
    println!("[Pedersen commitment]: {:.2?}", elapsed);

    let statement = TransferStatement {
        h1,
        y: mpk1,
        y_bar: mpk2,
        c1: c_transfer.0,
        c2: c_transfer.1,
        c2_bar: c_transfer_bar.1,
        c1_tilde: c_balance.0 - c_transfer.0,
        c2_tilde: c_balance.1 * c_transfer.1.inverse().unwrap(),
        c_b_star,
        c_b_prime,
    };
    let witness = TransferWitness {
        r,
        s: msk1,
        r_star,
        r_prime,
        b_star,
        b_prime,
        h_id,
        h_id_bar,
        sk_id: sk1,
    };

    let mut prover = TransferProver::new(rng.clone());
    let proof = prover.generate_proof(statement.clone(), witness);

    let result = TransferVerifier::verify_proof(statement, proof);
    assert!(result.is_ok());
}


