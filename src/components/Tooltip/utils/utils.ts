export const getDocumentWidth = () => document.documentElement.clientWidth;
export const getDocumentHeight = () => document.documentElement.clientHeight;
export const nextTickRender = () =>
  new Promise((resolve) => setTimeout(resolve));

export function getScrollableContainer(scrollableContainer?: HTMLElement) {
  return scrollableContainer ?? document.documentElement;
}


export function getElementVisibleWidthInsideScrollableContainer(
  element: HTMLElement,
  scrollableContainer: HTMLElement
) {
  const { x, width, right } = element.getBoundingClientRect();
  const scrollableContainerRect = scrollableContainer.getBoundingClientRect();

  return Math.min(
    width,
    Math.max(
      0,
      width -
      Math.max(0, right - scrollableContainerRect.right) -
      Math.max(0, scrollableContainerRect.x - x)
    )
  );
}

export function getElementVisibleHeightInsideScrollableContainer(
  element: HTMLElement,
  scrollableContainer: HTMLElement
) {
  const { y, height, bottom } = element.getBoundingClientRect();
  const scrollableContainerRect = scrollableContainer.getBoundingClientRect();

  return Math.min(
    height,
    Math.max(
      0,
      height -
      Math.max(0, bottom - scrollableContainerRect.bottom) -
      Math.max(0, scrollableContainerRect.y - y)
    )
  );
}


export function getElementVisibleBoundingClientRectInsideScrollableContainer(
  element: HTMLElement,
  scrollableContainer: HTMLElement
) {
  const { x, y } = element.getBoundingClientRect();
  const scrollableContainerRect = scrollableContainer.getBoundingClientRect();

  return {
    x: Math.max(x, scrollableContainerRect.x),
    y: Math.max(y, scrollableContainerRect.y),
    width: getElementVisibleWidthInsideScrollableContainer(
      element,
      scrollableContainer
    ),
    height: getElementVisibleHeightInsideScrollableContainer(
      element,
      scrollableContainer
    ),
  };
}

export function isMouseInsideBoundingBox(mouseX: number, mouseY: number, element: HTMLElement) {
  const boundingBox = element.getBoundingClientRect();

  return (
    mouseX >= boundingBox.x &&
    mouseX <= (boundingBox.x + boundingBox.width) &&
    mouseY >= boundingBox.y &&
    mouseY <= (boundingBox.y + boundingBox.height)
  );
}