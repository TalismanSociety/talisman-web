import Modal from '@components/Modal'
import { Button } from '@talismn/ui'
import { useCallback, useState } from 'react'

const BetaNotice = () => {
  const [isOpen, setIsOpen] = useState(true)
  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <Modal
      isOpen={isOpen}
      onAfterOpen={() => {}}
      onRequestClose={() => {
        setIsOpen(false)
      }}
      contentLabel="Beta Notice"
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
    >
      <div
        css={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center' }}
      >
        <div
          css={{
            display: 'grid',
            justifyItems: 'center',
          }}
        >
          <h1>Welcome to Signet!</h1>
          <br />
          <span>
            Signet is under active development and a Beta Service as defined in our{' '}
            <a
              css={{ textDecoration: 'underline' }}
              href={'https://docs.talisman.xyz/talisman/prepare-for-your-journey/terms-of-use'}
              target="_blank"
              rel="noreferrer"
            >
              Terms of Service
            </a>
            .
          </span>
          <br />
          <p>Please use with caution.</p>
          <br />
          <Button css={{ width: '164px' }} onClick={close}>
            I understand
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default BetaNotice
