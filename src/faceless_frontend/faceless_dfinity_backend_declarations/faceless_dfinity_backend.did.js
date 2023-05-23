export const idlFactory = ({ IDL }) => {
  const FacelessErr = IDL.Variant({
    'InvalidAccount' : IDL.Null,
    'TransferFailure' : IDL.Null,
    'BalanceLow' : IDL.Null,
  });
  const FacelessReceipt = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : FacelessErr });
  return IDL.Service({
    'clear' : IDL.Func([], [], ['oneway']),
    'decrypt' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Int32],
        [IDL.Int32],
        ['query'],
      ),
    'deposit' : IDL.Func([IDL.Text, IDL.Nat], [FacelessReceipt], []),
    'encrypt_with_randomness' : IDL.Func(
        [IDL.Int32, IDL.Text, IDL.Text, IDL.Text],
        [IDL.Text],
        ['query'],
      ),
    'extract' : IDL.Func([IDL.Text, IDL.Text], [IDL.Text], ['query']),
    'generate_key' : IDL.Func([], [IDL.Text, IDL.Text], ['query']),
    'getAnonymousDepositAddress' : IDL.Func([], [IDL.Vec(IDL.Nat8)], []),
    'getBalance' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'getDelegateBalance' : IDL.Func([IDL.Principal], [IDL.Int64], []),
    'getDepositAddress' : IDL.Func([], [IDL.Vec(IDL.Nat8)], []),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'ledger' : IDL.Func([], [IDL.Opt(IDL.Principal)], ['query']),
    'pk_id' : IDL.Func([IDL.Text, IDL.Text], [IDL.Text], ['query']),
    'random_scalar' : IDL.Func([], [IDL.Text], ['query']),
    'register' : IDL.Func([IDL.Text], [], ['oneway']),
    'transfer' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [FacelessReceipt],
        [],
      ),
    'verifyTransfer' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], ['query']),
    'verifyWithdraw' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], ['query']),
    'whoami' : IDL.Func([], [IDL.Principal], ['query']),
    'withdraw' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Principal],
        [FacelessReceipt],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return [IDL.Opt(IDL.Principal)]; };
