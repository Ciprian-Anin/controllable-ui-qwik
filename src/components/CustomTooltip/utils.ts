export const getDocumentWidth = () => document.documentElement.clientWidth;
export const getDocumentHeight = () => document.documentElement.clientHeight;
export const nextTickRender = () =>
  new Promise((resolve) => setTimeout(resolve));

export const delay = (milliseconds: number, timeoutIDSignal: Signal<number>) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export function getScrollableContainer(scrollableContainer?: HTMLElement) {
  return scrollableContainer ?? document;
} 