import {
  component$,
  useStyles$,
} from '@builder.io/qwik';

import TooltipArrowStyle from './TooltipArrow.scss?inline';

export const TooltipArrow = component$(
  ({ arrowSize }: { arrowSize: number }) => {
    useStyles$(TooltipArrowStyle);

    return (
      <div
        class="QwikUiTooltip-arrow"
        style={{ width: `${arrowSize}px`, height: `${arrowSize}px` }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -16 32 32">
          <path d="M16 0l16 16H0z"></path>
        </svg>
        {/* 
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="478 -652 188 344"
          height={arrowSize}
          width={arrowSize}
          version="1.1"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          transform="matrix(-1.8369701987210297e-16,-1,1,-1.8369701987210297e-16,0,0)"
        >
          <path d="M420-308q-8 0-14-5.5t-6-14.5v-304q0-9 6-14.5t14-5.5q2 0 14 6l145 145q5 5 7 10t2 11q0 6-2 11t-7 10L434-314q-3 3-6.5 4.5T420-308Z"></path>
        </svg> 
        */}
      </div>
    );
  }
);
