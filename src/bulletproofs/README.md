
# Bulletproofs
This is an implementation of Bulletproofs based on that of the following two repositories:
- [dalek-cryptography/bulletproofs](https://github.com/dalek-cryptography/bulletproofs): works on curves that do not support bilinear pairing
- [bls_bulletproofs](https://github.com/maidsafe/bls_bulletproofs): works on the BLS 12381 curve, not compatible with Substrate Pallet

This repository provides an implementation that:
- supports the `BN254` curve (or `alt_bn128`) that is used by Zcash and Zeropool
- is compatible with Substrate Pallet

