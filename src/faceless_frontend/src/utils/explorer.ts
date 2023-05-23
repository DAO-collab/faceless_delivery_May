const explorer = (chain: string, account: string) => {
  let adr = "";

  switch (chain) {
    case "ethereum":
      adr = `https://etherscan.io/address/${account}`;
      break;

    case "bsc":
      adr = `https://bscscan.com/address/${account}`;
      break;

    case "wax":
      adr = `https://wax.bloks.io/account/${account}`;
      break;

    case "solana":
      adr = `https://explorer.solana.com/address/${account}`;
      break;
  }

  return adr;
};

export { explorer };
