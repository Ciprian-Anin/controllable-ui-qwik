import { component$, useSignal, useStyles$ } from "@builder.io/qwik";

import { Logo } from "./components/logo/logo";
import { TooltipDemo } from "./demo/TooltipDemo/TooltipDemo";
import { TooltipWithCloseActionDemo } from "./demo/TooltipWithCloseActionDemo";
import RootStyle from "./Root.scss?inline";
import { TableWithTooltipsDemo } from "./TableWithTooltipsDemo";

const placements = [
  "top-start",
  "top",
  "top-end",
  "left-start",
  "left",
  "left-end",
  "bottom-start",
  "bottom",
  "bottom-end",
  "right-start",
  "right",
  "right-end",
] as const;

const loremIpsumLongText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent volutpat justo id libero mollis, at pharetra ligula eleifend. Integer gravida euismod massa, vel volutpat sapien tincidunt id. Phasellus nec lectus suscipit, lacinia lacus ac, vehicula orci. Suspendisse potenti. Mauris sit amet tincidunt libero. Nulla facilisi. Proin eget erat nec metus tempor aliquam non non lectus. Curabitur suscipit, ligula at pretium sollicitudin, lorem orci dictum odio, ut feugiat lacus justo sit amet est.

Aenean laoreet accumsan nulla, nec vehicula orci venenatis nec. Donec sollicitudin arcu nec urna tincidunt, id convallis eros tempus. In pharetra ipsum et sollicitudin aliquam. Pellentesque a nisi nunc. Nulla facilisi. Vivamus sed lorem a lorem scelerisque fermentum. Sed lacinia orci quis libero gravida, at pretium sem sollicitudin. Ut id magna vitae est dignissim sodales. Etiam et malesuada mi, sed tempor lacus.`;

export default component$(() => {
  useStyles$(RootStyle);
  const scrollableContainerRef = useSignal<HTMLElement>();

  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Blank App</title>
      </head>
      <body
        style="display: flex; flex-direction: column; align-items: center"
        class="QwikTooltipDemo-rootContainer"
      >
        <Logo />

        <h1>Basic Tooltip Demo</h1>
        <TooltipDemo preferredPlacement="bottom" placementStrategy="default">
          <button q:slot="relative-element">🎉</button>
          <div q:slot="message">Tada</div>
        </TooltipDemo>

        <h1>Qwik Tooltip With Close Action Demo </h1>
        <TooltipWithCloseActionDemo
          placementStrategy="default"
          preferredPlacement="bottom"
          tooltipRootClass="QwikTooltipDemo-html-example"
        />

        <h1>Qwik Tooltip Demo 0</h1>
        <TooltipDemo
          placementStrategy="default"
          preferredPlacement="bottom"
          tooltipRootClass="QwikTooltipDemo-html-example"
        >
          <button q:slot="relative-element">HTML</button>
          <span q:slot="message">
            <p style={{ fontSize: 16, fontWeight: "bold" }}>
              Tooltip with HTML
            </p>
            <p>
              <em>And here's</em> <b>some</b> <u>amazing content</u>. It's very
              engaging. Right?
            </p>
          </span>
        </TooltipDemo>
        <h1>Qwik Tooltip Demo 1</h1>

        <div class="Root-demo-tooltip">
          <div class="top-section">
            <TooltipDemo
              preferredPlacement="top-start"
              placementStrategy="default"
            >
              <button q:slot="relative-element" tabIndex={-1}>
                top-start
              </button>
              <div q:slot="message">Top start {loremIpsumLongText}</div>
            </TooltipDemo>
            <TooltipDemo preferredPlacement="top" placementStrategy="default">
              <button q:slot="relative-element">top</button>
              <div q:slot="message">Top</div>
            </TooltipDemo>
            <TooltipDemo
              preferredPlacement="top-end"
              placementStrategy="default"
            >
              <button q:slot="relative-element">top-end</button>
              <div q:slot="message">Top end</div>
            </TooltipDemo>
          </div>

          <div class="left-section">
            <TooltipDemo
              preferredPlacement="left-start"
              placementStrategy="default"
            >
              <button q:slot="relative-element">left-start</button>
              <div q:slot="message">Left start {loremIpsumLongText}</div>
            </TooltipDemo>
            <TooltipDemo preferredPlacement="left" placementStrategy="default">
              <button q:slot="relative-element">left</button>
              <div q:slot="message">Left {loremIpsumLongText}</div>
            </TooltipDemo>
            <TooltipDemo
              preferredPlacement="left-end"
              placementStrategy="default"
            >
              <button q:slot="relative-element">left-end</button>
              <div q:slot="message">Left end {loremIpsumLongText}</div>
            </TooltipDemo>
          </div>

          <div class="right-section">
            <TooltipDemo
              preferredPlacement="right-start"
              placementStrategy="default"
            >
              <button q:slot="relative-element">right-start</button>
              <div q:slot="message">Right start {loremIpsumLongText}</div>
            </TooltipDemo>
            <TooltipDemo preferredPlacement="right" placementStrategy="default">
              <button q:slot="relative-element">right</button>
              <div q:slot="message">Right</div>
            </TooltipDemo>
            <TooltipDemo
              preferredPlacement="right-end"
              placementStrategy="default"
            >
              <button q:slot="relative-element">right-end</button>
              <div q:slot="message">Right end {loremIpsumLongText}</div>
            </TooltipDemo>
          </div>

          <div class="bottom-section">
            <TooltipDemo
              placementStrategy="default"
              preferredPlacement="bottom-start"
              dialogOffset={60}
            >
              <button q:slot="relative-element">bottom-start</button>
              <div q:slot="message">Bottom start</div>
            </TooltipDemo>
            <TooltipDemo
              placementStrategy="considerKeepingCurrentPlacement"
              preferredPlacement="bottom"
              dialogMinMaxSizes={{
                dialogMinHeight: 50,
                // dialogMaxHeight: 100,
              }}
              dialogOffset={20}
            >
              <button q:slot="relative-element">bottom</button>
              <div q:slot="message">Bottom {loremIpsumLongText}</div>
            </TooltipDemo>
            <TooltipDemo
              preferredPlacement="bottom-end"
              placementStrategy="default"
            >
              <button q:slot="relative-element">bottom-end</button>
              <div q:slot="message">Bottom end</div>
            </TooltipDemo>
          </div>
        </div>

        <h1>Qwik Tooltip Demo 2</h1>
        <div style={{ position: "relative", height: "100vh", width: "100%" }}>
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <TooltipDemo placementStrategy="default" preferredPlacement="top">
              <button q:slot="relative-element">Top</button>
              <span q:slot="message">Top Tooltip</span>
            </TooltipDemo>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <TooltipDemo
              placementStrategy="default"
              preferredPlacement="bottom"
            >
              <button q:slot="relative-element">Bottom</button>
              <span q:slot="message">Bottom Tooltip</span>
            </TooltipDemo>
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "10px",
              transform: "translateY(-50%)",
            }}
          >
            <TooltipDemo placementStrategy="default" preferredPlacement="left">
              <button q:slot="relative-element">Left</button>
              <span q:slot="message">Left Tooltip</span>
            </TooltipDemo>
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
            }}
          >
            <TooltipDemo placementStrategy="default" preferredPlacement="right">
              <button q:slot="relative-element">Right</button>
              <span q:slot="message">Right Tooltip</span>
            </TooltipDemo>
          </div>
          <div style={{ position: "absolute", top: "10px", left: "10px" }}>
            <TooltipDemo
              placementStrategy="default"
              preferredPlacement="top-start"
            >
              <button q:slot="relative-element">Top Left</button>
              <span q:slot="message">Top Left Tooltip</span>
            </TooltipDemo>
          </div>
          <div style={{ position: "absolute", top: "10px", right: "10px" }}>
            <TooltipDemo
              placementStrategy="default"
              preferredPlacement="top-end"
            >
              <button q:slot="relative-element">Top Right</button>
              <span q:slot="message">Top Right Tooltip</span>
            </TooltipDemo>
          </div>
          <div style={{ position: "absolute", bottom: "10px", left: "10px" }}>
            <TooltipDemo
              placementStrategy="default"
              preferredPlacement="bottom-start"
            >
              <button q:slot="relative-element">Bottom Left</button>
              <span q:slot="message">Bottom Left Tooltip</span>
            </TooltipDemo>
          </div>
          <div style={{ position: "absolute", bottom: "10px", right: "10px" }}>
            <TooltipDemo
              placementStrategy="default"
              preferredPlacement="bottom-end"
            >
              <button q:slot="relative-element">Bottom Right</button>
              <span q:slot="message">Bottom Right Tooltip</span>
            </TooltipDemo>
          </div>
        </div>

        <h1>Qwik Tooltip Demo 3</h1>
        <div
          class="QwikTooltipDemo-grid"
          style={{ overflow: "auto", width: "100%", height: "100vh" }}
          ref={scrollableContainerRef}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${placements.length + 1}, auto)`,
              gridAutoRows: "auto",
              gap: "90px",
              padding: "10px",
            }}
          >
            {Array.from(
              { length: placements.length * (placements.length + 1) },
              (_, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <TooltipDemo
                    placementStrategy="default"
                    preferredPlacement={placements[i % placements.length]}
                    scrollableContainer={scrollableContainerRef.value}
                    enterDelay={100}
                  >
                    <button
                      q:slot="relative-element"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      Cell {i + 1}
                      <span>{placements[i % placements.length]}</span>
                    </button>
                    <span q:slot="message">
                      {i + 1} Lorem ipsum dolor sit amet, consectetur adipiscing
                      elit. Integer nec odio. Praesent libero. Sed cursus ante
                      dapibus diam. Sed nisi.
                    </span>
                  </TooltipDemo>
                </div>
              )
            )}
          </div>
        </div>

        <h1>Qwik Tooltip Table Demo</h1>
        <TableWithTooltipsDemo />
      </body>
    </>
  );
});
