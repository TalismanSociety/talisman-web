import { evmSignableAccountsState, writeableEvmAccountsState } from '../../../../domains/accounts'
import { ChainProvider } from '../../../../domains/chains'
import { slpxPairsState, useMintForm, type SlpxPair } from '../../../../domains/staking/slpx'
import { Maybe } from '../../../../util/monads'
import { SlpxAddStakeForm } from '../../../recipes/AddStakeDialog'
import { useAccountSelector } from '../../AccountSelector'
import { walletConnectionSideSheetOpenState } from '../../WalletConnectionSideSheet'
import Apr from './Apr'
import UnlockDuration from './UnlockDuration'
import {
  Button,
  CircularProgressIndicator,
  InfoCard,
  SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR,
  SideSheet,
  Surface,
  Text,
} from '@talismn/ui'
import { Zap } from '@talismn/web-icons'
import { Suspense, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRecoilValue, useSetRecoilState } from 'recoil'

type AddStakeSideSheetProps = {
  slpxPair: SlpxPair
  onRequestDismiss: () => unknown
}

const AddStakeSideSheet = (props: AddStakeSideSheetProps) => {
  const [[account], accountSelector] = useAccountSelector(useRecoilValue(evmSignableAccountsState), 0)
  const setWalletConnectionSideSheetOpen = useSetRecoilState(walletConnectionSideSheetOpenState)
  const writeableEvmAccounts = useRecoilValue(writeableEvmAccountsState)

  const {
    input: { amount, localizedFiatAmount },
    setAmount,
    newDestTokenAmount: newAmount,
    available,
    approvalNeeded,
    approve,
    approveTransaction,
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
      subtitle="SLPx liquid staking"
      onRequestDismiss={props.onRequestDismiss}
      css={{ [SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { width: '48rem' } }}
    >
      <div css={{ display: 'flex', gap: '1.6rem', marginBottom: '1.6rem', flexWrap: 'wrap', '> *': { flex: 1 } }}>
        <InfoCard
          overlineContent="Rewards"
          headlineContent={
            <Suspense fallback={<CircularProgressIndicator size="1em" />}>
              <Apr slpxPair={props.slpxPair} />
            </Suspense>
          }
        />
        <InfoCard
          overlineContent="Unbonding period"
          headlineContent={
            <Suspense fallback={<CircularProgressIndicator size="1em" />}>
              <UnlockDuration slpxPair={props.slpxPair} />
            </Suspense>
          }
        />
      </div>
      <Surface css={{ padding: '1.6rem', borderRadius: '1.6rem' }}>
        <SlpxAddStakeForm
          confirmState={
            !ready || +amount === 0
              ? 'disabled'
              : mint.isPending || approve.isPending || approveTransaction.isLoading
              ? 'pending'
              : undefined
          }
          approvalNeeded={approvalNeeded}
          accountSelector={
            writeableEvmAccounts.length > 0 ? (
              accountSelector
            ) : (
              <Button className="!w-full !rounded-[12px]" onClick={() => setWalletConnectionSideSheetOpen(true)}>
                Connect Ethereum Wallet
              </Button>
            )
          }
          amount={amount}
          fiatAmount={localizedFiatAmount ?? '...'}
          newAmount={newAmount?.toLocaleString() ?? '...'}
          newFiatAmount={null}
          onChangeAmount={setAmount}
          availableToStake={available?.toLocaleString() ?? '...'}
          rate={Maybe.of(rate).mapOr(
            '...',
            rate => `1 ${props.slpxPair.nativeToken.symbol} = ${rate.toLocaleString()} ${props.slpxPair.vToken.symbol}`
          )}
          onConfirm={async () => {
            if (approvalNeeded) {
              await approve.writeContractAsync()
            } else {
              await mint.writeContractAsync()
            }
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
      <Text.Body as="p" css={{ marginTop: '4.8rem' }}>
        {`Talisman has integrated the liquid staking protocol by Bifrost, which allows users to easily stake ${props.slpxPair.nativeToken.symbol}, without
        the need for complex staking processes. After staking, users receive ${props.slpxPair.vToken.symbol} (voucher ${props.slpxPair.nativeToken.symbol}), a liquid staking
          token of ${props.slpxPair.nativeToken.symbol}, which has fully underlying ${props.slpxPair.nativeToken.symbol} reserve and is directly yield bearing from ${props.slpxPair.nativeToken.symbol} rewards.

        `}
        <Text.Noop.A
          target="blank"
          href="https://bifrost.finance/news/bifrost-announces-the-official-launch-of-the-first-parachain-derivatives-v-glmr-and-v-movr"
        >
          Learn more
        </Text.Noop.A>
      </Text.Body>
    </SideSheet>
  )
}

export default () => {
  const slpxPairs = useRecoilValue(slpxPairsState)
  const [searchParams, setSearchParams] = useSearchParams()
  const open = searchParams.get('action') === 'stake' && searchParams.get('type') === 'slpx'

  const slpxPair = useMemo(
    () => slpxPairs.find(x => x.splx === searchParams.get('contract-address')),
    [searchParams, slpxPairs]
  )

  if (!open) {
    return null
  }

  if (slpxPair === undefined) {
    throw new Error(`No SLPx contract with address: ${searchParams.get('contract-address') ?? ''}`)
  }

  return (
    <ChainProvider
      chain={{
        genesisHash: slpxPair.substrateChainGenesisHash,
      }}
    >
      <AddStakeSideSheet
        slpxPair={slpxPair}
        onRequestDismiss={() =>
          setSearchParams(sp => {
            sp.delete('action')
            sp.delete('type')
            sp.delete('contract-address')
            return sp
          })
        }
      />
    </ChainProvider>
  )
}
