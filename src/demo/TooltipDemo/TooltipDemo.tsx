import { $, component$, Slot, useSignal } from "@builder.io/qwik";

import { Tooltip } from "../../components/Tooltip";
import {
  DefaultStrategyProps,
  KeepCurrentPlacementStrategyProps,
} from "../../components/Tooltip/Tooltip";

export const TooltipDemo = component$(
  (
    props:
      | Omit<DefaultStrategyProps, "open" | "onOpen$" | "onClose$">
      | Omit<KeepCurrentPlacementStrategyProps, "open" | "onOpen$" | "onClose$">
  ) => {
    const dialogIsOpen = useSignal(false);

    const handleOpen$ = $(() => {
      dialogIsOpen.value = true;
    });

    const handleClose$ = $(() => {
      dialogIsOpen.value = false;
    });

    return (
      <Tooltip
        {...props}
        open={dialogIsOpen}
        onOpen$={handleOpen$}
        onClose$={handleClose$}
      >
        <span q:slot="relative-element">
          <Slot name="relative-element" />
        </span>
        <span q:slot="message">
          <Slot name="message" />
        </span>
      </Tooltip>
    );
  }
);

export default TooltipDemo;
