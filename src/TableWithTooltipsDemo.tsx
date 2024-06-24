import { component$, useSignal } from "@builder.io/qwik";

import { TooltipDemo } from "./demo/TooltipDemo/TooltipDemo";

export const TableWithTooltipsDemo = component$(() => {
  const scrollableContainerRef = useSignal<HTMLElement>();

  return (
    <div
      style={{ overflow: "auto", width: "100%", height: "80vh" }}
      ref={scrollableContainerRef}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {Array.from({ length: 30 }, (_, row) => (
            <tr key={row}>
              {Array.from({ length: 30 }, (_, col) => (
                <td
                  key={col}
                  style={{
                    border: "1px solid #ccc",
                    position: "relative",
                  }}
                >
                  <TooltipDemo
                    placementStrategy="default"
                    preferredPlacement="top"
                    openTimeout={200}
                    scrollableContainer={scrollableContainerRef.value}
                  >
                    <div
                      q:slot="relative-element"
                      style={{ width: 100, height: 100, padding: "10px" }}
                    >
                      Cell {row * 10 + col + 1}
                    </div>
                    <span q:slot="message">
                      <p color="inherit">Tooltip with HTML</p>
                      <em>{"And here's"}</em> <b>{"some"}</b>{" "}
                      <u>{"amazing content"}</u>. {"It's very engaging. Right?"}
                    </span>
                  </TooltipDemo>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
