# Controllable UI - Qwik Library ⚡️

# Tooltip

**Customizable tooltip** component with **advanced placement strategies** for positioning. It ensures the tooltip is **positioned optimally within available screen space**, **automatically adjusting** based on user-defined preferences and space constraints.

## Features

- **HTML content support**: Supports HTML content, allowing for richer and more flexible tooltip messages.
- **Customizable style & animations**: Supports customizable styles and animations by exposing CSS classes for different parts of the tooltip.
- **Dynamic Placement**: Automatically adjusts the tooltip placement based on available space.
- **Customizable Fallback Placements**: Define the order of fallback placements to try if the preferred placement lacks space.
- **Multiple Trigger Actions**: Open tooltips using hover, focus, or click events.
- **Arrow pointer**: Offers an optional arrow that automatically adjusts its position to point to the target element.
- **Timeout Configuration**: Configure open and close timeouts for tooltip behavior.
- **Flexible Positioning Strategies**: Choose between two strategies:
  - immediately reposition the tooltip when space is limited
  - keep the current placement as long as it fits within the min/max tooltip sizes.

## Installation

Include the `Tooltip` component in your project by importing it.

```ts
import { Tooltip } from "./Tooltip";
```

Ensure you have the necessary dependencies and the environment set up for compiling and running the component.

## Usage

### Create the Basic Tooltip with desired behavior

```ts
import { $, component$, Slot, useSignal } from "@builder.io/qwik";

import { Tooltip } from "../../components/Tooltip";
import {
  DefaultStrategyProps,
  KeepCurrentPlacementStrategyProps,
} from "../../components/Tooltip/Tooltip";

export const MyAmazingTooltip = component$(
  (
    props: Omit<DefaultStrategyProps, "open" | "onOpen$" | "onClose$">
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
        placementStrategy="default"
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
```

### How to use the created `MyAmazingTooltip` 🎉

```ts
<MyAmazingTooltip preferredPlacement="bottom">
  <button q:slot="relative-element">🎉</button>
  <div q:slot="message">Tada</div>
</MyAmazingTooltip>
```

### Props

#### `BaseProps`

| Prop                         | Type                            | Description                                                                                                                                                                            |
| ---------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `open`                       | `Signal<boolean>`               | Signal that controls whether the tooltip is open or closed.                                                                                                                            |
| `onOpen$`                    | `QRL<() => void>`               | Optional callback when the tooltip opens.                                                                                                                                              |
| `onClose$`                   | `QRL<() => void>`               | Optional callback when the tooltip closes.                                                                                                                                             |
| `preferredPlacement`         | `Placement`                     | The preferred placement of the tooltip (`bottom-end`, `bottom-start`, `bottom`, `left-end`, `left-start`, `left`, `right-end`, `right-start`, `right`, `top-end`, `top-start`, `top`). |
| `orderOfPlacementsToBeTried` | `[Placement, ...Placement[]]`   | The list of placements to try if the preferred one lacks space.                                                                                                                        |
| `triggerActions`             | `("hover", "focus", "click")[]` | Defines how the tooltip should be triggered (hover, focus, or click).                                                                                                                  |
| `dialogOffset`               | `number`                        | Distance between the tooltip and the triggering element.                                                                                                                               |
| `enterDelay`                 | `number`                        | The number of milliseconds to wait before showing the tooltip.                                                                                                                         |
| `leaveDelay`                 | `number`                        | The number of milliseconds to wait before hiding the tooltip.                                                                                                                          |
| `arrow`                      | `boolean`                       | If `true`, renders an arrow on the tooltip.                                                                                                                                            |
| `scrollableContainer`        | `HTMLElement`                   | Scrollable container is the one used to track scroll event and position dialog while scrolling inside it.                                                                              |
| `tooltipClass`               | `string`                        | Additional class for tooltip dialog.                                                                                                                                                   |
| `tooltipRootClass`           | `string`                        | Additional class for tooltip root element (element containing the dialog plus the space between it and relative element).                                                              |

#### `DefaultStrategyProps`

In this strategy, the tooltip is repositioned immediately if the current placement no longer has enough space.

```ts
placementStrategy: "default";
```

#### `KeepCurrentPlacementStrategyProps`

Keep current placement of dialog as time as it remains in min & max sizes boundaries.

```ts
/* Strategy to keep the current placement as long as space allows. */
placementStrategy: "considerKeepingCurrentPlacement";
/* Dialog size constraints. */
dialogMinMaxSizes?: {
  dialogMaxHeight?: number;
  dialogMinHeight?: number;
  dialogMaxWidth?: number;
  dialogMinWidth?: number;
};
```

`dialogMinMaxSizes`:

In case we need to keep current position, we will use maximum & minimum sizes
of dialog to check if it fits in current placement, without going over its minimum sizes.
In case we don't have minimum size available for current placement,
than will be tried next place from `orderOfPlacementsToBeTried`.

Maximum size is used to make sure to not have a bigger maximum size on dialog popover.

> 📝Note: we make sure to override the maximum size in case the available space is smaller than the dialog size).

## Placement Strategies

You can choose between two different strategies for tooltip placement:

1. **Default Strategy** (`placementStrategy: "default"`)

   - The dialog placement will be recalculated immediately if there is insufficient space in the current position.

2. **Consider Keeping Current Placement Strategy** (`placementStrategy: "considerKeepingCurrentPlacement"`)
   - Attempts to keep the tooltip in its current position as long as it fits within the provided minimum and maximum size constraints. If space becomes too tight, it switches to the next placement in the list.

## Order of Placements

The `defaultOrderOfPlacementsToBeTried` object provides fallback placement orders for various initial placements. For example:

```ts
export const defaultOrderOfPlacementsToBeTried = {
  "top-start": ["top-start", "bottom-start", "left", "right"],
  top: ["top", "bottom", "left", "right"],
  // Additional placement configurations
};
```

This means if the preferred placement is `top-start`, the system will try `bottom-start`, `left`, and `right` if there isn’t enough space.

### CSS Classes

These class names are useful for styling with CSS. They are applied to the component's slots when specific states are triggered.

#### Class Names

| **Class Name**                                     | **Description**                                                                                  |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `.QwikUiTooltip-arrow`                             | Styles applied to the arrow element of the tooltip.                                              |
| `.QwikUiTooltip-dialog-with-bridge`                | Styles applied to the tooltip dialog container.                                                  |
| `.QwikUiTooltip-inner-dialog-with-bridge`          | Styles applied to the inner container of the tooltip dialog.                                     |
| `.QwikUiTooltip-animated-inner-dialog-with-bridge` | Styles applied to the animated container of the tooltip dialog.                                  |
| `.QwikUiTooltip-tooltip`                           | Styles applied to the tooltip's content box.                                                     |
| `.QwikUiTooltip-placement-top-start`               | Styles applied to the tooltip's content box when the placement is "top-start".                   |
| `.QwikUiTooltip-placement-top`                     | Styles applied to the tooltip's content box when the placement is "top".                         |
| `.QwikUiTooltip-placement-top-end`                 | Styles applied to the tooltip's content box when the placement is "top-end".                     |
| `.QwikUiTooltip-placement-bottom-start`            | Styles applied to the tooltip's content box when the placement is "bottom-start".                |
| `.QwikUiTooltip-placement-bottom`                  | Styles applied to the tooltip's content box when the placement is "bottom".                      |
| `.QwikUiTooltip-placement-bottom-end`              | Styles applied to the tooltip's content box when the placement is "bottom-end".                  |
| `.QwikUiTooltip-placement-left-start`              | Styles applied to the tooltip's content box when the placement is "left-start".                  |
| `.QwikUiTooltip-placement-left`                    | Styles applied to the tooltip's content box when the placement is "left".                        |
| `.QwikUiTooltip-placement-left-end`                | Styles applied to the tooltip's content box when the placement is "left-end".                    |
| `.QwikUiTooltip-placement-right-start`             | Styles applied to the tooltip's content box when the placement is "right-start".                 |
| `.QwikUiTooltip-placement-right`                   | Styles applied to the tooltip's content box when the placement is "right".                       |
| `.QwikUiTooltip-placement-right-end`               | Styles applied to the tooltip's content box when the placement is "right-end".                   |
| `.QwikUiTooltip-show`                              | Styles applied to the tooltip when it is visible, triggering the `QwikUITooltip-show` animation. |
| `.QwikUiTooltip-hide`                              | Styles applied to the tooltip when it is hidden, triggering the `QwikUITooltip-hide` animation.  |
| `.QwikUiTooltip-relative-element`                  | Styles applied to the relative element that the tooltip is anchored to.                          |

### Animation Classes

- **`.QwikUiTooltip-show`**

  - **Animation**: Applies the `QwikUITooltip-show` keyframes.
  - **Description**: Fades in and scales up the tooltip.

- **`.QwikUiTooltip-hide`**
  - **Animation**: Applies the `QwikUITooltip-hide` keyframes.
  - **Description**: Fades out and scales down the tooltip.

### Keyframes

- **`@keyframes QwikUITooltip-show`**

  - **0%**: Opacity 0, transform scale(0.8)
  - **100%**: Opacity 1, transform scale(1)

- **`@keyframes QwikUITooltip-hide`**
  - **0%**: Opacity 1, transform scale(1)
  - **100%**: Opacity 0, transform scale(0.8)

### Customization

You can override the style of the component using one of these customization options:

- **With a global class name**: Apply custom styles globally to override the default styles.

  ```css
  .my-amazing-tooltip {
    .QwikUiTooltip-tooltip {
      background-color: #333;
      color: #fff;
      font-size: 14px;
    }

    .QwikUiTooltip-arrow {
      color: #333;
    }
  }
  ```

## License

This project is licensed under the MIT License.
