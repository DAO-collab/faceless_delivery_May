use rand::SeedableRng;

use rand_chacha::ChaChaRng;

use bn::Fr as Scalar;

use merlin::Transcript;

use bulletproofs::{BulletproofGens, PedersenGens, RangeProof};
use bulletproofs::ext_traits::PointToBytes;
use borsh::ser::BorshSerialize;

use hex;

fn main() {
    let pc_gens = PedersenGens::default();
    let bp_gens = BulletproofGens::new(64, 8);

    // Use a deterministic RNG for proving, so the test vectors can be
    // generated reproducibly.
    let mut test_rng = ChaChaRng::from_seed([24u8; 32]);

    let values = vec![0u64, 1, 2, 3, 4, 5, 6, 7];
    let blindings = (0..8)
        .map(|_| Scalar::random(&mut test_rng))
        .collect::<Vec<_>>();

    for n in &[8, 16, 32, 64] {
        for m in &[1, 2, 4, 8] {
            let mut transcript = Transcript::new(b"Deserialize-And-Verify Test");
            let (proof, value_commitments) = RangeProof::prove_multiple(
                &bp_gens,
                &pc_gens,
                &mut transcript,
                &values[0..*m],
                &blindings[0..*m],
                *n,
            )
            .unwrap();

            println!("n,m = {}, {}", n, m);
            println!("proof = \"{}\"", hex::encode(proof.try_to_vec().unwrap()));
            println!("vc = [");
            for com in &value_commitments {
                println!("    \"{}\"", hex::encode(com.to_compressed()));
            }
            println!("]\n");

            let mut verifier_transcript = Transcript::new(b"Deserialize-And-Verify Test");
            let result = proof.verify_multiple(&bp_gens, &pc_gens, &mut verifier_transcript, &value_commitments, *n);
            //match result {
                //Ok(_) => {},
                //Err(e) => {
                    //println!("{:?}", e);
                //}
            //}
            assert!(
                result.is_ok()
            );
        }
    }

}
