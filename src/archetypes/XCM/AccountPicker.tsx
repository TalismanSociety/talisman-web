import { ReactComponent as ChevronDown } from '@icons/chevron-down.svg'

import styled from "styled-components"

const AccountPicker = (({ className, accounts } : any)  => {

  accounts = ["", ""]

  return (
    <div className={className}>
      {/* Handle selected account logic */}
      <span>Select an Account</span>
       
      {accounts.length > 1 && (
        <ChevronDown
          className="nav-toggle"
        />
      )}
    </div>
  )
})

const StyledAccountPicker = styled(AccountPicker)`
  background-color: #282828;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 56px;
  padding: 8px 16px;
  border-radius: 0.5em;
  cursor: pointer;
  font-size: 16px;

  .nav-toggle {
    width: 24px;
    height: 24px;
    position: absolute;
    right: 16px;
  }
`

export default StyledAccountPicker