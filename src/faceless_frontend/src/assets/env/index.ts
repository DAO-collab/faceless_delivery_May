import stag from "./stag.json";
import prod from "./prod.json";

export default !!import.meta.env.VITE_PRODUCT_PROD ? prod : stag;
