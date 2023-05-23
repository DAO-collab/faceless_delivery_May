// 封装实例
import _axios from "./interceptor";

// GET请求
const $GET = (path: string, params: object = {}) => {
  return _axios.get(path, { params });
};

// PUT请求
const $PUT = (path: string, params: object) => {
  return _axios.put(path, params);
};

// POST请求
const $POST = (path: string, params: object, option: object = {}) => {
  return _axios.post(path, params, option);
};

// DELETE请求
const $DELETE = (path: string, data: object) => {
  return _axios.delete(path, { data });
};

// 导出方法
export { $GET, $PUT, $POST, $DELETE };
