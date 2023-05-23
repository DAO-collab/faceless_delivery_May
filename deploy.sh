set -e
dfx stop && dfx start --background --clean


### === DEPLOY LOCAL LEDGER =====
dfx identity new minter --storage-mode=plaintext || true
dfx identity use minter
export MINT_ACC=$(dfx ledger account-id)

dfx identity use default
export LEDGER_ACC=$(dfx ledger account-id)

export ANONYMOUS_ACC=$(dfx ledger account-id --of-principal 2vxsx-fae)

# Use private api for install
rm src/ledger/ledger.did || true
cp src/ledger/ledger.private.did src/ledger/ledger.did

dfx deploy ledger --argument '(record  {
    minting_account = "'${MINT_ACC}'";
    initial_values = vec { record { "'${LEDGER_ACC}'"; record { e8s=100_000_000_000 } }; record { "'${ANONYMOUS_ACC}'"; record { e8s=100_000_000_000 } };};
    send_whitelist = vec {}
    })'
export LEDGER_ID=$(dfx canister id ledger)

# Replace with public api
rm src/ledger/ledger.did
cp src/ledger/ledger.public.did src/ledger/ledger.did

# Print the balance of the default identity
echo "Default Identity's Ledger Balance: "
dfx canister call ledger account_balance '(record { 
    account = '$(python3 -c 'print("vec{" + ";".join([str(b) for b in bytes.fromhex("'$LEDGER_ACC'")]) + "}")')' 
    })'
# Print the balance of the default identity
echo "Anonymous Identity's Ledger Balance: "
dfx canister call ledger account_balance '(record { 
    account = '$(python3 -c 'print("vec{" + ";".join([str(b) for b in bytes.fromhex("'$ANONYMOUS_ACC'")]) + "}")')' 
    })'

export ROOT_PRINCIPAL="principal \"$(dfx identity get-principal)\""


## === INSTALL FRONTEND / BACKEND ==== 

dfx deploy faceless_dfinity_backend --argument "(opt principal \"$LEDGER_ID\")"
# Transfer enough ICP to the faceless canister so that it has sufficient power to pay fees for ops
export AGENT_DEPOSIT_ADDR=$(dfx canister call faceless_dfinity_backend getAgentDepositAddress | tr -d '\n' | sed 's/,)/)/')
dfx canister call ledger transfer "(record { amount = record { e8s = 1000000000 }; to = $AGENT_DEPOSIT_ADDR; fee = record { e8s = 10000}; memo = 1;})"

# get anonymous deposit address (removes unnesessary comma at the end)
export ANONYMOUS_DEPOSIT_ADDR=$(dfx canister call faceless_dfinity_backend getAnonymousDepositAddress | tr -d '\n' | sed 's/,)/)/')
# delegate enough ICP for the anonymous addr so that we can test on the frontend website
dfx canister call ledger transfer "(record { amount = record { e8s = 1000000000 }; to = $ANONYMOUS_DEPOSIT_ADDR; fee = record { e8s = 10000}; memo = 1;})"


# dfx deploy faceless_frontend
