import type { LidoSuite } from '@domains/staking/lido'
import { ClassNames } from '@emotion/react'
import { SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR, SideSheet, Text } from '@talismn/ui'
import { Zap } from '@talismn/web-icons'
import { useEffect } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'

export type LidoWidgetSideSheetProps = {
  url: string
  lidoSuite: LidoSuite
  onRequestDismiss: () => unknown
}

const LidoWidgetSideSheet = (props: LidoWidgetSideSheetProps) => {
  const { chain } = useAccount()
  const { switchChain } = useSwitchChain()

  useEffect(() => {
    if (chain?.id !== props.lidoSuite.chain.id) {
      switchChain({ chainId: props.lidoSuite.chain.id })
    }
  }, [chain?.id, props.lidoSuite.chain.id, switchChain])

  return (
    <ClassNames>
      {({ css }) => (
        <SideSheet
          title={
            <>
              <Zap /> Stake
            </>
          }
          onRequestDismiss={props.onRequestDismiss}
          css={{
            display: 'flex',
            flexDirection: 'column',
          }}
          contentContainerClassName={css({ flex: 1, padding: '0 !important' })}
        >
          <Text.H4
            as="div"
            css={{
              textAlign: 'center',
              [SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { width: '55rem' },
            }}
          >
            Lido widget is currently under maintenance
          </Text.H4>
        </SideSheet>
      )}
    </ClassNames>
  )
}

export default LidoWidgetSideSheet
