print_ledger_balance() {
    dfx canister call ledger account_balance '(record { 
    account = '$(python3 -c 'print("vec{" + ";".join([str(b) for b in bytes.fromhex("'$1'")]) + "}")')' 
    })'
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

echo "My initial balance (on Ledger, expected: 100_000_000_000): "
print_ledger_balance $DEFAULT_LEDGER_ACCOUNT

# delegate some ICP in DEX
dfx canister call ledger transfer "(record { amount = record { e8s = 1000000 }; to = $ICP_DEPOSIT_ADDR; fee = record { e8s = 10000}; memo = 1;})"

echo "My balance (on Ledger, expected: 99_998_990_000, considering 10000 fee) after delegating 1000000 tokens to Faceless Dfinity Canister: "
print_ledger_balance $DEFAULT_LEDGER_ACCOUNT

echo "My balance (on Faceless Exchange, expected: 0): "
dfx canister call faceless_dfinity_backend getBalance

# transfer ICP to DEX
dfx canister call faceless_dfinity_backend deposit '(500000)'

echo "My balance after deposit (on Faceless Exchange, expected: 500000): "
dfx canister call faceless_dfinity_backend getBalance

# withdraw ICP
dfx canister call faceless_dfinity_backend withdraw '(100000, principal '\"$PRINCIPAL\"')'

echo "My balance after withdraw (on Faceless Exchange, expected: 390_000, considering 10000 fee): "
dfx canister call faceless_dfinity_backend getBalance

echo "My balance (on Ledger, expected: 99_999_090_000): "
print_ledger_balance $DEFAULT_LEDGER_ACCOUNT
