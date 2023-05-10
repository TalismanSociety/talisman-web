// NOTE: modified version of https://github.com/timolins/react-hot-toast/blob/main/src/components/toaster.tsx
// to allow customizability later on

import type { CSSObject } from '@emotion/react'
import { useReducedMotion } from 'framer-motion'
import { useCallback, type CSSProperties, type ReactNode, type RefCallback } from 'react'
import { resolveValue, useToaster, type ToastPosition, type ToasterProps } from 'react-hot-toast/headless'
import { ToastBar } from '../molecules'

type ToastWrapperProps = {
  id: string
  className?: string
  style?: CSSProperties
  onHeightUpdate: (id: string, height: number) => void
  children?: ReactNode
}

const ToastWrapper = ({ id, className, style, onHeightUpdate, children }: ToastWrapperProps) => (
  <div
    ref={useCallback<RefCallback<HTMLDivElement>>(
      element => {
        if (element !== null) {
          const updateHeight = () => {
            const height = element.getBoundingClientRect().height
            onHeightUpdate(id, height)
          }
          updateHeight()
          new MutationObserver(updateHeight).observe(element, {
            subtree: true,
            childList: true,
            characterData: true,
          })
        }
      },
      [id, onHeightUpdate]
    )}
    className={className}
    style={style}
  >
    {children}
  </div>
)

const getPositionStyle = (position: ToastPosition, offset: number, prefersReducedMotion: boolean): CSSObject[] => {
  const top = position.includes('top')

  return [
    {
      left: 0,
      right: 0,
      display: 'flex',
      position: 'absolute',
      transition: prefersReducedMotion ? undefined : `all 230ms cubic-bezier(.21,1.02,.73,1)`,
      transform: `translateY(${offset * (top ? 1 : -1)}px)`,
    },
    top ? { top: 0 } : { bottom: 0 },
    position.includes('center')
      ? {
          justifyContent: 'center',
        }
      : position.includes('right')
      ? {
          justifyContent: 'flex-end',
        }
      : {},
  ]
}

export const TOASTER_DEFAULT_OFFSET = 16

const Toaster = ({
  className,
  position = 'top-center',
  reverseOrder,
  toastOptions,
  gutter,
  children,
}: Omit<ToasterProps, 'containerClassname'> & { className?: string }) => {
  const { toasts, handlers } = useToaster(toastOptions)
  const prefersReducedMotion = useReducedMotion()

  return (
    <dialog
      open
      className={className}
      onMouseEnter={handlers.startPause}
      onMouseLeave={handlers.endPause}
      css={{
        position: 'fixed',
        inset: TOASTER_DEFAULT_OFFSET,
        margin: 0,
        border: 'none',
        width: 'auto',
        height: 'auto',
        background: 'none',
        pointerEvents: 'none',
      }}
    >
      {toasts.map(t => {
        const offset = handlers.calculateOffset(t, {
          reverseOrder,
          gutter,
          defaultPosition: position,
        })
        const positionStyle = getPositionStyle(position, offset, prefersReducedMotion ?? false)

        return (
          <ToastWrapper
            id={t.id}
            key={t.id}
            onHeightUpdate={handlers.updateHeight}
            css={[
              t.visible && {
                'zIndex': 9999,
                '> *': {
                  pointerEvents: 'auto',
                },
              },
              positionStyle,
            ]}
          >
            {t.type === 'custom' ? (
              resolveValue(t.message, t)
            ) : children ? (
              children(t)
            ) : (
              <ToastBar toast={t} position={position} />
            )}
          </ToastWrapper>
        )
      })}
    </dialog>
  )
}

export default Toaster

export { toast } from 'react-hot-toast/headless'
