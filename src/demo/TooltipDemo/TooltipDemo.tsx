import {
  $,
  component$,
  Slot,
  useSignal,
} from '@builder.io/qwik';

import { Tooltip } from '../../components/Tooltip';
import {
  DefaultStrategyProps,
  KeepCurrentPlacementStrategyProps,
  useTooltipRelativeElement,
} from '../../components/Tooltip/Tooltip';

export const TooltipDemo = component$(
  (
    props:
      | Omit<DefaultStrategyProps, "open" | "onOpen$" | "onClose$">
      | Omit<KeepCurrentPlacementStrategyProps, "open" | "onOpen$" | "onClose$">
  ) => {
    const dialogIsOpen = useSignal(false);
    const triggerActions = props.triggerActions || ["hover", "focus"];

    const handleOpen$ = $(() => {
      dialogIsOpen.value = true;
    });

    const handleClose$ = $(() => {
      dialogIsOpen.value = false;
    });

    const {
      tooltipId,
      relativeElementProps,
      dialogProps: { dialogWithBridgeRef },
    } = useTooltipRelativeElement({
      triggerActions,
      onOpen$: handleOpen$,
      onClose$: handleClose$,
    });

    return (
      <>
        <span
          {...relativeElementProps}
          // @ts-ignore
          popovertarget={tooltipId}
        >
          <Slot name="relative-element" />
        </span>
        <Tooltip
          {...props}
          id={tooltipId}
          relativeElementRef={relativeElementProps.ref}
          dialogWithBridgeRef={dialogWithBridgeRef}
          triggerActions={triggerActions}
          open={dialogIsOpen}
          onOpen$={handleOpen$}
          onClose$={handleClose$}
        >
          <span q:slot="message">
            <Slot name="message" />
          </span>
        </Tooltip>
      </>
    );
  }
);

export default TooltipDemo;
