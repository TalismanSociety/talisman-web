import styled from "styled-components"
import StyledAccountPicker from "./AccountPicker"

const Panel = ({ className }: any) => {
  return (
    <section className={className}>
      <StyledAccountPicker />
      <div>From and To</div>
      <div>Amount</div>
    </section>
  )
}

const StyledPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  padding: 24px;
  height: 280px;
  width: 422px;
  background-color: #1B1B1B;
  border-radius: 1em;
  border: 1px solid #5A5A5A;
`

export default StyledPanel