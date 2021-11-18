import { Button } from '@components'
import styled from 'styled-components'

const Popup = styled(({ className, openModal, dismiss }) => (
  <div className={className}>
    <h3>Contributed to the Moonbeam crowdloan?</h3>
    <p>Make sure you link your account to an Ethereum address to be eligible to claim your GLMR rewards</p>
    <p className="standalone-link">
      <a
        href="https://moonbeam.foundation/tutorials/how-to-create-a-moonbeam-ethereum-address"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more
      </a>
    </p>
    <div className="button-row">
      <Button small onClick={dismiss}>
        Dismiss
      </Button>
      <Button primary small onClick={openModal}>
        Link address
      </Button>
    </div>
  </div>
))`
  max-width: 40rem;
  position: fixed;
  top: 9.2rem;
  right: 3.2rem;
  padding: 3.2rem;
  border-radius: 1.6rem;
  background: var(--color-controlBackground);
  border: 1px solid #383838;
  text-align: center;
  z-index: 99999;

  > h3 {
    font-size: 2.4rem;
    font-weight: bold;
    color: var(--color-text);
  }

  > p {
    font-size: 1.6rem;
  }

  > p:last-of-type {
    margin-bottom: 2.4rem;
  }

  > .standalone-link a {
    font-size: 1.4rem;
    color: #5a5a5a;
    text-decoration: underline;
  }

  > .button-row {
    display: flex;

    > * {
      flex: 1 0 0%;
    }
    > *:not(:last-child) {
      margin-right: 1rem;
    }
  }
`
export default Popup
