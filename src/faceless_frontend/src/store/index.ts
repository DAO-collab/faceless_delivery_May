import { useFaceless } from "./client";
import { useConfig } from "./config";
import { initSubstrateFaceless } from "./substrate";
import { initDfinityFaceless } from "./dfinity";


export const initializeFaceless = async () => {
    const config = useConfig();
    const faceless = useFaceless();
    if (config.backend == "polkadot") {
        faceless.client = await initSubstrateFaceless();
        console.log("Substrate Faceless initialized");
    }
    else if (config.backend == "dfinity") {
        faceless.client = await initDfinityFaceless();
        console.log("Dfinity Faceless initialized");
    }
};

export { useUser } from "./user";
export { useConfig } from "./config";
export { useWallet } from "./wallet";
export type { Connect } from "./wallet";
export {useAccount, useReceiverAccount} from "./account";
export { useFaceless } from "./client";