import {
  $,
  component$,
  CSSProperties,
  QRL,
  Signal,
  Slot,
  useId,
  useSignal,
  useStore,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";

import { TooltipArrow } from "./components/TooltipArrow";
import TooltipStyle from "./Tooltip.scss?inline";
import { Placement } from "./types";
import {
  getAvailablePlacementFromTheOnesToBeTried,
  getDialogAvailablePositionConsideringKeepingCurrentPlacement,
} from "./utils/availablePosition.utils";
import { getDialogPositionStyle } from "./utils/positionStyle.utils";
import {
  getElementVisibleBoundingClientRectInsideScrollableContainer,
  getScrollableContainer,
  nextTickRender,
} from "./utils/utils";

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
  /**
   * Distance between relative element and tooltip dialog
   */
  dialogOffset?: number;
  /**
   * Open delay in ms
   */
  enterDelay?: number;
  /**
   * Close delay in ms
   */
  leaveDelay?: number;
  arrow?: boolean;
  /**
   * Scrollable container is the one used to track scroll event
   * and position dialog while scrolling inside it.
   */
  scrollableContainer?: HTMLElement;
  tooltipClass?: string;
  tooltipRootClass?: string;
};

export type KeepCurrentPlacementStrategyProps = BaseProps & {
  /**
   * Keep current placement of dialog as time as it remains in
   * min & max sizes boundaries.
   */
  placementStrategy: "considerKeepingCurrentPlacement";
  /**
   * `dialogMinMaxSizes`:
   *   > In case we need to keep current position, we will use maximum & minimum sizes
   *   > of dialog to check if it fits in current placement, without going over its minimum sizes.
   *   > In case we don't have minimum size available for current placement,
   *   > than will be tried next place from `orderOfPlacementsToBeTried`.
   *
   *   > Maximum size is used to make sure to not have a bigger maximum size on dialog popover.
   *   > (we make sure to override the maximum size in case the available space is smaller than the dialog size)
   */
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
export const Tooltip = component$((props: Props) => {
  const {
    open,
    onOpen$,
    onClose$,
    preferredPlacement = "bottom-start",
    orderOfPlacementsToBeTried = defaultOrderOfPlacementsToBeTried[
      preferredPlacement
    ],
    dialogOffset = 5,
    enterDelay = 100,
    leaveDelay = 150,
    triggerActions = ["hover", "focus"],
    // triggerActions = ["click"],
    arrow = false,
    scrollableContainer,
    tooltipRootClass,
    tooltipClass,
  } = props;
  const arrowSize = arrow ? 12 : 0;
  const tooltipId = useId();

  useStyles$(TooltipStyle);

  const relativeElementRef = useSignal<HTMLElement>();
  const dialogWithBridgeRef = useSignal<HTMLElement>();
  const dialogRef = useSignal<HTMLElement>();

  const dialogIsOpenLocalState = useSignal(open.value);
  const dialogPositionStyle = useStore<{
    currentPlacement?: Placement;
    value: CSSProperties;
    maxHeight: string;
    maxWidth: string;
  }>({ currentPlacement: undefined, value: {}, maxHeight: "", maxWidth: "" });
  const closeDialogTimeoutID = useSignal<number | undefined>();
  const openDialogTimeoutID = useSignal<number | undefined>();
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
          relativeElementRef.value,
          scrollableContainer
        ),
        "--scrollbar-height": `${
          window.innerHeight - document.documentElement.clientHeight
        }px`,
        // visibility: "visible",
      };

      await nextTickRender(); // wait for the dialog to be rendered on the computed placement

      dialogPositionStyle.value = {
        ...dialogPositionStyle.value,
        ...(arrow
          ? {
              ...(() => {
                const { x, y, width, height } =
                  getElementVisibleBoundingClientRectInsideScrollableContainer(
                    relativeElementRef.value,
                    getScrollableContainer(scrollableContainer)
                  );

                return {
                  "--relative-x": `${x}px`,
                  "--relative-y": `${y}px`,
                  "--relative-width": `${width}px`,
                  "--relative-height": `${height}px`,
                };
              })(),
              ...(() => {
                const { x, y, width, height } =
                  dialogRef.value.getBoundingClientRect() ?? {};

                return {
                  "--dialog-x": `${x}px`,
                  "--dialog-y": `${y}px`,
                  "--dialog-width": `${width}px`,
                  "--dialog-height": `${height}px`,
                };
              })(),
            }
          : {}),
      };
    }
  });

  const scheduleDialogOpen = $(async () => {
    // ! check again to make sure we open dialog just if external
    // ! state specify now that the dialog should be opened
    // This check is needed because due to asynchronously downloading
    // the function, it might be downloaded later than scheduleDialogClose
    // an in that case close would take place before scheduleDialogOpen,
    // and this will end up, having dialog open, even if external state
    // specify that it should be closed
    if (open.value) {
      dialogPositionStyle.value = {
        ...dialogPositionStyle.value,
        visibility: "hidden",
      };

      await new Promise<void>((resolve, reject) => {
        openDialogTimeoutID.value = setTimeout(async () => {
          // ! check again to make sure we open dialog just if external
          // ! state specify now that the dialog should be opened
          if (open.value) {
            try {
              await nextTickRender(); // wait for dialog to have `visibility: hidden` set
              // before showing it
              // This is important in order to avoid the display of it on a position
              // inappropriate with requested/available placement
              // * (at this moment we don't have the dialog sizes,
              // * and it is not positioned on requested/available placement)

              const positionDialogAndMakeItVisible = new ResizeObserver(
                async () => {
                  try {
                    await positionDialog();
                    await positionDialog(); // call a second time to make sure that the size of dialog is computed properly
                    // (the first time when we call positionDialog the browser doesn't compute the height/width of dialog properly)
                    dialogPositionStyle.value = {
                      ...dialogPositionStyle.value,
                      visibility: "visible",
                    };
                    dialogAnimationState.value = "show";
                    resolve();
                    positionDialogAndMakeItVisible.disconnect();
                  } catch {
                    reject();
                  }
                }
              );

              if (dialogRef.value) {
                positionDialogAndMakeItVisible.observe(dialogRef.value);
                dialogWithBridgeRef.value?.showPopover();
                dialogIsOpenLocalState.value = true;
              }
            } catch {
              reject();
            }
          }
        }, enterDelay);
      });
    }
  });

  const closeDialog = $(() => {
    // ! check again to make sure we close dialog just if external
    // ! state specify now that the dialog should be closed
    if (!open.value) {
      dialogWithBridgeRef.value?.hidePopover();
      dialogIsOpenLocalState.value = false;

      dialogPositionStyle.currentPlacement = undefined;
      dialogPositionStyle.value = {};
      dialogPositionStyle.maxHeight = "";
      dialogPositionStyle.maxWidth = "";

      const scrollableContainerElement = scrollableContainer ?? document;
      scrollableContainerElement.removeEventListener("scroll", positionDialog);
    }
  });

  const scheduleDialogClose = $(async () => {
    // check again to make sure we close dialog just if external
    // state specify now that the dialog should be closed
    if (!open.value) {
      dialogAnimationState.value = "hide";

      await new Promise<void>((resolve, reject) => {
        closeDialogTimeoutID.value = setTimeout(() => {
          closeDialog().then(resolve).catch(reject);
        }, leaveDelay);
      });
    }
  });

  const cancelDialogOpen = $(() => {
    if (openDialogTimeoutID.value !== undefined) {
      clearTimeout(openDialogTimeoutID.value);
      openDialogTimeoutID.value = undefined;
      dialogAnimationState.value = "hide";
    }
  });

  const cancelDialogClose = $(() => {
    if (closeDialogTimeoutID.value !== undefined) {
      clearTimeout(closeDialogTimeoutID.value);
      closeDialogTimeoutID.value = undefined;
      dialogAnimationState.value = "show";
    }
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

  const handleOpenAction = $(() => {
    onOpen$?.();
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track, cleanup }) => {
    const shouldDialogOpen = track(() => open.value);

    if (shouldDialogOpen) {
      await cancelDialogClose();
      await scheduleDialogOpen();

      cleanup(async () => {
        await cancelDialogOpen();
      });
    } else {
      await cancelDialogOpen();
      if (dialogIsOpenLocalState.value) {
        await scheduleDialogClose();

        cleanup(async () => {
          await cancelDialogClose();
        });
      }
    }
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track, cleanup }) => {
    const isDialogOpen = track(() => dialogIsOpenLocalState.value);

    if (isDialogOpen && triggerActions.includes("click")) {
      window.addEventListener("click", handleClickOutsideClose);

      cleanup(() => {
        if (triggerActions.includes("click")) {
          window.removeEventListener("click", handleClickOutsideClose);
        }
      });
    }
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track, cleanup }) => {
    const isDialogOpen = track(() => dialogIsOpenLocalState.value);

    if (isDialogOpen) {
      const scrollableContainerElement = scrollableContainer ?? document;
      scrollableContainerElement.addEventListener("scroll", positionDialog);

      cleanup(() => {
        scrollableContainerElement.removeEventListener(
          "scroll",
          positionDialog
        );
      });
    }
  });

  const handleRelativeElementMouseOrFocusLeave = $((event: MouseEvent) => {
    if (
      dialogWithBridgeRef.value !== event.relatedTarget &&
      !dialogWithBridgeRef.value?.contains(event.relatedTarget as Node)
    ) {
      onClose$?.();
    }
  });

  const handleMouseOrFocusLeaveDialog = $(
    async (event: MouseEvent | FocusEvent) => {
      if (
        relativeElementRef.value !== event.relatedTarget &&
        !relativeElementRef.value?.contains(event.relatedTarget as Node)
      ) {
        onClose$?.();
      }
    }
  );

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
          tooltipRootClass,
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
          "--dialog-offset": `${dialogOffset}px`,
          "--close-timeout": `${leaveDelay}ms`,
          "--arrow-size": `${arrowSize}px`,
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
              class={["QwikUiTooltip-tooltip", tooltipClass]}
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
