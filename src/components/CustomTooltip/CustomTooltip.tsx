import {
  $,
  component$,
  CSSProperties,
  Slot,
  useId,
  useSignal,
  useStore,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";

import {
  getAvailablePlacementFromTheOnesToBeTried,
  getDialogAvailablePositionConsideringKeepingCurrentPlacement,
} from "./availablePosition.utils";
import TooltipStyle from "./CustomTooltip.scss?inline";
import { getDialogPositionStyle } from "./positionStyle.utils";
import { Placement } from "./types";
import { nextTickRender } from "./utils";

const defaultOrderOfPlacementsToBeTried: {
  [key in Placement]: [
    preferredPlacement: Placement,
    ...restOfPlacements: Placement[],
  ];
} = {
  "top-start": ["top-start", "bottom-start", "left", "right"],
  top: ["top", "bottom", "left", "right"],
  "top-end": ["top-end", "bottom-end", "left", "right"],
  "left-start": ["left-start", "right-start", "top", "bottom"],
  left: ["left", "right", "top", "bottom"],
  "left-end": ["left-end", "right-end", "top", "bottom"],
  "right-start": ["right-start", "left-start", "top", "bottom"],
  right: ["right", "left", "top", "bottom"],
  "right-end": ["right-end", "left-end", "top", "bottom"],
  "bottom-start": ["bottom-start", "top-start", "left", "right"],
  bottom: ["bottom", "top", "left", "right"],
  "bottom-end": ["bottom-end", "top-end", "left", "right"],
};

type BaseProps = {
  preferredPlacement?: Placement;
  orderOfPlacementsToBeTried?: [
    preferredPlacement: Placement,
    ...restOfPlacements: Placement[],
  ];
  triggerActions?: ("hover" | "focus" | "touch" | "click")[]; // TODO: ...
  dialogOffset?: number; // distance between relative element and tooltip dialog
};

/**
 * Keep current placement of dialog as time as it remains in
 * min & max sizes boundaries.
 * 
 *  @prop `dialogMinMaxSizes`:
 *   > In case we need to keep current position, we will use maximum & minimum sizes
 *   > of dialog to check if it fits in current placement, without going over its minimum sizes.
 *   > In case we don't have minimum size available for current placement,
 *   > than will be tried next place from `orderOfPlacementsToBeTried`.
 *
 *   > Maximum size is used to make sure to not have a bigger maximum size on dialog popover.
 *   > (we make sure to override the maximum size in case the available space is smaller than the dialog size)

 */
type KeepCurrentPlacementStrategyProps = BaseProps & {
  placementStrategy: "considerKeepingCurrentPlacement";
  dialogMinMaxSizes?: {
    dialogMaxHeight?: number;
    dialogMinHeight?: number;
    dialogMaxWidth?: number;
    dialogMinWidth?: number;
  };
};

/**
 * Dialog placement will be recomputed immediately after we remain
 * without necessary space for dialog on current placement.
 */
export type DefaultStrategyProps = BaseProps & {
  placementStrategy: "default";
};

type Props = DefaultStrategyProps | KeepCurrentPlacementStrategyProps;

/**
 * @prop `orderOfPlacementsToBeTried`:
 *   > In case dialog will not have enough space to be positioned in
 *   > the preferred placement, we will try to position it in the rest
 *   > of placements. The first placement with enough space will be the chosen one.
 */
export const CustomTooltip = component$((props: Props) => {
  const {
    preferredPlacement = "bottom-start",
    orderOfPlacementsToBeTried = defaultOrderOfPlacementsToBeTried[
      preferredPlacement
    ],
    dialogOffset = 5,
  } = props;
  useStyles$(TooltipStyle);
  const relativeElementRef = useSignal<HTMLElement>();
  const dialogRef = useSignal<HTMLElement>();
  const dialogPositionStyle = useStore<{
    currentPlacement?: Placement;
    value: CSSProperties & {
      transform?: string;
      inset?: string;
      transformOrigin?: string;
    };
  }>({ currentPlacement: undefined, value: {} });

  // useVisibleTask$(() => {
  //   dialogRef.value?.showPopover();
  // });

  const positionDialog = $(async () => {
    (document.querySelector(":root") as HTMLElement)?.style.setProperty(
      "--dialog-offset",
      `${dialogOffset}px`
    );

    if (dialogRef.value && relativeElementRef.value) {
      const availablePosition =
        props.placementStrategy === "considerKeepingCurrentPlacement"
          ? getDialogAvailablePositionConsideringKeepingCurrentPlacement({
              placementsToBeTried: orderOfPlacementsToBeTried,
              dialogElement: dialogRef.value,
              relativeElement: relativeElementRef.value,
              currentPlacement: dialogPositionStyle.currentPlacement,
              dialogOffset,
              ...props.dialogMinMaxSizes,
            })
          : getAvailablePlacementFromTheOnesToBeTried(
              orderOfPlacementsToBeTried,
              dialogRef.value,
              relativeElementRef.value,
              dialogOffset
            );

      if (availablePosition.type === "partial-size-available") {
        // in case of partial size available to be displayed,
        // apply the new height or width on element before computing
        // its position for available placement location
        // (for ex. if placement is left this will make sure to always
        // place on left center based on new dialog height obtained
        // after reducing the width of it)
        switch (availablePosition.placement) {
          case "top-start":
          case "top":
          case "top-end":
          case "bottom-start":
          case "bottom":
          case "bottom-end":
            dialogPositionStyle.value = {
              ...dialogPositionStyle.value,
              maxHeight: `${availablePosition.availableSize - dialogOffset}px`,
            };
            break;
          case "left-start":
          case "left":
          case "left-end":
          case "right-start":
          case "right":
          case "right-end":
            dialogPositionStyle.value = {
              ...dialogPositionStyle.value,
              maxWidth: `${availablePosition.availableSize - dialogOffset}px`,
            };
            break;
        }
        await nextTickRender(); // wait for new width/height to be rendered,
        // to be able to compute properly, the position of dialog for
        // available placement location
      }

      dialogPositionStyle.currentPlacement = availablePosition.placement;
      await nextTickRender(); // wait for the placement class to be rendered,
      // in order to have the proper margin applied

      dialogPositionStyle.value = {
        ...dialogPositionStyle.value,
        ...getDialogPositionStyle(
          availablePosition,
          dialogRef.value,
          relativeElementRef.value
        ),
        "--scrollbar-height": `${
          window.innerHeight - document.documentElement.clientHeight
        }px`,
        visibility: "visible",
      };
    }
  });

  const tooltipId = useId();

  const handleMouseEnter = $(async () => {
    if (relativeElementRef.value) {
      dialogPositionStyle.value = {
        ...dialogPositionStyle.value,
        visibility: "hidden",
      };

      await nextTickRender(); // wait for dialog to have `visibility: hidden` set
      // before showing it
      // This is important in order to avoid the display of it on a position
      // inappropriate with requested/available placement
      // * (at this moment we don't have the dialog sizes,
      // * and it is not positioned on requested/available placement)
      dialogRef.value?.showPopover();
      await nextTickRender(); // wait for new popover to be showed before
      // computing the available placement location, in order to have its sizes available
      // * (showing it => making it to occupy space on page)

      await positionDialog();
      document.addEventListener("scroll", positionDialog);
    }
  });

  const closeDialog = $(() => {
    dialogRef.value?.hidePopover();
    dialogPositionStyle.currentPlacement = undefined;
    dialogPositionStyle.value = {};
    document.removeEventListener("scroll", positionDialog);
  });

  useVisibleTask$(({ cleanup }) => {
    cleanup(() => document.removeEventListener("scroll", positionDialog));
  });

  return (
    <div>
      <div
        ref={relativeElementRef}
        class="QwikUiTooltip-relative-element"
        // @ts-ignore
        popovertarget={tooltipId}
        onMouseEnter$={handleMouseEnter}
        onMouseLeave$={async (event) => {
          if (
            dialogRef.value !== event.relatedTarget &&
            !dialogRef.value?.contains(event.relatedTarget as Node)
          ) {
            await closeDialog();
          }
        }}
      >
        <Slot name="relative-element" />
      </div>
      <div
        class={[
          "QwikUiTooltip-dialog",
          dialogPositionStyle.currentPlacement &&
            `QwikUiTooltip-placement-${dialogPositionStyle.currentPlacement}`,
        ]}
        // @ts-ignore
        popover="manual"
        id={tooltipId}
        ref={dialogRef}
        role="tooltip"
        data-dialog-placement={preferredPlacement}
        style={dialogPositionStyle.value}
        onMouseLeave$={async (event) => {
          if (
            relativeElementRef.value !== event.relatedTarget &&
            !relativeElementRef.value?.contains(event.relatedTarget as Node)
          ) {
            await closeDialog();
          }
        }}
      >
        <div
          class="QwikUiTooltip-tooltip"
          style={{
            maxHeight: dialogPositionStyle.value?.maxHeight ?? "",
          }}
        >
          <Slot name="message" />
        </div>
      </div>
    </div>
  );
});
