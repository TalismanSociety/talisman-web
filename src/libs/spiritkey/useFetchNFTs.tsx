import { useAllAccountAddresses } from '@libs/talisman'
import { encodeAnyAddress } from '@talismn/util'
import { useEffect, useMemo, useState } from 'react'
import { NFTConsolidated } from 'rmrk-tools/dist/tools/consolidator/consolidator'

import { fetchNFTData } from './spirit-key'

export function useFetchNFTs() {
  const [totalNFTs, setNFTs] = useState<NFTConsolidated[]>()
  const accountAddresses = useAllAccountAddresses()
  const encoded = useMemo(() => accountAddresses?.map(account => encodeAnyAddress(account, 2)), [accountAddresses])

  useEffect(() => {
    fetchNFTData(setNFTs, encoded as string[])
  }, [setNFTs, encoded])

  return totalNFTs
}
