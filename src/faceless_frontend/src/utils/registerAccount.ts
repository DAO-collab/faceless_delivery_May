import { useConfig, useFaceless, initializeFaceless } from "@/store";
import { eras, medias } from "@/components/community";
import { platform_id } from "@/utils/account";
import pinia from "@/utils/piniaInstance";
import phonePlatform from "@/assets/images/phonePlatform.png";

const createAccount = async (platform: string, username: string) => {
  let accountList = JSON.parse(window.sessionStorage.getItem("eras"));

  Object.entries(accountList).forEach(([key, value]) => {
    eras[key] = value;
  })

  const faceless = useFaceless(pinia);
  await initializeFaceless();

  if (platform && username) {
    await faceless.client.register(platform, username);
    let pid = platform_id(platform, username);
    eras[pid] = { icon: phonePlatform, platform, username };
    medias[pid] = {
      avatar: "https://avatars.githubusercontent.com/u/2106987?v=4",
      username: username,
      platform: platform,
      amount: await faceless.client.balance(platform, username),
      coin: "ETH",
      key: medias.length + 1,
    };
  }
}

export { createAccount };
