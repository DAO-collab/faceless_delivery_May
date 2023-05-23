type Account = string | null;

const omiter = (account: Account): Account => {
  // 省略显示
  if (!!account) {
    // 长度不足
    if (account.length < 12) return account;

    return `${account.slice(0, 6)}...${account.slice(-4)}`;
  }

  return null;
};

export { omiter };
