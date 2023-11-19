import { CSSProperties } from '@builder.io/qwik';

import { Placement } from './types';
import {
  getDocumentHeight,
  getDocumentWidth,
} from './utils';

export function getBottomEndPositionStyle({
  relativeElement,
  dialogElement,
}: {
  relativeElement: HTMLElement,
  dialogElement: HTMLElement
}) {
  const { right, bottom } = relativeElement.getBoundingClientRect();
  const dialogElementRect = dialogElement.getBoundingClientRect();

  return ({
    top: `${bottom}px`,
    left: `${ensureAdjustXToHaveWidthInsideView(
      right - dialogElementRect.width,
      dialogElementRect.width
    )}px`,
    right: "auto",
    bottom: "auto",
  } as const) satisfies CSSProperties;
}

export function getBottomPositionStyle({
  relativeElement,
  dialogElement,
}: {
  relativeElement: HTMLElement,
  dialogElement: HTMLElement
}) {
  const { x, bottom, width } = relativeElement.getBoundingClientRect();
  const dialogElementRect = dialogElement.getBoundingClientRect();

  return ({
    top: `${bottom}px`,
    left: `${ensureAdjustXToHaveWidthInsideView(
      x + width / 2 - dialogElementRect.width / 2,
      dialogElementRect.width
    )}px`,
    right: "auto",
    bottom: "auto",
  } as const) satisfies CSSProperties;
}

export function getBottomStartPositionStyle({
  relativeElement,
  dialogElement,
}: {
  relativeElement: HTMLElement,
  dialogElement: HTMLElement
}) {
  const { x, bottom } = relativeElement.getBoundingClientRect();
  const dialogElementRect = dialogElement.getBoundingClientRect();

  return ({
    top: `${bottom}px`,
    left: `${ensureAdjustXToHaveWidthInsideView(x, dialogElementRect.width)}px`,
    right: "auto",
    bottom: "auto",
  } as const) satisfies CSSProperties;
}

export function getRightEndPositionStyle({
  relativeElement,
  dialogElement,
}: {
  relativeElement: HTMLElement,
  dialogElement: HTMLElement
}) {
  const { right, bottom } = relativeElement.getBoundingClientRect();
  const dialogElementRect = dialogElement.getBoundingClientRect();

  return ({
    top: `${ensureAdjustYToHaveHeightInsideView(
      bottom - dialogElementRect.height,
      dialogElementRect.height
    )}px`,
    left: `${right}px`,
    right: "auto",
    bottom: "auto",
  } as const) satisfies CSSProperties;
}

export function getRightPositionStyle({
  relativeElement,
  dialogElement,
}: {
  relativeElement: HTMLElement,
  dialogElement: HTMLElement
}) {
  const { right, y, height } = relativeElement.getBoundingClientRect();
  const dialogElementRect = dialogElement.getBoundingClientRect();

  return ({
    top: `${ensureAdjustYToHaveHeightInsideView(
      y + height / 2 - dialogElementRect.height / 2,
      dialogElementRect.height
    )}px`,
    left: `${right}px`,
    right: "auto",
    bottom: "auto",
  } as const) satisfies CSSProperties;
}

export function getRightStartPositionStyle({
  relativeElement,
  dialogElement,
}: {
  relativeElement: HTMLElement,
  dialogElement: HTMLElement
}) {
  const { right, y } = relativeElement.getBoundingClientRect();
  const dialogElementRect = dialogElement.getBoundingClientRect();

  return ({
    top: `${ensureAdjustYToHaveHeightInsideView(y, dialogElementRect.height)}px`,
    left: `${right}px`,
    right: "auto",
    bottom: "auto",
  } as const) satisfies CSSProperties;
}

export function getLeftEndPositionStyle({
  relativeElement,
  dialogElement,
}: {
  relativeElement: HTMLElement,
  dialogElement: HTMLElement
}) {
  const { x, bottom } = relativeElement.getBoundingClientRect();
  const dialogElementRect = dialogElement.getBoundingClientRect();

  return ({
    top: `${ensureAdjustYToHaveHeightInsideView(bottom - dialogElementRect.height, dialogElementRect.height)}px`,
    left: `${x - dialogElementRect.width}px`,
    right: "auto",
    bottom: "auto",
  } as const) satisfies CSSProperties;
}

export function getLeftPositionStyle({
  relativeElement,
  dialogElement,
}: {
  relativeElement: HTMLElement,
  dialogElement: HTMLElement
}) {
  const { x, y, height } = relativeElement.getBoundingClientRect();
  const dialogElementRect = dialogElement.getBoundingClientRect();

  return ({
    top: `${ensureAdjustYToHaveHeightInsideView(
      y + height / 2 - dialogElementRect.height / 2,
      dialogElementRect.height
    )}px`,
    left: `${x - dialogElementRect.width}px`,
    right: "auto",
    bottom: "auto",
  } as const) satisfies CSSProperties;
}

export function getLeftStartPositionStyle({
  relativeElement,
  dialogElement,
}: {
  relativeElement: HTMLElement,
  dialogElement: HTMLElement
}) {
  const { x, y } = relativeElement.getBoundingClientRect();
  const dialogElementRect = dialogElement.getBoundingClientRect();

  return ({
    top: `${ensureAdjustYToHaveHeightInsideView(y, dialogElementRect.height)}px`,
    left: `${x - dialogElementRect.width}px`,
    right: "auto",
    bottom: "auto",
  } as const) satisfies CSSProperties;
}

export function getTopEndPositionStyle({
  relativeElement,
  dialogElement,
}: {
  relativeElement: HTMLElement,
  dialogElement: HTMLElement
}) {
  const { y, right } = relativeElement.getBoundingClientRect();
  const dialogElementRect = dialogElement.getBoundingClientRect();

  return ({
    top: `${y - dialogElementRect.height}px`,
    left: `${ensureAdjustXToHaveWidthInsideView(right - dialogElementRect.width, dialogElementRect.width)}px`,
    right: "auto",
    bottom: "auto",
  } as const) satisfies CSSProperties;
}

export function ensureAdjustXToHaveWidthInsideView(x: number, dialogWidth: number) {
  const sizeOutsideRightSide = (x + dialogWidth) - getDocumentWidth();
  const adjustedX = sizeOutsideRightSide > 0
    ? Math.max(x - sizeOutsideRightSide, 0)
    : Math.max(x, 0)

  return Math.round(adjustedX);
}

export function ensureAdjustYToHaveHeightInsideView(y: number, dialogHeight: number) {
  const sizeOutside = (y + dialogHeight) - getDocumentHeight();
  const adjustedY = sizeOutside > 0
    ? Math.max(y - sizeOutside, 0)
    : Math.max(y, 0)

  return adjustedY;
}


export function getTopStartPositionStyle({
  dialogElement,
  relativeElement,
}: {
  dialogElement: HTMLElement,
  relativeElement: HTMLElement,
}) {
  const { x, y } = relativeElement.getBoundingClientRect();
  const dialogElementRect = dialogElement.getBoundingClientRect()

  return ({
    top: `${y - dialogElementRect.height}px`,
    left: `${ensureAdjustXToHaveWidthInsideView(x, dialogElementRect.width)}px`,
    right: "auto",
    bottom: "auto",
  } as const) satisfies CSSProperties;
}

export function getTopPositionStyle({
  dialogElement,
  relativeElement,
}: {
  dialogElement: HTMLElement,
  relativeElement: HTMLElement
}) {
  const { x, y, width } = relativeElement.getBoundingClientRect();
  const dialogElementRect = dialogElement.getBoundingClientRect();

  return ({
    top: `${y - dialogElementRect.height}px`,
    left: `${ensureAdjustXToHaveWidthInsideView(
      x + width / 2 - dialogElementRect.width / 2,
      dialogElementRect.width
    )}px`,
    right: "auto",
    bottom: "auto",
  } as const) satisfies CSSProperties;
}

export function getDialogPositionStyle(
  availablePosition:
    | {
      type: "full-size-available";
      placement: Placement;
    }
    | {
      placement: Placement;
      availableSize: number;
      type: "partial-size-available";
    },
  dialogElement: HTMLElement,
  relativeElement: HTMLElement
) {
  switch (availablePosition.placement) {
    case "top-start":
      return getTopStartPositionStyle({
        dialogElement,
        relativeElement,
      });

    case "top":
      return getTopPositionStyle({
        dialogElement,
        relativeElement,
      });

    case "top-end":
      return getTopEndPositionStyle({
        relativeElement,
        dialogElement,
      });
    case "bottom-start":
      return getBottomStartPositionStyle({
        dialogElement,
        relativeElement,
      });

    case "bottom":
      return getBottomPositionStyle({
        dialogElement,
        relativeElement,
      });

    case "bottom-end":
      return getBottomEndPositionStyle({
        dialogElement,
        relativeElement,
      });
    case "left-start":
      return getLeftStartPositionStyle({
        dialogElement,
        relativeElement,
      });

    case "left":
      return getLeftPositionStyle({
        dialogElement,
        relativeElement,
      });

    case "left-end":
      return getLeftEndPositionStyle({
        dialogElement,
        relativeElement,
      });
    case "right-start":
      return getRightStartPositionStyle({
        dialogElement,
        relativeElement,
      });

    case "right":
      return getRightPositionStyle({
        dialogElement,
        relativeElement,
      });

    case "right-end":
      return getRightEndPositionStyle({
        dialogElement,
        relativeElement,
      });
  }
}
