import styled from "styled-components";

const Spinner = ({className} : any) => {
  return (
    <div className={className}></div>
  );
}

const StyledSpinner = styled(Spinner)`

  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;

  :after {
    content: " ";
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid #fff;
    border-color: var(--color-dim) transparent var(--color-dim) transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }

  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

export default StyledSpinner;