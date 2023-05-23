import { IbeWrapper } from 'faceless-wasm-wrapper';

const platform_id = (platform: string, username: string) => {
  return platform + ":" + username;
};

const derive_pk_id = (platform: string, id: string, mpk?: string) => {
  if (mpk === undefined) {
    return undefined;
  }
  return IbeWrapper.pk_id(mpk, platform_id(platform, id));
}

export { platform_id, derive_pk_id };