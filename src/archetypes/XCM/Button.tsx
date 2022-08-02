import styled from 'styled-components'

const Button = ({ title, onClick, className, disabled } : any) => {
  return (
    <button onClick={() => console.log("Clicked!")} className={className} disabled={disabled}>
      {title}
    </button>
  )
}

const StyledButton = styled(Button)`

  background-color: #D5FF5C;
  color: #121212;
  
  transition: background-color 0.15s ease-in-out;

  :disabled {
    background-color: #262626;
    color: #5A5A5A;
  }

  display: flex;
  align-items: center;
  justify-content: center;

  max-width: 422px;
  width: 422px; // Make this dynamic
  padding: 16px 24px 16px 24px;

  border: none;
  border-radius: 1em;


  font-size: 18px;
  cursor: pointer;
`

export default StyledButton