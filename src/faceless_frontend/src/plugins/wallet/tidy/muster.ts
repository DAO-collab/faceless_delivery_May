import wax from "@/assets/images/wax.png";
import solana from "@/assets/images/solana.png";
import portis from "@/assets/images/portis.svg";
import sollet from "@/assets/images/sollet.svg";
import phantom from "@/assets/images/phantom.svg";
import ethereum from "@/assets/images/ethereum.png";
import metamask from "@/assets/images/metamask.svg";
import walletlink from "@/assets/images/coinbase.svg";
import fortmatic from "@/assets/images/fortmatic.svg";
import waxio from "@/assets/images/waxcloudwallet.svg";
import walletconnect from "@/assets/images/walletconnect.svg";

const walletIcons: any = {
  metamask: {
    mainnet: ethereum,
    icon: metamask,
  },

  walletconnect: {
    mainnet: ethereum,
    icon: walletconnect,
  },

  walletlink: {
    mainnet: ethereum,
    icon: walletlink,
  },

  portis: {
    mainnet: ethereum,
    icon: portis,
  },

  fortmatic: {
    mainnet: ethereum,
    icon: fortmatic,
  },

  sollet: {
    mainnet: solana,
    icon: sollet,
  },

  phantom: {
    mainnet: solana,
    icon: phantom,
  },

  waxio: {
    mainnet: wax,
    icon: waxio,
  },
};

const muster: any = {
  ethereum: {
    icon: ethereum,
    name: "Ethereum",

    include: [
      {
        icon: metamask,
        name: "Metamask",
        symbol: "metamask",
      },

      {
        icon: walletconnect,
        name: "WalletConnect",
        symbol: "walletconnect",
      },

      {
        icon: walletlink,
        symbol: "walletlink",
        name: "Coinbase Wallet",
      },

      {
        icon: portis,
        name: "Portis",
        symbol: "portis",
      },

      {
        icon: fortmatic,
        name: "Fortmatic",
        symbol: "fortmatic",
      },
    ],
  },

  solana: {
    icon: solana,
    name: "Solana",

    include: [
      {
        icon: sollet,
        name: "Sollet",
        symbol: "sollet",
      },

      {
        icon: phantom,
        name: "Phantom",
        symbol: "phantom",
      },
    ],
  },

  wax: {
    icon: wax,
    name: "Wax",

    include: [
      {
        icon: waxio,
        symbol: "waxio",
        name: "Wax Wallet",
      },
    ],
  },
};

export { muster, walletIcons };
