import '@google/model-viewer'

import PlaceholderPreview from '@archetypes/NFT/PlaceholderPreview'
import CircularProgressIndicator from '@components/atoms/CircularProgressIndicator'
import { Box, File, Image, Unknown, Video, Volume2 } from '@components/atoms/Icon'
import { getNFTType } from '@libs/@talisman-nft'
import { NFTDetail } from '@libs/@talisman-nft/types'
import { useEffect, useMemo, useState } from 'react'

type NFTPreviewProps = {
  nft?: NFTDetail
  isFull?: boolean
  loading?: boolean
  isBlank?: boolean
}

const NFTPreview = ({ nft, isFull, loading, isBlank = false }: NFTPreviewProps) => {
  const [fetchedType, setFetchedType] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!fetchedType && nft?.mediaUri) {
      setIsLoading(true)
      getNFTType(nft?.mediaUri).then(type => {
        setFetchedType(type)
      })
      setIsLoading(false)
    }
  }, [fetchedType, nft?.mediaUri])

  const effectiveType = useMemo(() => {
    if (isBlank) return 'blank'
    if (nft?.type) return nft?.type
    if (isLoading || loading) return 'loading'
    return fetchedType ?? undefined
  }, [nft?.type, isLoading, loading, fetchedType, isBlank])

  switch (effectiveType) {
    case 'image':
      return nft?.mediaUri ? (
        <img
          loading="lazy"
          src={`${nft?.mediaUri}${
            !isFull && !nft?.mediaUri.endsWith('gif' || 'jpeg' || 'jpg' || 'png')
              ? '?img-width=500&img-height=500&img-quality=50&img-onerror=redirect'
              : ''
          }`}
          alt={nft?.name ?? nft?.id}
        />
      ) : (
        <PlaceholderPreview icon={<Image />} text={'Image'} />
      )
    case 'video':
      return nft?.thumb && !isFull ? (
        <video poster={nft?.thumb}>
          <source src={nft?.thumb} />
        </video>
      ) : nft?.mediaUri ? (
        <video
          src={nft?.thumb ?? `${nft?.mediaUri}?stream=true`}
          onMouseOver={(event: any) => {
            event.target.play()
          }}
          onMouseOut={(event: any) => {
            event.target.pause()
            event.target.currentTime = 0
          }}
          loop
          muted
          playsInline
          preload="metadata"
          controlsList="nodownload"
        />
      ) : (
        <PlaceholderPreview icon={<Video />} text={'Video'} />
      )
    case 'pdf':
    case 'application':
      return nft?.thumb && !isFull ? (
        <img
          loading="lazy"
          src={nft?.thumb ?? `${nft?.mediaUri}?img-width=500&img-height=500&img-quality=50&img-onerror=redirect`}
          alt={nft?.name ?? nft?.id}
        />
      ) : nft?.mediaUri && isFull ? (
        <embed src={`${nft?.mediaUri}#toolbar=0`} />
      ) : (
        <PlaceholderPreview icon={<File />} text={'File'} />
      )
    case 'audio':
      return nft?.thumb && !isFull ? (
        <img
          loading="lazy"
          src={nft?.thumb ?? `${nft?.mediaUri}?img-width=500&img-height=500&img-quality=50&img-onerror=redirect`}
          alt={'nft?.name ?? nft?.id'}
        />
      ) : nft?.mediaUri && isFull ? (
        <>
          {nft?.thumb ? (
            <img loading="lazy" src={nft?.thumb} alt={nft?.name ?? nft?.id} />
          ) : (
            <PlaceholderPreview icon={<Volume2 />} text={'Audio'} />
          )}
          <audio controls css={{ position: 'absolute', bottom: '0px' }}>
            <source src={nft?.mediaUri} />
          </audio>
        </>
      ) : (
        <PlaceholderPreview icon={<Volume2 />} text={'Audio'} />
      )
    case 'model':
      if (!nft?.mediaUri) return <PlaceholderPreview icon={<Box />} text={'Model'} />
      const modelProps = {
        'src': nft?.mediaUri,
        'alt': nft?.name ?? nft?.id,
        'autoplay': true,
        'shadow-intensity': '1',
        'ar-status': 'not-presenting',
        'auto-rotate': isFull ? false : true,
        'rotation-per-second': isFull ? '0deg' : '30deg',
        'cameraControls': isFull ? true : false,
      }
      return <model-viewer {...modelProps} />
    case 'loading':
      return (
        <div
          css={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <CircularProgressIndicator size={30} />
        </div>
      )
    case 'blank':
      return null
    default:
      return <PlaceholderPreview icon={<Unknown />} text={'Unknown'} />
  }
}

export default NFTPreview
