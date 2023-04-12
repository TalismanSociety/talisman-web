import TokenSelectorDialog, { TokenSelectorItem } from '@components/recipes/TokenSelectorDialog'
import TransferDialogComponent from '@components/recipes/TransferDialog'
import TransferFormComponent from '@components/recipes/TransferForm'
import { substrateAccountsState } from '@domains/accounts/recoils'
import { balancesState } from '@domains/balances/recoils'
import { useAssetsWithBalances, useWayfinder, useXcmBalances, useXcmSender } from '@talismn/wayfinder-react'
import Decimal from '@util/Decimal'
import { Maybe } from '@util/monads'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useSearchParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import AccountSelector from './AccountSelector'

const WAYFINDER_SQUID = 'https://squid.subsquid.io/wayfinder/v/0/graphql'
const TOAST_ID = 'XCM_TRANSACTION'

const TransferForm = () => {
  const accounts = useRecoilValue(substrateAccountsState)

  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])

  const {
    status: wayfinderStatus,
    inputs: { dispatch, ...inputs },
    all,
    filtered,
  } = useWayfinder(WAYFINDER_SQUID)

  const chaindataBalances = useRecoilValue(balancesState)
  const balances = useXcmBalances(WAYFINDER_SQUID, chaindataBalances as any, inputs.sender ? inputs.sender : addresses)

  useAssetsWithBalances(balances, assets => dispatch({ setAssets: assets }))

  const selectedRoute = filtered.routes?.length === 1 ? filtered.routes[0] : undefined
  const rpcs = selectedRoute ? all.sourcesMap[selectedRoute.from.id]?.rpcs ?? [] : []

  const { status, send } = useXcmSender(
    WAYFINDER_SQUID,
    balances,
    Maybe.of(inputs.sender).mapOrUndefined(address => ({ address })),
    inputs.recipient,
    selectedRoute,
    rpcs,
    inputs.amount
  )

  const [tokenSelectorOpen, setTokenSelectorOpen] = useState(false)

  const selectedToken = Maybe.of(inputs.token).mapOrUndefined(x => all.tokensMap[x])

  const selectedTokenBalance = useMemo(() => {
    if (selectedToken === undefined) return

    const selectedTokenBalance = balances
      .filter(balance => balance.token.id === inputs.token && balance.chain.id === inputs.from)
      .reduce((sum, balance) => sum + BigInt(balance.amount), 0n)
      .toString()
    return Decimal.fromPlanck(selectedTokenBalance, selectedToken.decimals, selectedToken.symbol)
  }, [balances, inputs.from, inputs.token, selectedToken])

  const inputError = useMemo(() => {
    if (selectedTokenBalance !== undefined && selectedToken !== undefined && inputs.amount !== undefined) {
      const input = Decimal.fromUserInput(inputs.amount, selectedToken.decimals, selectedToken.symbol)

      if (input.planck.gt(selectedTokenBalance.planck)) {
        return 'Insufficient balance'
      }
    }
  }, [inputs.amount, selectedToken, selectedTokenBalance])

  const disabled = 'INIT' in status || 'LOADING' in status || inputs.amount?.trim() === '' || inputError !== undefined

  const pending = 'PROCESSING' in status || 'SUBMITTING' in status

  const isBiDirectionalRoute = all.routes?.some(
    x =>
      x.token.id === inputs.token &&
      x.from.id === inputs.to &&
      x.to.id === inputs.from &&
      inputs.assets?.some(({ chainId, tokenId }) => chainId === x.from.id && tokenId === x.token.id)
  )

  useEffect(() => {
    if (pending) {
      toast.loading('Your transaction is pending...', { id: TOAST_ID })
    }

    if ('ERROR' in status) {
      toast.error(status.ERROR, { id: TOAST_ID })
    }

    if ('TX_SUCCESS' in status) {
      toast.success('Your transaction was successful', { id: TOAST_ID })
    }

    if ('TX_FAILED' in status) {
      toast.error('Your transaction failed', { id: TOAST_ID })
    }
  }, [pending, status])

  return (
    <>
      <TransferFormComponent
        loading={wayfinderStatus === 'loading'}
        accountSelector={
          <AccountSelector
            selectedAccount={inputs.sender}
            onChangeSelectedAccount={account => dispatch({ setSender: account?.address })}
          />
        }
        selectedTokenBalance={selectedTokenBalance?.toHuman()}
        fromNetworks={filtered.sources.map(x => ({ name: x.name, logoSrc: x.logo }))}
        selectedFromNetworkIndex={filtered.sources.findIndex(x => x.id === inputs.from)}
        onSelectFromNetworkIndex={useCallback(
          index => dispatch({ setFrom: Maybe.of(index).mapOrUndefined(x => filtered.sources[x]?.id) }),
          [dispatch, filtered.sources]
        )}
        toNetworks={filtered.destinations.map(x => ({ name: x.name, logoSrc: x.logo }))}
        selectedToNetworkIndex={filtered.destinations.findIndex(x => x.id === inputs.to)}
        onSelectToNetworkIndex={useCallback(
          index => dispatch({ setTo: Maybe.of(index).mapOrUndefined(x => filtered.destinations[x]?.id) }),
          [dispatch, filtered.destinations]
        )}
        canReverseNetworkRoute={isBiDirectionalRoute}
        onReverseNetworkRoute={useCallback(
          () => dispatch({ setFrom: inputs.to, setTo: inputs.from }),
          [dispatch, inputs.from, inputs.to]
        )}
        token={Maybe.of(inputs.token)
          .map(x => all.tokensMap[x])
          .mapOrUndefined(x => ({
            name: x.name,
            logoSrc: x.logo,
          }))}
        onRequestTokenChange={useCallback(() => setTokenSelectorOpen(true), [])}
        amount={inputs.amount ?? ''}
        onChangeAmount={useCallback(value => dispatch({ setAmount: value }), [dispatch])}
        onConfirmTransfer={send}
        confirmTransferState={disabled ? 'disabled' : pending ? 'pending' : undefined}
        inputError={inputError}
      />
      <TokenSelectorDialog
        open={tokenSelectorOpen}
        onRequestDismiss={useCallback(() => setTokenSelectorOpen(false), [])}
      >
        {all.tokens
          ?.map(x => ({
            ...x,
            balance: Decimal.fromPlanck(
              balances
                .filter(balance => balance.token.id === x.id)
                .reduce((sum, balance) => sum + BigInt(balance.amount), 0n)
                .toString(),
              x.decimals,
              x.symbol
            ),
          }))
          .sort((a, b) => b.balance.planck.cmp(a.balance.planck))
          .map(x => {
            const chain = Maybe.of(x.chains.find(y => y.isNative)?.chain.id).mapOrUndefined(
              y => all.sourcesMap[y] ?? all.destinationsMap[y]
            )
            return (
              <TokenSelectorItem
                logoSrc={x.logo}
                name={x.name}
                networkLogoSrc={chain?.logo}
                network={chain?.name ?? ''}
                amount={x.balance.toHuman()}
                fiatAmount=""
                disabled={x.balance.planck.isZero()}
                onClick={() => {
                  if (!filtered.tokens.some(y => y.id === x.id)) {
                    dispatch({ setFrom: undefined, setTo: undefined, setToken: x.id })
                  } else {
                    dispatch({ setToken: x.id })
                  }
                  setTokenSelectorOpen(false)
                }}
              />
            )
          })}
      </TokenSelectorDialog>
    </>
  )
}

const TransferDialog = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const open = searchParams.get('action') === 'teleport'

  return (
    <TransferDialogComponent
      open={open}
      onRequestDismiss={() => setSearchParams(new URLSearchParams())}
      transferForm={
        <Suspense>
          <TransferForm />
        </Suspense>
      }
    />
  )
}

export default TransferDialog
