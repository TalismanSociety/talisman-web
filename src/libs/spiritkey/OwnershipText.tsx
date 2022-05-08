import { StyledLoader } from '@components/Await'
import { useExtensionAutoConnect } from '@libs/talisman'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useFetchNFTs } from './useFetchNFTs'

export const OwnershipText = styled(({ className }) => {
  const { t } = useTranslation('spirit-keys')
  const { status } = useExtensionAutoConnect()
  const totalNFTs = useFetchNFTs()
  const nftLoading = totalNFTs === undefined
  const hasNfts = totalNFTs?.length > 0
  const total = hasNfts ? totalNFTs?.length : t('no')
  return (
    <>
      {status === 'OK' && nftLoading && <StyledLoader />}
      {!nftLoading && (
        <div className={className}>
          <Trans i18nKey="ownershipText" ns="spirit-keys" count={totalNFTs?.length}>
            You have <em>{{ total }}</em> Spirit Keys
          </Trans>
        </div>
      )}
    </>
  )
})`
  text-align: center;
  font-size: large;
  em {
    font-style: unset;
    color: var(--color-primary);
  }
`
