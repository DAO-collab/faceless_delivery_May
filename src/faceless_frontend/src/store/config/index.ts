import { defineStore } from "pinia";

export const useConfig = defineStore("config", {
  state: () => ({
    website: "http://127.0.0.1:4944",
    // website: "https://dapp.faceless.live",
    backend: "dfinity",
    // backend: "polkadot",
    substrate_wss: "wss://dapp.faceless.live/substrate_node",
  }),

  getters: {},

  actions: {},
});
