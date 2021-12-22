import { StyledLoader } from '@components/Await'
import { useExtensionAutoConnect } from '@libs/talisman'
import styled from 'styled-components'

import { useFetchNFTs } from './useFetchNFTs'

export const OwnershipText = styled(({ className }) => {
  const { status } = useExtensionAutoConnect()
  const totalNFTs = useFetchNFTs()
  const nftLoading = totalNFTs === undefined
  const hasNfts = totalNFTs?.length > 0
  return (
    <>
      {status === 'OK' && nftLoading && <StyledLoader />}
      {!nftLoading && (
        <div className={className}>
          You have {hasNfts ? <em>{totalNFTs.length}</em> : 'no'} Spirit Key{totalNFTs.length === 1 ? '' : 's'}
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
