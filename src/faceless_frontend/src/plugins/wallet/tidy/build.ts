import ENV from "@/assets/env";
import { muster } from "./muster";

let output: any = [];
const wallets = ENV.walletChains;
for (const it of wallets) output.push(muster[it]);

export { output };
