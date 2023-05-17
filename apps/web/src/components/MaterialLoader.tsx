import styled from '@emotion/styled'

export default styled((props: any) => (
  <div {...props}>
    <svg viewBox="25 25 50 50">
      <circle cx="50" cy="50" r="20" fill="none" strokeWidth="4" strokeMiterlimit="10" />
    </svg>
  </div>
))`
  position: relative;
  margin: 0 auto;
  width: 1em;
  &:before {
    content: '';
    display: block;
    padding-top: 100%;
  }

  svg {
    animation: rotate 2s linear infinite;
    height: 100%;
    transform-origin: center center;
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }

  circle {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    animation: dash 1.5s ease-in-out infinite;
    stroke: currentColor;
    stroke-linecap: round;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -35px;
    }
    100% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -124px;
    }
  }
`
