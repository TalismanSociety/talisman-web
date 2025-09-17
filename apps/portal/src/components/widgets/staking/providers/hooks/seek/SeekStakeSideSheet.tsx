import { Button } from '@talismn/ui/atoms/Button'
import { SurfaceChip } from '@talismn/ui/atoms/Chip'
import { Surface } from '@talismn/ui/atoms/Surface'
import { Text } from '@talismn/ui/atoms/Text'
import { Tooltip } from '@talismn/ui/atoms/Tooltip'
import { InfoCard } from '@talismn/ui/molecules/InfoCard'
import { SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR, SideSheet } from '@talismn/ui/molecules/SideSheet'
import { Clock, Zap } from '@talismn/web-icons'
import { formatDistance } from 'date-fns'
import { useSearchParams } from 'react-router-dom'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { AddStakeForm } from '@/components/recipes/AddStakeDialog'
import { useAccountSelector } from '@/components/widgets/AccountSelector'
import { walletConnectionSideSheetOpenState } from '@/components/widgets/WalletConnectionSideSheet'
import { evmSignableAccountsState, writeableEvmAccountsState } from '@/domains/accounts/recoils'
import { CHAIN_NAME, DEEK_TICKER } from '@/domains/staking/seek/constants'

import useGetSeekStakeApr from './hooks/useGetSeekStakeApr'
import useGetSeekStakeUnlockDuration from './hooks/useGetSeekStakeUnlockDuration'
import useStakeSeek from './hooks/useStakeSeek'

type AddStakeSideSheetProps = {
  onRequestDismiss: () => unknown
}

const AddStakeSideSheet = (props: AddStakeSideSheetProps) => {
  const [[account], accountSelector] = useAccountSelector(useRecoilValue(evmSignableAccountsState), 0)
  const setWalletConnectionSideSheetOpen = useSetRecoilState(walletConnectionSideSheetOpenState)
  const writeableEvmAccounts = useRecoilValue(writeableEvmAccountsState)
  const unlockDuration = useGetSeekStakeUnlockDuration()
  const monthlyAPR = useGetSeekStakeApr()

  const {
    available,
    newStakedTotal,
    setAmountInput,
    input: { amountInput },
  } = useStakeSeek({ account })

  return (
    <SideSheet
      title={
        <div className="flex items-center gap-2">
          <Zap />
          Stake
        </div>
      }
      subtitle="Talisman Staking"
      onRequestDismiss={props.onRequestDismiss}
      css={{ [SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { width: '48rem' } }}
    >
      <div css={{ display: 'flex', gap: '1.6rem', marginBottom: '1.6rem', flexWrap: 'wrap', '> *': { flex: 1 } }}>
        <InfoCard
          overlineContent="Rewards"
          headlineContent={
            <div>{monthlyAPR.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })}</div>
          }
        />
        <InfoCard overlineContent="Unbonding period" headlineContent={<div>{formatDistance(0, unlockDuration)}</div>} />
      </div>
      <Surface css={{ padding: '1.6rem', borderRadius: '1.6rem' }}>
        <AddStakeForm
          confirmState={
            // !ready || +amount === 0
            //   ? 'disabled'
            //   : mint.isPending || approve.isPending || approveTransaction.isLoading
            //   ? 'pending'
            //   : undefined
            'disabled'
          }
          // approvalNeeded={approvalNeeded}
          approvalNeeded={true}
          accountSelector={
            writeableEvmAccounts.length > 0 ? (
              accountSelector
            ) : (
              <Button className="!w-full !rounded-[12px]" onClick={() => setWalletConnectionSideSheetOpen(true)}>
                Connect Ethereum Wallet
              </Button>
            )
          }
          availableToStake={available?.toLocaleString()}
          amount={amountInput}
          fiatAmount=""
          newAmount={newStakedTotal.toLocaleString()}
          newFiatAmount={null}
          onChangeAmount={setAmountInput}
          onRequestMaxAmount={() => setAmountInput(available?.toString() ?? '')}
          onConfirm={() => console.log('confirm')}

          // )}
          // onConfirm={async () => {
          //   if (approvalNeeded) {
          //     try {
          //       await approve.writeContractAsync()
          //     } catch (error) {
          //       console.error(
          //         `An error occurred while approving allowance for asset: ${props.slpxPair.nativeToken.symbol}`,
          //         error
          //       )
          //     }
          //   } else {
          //     try {
          //       await mint.writeContractAsync()
          //       props.onRequestDismiss()
          //     } catch (error) {
          //       console.error(`An error occurred while staking asset: ${props.slpxPair.nativeToken.symbol}`, error)
          //     }
          //   }
          // }}
          // isError={error !== undefined}
          // inputSupportingText={error?.message}
        />
      </Surface>
      <Text.Body as="p" css={{ marginTop: '4.8rem' }}>
        {`To get started with SEEK Staking, you'll need ${DEEK_TICKER} on ${CHAIN_NAME}.`}{' '}
        <Text.Noop.A target="blank" href="https://talisman.xyz/">
          Learn more
        </Text.Noop.A>
      </Text.Body>
      <Text.Body as="p" css={{ marginTop: '1.6rem' }}>
        Make sure you have ETH on Ethereum Mainnet.
      </Text.Body>
      <div className="mt-2 flex justify-end">
        <Tooltip content="Transaction may take several minutes to complete">
          <SurfaceChip className="cursor-default">
            <Clock />
            5-10 minutes
          </SurfaceChip>
        </Tooltip>
      </div>
    </SideSheet>
  )
}
// HERE
export default () => {
  // const slpxPairs = useRecoilValue(slpxPairsState)
  const [searchParams, setSearchParams] = useSearchParams()
  const open = searchParams.get('action') === 'stake' && searchParams.get('type') === 'seek'

  // const slpxPair = useMemo(
  //   () => slpxPairs.find(x => x.splx === searchParams.get('contract-address')),
  //   [searchParams, slpxPairs]
  // )

  if (!open) {
    return null
  }

  // if (slpxPair === undefined) {
  //   throw new Error(`No SLPx contract with address: ${searchParams.get('contract-address') ?? ''}`)
  // }

  return (
    // <ChainProvider
    //   chain={{
    //     genesisHash: slpxPair.substrateChainGenesisHash,
    //   }}
    // >
    <AddStakeSideSheet
      // slpxPair={slpxPair}
      onRequestDismiss={() =>
        setSearchParams(sp => {
          sp.delete('action')
          sp.delete('type')
          sp.delete('contract-address')
          return sp
        })
      }
    />
    // </ChainProvider>
  )
}
