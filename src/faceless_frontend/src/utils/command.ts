import { createDiscreteApi, darkTheme } from "naive-ui";

type DiscreteApiType = "message" | "notification" | "loadingBar" | "dialog";

const kinds: Array<DiscreteApiType> = ["message", "notification", "loadingBar", "dialog"];

const options = { configProviderProps: { theme: darkTheme } };

export const { message, notification, loadingBar, dialog } = createDiscreteApi(kinds, options);
