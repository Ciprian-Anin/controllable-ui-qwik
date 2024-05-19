import { $, component$, Slot, useSignal } from "@builder.io/qwik";

import { CustomTooltip } from "../../components/CustomTooltip";
import {
  DefaultStrategyProps,
  KeepCurrentPlacementStrategyProps,
} from "../../components/CustomTooltip/CustomTooltip";

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
      <CustomTooltip
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
      </CustomTooltip>
    );
  }
);

export default TooltipDemo;
