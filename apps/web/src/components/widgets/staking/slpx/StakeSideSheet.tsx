import { SlpxAddStakeForm } from '@components/recipes/AddStakeDialog'
import { useAccountSelector } from '@components/widgets/AccountSelector'
import { writeableEvmAccountsState } from '@domains/accounts'
import { glmrSlpxPair, useMintForm, type SlpxPair } from '@domains/staking/slpx'
import { Zap } from '@talismn/icons'
import { PolkadotApiIdProvider } from '@talismn/react-polkadot-api'
import { InfoCard, SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR, SideSheet, Surface, Text } from '@talismn/ui'
import { Maybe } from '@util/monads'
import { Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { useSwitchNetwork } from 'wagmi'
import UnlockDuration from './UnlockDuration'

type AddStakeSideSheetProps = {
  slpxPair: SlpxPair
  onRequestDismiss: () => unknown
}

const AddStakeSideSheet = (props: AddStakeSideSheetProps) => {
  const [account, accountSelector] = useAccountSelector(useRecoilValue(writeableEvmAccountsState), 0)

  const { switchNetworkAsync } = useSwitchNetwork()

  const {
    input: { amount, localizedFiatAmount },
    setAmount,
    newDestTokenAmount: newAmount,
    available,
    mint,
    rate,
    ready,
    error,
  } = useMintForm(account, props.slpxPair)

  return (
    <SideSheet
      title={
        <div>
          <Zap /> Stake
        </div>
      }
      onRequestDismiss={props.onRequestDismiss}
      css={{ [SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { width: '48rem' } }}
    >
      <Surface css={{ padding: '1.6rem', borderRadius: '1.6rem' }}>
        <SlpxAddStakeForm
          confirmState={!ready ? 'disabled' : mint.isLoading ? 'pending' : undefined}
          accountSelector={accountSelector}
          amount={amount}
          fiatAmount={localizedFiatAmount ?? '...'}
          newAmount={newAmount?.toHuman() ?? '...'}
          newFiatAmount={null}
          onChangeAmount={setAmount}
          availableToStake={available?.toHuman() ?? '...'}
          rate={Maybe.of(rate).mapOr(
            '...',
            rate => `1 ${props.slpxPair.nativeToken.symbol} = ${rate.toLocaleString()} ${props.slpxPair.vToken.symbol}`
          )}
          onConfirm={async () => {
            await switchNetworkAsync?.(props.slpxPair.chainId)
            await mint.writeAsync()
          }}
          onRequestMaxAmount={() => {
            if (available !== undefined) {
              setAmount(available.toString())
            }
          }}
          isError={error !== undefined}
          inputSupportingText={error?.message}
        />
      </Surface>
      <div css={{ 'display': 'flex', 'gap': '1.6rem', 'marginTop': '1.6rem', 'flexWrap': 'wrap', '> *': { flex: 1 } }}>
        <InfoCard headlineText="Rewards" text="4%" />
        <InfoCard
          headlineText="Unbonding period"
          text={
            <Suspense fallback="...">
              <UnlockDuration slpxPair={props.slpxPair} />
            </Suspense>
          }
        />
      </div>
      <Text.Body as="p" css={{ marginTop: '4.8rem' }}>
        vGLMR (voucher GLMR) is a liquid staking token of GLMR, with fully underlying GLMR reserve and yield-bearing
        feature of GLMR staking reward.
      </Text.Body>
    </SideSheet>
  )
}

export default () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const open = searchParams.get('action') === 'stake' && searchParams.get('type') === 'slpx'

  if (!open) {
    return null
  }

  return (
    <PolkadotApiIdProvider id="wss://hk.p.bifrost-rpc.liebi.com/ws">
      <AddStakeSideSheet
        slpxPair={glmrSlpxPair}
        onRequestDismiss={() =>
          setSearchParams(sp => {
            sp.delete('action')
            sp.delete('type')
            return sp
          })
        }
      />
    </PolkadotApiIdProvider>
  )
}
