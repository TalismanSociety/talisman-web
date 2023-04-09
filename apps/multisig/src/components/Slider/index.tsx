import 'rc-slider/assets/index.css'

import { css } from '@emotion/css'
import RcSlider, { SliderProps as RcSliderProps } from 'rc-slider'

export interface SliderProps extends RcSliderProps {
  leftLabel?: string
  rightLabel?: string
}

const Slider = (props: SliderProps) => (
  <div>
    {(props.leftLabel || props.rightLabel) && (
      <div
        className={css`
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
        `}
      >
        <span>{props.leftLabel}</span>
        <span>{props.rightLabel}</span>
      </div>
    )}
    <RcSlider
      className={css`
        display: flex;
        align-items: center;
        justify-content: center;
        height: 32px;
        .rc-slider-rail {
          height: 1px;
          background: var(--color-dim);
        }
        .rc-slider-handle {
          margin-top: 0;
          background-color: var(--color-primary);
          opacity: 1;
          border: 0;
          height: 32px;
          width: 32px;
        }
        .rc-slider-handle-dragging {
          box-shadow: 0 0 5px var(--color-primary) !important;
        }
        .rc-slider-track {
          background: transparent;
        }
        background: transparent;
      `}
      {...props}
    />
  </div>
)

export default Slider
