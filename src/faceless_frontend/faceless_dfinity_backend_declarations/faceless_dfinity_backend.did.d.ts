import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Balance {
  'token' : Token,
  'owner' : Principal,
  'amount' : bigint,
}
export type BalanceReceipt = { 'Ok' : string } |
  { 'Err' : FacelessErr };
export type FacelessErr = { 'InvalidAccount' : null } |
  { 'TransferFailure' : null } |
  { 'BalanceLow' : null };
export type FacelessReceipt = { 'Ok' : bigint } |
  { 'Err' : FacelessErr };
export type Token = Principal;
export interface _SERVICE {
  'clear' : ActorMethod<[], undefined>,
  'decrypt' : ActorMethod<[string, string, string, number], number>,
  'deposit' : ActorMethod<[string, bigint], FacelessReceipt>,
  'encrypt_with_randomness' : ActorMethod<
    [number, string, string, string],
    string
  >,
  'extract' : ActorMethod<[string, string], string>,
  'generate_key' : ActorMethod<[], [string, string]>,
  'getAnonymousDepositAddress' : ActorMethod<[], Uint8Array | number[]>,
  'getBalance' : ActorMethod<[string], string>,
  'getDelegateBalance' : ActorMethod<[Principal], bigint>,
  'getDepositAddress' : ActorMethod<[], Uint8Array | number[]>,
  'greet' : ActorMethod<[string], string>,
  'ledger' : ActorMethod<[], [] | [Principal]>,
  'pk_id' : ActorMethod<[string, string], string>,
  'random_scalar' : ActorMethod<[], string>,
  'register' : ActorMethod<[string], undefined>,
  'transfer' : ActorMethod<[string, string, string, string], FacelessReceipt>,
  'verifyTransfer' : ActorMethod<[string, string], boolean>,
  'verifyWithdraw' : ActorMethod<[string, string], boolean>,
  'whoami' : ActorMethod<[], Principal>,
  'withdraw' : ActorMethod<[string, bigint, Principal], FacelessReceipt>,
}
