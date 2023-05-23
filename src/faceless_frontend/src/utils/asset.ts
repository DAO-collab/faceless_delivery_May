import ENV from "@/assets/env";
import Avatar from "@/assets/images/avatar.svg";
import placeholder from "@/assets/images/placeholder.svg";

const readAvatar = (path: string) => {
  if (path) return path;
  return Avatar;
};

const readCoin = (path: string) => {
  if (path) return path;
  return placeholder;
};

const readPlatform = (path: string) => {
  if (path) return path;
  return placeholder;
};

export { readAvatar, readCoin, readPlatform };
