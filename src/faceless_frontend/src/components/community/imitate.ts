import icon from "@/assets/images/eth.svg";
import meta from "@/assets/images/meta.svg";
import more from "@/assets/images/more.svg";
import phone from "@/assets/images/phone.svg";
import google from "@/assets/images/gmail.svg";
import twitter from "@/assets/images/twitter.svg";
import telegram from "@/assets/images/telegram.svg";
import passport from "@/assets/images/passport.svg";
import drivelicense from "@/assets/images/drivelicense.svg";
import twitterPlatform from "@/assets/images/twitterPlatform.png";

const tokens = [
  {
    icon,
    name: "ETH",
    blockchain: "Ethereum",
  },

  {
    icon,
    name: "BTC",
    blockchain: "Bitcoin",
  },

  {
    icon,
    name: "USDT",
    blockchain: "Tether",
  },

  {
    icon,
    name: "BNB",
    blockchain: "Binance Coin",
  },

  {
    icon,
    name: "XRP",
    blockchain: "XRP",
  },

  {
    icon,
    name: "ADA",
    blockchain: "Cardano",
  },

  {
    icon,
    name: "DOGE",
    blockchain: "Dogecoin",
  },

  {
    icon,
    name: "DOT",
    blockchain: "Polkadot",
  },

  {
    icon,
    name: "UNI",
    blockchain: "Uniswap",
  },

  {
    icon,
    name: "LTC",
    blockchain: "Litecoin",
  },

  {
    icon,
    name: "LINK",
    blockchain: "Chainlink",
  },

  {
    icon,
    name: "BCH",
    blockchain: "Bitcoin Cash",
  },

  {
    icon,
    name: "XLM",
    blockchain: "Stellar",
  },

  {
    icon,
    name: "USDC",
    blockchain: "USD Coin",
  },

  {
    icon,
    name: "THETA",
    blockchain: "Theta",
  },
];

const medias = [
  {
    avatar: "https://avatars.githubusercontent.com/u/2106987?v=4",
    username: "@Hellohuman",
    platform: "GitHub",
    amount: 1.23,
    coin: "ETH",
    key: 1,
  },

  {
    avatar: "https://avatars.githubusercontent.com/u/6128107?v=4",
    username: "facebook",
    platform: "GitHub",
    amount: 2.34,
    coin: "BTC",
    key: 2,
  },

  {
    avatar: "https://avatars.githubusercontent.com/u/69631?v=4",
    username: "Meta",
    platform: "GitHub",
    amount: 3.45,
    coin: "USDT",
    key: 3,
  },

  // {
  //   avatar: "https://avatars.githubusercontent.com/u/1335026?v=4",
  //   username: "+39-339***0318",
  //   platform: "GitHub",
  //   amount: 4.56,
  //   coin: "BNB",
  //   key: 4,
  // },

  // {
  //   avatar: "https://avatars.githubusercontent.com/u/317889?v=4",
  //   username: "twitter",
  //   platform: "GitHub",
  //   amount: 5.67,
  //   coin: "XRP",
  //   key: 5,
  // },

  // {
  //   avatar: "https://avatars.githubusercontent.com/u/10639145?v=4",
  //   username: "@Hellohuman",
  //   platform: "GitHub",
  //   amount: 6.78,
  //   coin: "ADA",
  //   key: 6,
  // },

  // {
  //   avatar: "https://avatars.githubusercontent.com/u/2106987?v=4",
  //   username: "@Hellohuman",
  //   platform: "GitHub",
  //   amount: 7.89,
  //   coin: "DOGE",
  //   key: 7,
  // },

  // {
  //   avatar: "https://avatars.githubusercontent.com/u/6128107?v=4",
  //   username: "facebook",
  //   platform: "GitHub",
  //   amount: 8.9,
  //   coin: "DOT",
  //   key: 8,
  // },

  // {
  //   avatar: "https://avatars.githubusercontent.com/u/69631?v=4",
  //   username: "Meta",
  //   platform: "GitHub",
  //   amount: 9.01,
  //   coin: "UNI",
  //   key: 9,
  // },

  // {
  //   avatar: "https://avatars.githubusercontent.com/u/1335026?v=4",
  //   username: "+39-339***0318",
  //   platform: "GitHub",
  //   amount: 10.12,
  //   coin: "LTC",
  //   key: 10,
  // },

  // {
  //   avatar: "https://avatars.githubusercontent.com/u/317889?v=4",
  //   username: "twitter",
  //   platform: "GitHub",
  //   amount: 1.23,
  //   coin: "LINK",
  //   key: 11,
  // },

  // {
  //   avatar: "https://avatars.githubusercontent.com/u/10639145?v=4",
  //   username: "@Hellohuman",
  //   platform: "GitHub",
  //   amount: 2.34,
  //   coin: "BCH",
  //   key: 12,
  // },

  // {
  //   avatar: "https://avatars.githubusercontent.com/u/2106987?v=4",
  //   username: "@Hellohuman",
  //   platform: "GitHub",
  //   amount: 3.45,
  //   coin: "XLM",
  //   key: 13,
  // },

  // {
  //   avatar: "https://avatars.githubusercontent.com/u/6128107?v=4",
  //   username: "facebook",
  //   platform: "GitHub",
  //   amount: 4.56,
  //   coin: "USDC",
  //   key: 14,
  // },

  // {
  //   avatar: "https://avatars.githubusercontent.com/u/69631?v=4",
  //   username: "Meta",
  //   platform: "GitHub",
  //   amount: 5.67,
  //   coin: "THETA",
  //   key: 15,
  // },
];

const hris = [
  {
    icon: phone,
    name: "Mobile Phone",
    key: "MPhone",
  },

  {
    icon: telegram,
    name: "Telegram",
    key: "Telegram",
  },

  {
    icon: google,
    name: "Google",
    key: "Google",
  },

  {
    icon: twitter,
    name: "Twitter",
    key: "Twitter",
  },

  {
    icon: meta,
    name: "Meta",
    key: "MPhone",
  },

  {
    icon: passport,
    name: "Passport",
    key: "MPhone",
  },

  {
    icon: drivelicense,
    name: "Drivelicense",
    key: "MPhone",
  },

  {
    icon: more,
    name: "More in support",
    key: "MPhone",
  },
];

const eras = {
  "Twitter:@Hellohuman" : {
    platform: "Twitter",
    username: "@Hellohuman",
    icon: twitterPlatform,
  },
};

const areas = [
  {
    key: "1",
    name: "+1 America",
  },

  {
    key: "7",
    name: "+7 Russia",
  },

  {
    key: "81",
    name: "+81 Japan",
  },

  {
    key: "82",
    name: "+82 South Korea",
  },

  {
    key: "33",
    name: "+33 France",
  },

  {
    key: "44",
    name: "+44 England",
  },

  {
    key: "49",
    name: "+49 Germany",
  },

  {
    key: "61",
    name: "+61 Australia",
  },

  {
    key: "64",
    name: "+64 New Zealand",
  },

  {
    key: "65",
    name: "+65 Singapore",
  },

  {
    key: "66",
    name: "+66 Thailand",
  },

  {
    key: "84",
    name: "+84 Vietnam",
  },

  {
    key: "86",
    name: "+86 Chinese Mainland",
  },
];

export { tokens, medias, hris, eras, areas };
