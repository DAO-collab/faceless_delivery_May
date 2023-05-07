set -e
dfx stop && dfx start --background --clean


### === DEPLOY LOCAL LEDGER =====
dfx identity new minter --storage-mode=plaintext || true
dfx identity use minter
export MINT_ACC=$(dfx ledger account-id)

dfx identity use default
export LEDGER_ACC=$(dfx ledger account-id)

# Use private api for install
rm src/ledger/ledger.did || true
cp src/ledger/ledger.private.did src/ledger/ledger.did

dfx deploy ledger --argument '(record  {
    minting_account = "'${MINT_ACC}'";
    initial_values = vec { record { "'${LEDGER_ACC}'"; record { e8s=100_000_000_000 } }; };
    send_whitelist = vec {}
    })'
export LEDGER_ID=$(dfx canister id ledger)

# Replace with public api
rm src/ledger/ledger.did
cp src/ledger/ledger.public.did src/ledger/ledger.did

# Print the balance of the default identity
dfx canister call ledger account_balance '(record { 
    account = '$(python3 -c 'print("vec{" + ";".join([str(b) for b in bytes.fromhex("'$LEDGER_ACC'")]) + "}")')' 
    })'

export ROOT_PRINCIPAL="principal \"$(dfx identity get-principal)\""


## === INSTALL FRONTEND / BACKEND ==== 

dfx deploy faceless_dfinity_backend --argument "(opt principal \"$LEDGER_ID\")"

# rsync -avr .dfx/$(echo ${DFX_NETWORK:-'**'})/canisters/** --exclude='assets/' --exclude='idl/' --exclude='*.wasm' --delete src/frontend/declarations

# dfx canister create frontend
# pushd src/frontend
# npm install
# npm run build
# popd
# dfx build frontend
# dfx canister install frontend

# echo "===== VISIT DEFI FRONTEND ====="
# echo "http://localhost:8000?canisterId=$(dfx canister id frontend)"
# echo "===== VISIT DEFI FRONTEND ====="