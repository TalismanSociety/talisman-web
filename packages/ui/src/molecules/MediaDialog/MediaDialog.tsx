import { Global, keyframes, useTheme } from '@emotion/react'
import { Volume2, X } from '@talismn/icons'
import { type ReactNode } from 'react'
import { Button, Dialog, Text, type DialogProps } from '../../atoms'
import { useMimeType, type MimeTypeSubType, type MimeTypeType } from '../../utils'

const show = keyframes`
  from {
    opacity: 0;
    transform: translateY(2rem);
  }
`

const backdropKeyframes = keyframes`
  from {
    background: rgba(0,0,0,0);
    backdrop-filter: blur(0);
  }
  to {
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(16px);
  }
`

type MediaPlayerProps = { src: string | undefined; type?: MimeTypeType; subType?: MimeTypeSubType }

const MediaPlayer = (props: MediaPlayerProps) => {
  const [_type, _subType] = useMimeType(props.src, props.type === undefined)

  const type = props.type ?? _type
  const subType = props.subType ?? _subType

  switch (type) {
    case 'image':
      return <img src={props.src} css={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    case 'video':
      return <video src={props.src} css={{ width: '100%', height: '100%' }} controls />
    case 'audio':
      return (
        <div css={{ position: 'relative', height: '100%' }}>
          <Volume2 size="40%" css={{ position: 'absolute', inset: 0, margin: 'auto' }} />
          <audio src={props.src} css={{ width: '100%', height: '100%' }} controls />
        </div>
      )
    case 'model':
      import('@google/model-viewer/dist/model-viewer')
      return (
        <model-viewer
          src={props.src}
          camera-controls
          // @ts-expect-error
          style={{ width: '100%', height: '100%' }}
        />
      )
    case 'application':
      if (subType === 'pdf') {
        return <embed src={props.src} css={{ width: '100%', height: '100%' }} />
      }
      return null
    case null:
    case undefined:
    default:
      return null
  }
}

export type MediaDialogProps = DialogProps & {
  title: ReactNode
  overline?: ReactNode
  media: ReactNode
  content: ReactNode
  onRequestDismiss: () => unknown
}

const MediaDialog = Object.assign(
  ({ title, overline, media, content, onRequestDismiss, ...props }: MediaDialogProps) => {
    const theme = useTheme()

    return (
      <>
        {props.open && <Global styles={{ body: { overflow: 'hidden' } }} />}
        <Dialog
          {...props}
          title={undefined}
          onClickBackdrop={onRequestDismiss}
          onClose={onRequestDismiss}
          onCancel={onRequestDismiss}
          css={{
            'display': 'grid',
            'gridTemplateAreas': `
            'media'
            'header'
            'content'
          `,
            'gridTemplateRows': 'repeat(3, min-content)',
            'margin': 0,
            'width': 'auto',
            'maxWidth': '100%',
            'height': 'auto',
            'maxHeight': '100%',
            'border': 'none',
            'padding': 0,
            'background': theme.color.surface,
            'overflow': 'auto',
            '&[open]': {
              'animation': `${show} .5s ease`,
              '::backdrop': {
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(16px)',
                animation: `${backdropKeyframes} .5s ease forwards`,
              },
            },
            '@media(min-width: 1024px)': {
              gridTemplateAreas: `
              'media header'
              'media content'
            `,
              gridTemplateRows: 'min-content minmax(0, 1fr)',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
              margin: 'auto',
              width: '80%',
              maxWidth: 'revert',
              height: 'revert',
              maxHeight: 'revert',
              borderRadius: '2.4rem',
              overflow: 'hidden',
            },
          }}
        >
          <div
            css={{
              gridArea: 'header',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              padding: '2.4rem',
            }}
          >
            <header>
              <Text.H4 alpha="medium" css={{ margin: '0 0 0.4rem 0' }}>
                {overline}
              </Text.H4>
              <Text.H3 css={{ margin: 0 }}>{title}</Text.H3>
            </header>
            <Button variant="noop" onClick={onRequestDismiss}>
              <X size="2.4rem" />
            </Button>
          </div>
          <div css={{ gridArea: 'media', aspectRatio: '1 / 1' }}>{media}</div>
          <div css={{ gridArea: 'content', display: 'flex', flexDirection: 'column' }}>
            <div css={{ 'padding': '2.4rem', '@media(min-width: 1024px)': { flex: '1 1 0', overflow: 'auto' } }}>
              {content}
            </div>
          </div>
        </Dialog>
      </>
    )
  },
  { Player: MediaPlayer }
)

export default MediaDialog
