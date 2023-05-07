
get_result() {
  res=$(python3 -c 'x = '$1'; print(x['$2']) if isinstance(x, tuple) else print(x)')
  echo $res
}

generate_key() {
  KEYS=$(dfx canister call faceless_dfinity_backend generate_key | tr -d '\n ')
  MSK=$(get_result $KEYS 0)
  MPK=$(get_result $KEYS 1)
  echo $MSK $MPK
}

# Generate key pair
read msk mpk <<EOM
$(generate_key)
EOM
echo "msk: " $msk
echo "mpk: " $mpk

# Get the PK ID
tmp=$(dfx canister call faceless_dfinity_backend pk_id '("'$mpk'", "zico1")' | tr -d '\n ')
pk_id1=$(get_result $tmp 0)
echo "pk_id1: " $pk_id1

# Get a random value
r=$(dfx canister call faceless_dfinity_backend random_scalar | tr -d '\n ')
r=$(get_result $r 0)
echo "r: " $r

# Encryption
tmp=$(dfx canister call faceless_dfinity_backend encrypt_with_randomness '(300, "zico1", "'$mpk'", "'$r'")' | tr -d '\n ')
ciphertext=$(get_result $tmp 0)
echo "ciphertext: " $ciphertext

# Extract SK
tmp=$(dfx canister call faceless_dfinity_backend extract '("zico1", "'$msk'")' | tr -d '\n ')
sk=$(get_result $tmp 0)
echo "sk: " $sk

# Decryption
plaintext=$(dfx canister call faceless_dfinity_backend decrypt '("'$ciphertext'", "zico1", "'$sk'", 1000)' | tr -d '\n ')
echo "plaintext: " $plaintext

