import { Button, useModal } from '@components'
import { isMobileBrowser } from '@util/helpers'
import { useEffect } from 'react'
import styled from 'styled-components'

export default function DesktopRequired() {
  const { openModal } = useModal()

  useEffect(() => {
    if (!isMobileBrowser()) return

    openModal(<DesktopRequiredModal />, { closable: false })
  }, [openModal])

  return null
}

const DesktopRequiredModal = styled(props => {
  const { closeModal } = useModal()

  return (
    <div {...props}>
      <h2>Sorry!</h2>
      <p>This feature is currently only available on desktop, but we will be launching mobile-friendly version soon.</p>
      <p>In the meantime feel free to check out our Crowdloans dashboard</p>
      <Button primary to="/crowdloans" onClick={closeModal}>
        View Crowdloans
      </Button>
    </div>
  )
})`
  text-align: center;

  > *:not(:last-child) {
    margin-bottom: 2rem;
  }

  h2 {
    color: var(--color-text);
    font-weight: 600;
    font-size: 1.8rem;
  }
  p {
    color: #999;
    font-size: 1.6rem;
  }
`
