const randomString = () => {
  return `I hereby comfirm that I will be a builder in MUADAO.

As pioneers in the metaverse, we will build a new world of greater freedom, fairness and efficiency.

Created, Curated, and Owned by the People in MUADAO.
  
Random String: ${Math.random().toString(36).slice(2)}
  
Issued At: ${new Date().toLocaleString()}`;
};

export { randomString };
