import { X } from '@talismn/icons'
import { IconButton } from '@talismn/ui'
import { useState } from 'react'
import Modal from 'react-modal'
import { useLocation, useNavigate } from 'react-router-dom'
import { animated, useSpring } from 'react-spring'
import { useMeasure } from 'react-use'

import ActionsMenu from './ActionsMenu'
import AdvancedAction from './AdvancedAction'
import SendAction from './SendAction'

export enum Action {
  Send,
  Advanced,
}

const NewTransactionModal = () => {
  const location = useLocation().pathname
  const navigate = useNavigate()
  const [action, setAction] = useState<Action | undefined>(undefined)
  const isOpen = location.startsWith('/overview/new-transaction')
  const close = () => {
    navigate('/overview')
  }

  // get ref for the content div and the height from useMeasure
  const [contentRef, { height }] = useMeasure<HTMLDivElement>()

  const springStyle = useSpring({
    height: height + 32 + 80, // adding padding (top and bottom) to content's height
    overflow: 'auto',
    padding: '32px 32px 80px 32px',
    config: { tension: 170, friction: 26 }, // these values are recommended for height transition
  })

  Modal.setAppElement('#root')
  return (
    <Modal
      isOpen={isOpen}
      onAfterOpen={() => {}}
      onRequestClose={close}
      onAfterClose={() => {
        setAction(undefined)
      }}
      style={{
        overlay: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(5px)',
        },
        content: {
          position: 'absolute',
          top: 'auto',
          left: 'auto',
          right: 'auto',
          bottom: 'auto',
          border: '0',
          background: 'var(--color-background)',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '32px',
          outline: 'none',
          padding: '0',
          width: 'calc(100% - 24px)',
          maxWidth: '1024px',
        },
      }}
      contentLabel="Example Modal"
      closeTimeoutMS={150}
    >
      <animated.div style={springStyle}>
        <div ref={contentRef}>
          <IconButton css={{ marginLeft: 'auto' }} onClick={close}>
            <X />
          </IconButton>
          {action === undefined ? (
            <ActionsMenu
              onActionClick={(a: Action) => {
                setAction(a)
              }}
            />
          ) : action === Action.Send ? (
            <SendAction onCancel={() => setAction(undefined)} />
          ) : action === Action.Advanced ? (
            <AdvancedAction onCancel={() => setAction(undefined)} />
          ) : null}
        </div>
      </animated.div>
    </Modal>
  )
}

export default NewTransactionModal
