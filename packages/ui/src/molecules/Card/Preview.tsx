import { Box, Unknown, Video, Volume2 } from '@talismn/icons'
import React, { useState, type ReactNode } from 'react'
import { useMimeType, type MimeTypeType } from '../../utils'
import type { Interpolation, Theme } from '@emotion/react'

type PreviewProps = {
  src?: string | readonly string[] | undefined
  type?: MimeTypeType
  /**
   * If src doesn't contain file extension
   * use a HEAD request to get the content type
   */
  fetchMime?: boolean
}

const css = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  inset: 0,
  margin: 0,
  width: '100%',
  height: '100%',
} satisfies Interpolation<Theme>

const imgCss = [css, { objectFit: 'cover' }] satisfies Interpolation<Theme>

const SyncPreview = (props: Pick<PreviewProps, 'src'> & { type: MimeTypeType | undefined }) => {
  const srcs = typeof props.src === 'string' ? [props.src] : props.src
  switch (props.type) {
    case 'image':
      return (
        <picture>
          {srcs?.map((x, index) => (
            <source key={index} srcSet={x} />
          ))}
          <img css={imgCss} />
        </picture>
      )
    case 'video':
      return (
        <figure css={css}>
          <Video size="40%" />
        </figure>
      )
    case 'audio':
      return (
        <figure css={css}>
          <Volume2 size="40%" />
        </figure>
      )
    case 'model':
      return (
        <figure css={css}>
          <Box size="40%" />
        </figure>
      )
    default:
      return (
        <figure css={css}>
          <Unknown size="40%" />
        </figure>
      )
  }
}

const AsyncPreview = (props: Pick<PreviewProps, 'src'>) => {
  const [type] = useMimeType(props.src, true)

  return <SyncPreview type={type} src={props.src} />
}

export const Preview = (props: PreviewProps) => {
  const [_type] = useMimeType(props.src)

  const type = props.type ?? _type

  const srcs = typeof props.src === 'string' ? [props.src] : props.src

  const [shouldTryFetchingMimeType, setShouldTryFetchingMimeType] = useState(false)

  if ((srcs?.length ?? 0) === 0) {
    return <SyncPreview src={props.src} type={undefined} />
  }

  if (type !== undefined) {
    return <SyncPreview src={props.src} type={type} />
  }

  if (shouldTryFetchingMimeType) {
    return props.fetchMime ? <AsyncPreview src={props.src} /> : <SyncPreview src={props.src} type={type} />
  }

  return (
    <picture>
      {srcs?.map((x, index) => (
        <source key={index} srcSet={x} />
      ))}
      <img onError={() => setShouldTryFetchingMimeType(true)} css={imgCss} />
    </picture>
  )
}

export const MultiPreview = (props: {
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
