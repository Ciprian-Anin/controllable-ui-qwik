import {
  $,
  component$,
  CSSProperties,
  QRL,
  QwikFocusEvent,
  QwikMouseEvent,
  Signal,
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
import { TooltipArrow } from "./components/TooltipArrow";
import TooltipStyle from "./CustomTooltip.scss?inline";
import { getDialogPositionStyle } from "./positionStyle.utils";
import { Placement } from "./types";
import { nextTickRender } from "./utils";

export const defaultOrderOfPlacementsToBeTried: {
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
  open: Signal<boolean>;
  onOpen$?: QRL<() => void>;
  onClose$?: QRL<() => void>;
  preferredPlacement?: Placement;
  orderOfPlacementsToBeTried?: [
    preferredPlacement: Placement,
    ...restOfPlacements: Placement[],
  ];
  triggerActions?: ("hover" | "focus" | "click")[];
  dialogOffset?: number; // distance between relative element and tooltip dialog
  closeTimeout?: number; // close timeout in ms
  arrow?: boolean;
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
export type KeepCurrentPlacementStrategyProps = BaseProps & {
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

export type Props = DefaultStrategyProps | KeepCurrentPlacementStrategyProps;

/**
 * @prop `orderOfPlacementsToBeTried`:
 *   > In case dialog will not have enough space to be positioned in
 *   > the preferred placement, we will try to position it in the rest
 *   > of placements. The first placement with enough space will be the chosen one.
 */
export const CustomTooltip = component$((props: Props) => {
  const {
    open,
    onOpen$,
    onClose$,
    preferredPlacement = "bottom-start",
    orderOfPlacementsToBeTried = defaultOrderOfPlacementsToBeTried[
      preferredPlacement
    ],
    // dialogOffset = 5,
    closeTimeout = 150,
    triggerActions = ["hover", "focus"],
    // triggerActions = ["click"],
    arrow = true,
    dialogOffset = 18,
  } = props;
  const arrowSize = arrow ? 12 : 0;

  useStyles$(TooltipStyle);

  const relativeElementRef = useSignal<HTMLElement>();
  const dialogWithBridgeRef = useSignal<HTMLElement>();
  const dialogRef = useSignal<HTMLElement>();

  const dialogIsOpenLocalState = useSignal(open.value);
  const dialogPositionStyle = useStore<{
    currentPlacement?: Placement;
    value: CSSProperties & {
      transform?: string;
      inset?: string;
      transformOrigin?: string;
    };
    maxHeight: string;
    maxWidth: string;
  }>({ currentPlacement: undefined, value: {}, maxHeight: "", maxWidth: "" });
  const closeDialogTimeoutID = useSignal<number>();
  const dialogAnimationState = useSignal<"show" | "hide" | "initial">(
    "initial"
  );

  const positionDialog = $(async () => {
    if (
      dialogWithBridgeRef.value &&
      dialogRef.value &&
      relativeElementRef.value
    ) {
      // remove maxHeight & maxWidth to compute availableSize properly
      dialogPositionStyle.maxHeight = "";
      dialogPositionStyle.maxWidth = "";
      await nextTickRender(); // wait to have dialog rendered without maxHeight & maxWidth

      // compute placement of dialog using the dialogRef which doesn't include bridge,
      // which is unknown before knowing the next dialog placement.
      // We use dialogOffset to properly take the bridge into account when computing the available space & placement
      const availablePosition =
        props.placementStrategy === "considerKeepingCurrentPlacement"
          ? getDialogAvailablePositionConsideringKeepingCurrentPlacement({
              placementsToBeTried: orderOfPlacementsToBeTried,
              dialogElement: dialogRef.value,
              relativeElement: relativeElementRef.value,
              currentPlacement: dialogPositionStyle.currentPlacement,
              dialogOffset: 0,
              ...props.dialogMinMaxSizes,
            })
          : getAvailablePlacementFromTheOnesToBeTried(
              orderOfPlacementsToBeTried,
              dialogRef.value,
              relativeElementRef.value,
              0 // dialogOffset
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
            // Note: maxHeight will be set on .QwikUiTooltip-tooltip
            dialogPositionStyle.maxHeight = `${
              availablePosition.availableSize - dialogOffset
            }px`;
            break;
          case "left-start":
          case "left":
          case "left-end":
          case "right-start":
          case "right":
          case "right-end":
            // Note: maxWidth will be set on .QwikUiTooltip-dialog-with-bridge
            dialogPositionStyle.maxWidth = `${availablePosition.availableSize}px`;
            break;
        }
        await nextTickRender(); // wait for new width/height to be rendered,
        // to be able to compute properly, the position of dialog for
        // available placement location
      }

      dialogPositionStyle.currentPlacement = availablePosition.placement;
      await nextTickRender(); // wait for the placement class to be rendered,
      // in order to have the bridge (padding) applied

      dialogPositionStyle.value = {
        ...dialogPositionStyle.value,
        ...getDialogPositionStyle(
          availablePosition,
          dialogWithBridgeRef.value, // dialogWithBridgeRef have the bridge in place in this point
          // so we can properly compute the position, taking into account the bridge
          relativeElementRef.value
        ),
        "--scrollbar-height": `${
          window.innerHeight - document.documentElement.clientHeight
        }px`,
        visibility: "visible",
      };
    }
  });

  const openDialog = $(async () => {
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
    dialogWithBridgeRef.value?.showPopover();
    dialogIsOpenLocalState.value = true;

    await nextTickRender(); // wait for new popover to be showed before
    // computing the available placement location, in order to have its sizes available
    // * (showing it => making it to occupy space on page)

    await positionDialog();
    await positionDialog(); // call a second time to make sure that the size of dialog is computed properly
    // (the first time when we call positionDialog the browser doesn't compute the height/width of dialog properly)
    dialogAnimationState.value = "show";
  });

  const closeDialog = $(() => {
    dialogWithBridgeRef.value?.hidePopover();
    dialogIsOpenLocalState.value = false;

    dialogPositionStyle.currentPlacement = undefined;
    dialogPositionStyle.value = {};
    dialogPositionStyle.maxHeight = "";
    dialogPositionStyle.maxWidth = "";

    document.removeEventListener("scroll", positionDialog);
  });

  const scheduleDialogClose = $(async () => {
    dialogAnimationState.value = "hide";
    await new Promise<void>((resolve, reject) => {
      closeDialogTimeoutID.value = setTimeout(() => {
        closeDialog().then(resolve).catch(reject);
      }, closeTimeout);
    });
  });

  const cancelDialogClose = $(() => {
    clearTimeout(closeDialogTimeoutID.value);
    closeDialogTimeoutID.value = undefined;
    dialogAnimationState.value = "show";
  });

  const handleClickOutsideClose = $(async (event: Event) => {
    if (
      dialogWithBridgeRef.value !== event.target &&
      !dialogWithBridgeRef.value?.contains(event.target as Node) &&
      relativeElementRef.value !== event.target &&
      !relativeElementRef.value?.contains(event.target as Node)
    ) {
      onClose$?.();
    }
  });

  const handleOpenAction = $(async () => {
    onOpen$?.();
  });

  useVisibleTask$(async ({ track }) => {
    const shouldDialogOpen = track(() => open.value);

    if (shouldDialogOpen) {
      cancelDialogClose();

      await openDialog();
    } else {
      await scheduleDialogClose();
    }
  });

  useVisibleTask$(({ track, cleanup }) => {
    const isDialogOpen = track(() => dialogIsOpenLocalState.value);

    if (isDialogOpen && triggerActions.includes("click")) {
      window.addEventListener("click", handleClickOutsideClose);
    }

    cleanup(() => {
      if (triggerActions.includes("click")) {
        window.removeEventListener("click", handleClickOutsideClose);
      }
    });
  });

  useVisibleTask$(({ track, cleanup }) => {
    const isDialogOpen = track(() => dialogIsOpenLocalState.value);

    if (isDialogOpen) {
      document.addEventListener("scroll", positionDialog);
    }

    cleanup(() => {
      document.removeEventListener("scroll", positionDialog);
    });
  });

  useVisibleTask$(({ cleanup }) => {
    cleanup(() => {
      clearTimeout(closeDialogTimeoutID.value);
    });
  });

  const handleRelativeElementMouseOrFocusLeave = $(
    async (
      event:
        | QwikMouseEvent<HTMLDivElement, MouseEvent>
        | QwikFocusEvent<HTMLDivElement>
    ) => {
      if (
        dialogWithBridgeRef.value !== event.relatedTarget &&
        !dialogWithBridgeRef.value?.contains(event.relatedTarget as Node)
      ) {
        onClose$?.();
      }
    }
  );

  const handleMouseOrFocusLeaveDialog = $(
    async (
      event:
        | QwikMouseEvent<HTMLDivElement, MouseEvent>
        | QwikFocusEvent<HTMLDivElement>
    ) => {
      if (
        relativeElementRef.value !== event.relatedTarget &&
        !relativeElementRef.value?.contains(event.relatedTarget as Node)
      ) {
        onClose$?.();
      }
    }
  );

  const tooltipId = useId();

  return (
    <div>
      <div
        ref={relativeElementRef}
        class="QwikUiTooltip-relative-element"
        // @ts-ignore
        popovertarget={tooltipId}
        onMouseEnter$={
          triggerActions.includes("hover") ? handleOpenAction : undefined
        }
        onMouseLeave$={
          triggerActions.includes("hover")
            ? handleRelativeElementMouseOrFocusLeave
            : undefined
        }
        onFocus$={
          triggerActions.includes("focus") ? handleOpenAction : undefined
        }
        onBlur$={
          triggerActions.includes("focus")
            ? handleRelativeElementMouseOrFocusLeave
            : undefined
        }
        tabIndex={triggerActions.includes("focus") ? 0 : undefined}
        onClick$={
          triggerActions.includes("click") ? handleOpenAction : undefined
        }
      >
        <Slot name="relative-element" />
      </div>
      <div
        class={[
          "QwikUiTooltip-dialog-with-bridge",
          dialogPositionStyle.currentPlacement &&
            `QwikUiTooltip-placement-${dialogPositionStyle.currentPlacement}`,
          dialogAnimationState.value === "initial" && "QwikUiTooltip-initial",
          dialogAnimationState.value === "show" && "QwikUiTooltip-show",
          dialogAnimationState.value === "hide" && "QwikUiTooltip-hide",
        ]}
        ref={dialogWithBridgeRef}
        // @ts-ignore
        popover="manual"
        id={tooltipId}
        role="tooltip"
        data-dialog-placement={preferredPlacement}
        style={{
          ...dialogPositionStyle.value,
          maxWidth: dialogPositionStyle.maxWidth,
          "--dialog-offset": `${dialogOffset - arrowSize}px`,
          "--close-timeout": `${closeTimeout}ms`,
          ...(arrow
            ? {
                "--arrow-size": `${arrowSize}px`,
                ...(() => {
                  const { x, y, width, height } =
                    relativeElementRef.value?.getBoundingClientRect() ?? {};

                  return {
                    "--relative-x": `${x}px`,
                    "--relative-y": `${y}px`,
                    "--relative-width": `${width}px`,
                    "--relative-height": `${height}px`,
                  };
                })(),
                ...(() => {
                  const { x, y, width, height } =
                    dialogRef.value?.getBoundingClientRect() ?? {};

                  return {
                    "--dialog-x": `${x}px`,
                    "--dialog-y": `${y}px`,
                    "--dialog-width": `${width}px`,
                    "--dialog-height": `${height}px`,
                  };
                })(),
              }
            : {}),
        }}
        onMouseEnter$={
          triggerActions.includes("hover")
            ? $(async () => {
                onOpen$?.(); // emit open to parent to make sure it will have open state also
                await cancelDialogClose();
              })
            : undefined
        }
        onMouseLeave$={
          triggerActions.includes("hover")
            ? handleMouseOrFocusLeaveDialog
            : undefined
        }
      >
        <div
          class="QwikUiTooltip-inner-dialog-with-bridge"
          ref={dialogRef}
          tabIndex={triggerActions.includes("focus") ? 0 : undefined}
          onFocusout$={
            triggerActions.includes("focus")
              ? handleMouseOrFocusLeaveDialog
              : undefined
          }
        >
          <div class="QwikUiTooltip-animated-inner-dialog-with-bridge">
            <div
              class="QwikUiTooltip-tooltip"
              style={{
                maxHeight: dialogPositionStyle.maxHeight,
              }}
            >
              <Slot name="message" />
            </div>
            {arrow && <TooltipArrow arrowSize={arrowSize} />}
          </div>
        </div>
      </div>
    </div>
  );
});
