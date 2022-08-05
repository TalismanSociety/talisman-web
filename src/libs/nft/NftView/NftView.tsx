import { MediaPreviewProps, NftElement } from '@util/nfts/types'
import React, { EmbedHTMLAttributes, ImgHTMLAttributes, MediaHTMLAttributes, cloneElement } from 'react'

export interface NftPreviewProps extends ImgHTMLAttributes<HTMLImageElement>, NftElement {}

export interface ImgPreviewProps extends ImgHTMLAttributes<HTMLImageElement> {
  contentCategory: 'image' | 'audio'
}

export interface VideoPreviewProps extends MediaHTMLAttributes<HTMLMediaElement> {
  contentCategory: 'video'
}

export interface ModelPreviewProps {
  contentCategory: 'model'
}

export interface EmbedPreviewProps {
  contentCategory: 'application'
}

export interface GenericPreviewProps {
  contentCategory: string
}

export function MediaPreview(props: MediaPreviewProps) {
  const { contentCategory, ...mediaElementProps } = props
  const imgProps = mediaElementProps as ImgHTMLAttributes<HTMLImageElement>
  switch (contentCategory) {
    case 'model':
      const modelProps = {
        'src': imgProps.src,
        'alt': imgProps.alt,
        'autoplay': 'true',
        'camera-controls': 'true',
        'shadow-intensity': '1',
        'ar-status': 'not-presenting',
        ...mediaElementProps,
      }
      return (
        <model-viewer
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
          }}
          {...modelProps}
        />
      )
    case 'video':
      const videoProps = mediaElementProps as MediaHTMLAttributes<HTMLMediaElement>
      return (
        <video
          onMouseOver={event => {
            event.target.play()
          }}
          onMouseOut={event => {
            event.target.pause()
            event.target.currentTime = 0
          }}
          loop
          muted
          // autoPlay
          playsInline
          preload="metadata"
          controlsList="nodownload"
          {...videoProps}
        />
      )
    case 'application':
      const { src, ...embedProps } = mediaElementProps as EmbedHTMLAttributes<HTMLEmbedElement>
      return <embed src={`${src}#toolbar=0`} {...embedProps} />
    default:
      if (!imgProps.src) {
        return null
      }
      return <img loading="lazy" {...imgProps} />
  }
}
