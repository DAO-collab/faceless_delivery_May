const lan = () => {
  // 本地访问历史
  let local = localStorage.getItem("lan");
  if (local) return local;

  // 浏览器默认
  let nav = navigator.language;
  if (nav === "zh-CN") return "zh";

  // 产品默认
  return "en";
};

export { lan };
