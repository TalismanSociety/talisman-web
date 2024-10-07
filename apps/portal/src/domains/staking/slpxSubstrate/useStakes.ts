import { SlpxSubstratePair } from './types'
import { selectedSubstrateAccountsState } from '@/domains/accounts'
import { useRecoilValueLoadable } from 'recoil'

const useStakes = ({ slpxSubstratePair }: { slpxSubstratePair: SlpxSubstratePair }) => {
  const accountsLoadable = useRecoilValueLoadable(selectedSubstrateAccountsState)
  const accounts = accountsLoadable.valueMaybe()
  console.log({ slpxSubstratePair })

  const data = accounts?.map(account => ({ account }))
  return data
}

export default useStakes
