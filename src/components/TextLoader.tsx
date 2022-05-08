import styled from 'styled-components'

const TextLoader = styled.div`
  display: inline-block;

  background: linear-gradient(
    90deg,
    rgba(213, 255, 92, 0) 25%,
    rgba(213, 255, 92, 0.4) 40%,
    rgba(213, 255, 92, 0.7) 60%,
    rgba(213, 255, 92, 0) 75%
  );
  background-size: 400% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  background-repeat: no-repeat;
  background-position: 0 0;
  background-color: var(--color-text);
  animation: shimmer 2s infinite;

  &&& {
    color: transparent;
  }

  @keyframes shimmer {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 100% 0;
    }
  }
`

export default TextLoader
