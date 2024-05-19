import { component$, useStyles$ } from "@builder.io/qwik";

import { Counter } from "./components/counter/counter";
import { Logo } from "./components/logo/logo";
import { TooltipDemo } from "./demo/TooltipDemo/TooltipDemo";
import RootStyle from "./Root.scss?inline";

export default component$(() => {
  useStyles$(RootStyle);

  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Blank App</title>
      </head>
      <body style="display: flex; flex-direction: column; align-items: start">
        <Logo />
        <Counter />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------ ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------ ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------ ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------ ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------ ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <div class="Root-demo-tooltip">
          <div class="top-section">
            <TooltipDemo
              preferredPlacement="top-start"
              placementStrategy="default"
            >
              <button q:slot="relative-element" tabIndex={-1}>
                top-start
              </button>
              <div q:slot="message">
                Top start - --- a very long long message --- a very long long
                message ---a very long long message ---a very long long message
                ---a very long long message ---a very long long message ---a
                very long long message ---a very long long message ---a very
                long long message ---a very long long message ---a very long
                long message ---a very long long message ---a very long long
                message ---a very long long message ---a very long long message
                ---a very long long message ---a very long long message ---a
                very long long message ---a very long long message ---a very
                long long message
              </div>
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
              <div q:slot="message">
                Left start -- a very long long message --- a very long long
              </div>
            </TooltipDemo>
            <TooltipDemo preferredPlacement="left" placementStrategy="default">
              <button q:slot="relative-element">left</button>
              <div q:slot="message">
                Left --- a very long long message --- a very long long message
                ---a very long long message ---a very long long message ---a
                very long long message ---a very long long message ---a very
                long long message ---a very long long message ---a very long
                long message ---a very long long message ---a very long long
                message ---a very long long message ---a very long long message
                ---a very long long message ---a very long long message ---a
                very long long message ---a very long long message ---a very
                long long message ---a very long long message ---a very long
                long message
              </div>
            </TooltipDemo>
            <TooltipDemo
              preferredPlacement="left-end"
              placementStrategy="default"
            >
              <button q:slot="relative-element">left-end</button>
              <div q:slot="message">
                Left end --- a very long long message --- a very long long
                message ---a very long long message ---a very long long message
                ---a very long long message ---a very long long message ---a
                very long long message ---a very long long message ---a very
                long long message ---a very long long message ---a very long
                long message ---a very long long message ---a very long long
                message ---a very long long message ---a very long long message
                ---a very long long message ---a very long long message ---a
                very long long message ---a very long long message ---a very
                long long message
              </div>
            </TooltipDemo>
          </div>

          <div class="right-section">
            <TooltipDemo
              preferredPlacement="right-start"
              placementStrategy="default"
            >
              <button q:slot="relative-element">right-start</button>
              <div q:slot="message">
                Right start - --- a very long long message --- a very long long
                message ---a very long long message ---a very long long message
                ---a very long long message ---a very long long message ---a
                very long long message ---a very long long message ---a very
                long long message ---a very long long message ---a very long
                long message ---a very long long message ---a very long long
                message ---a very long long message ---a very long long message
                ---a very long long message ---a very long long message ---a
                very long long message ---a very long long message ---a very
                long long message
              </div>
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
              <div q:slot="message">
                Right end --- a very long long message --- a very long long
                message ---a very long long message ---a very long long message
                ---a very long long message ---a very long long message ---a
                very long long message ---a very long long message ---a very
                long long message ---a very long long message ---a very long
                long message ---a very long long message ---a very long long
                message ---a very long long message ---a very long long message
                ---a very long long message ---a very long long message ---a
                very long long message ---a very long long message ---a very
                long long message
              </div>
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
              <div q:slot="message">
                Bottom --- a very long long message --- a very long long message
                ---a very long long message ---a very long long message ---a
                very long long message ---a very long long message ---a very
                long long message ---a very long long message ---a very long
                long message ---a very long long message ---a very long long
                message ---a very long long message ---a very long long message
                ---a very long long message ---a very long long message ---a
                very long long message ---a very long long message ---a very
                long long message ---a very long long message ---a very long
                long message
              </div>
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
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br /> ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------ ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------ ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------ ------
        <br />
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------ ------
        <br />
        ------
        <br />
        ------
        <br />
        ------ ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------ ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
        <br />
        ------
      </body>
    </>
  );
});
