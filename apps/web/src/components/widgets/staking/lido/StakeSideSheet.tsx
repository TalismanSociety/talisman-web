import { lidoMainnet } from '@domains/staking/lido'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import LidoWidgetSideSheet from './LidoWidgetSideSheet'

const StakeSideSheet = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const open = useMemo(
    () => searchParams.get('action') === 'stake' && searchParams.get('type') === 'lido',
    [searchParams]
  )

  if (open) {
    return (
      <LidoWidgetSideSheet
        url="https://stake.lido.fi/?ref=0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"
        lidoSuite={lidoMainnet}
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

  return null
}

export default StakeSideSheet
