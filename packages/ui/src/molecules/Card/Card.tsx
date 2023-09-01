import { useTheme } from '@emotion/react'
import { motion, useMotionTemplate, useSpring, useTransform } from 'framer-motion'
import { createContext, useState, type ReactNode } from 'react'
import { Skeleton, Text } from '../..'
import { MultiPreview, Preview } from './Preview'

export type CardProps = {
  media?: ReactNode
  headlineText: ReactNode
  overlineText?: ReactNode
  mediaLabel?: ReactNode
  actions?: ReactNode
  onClick?: () => unknown
}

const CardContext = createContext({ hover: false })

const CardSkeleton = () => (
  <Skeleton.Surface
    css={{
      position: 'relative',
      opacity: 0.95,
      border: ' 1px solid rgba(200 200 200 / 0.2)',
      borderRadius: '1.5rem',
      backdropFilter: 'blur(16px)',
      overflow: 'hidden',
    }}
  >
    <Skeleton.Surface css={{ position: 'relative', width: 'auto', aspectRatio: '1 / 1' }} />
    <Skeleton.Foreground css={{ padding: '1.6rem 2.4rem', borderRadius: 0 }}>
      <Text.Body as="h4" css={{ marginBottom: '0.8rem' }}>
        <wbr />
      </Text.Body>
      <Text.BodyLarge as="h3" alpha="high">
        <wbr />
      </Text.BodyLarge>
    </Skeleton.Foreground>
  </Skeleton.Surface>
)

const Card = Object.assign(
  (props: CardProps) => {
    const theme = useTheme()

    // Disable heavy animations instantly when not hovering
    // critical for performance if lots of cards are rendered
    const [hover, setHover] = useState(false)

    const width = useSpring(0)
    const scale = useSpring(1)
    const rotateX = useSpring(0)
    const rotateY = useSpring(0)

    const transform = useMotionTemplate`perspective(${width}px) scale3d(${scale},${scale},${scale}) rotateX(${rotateY}deg) rotateY(${rotateX}deg)`

    const diagonalMovement = useTransform<number, number>([rotateX, rotateY], ([newRotateX, newRotateY]) => {
      const position: number = (newRotateX ?? 0) + (newRotateY ?? 0)
      return position
    })
    const sheenPosition = useTransform(diagonalMovement, [-5, 5], [-100, 200])
    const sheenOpacity = useTransform(sheenPosition, [-100, 50, 200], [0, 0.05, 0])
    const sheenGradient = useMotionTemplate`linear-gradient(
    55deg,
    transparent,
    rgba(255 255 255 / ${sheenOpacity}) ${sheenPosition}%,
    transparent)`

    return (
      <motion.article
        whileHover="hover"
        onMouseEnter={() => {
          setHover(true)
          scale.set(1.025)
        }}
        onMouseLeave={event => {
          const rect = event.currentTarget.getBoundingClientRect()

          setHover(false)
          width.set(rect.width)
          scale.set(1)
          rotateX.set(0)
          rotateY.set(0)
        }}
        onMouseMove={event => {
          const threshold = 2
          const rect = event.currentTarget.getBoundingClientRect()

          const horizontal = (event.clientX - rect.left) / rect.width
          const vertical = (event.clientY - rect.top) / rect.height
          const _rotateX = threshold / 2 - horizontal * threshold
          const _rotateY = vertical * threshold - threshold / 2

          width.set(rect.width)
          rotateX.set(_rotateX)
          rotateY.set(_rotateY)
        }}
        style={{
          transform: hover ? transform : 'revert',
          cursor: props.onClick !== undefined ? 'pointer' : undefined,
        }}
        css={{
          position: 'relative',
          border: ' 1px solid rgba(200 200 200 / 0.2)',
          borderRadius: '1.5rem',
          backgroundColor: theme.color.foreground,
          overflow: 'hidden',
        }}
        onClick={props.onClick}
      >
        <div css={{ position: 'relative', width: 'auto', aspectRatio: '1 / 1' }}>
          {props.media}
          <CardContext.Provider value={{ hover }}>{props.actions}</CardContext.Provider>
          {props.mediaLabel && (
            <Text.BodyLarge
              as="div"
              alpha="high"
              css={{
                fontWeight: 'bold',
                position: 'absolute',
                right: '2.4rem',
                bottom: '2.4rem',
                borderRadius: '0.8rem',
                backgroundColor: theme.color.background,
                padding: '1.2rem 1.6rem',
              }}
            >
              {props.mediaLabel}
            </Text.BodyLarge>
          )}
        </div>
        <header css={{ backgroundColor: theme.color.surface, padding: '1.6rem 2.4rem' }}>
          <Text.Body as="h4" css={{ marginBottom: '0.8rem' }}>
            {props.overlineText}
          </Text.Body>
          <Text.BodyLarge as="h3" alpha="high">
            {props.headlineText}
          </Text.BodyLarge>
        </header>
        <motion.div
          variants={{ hover: { opacity: 1 } }}
          style={{ backgroundImage: hover ? sheenGradient : 'revert' }}
          css={{ position: 'absolute', inset: 0, opacity: 0, pointerEvents: 'none' }}
        />
      </motion.article>
    )
  },
  {
    Preview,
    MultiPreview,
    Actions: ({ children }: { children: ReactNode | ((props: { hover: boolean }) => ReactNode) }) => (
      <motion.div css={{ display: 'flex', position: 'absolute', top: '1rem', right: '1rem', gap: '0.4rem' }}>
        {typeof children === 'function' ? (
          <CardContext.Consumer>{({ hover }) => children({ hover })}</CardContext.Consumer>
        ) : (
          children
        )}
      </motion.div>
    ),
    Skeleton: CardSkeleton,
  }
)

export default Card
