import { lidoSuitesState } from '@domains/staking/lido/recoils'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import LidoWidgetSideSheet from './LidoWidgetSideSheet'

const StakeSideSheet = () => {
  const lidoSuites = useRecoilValue(lidoSuitesState)
  const [searchParams, setSearchParams] = useSearchParams()

  const open = useMemo(
    () => searchParams.get('action') === 'stake' && searchParams.get('type') === 'lido',
    [searchParams]
  )

  const lidoSuite = useMemo(
    () => lidoSuites.find(x => x.token.address === searchParams.get('token-address')),
    [lidoSuites, searchParams]
  )

  if (!open) {
    return null
  }

  if (lidoSuite === undefined) {
    throw new Error(`No lido token with address: ${searchParams.get('token-address') ?? ''}`)
  }

  return (
    <LidoWidgetSideSheet
      url="https://stake.lido.fi/?ref=0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"
      lidoSuite={lidoSuite}
      onRequestDismiss={() =>
        setSearchParams(sp => {
          sp.delete('action')
          sp.delete('type')
          return sp
        })
      }
    />
  )
}

export default StakeSideSheet
