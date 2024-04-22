import { useTheme } from '@emotion/react'
import { Check, X } from '@talismn/web-icons'
import { motion } from 'framer-motion'
import { isValidElement, useMemo, useRef, type ReactNode } from 'react'
import { resolveValue, type Toast, type ToastPosition } from 'react-hot-toast/headless'
import { CircularProgressIndicator, SurfaceIconButton, Text, useSurfaceColor } from '../../atoms'
import { toast as toaster } from '../../organisms'

export type ToastMessageProps = {
  headlineContent: ReactNode
  supportingContent: ReactNode
}

export const ToastMessage = (_props: ToastMessageProps) => null

export type ToastBarProps = {
  toast: Toast
  position?: ToastPosition
}

const ToastBar = ({ toast }: ToastBarProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const theme = useTheme()
  const surfaceColor = useSurfaceColor()

  const children = resolveValue(toast.message, toast)
  const [headlineContent, supportingContent] = useMemo(() => {
    if (isValidElement(children) && children.type === ToastMessage) {
      const messageProps = children.props as ToastMessageProps
      return [messageProps.headlineContent, messageProps.supportingContent] as const
    }

    return [children, undefined] as const
  }, [children])

  const origin = useMemo(() => {
    switch (toast.position) {
      case 'top-center':
        return { y: '-100%' }
      case 'bottom-left':
      case 'bottom-center':
      case 'bottom-right':
        return { y: '100%' }
      case 'top-right':
      case undefined:
        return { x: '100%' }
      case 'top-left':
        return { x: '-100%' }
    }
  }, [toast.position])

  return (
    <motion.div
      ref={ref}
      key={toast.id}
      css={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '1.2rem',
        border: `1px solid ${theme.color.outlineVariant}`,
        padding: '1.6rem',
        borderRadius: theme.shape.small,
        backgroundColor: surfaceColor,
        filter: 'drop-shadow(0 2px 5px rgba(0, 0, 0, 0.06))',
        cursor: 'grab',
      }}
      initial={{ ...origin, opacity: 0, scale: 0.8 }}
      animate={{ ...(toast.visible ? { x: 0, y: 0 } : origin), opacity: toast.visible ? 1 : 0, scale: 1 }}
      whileHover="hover"
      drag="x"
      dragConstraints={{ left: 0 }}
      dragSnapToOrigin={true}
      whileDrag={{ cursor: 'grabbing' }}
      onDragEnd={(_, info) => {
        const rect = ref.current?.getBoundingClientRect()

        if (rect !== undefined && info.offset.x > rect.width / 2) {
          toaster.dismiss(toast.id)
        }
      }}
      variants={{ hover: { scale: 1.01 } }}
      {...toast.ariaProps}
    >
      {useMemo(() => {
        const commonCss = {
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '4rem',
          height: '4rem',
          borderRadius: theme.shape.full,
        }

        if (toast.icon !== undefined) {
          return (
            <div
              css={{
                ...commonCss,
                backgroundColor: toast.iconTheme?.primary,
                color: toast.iconTheme?.secondary,
              }}
            >
              {resolveValue(toast.icon, toast)}
            </div>
          )
        }

        switch (toast.type) {
          case 'loading':
            return <CircularProgressIndicator size="4rem" />
          case 'success':
            return (
              <div
                css={{
                  ...commonCss,
                  backgroundColor: 'rgba(56, 212, 72, 0.25)',
                  color: '#38D448',
                }}
              >
                <Check size="2rem" />
              </div>
            )
          case 'error':
            return (
              <div
                css={{
                  ...commonCss,
                  backgroundColor: 'rgba(210, 36, 36, 0.25)',
                  color: '#D22424',
                }}
              >
                <X size="2rem" />
              </div>
            )
        }

        return undefined
      }, [theme.shape.full, toast])}
      <Text.Body as="div">
        <Text.Body css={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          <Text.Body alpha="high">{headlineContent}</Text.Body>
          {/* <Text.Body alpha="disabled" css={{ textAlign: 'end', alignSelf: 'first baseline', minWidth: '11rem' }}>
            {createdAtDistance}
          </Text.Body> */}
        </Text.Body>
        {supportingContent}
      </Text.Body>
      <motion.div
        // https://github.com/framer/motion/issues/2563
        animate={{ transitionEnd: { display: 'none' } }}
        variants={{ hover: { display: 'revert' } }}
        css={{ display: 'none', position: 'absolute', top: '-0.75rem', left: '-0.75rem' }}
      >
        <SurfaceIconButton
          size="2rem"
          onClick={() => toaster.dismiss(toast.id)}
          css={{ border: `1px solid ${theme.color.outlineVariant}` }}
        >
          <X />
        </SurfaceIconButton>
      </motion.div>
    </motion.div>
  )
}

export default ToastBar
