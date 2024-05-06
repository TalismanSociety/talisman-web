import type { LidoSuite } from '@domains/staking/lido'
import { ClassNames } from '@emotion/react'
import { Zap } from '@talismn/web-icons'
import { SideSheet, SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR } from '@talismn/ui'
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
          <iframe
            src={props.url}
            css={{
              flex: 1,
              border: 'none',
              width: '100%',
              height: '100%',
              [SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { width: '55rem' },
            }}
          />
        </SideSheet>
      )}
    </ClassNames>
  )
}

export default LidoWidgetSideSheet
