import { useTheme } from '@emotion/react'
import { Button } from '@talismn/ui/atoms/Button'
import { useSetRecoilState } from 'recoil'

import { walletConnectionSideSheetOpenState } from '@/components/widgets/WalletConnectionSideSheet'
import { useHasActiveWalletConnection } from '@/domains/extension/main'

export const WalletConnectionButton = () => {
  const theme = useTheme()
  const setOpen = useSetRecoilState(walletConnectionSideSheetOpenState)

  const hasActiveConnection = useHasActiveWalletConnection()

  const connectionColor = hasActiveConnection ? '#38D448' : theme.color.onSurface

  return (
    <Button
      variant="surface"
      leadingIcon={
        <div
          css={{
            position: 'relative',
            width: '1.4rem',
            height: '1.4rem',
            border: `0.2rem solid color-mix(in srgb, ${connectionColor}, transparent 70%)`,
            borderRadius: '0.7rem',
          }}
        >
          <div css={{ position: 'absolute', inset: '0.2rem', borderRadius: '50%', backgroundColor: connectionColor }} />
        </div>
      }
      onClick={() => setOpen(true)}
    >
      {hasActiveConnection ? 'Connected' : 'Connect wallet'}
    </Button>
  )
}
