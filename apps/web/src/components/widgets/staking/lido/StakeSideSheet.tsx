import { SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR, SideSheet } from '@talismn/ui'
import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { mainnet, useSwitchNetwork } from 'wagmi'

const StakeSideSheet = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { switchNetwork } = useSwitchNetwork()

  const open = useMemo(
    () => searchParams.get('action') === 'stake' && searchParams.get('type') === 'lido',
    [searchParams]
  )

  useEffect(() => {
    if (open) {
      switchNetwork?.(mainnet.id)
    }
  }, [open, switchNetwork])

  if (open) {
    return (
      <SideSheet
        title="Lido staking"
        onRequestDismiss={() =>
          setSearchParams(sp => {
            sp.delete('action')
            sp.delete('type')
            return sp
          })
        }
        css={{
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          [SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { padding: 0 },
        }}
      >
        <iframe
          src="https://stake.lido.fi/?ref=0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"
          title="Lido Staking App"
          css={{ flex: 1, border: 'none', width: '100%', [SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { width: '55rem' } }}
        />
      </SideSheet>
    )
  }

  return null
}

export default StakeSideSheet
