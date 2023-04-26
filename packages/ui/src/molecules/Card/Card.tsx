import { useTheme } from '@emotion/react'
import { useGesture } from '@use-gesture/react'
import { motion, useMotionTemplate, useSpring, useTransform } from 'framer-motion'
import type { DetailedHTMLProps, ImgHTMLAttributes, ReactNode } from 'react'
import { Text } from '../..'
import React from 'react'

export type CardProps = {
  media?: ReactNode
  headlineText: ReactNode
  overlineText?: ReactNode
  mediaLabel?: ReactNode
  onClick?: () => unknown
}

const Image = (props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => (
  <img {...props} css={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
)

const MultiMedia = (props: {
  children:
    | ReactNode
    | [ReactNode, ReactNode]
    | [ReactNode, ReactNode, ReactNode]
    | [ReactNode, ReactNode, ReactNode, ReactNode]
}) => (
  <div css={{ display: 'flex', height: '100%' }}>
    <div
      css={{
        display: 'grid',
        gridTemplateRows: '1fr 1fr',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        gap: '1.6rem',
        margin: '1.6rem',
        width: 'stretch',
        alignSelf: 'stretch',
      }}
    >
      {React.Children.map(props.children, (child, index) => (
        <div key={index} css={{ position: 'relative', borderRadius: '0.8rem', overflow: 'hidden' }}>
          {child}
        </div>
      ))}
    </div>
  </div>
)

const Card = Object.assign(
  (props: CardProps) => {
    const theme = useTheme()

    const width = useSpring(0)
    const scale = useSpring(1)
    const rotateX = useSpring(0)
    const rotateY = useSpring(0)

    const cardBind = useGesture({
      onHover: event => {
        const rect = (event.currentTarget as EventTarget & HTMLElement).getBoundingClientRect()

        if (!event.hovering) {
          width.set(rect.width)
          scale.set(1)
          rotateX.set(0)
          rotateY.set(0)
        }
      },
      onMove: event => {
        const threshold = 2
        const {
          currentTarget,
          xy: [x, y],
        } = event
        const rect = (currentTarget as EventTarget & HTMLElement).getBoundingClientRect()

        const horizontal = (x - rect.left) / rect.width
        const vertical = (y - rect.top) / rect.height
        const _rotateX = threshold / 2 - horizontal * threshold
        const _rotateY = vertical * threshold - threshold / 2

        width.set(rect.width)
        scale.set(1.025)
        rotateX.set(_rotateX)
        rotateY.set(_rotateY)
      },
    })

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
        {...(cardBind() as any)}
        style={{ transform, cursor: props.onClick !== undefined ? 'pointer' : undefined }}
        css={{
          position: 'relative',
          opacity: 0.95,
          border: ' 1px solid rgba(200 200 200 / 0.2)',
          borderRadius: '1.5rem',
          backgroundColor: theme.color.foreground,
          backdropFilter: 'blur(16px)',
          overflow: 'hidden',
        }}
        onClick={props.onClick}
      >
        <div css={{ position: 'relative', width: 'auto', aspectRatio: '1 / 1' }}>
          {props.media}
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
          css={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          style={{ backgroundImage: sheenGradient }}
        />
      </motion.article>
    )
  },
  { Image, MultiMedia }
)

export default Card
