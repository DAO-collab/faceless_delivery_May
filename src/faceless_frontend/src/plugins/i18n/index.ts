import zh from "./lan/zh.json";
import en from "./lan/en.json";
import { lan } from "@/utils/lan";
import { createI18n } from "vue-i18n";

const locale = lan();

export default createI18n({
  locale,
  legacy: false,
  messages: {
    zh,
    en,
  },
});
