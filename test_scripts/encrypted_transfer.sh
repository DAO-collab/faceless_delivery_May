print_ledger_balance() {
    dfx canister call ledger account_balance '(record { 
    account = '$(python3 -c 'print("vec{" + ";".join([str(b) for b in bytes.fromhex("'$1'")]) + "}")')' 
    })'
}

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

decrypt_balance() {
  plaintext=$(dfx canister call faceless_dfinity_backend decrypt '("'$1'", "'$2'", "'$3'", 1000000)' | tr -d '\n ')
  echo $plaintext
}

# arg $1: pk id
# arg $2: sk
print_faceless_balance() {
  echo "$3's balance on Faceless: "
  enc_balance=$(dfx canister call faceless_dfinity_backend getBalance '("'$1'")' | tr -d '\n ')
  enc_balance=$(get_result $enc_balance 0)
  echo "encrypted balance: " $enc_balance
  echo "decrypted balance: " $(decrypt_balance $enc_balance $3 $2)
}


trap 'catch' ERR
catch() {
  dfx identity use default
  echo "FAIL"
  exit 1
}
dfx identity use default
export DEFAULT_LEDGER_ACCOUNT=$(dfx ledger account-id)
export PRINCIPAL=$(dfx identity get-principal)
dfx canister call faceless_dfinity_backend clear
export DEX_ID=$(dfx canister id faceless_dfinity_backend)
# get ICP deposit address (removes unnesessary comma at the end)
export ICP_DEPOSIT_ADDR=$(dfx canister call faceless_dfinity_backend getDepositAddress | tr -d '\n' | sed 's/,)/)/')
# get ledger canister IDs
export LEDGER_ID=$(dfx canister id ledger)

echo "======================"
echo "My initial balance (on Ledger, expected: 100_000_000_000): "
print_ledger_balance $DEFAULT_LEDGER_ACCOUNT

# delegate some ICP in DEX
dfx canister call ledger transfer "(record { amount = record { e8s = 1000000 }; to = $ICP_DEPOSIT_ADDR; fee = record { e8s = 10000}; memo = 1;})"

echo "======================"
echo "My balance (on Ledger, expected: 99_998_990_000, considering 10000 fee) after delegating 1000000 tokens to Faceless Dfinity Canister: "
print_ledger_balance $DEFAULT_LEDGER_ACCOUNT



# Generate key pair
read msk mpk <<EOM
$(generate_key)
EOM
echo "======================"
echo "msk: " $msk
echo "mpk: " $mpk

# Get the PK ID
tmp=$(dfx canister call faceless_dfinity_backend pk_id '("'$mpk'", "zico1")' | tr -d '\n ')
pk_id1=$(get_result $tmp 0)
echo "pk_id1: " $pk_id1

# Extract SK
tmp=$(dfx canister call faceless_dfinity_backend extract '("zico1", "'$msk'")' | tr -d '\n ')
sk1=$(get_result $tmp 0)
echo "sk1: " $sk1

# Register an account for the PK ID
dfx canister call faceless_dfinity_backend register '("'$pk_id1'")'


# Get and decrypt the balance for the above account
echo "======================"
print_faceless_balance $pk_id1 $sk1 zico1


# Deposit ICP
echo "======================"
dfx canister call faceless_dfinity_backend deposit '("'$pk_id1'", 500000)'
print_faceless_balance $pk_id1 $sk1 zico1

# withdraw ICP
echo "======================"
dfx canister call faceless_dfinity_backend withdraw '("'$pk_id1'", 100000, principal '\"$PRINCIPAL\"')'
print_faceless_balance $pk_id1 $sk1 zico1

# Transfer ICP
## Register an account for the second ID
tmp=$(dfx canister call faceless_dfinity_backend pk_id '("'$mpk'", "zico2")' | tr -d '\n ')
pk_id2=$(get_result $tmp 0)
echo "pk_id2: " $pk_id2
tmp=$(dfx canister call faceless_dfinity_backend extract '("zico2", "'$msk'")' | tr -d '\n ')
sk2=$(get_result $tmp 0)
echo "sk2: " $sk2
dfx canister call faceless_dfinity_backend register '("'$pk_id2'")'
## Encrypt a negative transfer amount with sender ID 'zico1', and a positive transfer amount with receiver ID 'zico2'
tmp=$(dfx canister call faceless_dfinity_backend random_scalar | tr -d '\n ')
r=$(get_result $tmp 0)
tmp=$(dfx canister call faceless_dfinity_backend encrypt_with_randomness '(-200000, "zico1", "'$mpk'", "'$r'")' | tr -d '\n ')
enc_amount1=$(get_result $tmp 0)
tmp=$(dfx canister call faceless_dfinity_backend encrypt_with_randomness '(200000, "zico2", "'$mpk'", "'$r'")' | tr -d '\n ')
enc_amount2=$(get_result $tmp 0)
## Call the transfer
dfx canister call faceless_dfinity_backend transfer '("'$pk_id1'", "'$pk_id2'", "'$enc_amount1'", "'$enc_amount2'")'

# Check balance of "zico1" and "zico2"
echo "======================"
print_faceless_balance $pk_id1 $sk1 zico1
print_faceless_balance $pk_id2 $sk2 zico2


echo "======================"
echo "My balance on Ledger: "
print_ledger_balance $DEFAULT_LEDGER_ACCOUNT
