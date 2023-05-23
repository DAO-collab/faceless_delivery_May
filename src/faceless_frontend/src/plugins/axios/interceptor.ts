import axios from "axios";
import ENV from "@/assets/env";
import { message, notification, loadingBar } from "@/utils/command";

// 初始化实例
const _axios = axios.create({
  timeout: 300000,
  responseType: "json",
  baseURL: ENV.faceless.http,
});

// 请求拦截器
_axios.interceptors.request.use(
  config => {
    loadingBar.start();
    config.method?.toUpperCase() === "POST" && (config.data = JSON.stringify(config.data));
    return config;
  },

  error => {
    loadingBar.error();
    return Promise.reject(error);
  },
);

// 响应拦截器
_axios.interceptors.response.use(
  ({ data, status }) => {
    if (status === 200) {
      loadingBar.finish();
      return Promise.resolve(data);
    }

    loadingBar.error();
    return Promise.reject(data);
  },

  error => {
    loadingBar.error();
    return Promise.reject(error);
  },
);

export default _axios;
