import { defineStore } from "pinia";
import { useConfig } from "../config";

interface FacelessClient {

    wallet_address(): string;

    keypair(): [string, string] | null;

    balance(platform: string, id: string): Promise<number>;

    register(platform: string, id: string): Promise<void>;

    deposit(value: number, platform: string, id: string): Promise<void>;
    
    withdraw(destination: string, value: number, platform: string, id: string): Promise<void>;

    self_transfer(
        value: number, 
        sender_platform: string, 
        sender_id: string,
        receiver_platform: string,
        receiver_id: string): Promise<void>;

    transfer(
        value: number, 
        sender_platform: string, 
        sender_username: string,
        receiver_platform: string,
        receiver_username: string,
        receiver_mpk: string): Promise<void>;
}

const useFaceless = defineStore("faceless", {
    state: () => ({
        client: {} as FacelessClient,
    }),

    getters: {},

    actions: {},
});

export { FacelessClient, useFaceless };