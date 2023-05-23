import CryptoJS from "crypto-js";

const config = {
  pass: "n2dNvHJ&3iJmWqgyv6k%BoXUGX5RWFVf",
  ivStr: "\x90;\xFF\xF5\xF7\x94\xABD\xF9CJ\xE8\xEB\x9D\xE1x",
  saltStr: "\xE1J\xF9\xB3\xE6\xB6+c\xBE%.\x86\nK\x91\xC3",
};

const encrypt = (data: string) => {
  let params = { keySize: 256 / 32, iterations: 100 };
  let salt = CryptoJS.enc.Latin1.parse(config.saltStr);
  let key = CryptoJS.PBKDF2(config.pass, salt, params);
  let iv = CryptoJS.enc.Latin1.parse(config.ivStr);
  let cipher = CryptoJS.AES.encrypt(data, key, { iv });
  return cipher.toString();
};

export { encrypt };
