import ENV from "@/assets/env";

const config: any = {
  phantom: {},

  metamask: {},

  walletconnect: { rpc: {} },

  walletlink: {
    darkMode: true,
    appName: "Faceless",
    network: ENV.defaultChainName,
    appLogoUrl: "https://gametaverse.png",
  },

  portis: {
    config: {},
    network: ENV.defaultChainName,
    dappId: "62b0690f-8942-4a25-902b-02a6c77ba9e0",
  },

  fortmatic: {
    network: ENV.defaultChainName,
    apiKey: ENV.defaultFortmaticKey,
  },

  waxio: {
    pubKeys: [],
    userAccount: "",
    tryAutoLogin: true,
    rpcEndpoint: "https://wax.greymass.com",
  },

  sollet: {
    network: "mainnet-beta",
    provider: "https://www.sollet.io",
  },
};

export { config };
