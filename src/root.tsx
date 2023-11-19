import { component$, useStyles$ } from "@builder.io/qwik";

import { Counter } from "./components/counter/counter";
import { CustomTooltip } from "./components/CustomTooltip";
import { Logo } from "./components/logo/logo";
import RootStyle from "./Root.scss?inline";

export default component$(() => {
  useStyles$(RootStyle);

  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Blank App</title>
      </head>
      <body style="display: flex; flex-direction: column; align-items: center">
        <Logo />
        <Counter />
        <div class="Root-demo-tooltip">
          <div class="top-section">
            <CustomTooltip
              preferredPlacement="top-start"
              placementStrategy="default"
            >
              <button q:slot="relative-element">top-start</button>
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
            </CustomTooltip>
            <CustomTooltip preferredPlacement="top" placementStrategy="default">
              <button q:slot="relative-element">top</button>
              <div q:slot="message">Top</div>
            </CustomTooltip>
            <CustomTooltip
              preferredPlacement="top-end"
              placementStrategy="default"
            >
              <button q:slot="relative-element">top-end</button>
              <div q:slot="message">Top end</div>
            </CustomTooltip>
          </div>

          <div class="left-section">
            <CustomTooltip
              preferredPlacement="left-start"
              placementStrategy="default"
            >
              <button q:slot="relative-element">left-start</button>
              <div q:slot="message">Left start</div>
            </CustomTooltip>
            <CustomTooltip
              preferredPlacement="left"
              placementStrategy="default"
            >
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
            </CustomTooltip>
            <CustomTooltip
              preferredPlacement="left-end"
              placementStrategy="default"
            >
              <button q:slot="relative-element">left-end</button>
              <div q:slot="message">Left end</div>
            </CustomTooltip>
          </div>

          <div class="right-section">
            <CustomTooltip
              preferredPlacement="right-start"
              placementStrategy="default"
            >
              <button q:slot="relative-element">right-start</button>
              <div q:slot="message">Right start</div>
            </CustomTooltip>
            <CustomTooltip
              preferredPlacement="right"
              placementStrategy="default"
            >
              <button q:slot="relative-element">right</button>
              <div q:slot="message">Right</div>
            </CustomTooltip>
            <CustomTooltip
              preferredPlacement="right-end"
              placementStrategy="default"
            >
              <button q:slot="relative-element">right-end</button>
              <div q:slot="message">Right end</div>
            </CustomTooltip>
          </div>

          <div class="bottom-section">
            <CustomTooltip
              placementStrategy="default"
              preferredPlacement="bottom-start"
            >
              <button q:slot="relative-element">bottom-start</button>
              <div q:slot="message">Bottom start</div>
            </CustomTooltip>
            <CustomTooltip
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
            </CustomTooltip>
            <CustomTooltip
              preferredPlacement="bottom-end"
              placementStrategy="default"
            >
              <button q:slot="relative-element">bottom-end</button>
              <div q:slot="message">Bottom end</div>
            </CustomTooltip>
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
