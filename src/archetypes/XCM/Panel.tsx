import styled from "styled-components"

const Panel = ({ className }: any) => {
  return (
    <section className={className}>
    
    </section>
  )
}

const StyledPanel = styled(Panel)`
  height: 280px;
  width: 422px;
  background-color: #1B1B1B;
  border-radius: 1em;
  border: 1px solid #5A5A5A;
`

export default StyledPanel