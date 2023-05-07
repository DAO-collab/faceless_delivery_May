# Faceless

This repository contains code and resources for the Faceless project implemented on the Dfinity platform.

If you want to start working on the project right away, you might want to try the following commands:

```bash
cd faceless_dfinity/
dfx help
dfx canister --help
```

## Crypto Implementation

### Anonymous Identity-Based Encryption

An implementation of a variant of the following scheme:

- Dan Boneh and Matthew K. Franklin. Identity-based encryption from the weil

pairing. SIAM J. Comput., 32(3):586–615, 2003.

Implemented [here](./src/aibe/src/bf_ibe.rs).

### BN254 Curve (alt_bn128)

An implementation of the `alt_bn128` curve that is almost the same as the [zeropool-bn](https://github.com/zeropoolnetwork/bn.git)  repository, but with some fixes to be applicable in our faceless protocol.

### BulletProof

An implementation of the [BulletProof](https://eprint.iacr.org/2017/1066.pdf) zero-knowledge protocol based on BN254 curve.

## Environment setup

```sh
# Install Rust
curl --tlsv1.2 https://sh.rustup.rs -sSf | sh
# Install dfx SDK
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
```

## Unit tests

```sh
# Test the anonymous identity-based encryption
cd aibe
cargo test test_bf_ibe -- --show-output

# Test the withdrawal proof generation and verification
cd aibe
cargo test test_zk_withdraw -- --show-output

# Test the transfer proof generation and verification
cargo test test_zk_transfer -- --show-output
```

Code of the above three unit tests are located in:
- [Test anonymous identity-based encryption](./src/aibe/tests/test_bf_ibe.rs)
- [Test withdrawal proof generation and verification](./src/aibe/tests/test_zk_withdraw.rs)
- [Test transfer proof generation and verification](./src/aibe/tests/test_zk_transfer.rs)


## Faceless Backend Canister

The Faceless backend canister is located [here](./src/faceless_dfinity_backend).

Please use the [test_scripts](./test_scripts/), where you can also see the backend canister logics.

```bash
# Depoly the canisters
./test_scripts/depoly.sh

# Run the encrypted anonymous transfer procedure
./test_scripts/encrypted_transfer.sh
```

