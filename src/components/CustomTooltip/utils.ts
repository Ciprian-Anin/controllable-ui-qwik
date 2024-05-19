export const getDocumentWidth = () => document.documentElement.clientWidth;
export const getDocumentHeight = () => document.documentElement.clientHeight;
export const nextTickRender = () =>
  new Promise((resolve) => setTimeout(resolve));