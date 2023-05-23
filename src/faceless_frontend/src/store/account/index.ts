import { defineStore } from "pinia";

export const useAccount = defineStore("account", {
  state: () => ({
    platform: "",
    username: "",
    icon: "#",
  }),

  getters: {},

  actions: {},
});

export const useReceiverAccount = defineStore("receiver_account", {
    state: () => ({
      mpk: "",
      platform: "",
      username: "",
      icon: "#",
    }),
  
    getters: {},
  
    actions: {},
  });
  