const isMobile = () => {
  let width = document.body.clientWidth;
  if (width <= 768) return true;
  return false;
};

export { isMobile };
