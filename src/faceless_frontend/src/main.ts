import { createApp } from "vue";

import Main from "./Main.vue";
import router from "./router";
import Env from "./assets/env";
import i18n from "./plugins/i18n";
import naive from "./plugins/naive";
import pinia from "@/utils/piniaInstance";
import VueAnimXyz from "@animxyz/vue3";
import { VueReCaptcha } from "vue-recaptcha-v3";

import "normalize.css";
import "@animxyz/core";
import "./assets/font/index.scss";
import "./assets/style/reset.scss";
import "./assets/style/global.scss";
import "./assets/style/animation.scss";
import "cropperjs/dist/cropper.min.css";

createApp(Main)
  .use(i18n)
  .use(naive)
  .use(pinia)
  .use(router)
  .use(VueAnimXyz)
  .use(VueReCaptcha, { siteKey: Env.faceless.siteKey, loaderOptions: { autoHideBadge: true } })
  .mount("#container");
