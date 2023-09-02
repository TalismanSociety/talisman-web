import { ReactNode } from 'react'
import ReactModal, { Props as ReactModalProps } from 'react-modal'
import { animated, useSpring } from 'react-spring'
import { useMeasure } from 'react-use'

interface Props extends ReactModalProps {
  children: ReactNode
  width?: string
}

const Modal = (props: Props) => {
  // get ref for the content div and the height from useMeasure
  const [contentRef, { height }] = useMeasure<HTMLDivElement>()

  const springStyle = useSpring({
    height,
    overflow: 'auto',
    config: { tension: 170, friction: 26 }, // these values are recommended for height transition
  })

  ReactModal.setAppElement('#root')
  return (
    <ReactModal
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
          width: props.width || 'calc(100% - 24px)',
          maxWidth: '1024px',
        },
      }}
      closeTimeoutMS={150}
      onAfterOpen={() => {}}
      {...props}
    >
      <animated.div style={springStyle}>
        <div ref={contentRef}>{props.children}</div>
      </animated.div>
    </ReactModal>
  )
}

export default Modal
