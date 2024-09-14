import { CSSProperties } from '@builder.io/qwik';

import { Placement } from '../types';
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
    top: "0",
    right: "auto",
    bottom: "auto",
    left: "0",
    transformOrigin: "center top",
    transform: `translate3d(${right - dialogElementRect.width
      }px, ${bottom}px, 0px)`
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
    top: "0",
    right: "auto",
    bottom: "auto",
    left: `${-dialogElementRect.width / 2}px`,
    transformOrigin: "center top",
    transform: `translate3d(${x + width / 2}px, ${bottom}px, 0px)`
  } as const) satisfies CSSProperties;
}

export function getBottomStartPositionStyle({
  relativeElement,
}: {
  relativeElement: HTMLElement;
}) {
  const { x, bottom } = relativeElement.getBoundingClientRect();

  return ({
    top: "0",
    right: "auto",
    bottom: "auto",
    left: "0",
    transformOrigin: "center top",
    transform: `translate3d(${x}px, ${bottom}px, 0px)`
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
    top: "0",
    right: "auto",
    bottom: `auto`,
    left: "0",
    transform: `translate3d(${right}px, ${bottom - dialogElementRect.height
      }px, 0px)`
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
    top: `${-dialogElementRect.height / 2}px`,
    right: "auto",
    bottom: `auto`,
    left: "0",
    transform: `translate3d(${right}px, ${y + height / 2}px, 0px)`
  } as const) satisfies CSSProperties;
}

export function getRightStartPositionStyle({
  relativeElement,
}: {
  relativeElement: HTMLElement

}) {
  const { x, y, width } = relativeElement.getBoundingClientRect();

  return ({
    top: "0",
    right: "auto",
    bottom: "auto",
    left: "0",
    transform: `translate3d(${x + width}px, ${y}px, 0px)`
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
    top: "0",
    right: "0",
    bottom: "auto",
    left: "auto",
    transform: `translate3d(-${getDocumentWidth() - x}px, ${bottom - dialogElementRect.height}px, 0px)`
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
    top: `${-dialogElementRect.height / 2}px`,
    right: "0",
    bottom: `auto`,
    left: "auto",
    transform: `translate3d(-${getDocumentWidth() - x}px, ${y + height / 2
      }px, 0px)`
  } as const) satisfies CSSProperties;
}

export function getLeftStartPositionStyle({
  relativeElement,
}: {
  relativeElement: HTMLElement,
}) {
  const { x, y } = relativeElement.getBoundingClientRect();

  return ({
    top: "0",
    right: "0",
    bottom: "auto",
    left: "auto",
    transform: `translate3d(-${getDocumentWidth() - x}px, ${y}px, 0px)`
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
    top: "auto",
    right: "auto",
    bottom: "0",
    left: "0",
    transformOrigin: "left bottom",
    transform: `translate3d(${right - dialogElementRect.width}px, -${getDocumentHeight() - y}px, 0px)`
  } as const) satisfies CSSProperties;
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

  const sizeOutside = (x + dialogElementRect.width) - getDocumentWidth();
  const adjustedX = sizeOutside > 0 ? Math.max(0, x - sizeOutside) : x

  return ({
    top: "auto",
    right: "auto",
    bottom: "0",
    left: "0",
    transformOrigin: "center bottom",
    transform: `translate3d(${adjustedX}px, -${getDocumentHeight() - y}px, 0px)`
  } as const) satisfies CSSProperties;
}

export function getTopPositionStyle({
  dialogElement,
  relativeElement,
}: {
  dialogElement: HTMLElement,
  relativeElement: HTMLElement
}) {
  const relativeElementRect = relativeElement.getBoundingClientRect();
  const dialogElementRect = dialogElement.getBoundingClientRect();

  return ({
    top: "auto",
    right: "auto",
    bottom: "0",
    left: `${-dialogElementRect.width / 2}px`,
    transformOrigin: "center bottom",
    transform: `translate3d(${relativeElementRect.x + relativeElementRect.width / 2
      }px, -${getDocumentHeight() - relativeElementRect.y}px, 0px)`
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
