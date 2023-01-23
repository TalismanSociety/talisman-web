import SwapComponent from '@components/recipes/Swap'
import TokenSelectorDialog, { TokenSelectorItem } from '@components/recipes/TokenSelectorDialog'
import { substrateAccountsState } from '@domains/accounts/recoils'
import { extensionState } from '@domains/extension/recoils'
import { useBalances } from '@libs/talisman'
import { useAssetsWithBalances, useWayfinder, useXcmBalances, useXcmSender } from '@talismn/wayfinder-react'
import Decimal from '@util/Decimal'
import { Maybe } from '@util/monads'
import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useRecoilValue } from 'recoil'

const WAYFINDER_SQUID = 'https://squid.subsquid.io/wayfinder/v/0/graphql'
const TOAST_ID = 'XCM_TRANSACTION'

const Swap = () => {
  const accounts = useRecoilValue(substrateAccountsState)
  const extension = useRecoilValue(extensionState)

  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])

  const {
    inputs: { dispatch, ...inputs },
    all,
    filtered,
  } = useWayfinder(WAYFINDER_SQUID)

  const { balances: chaindataBalances } = useBalances()
  const balances = useXcmBalances(WAYFINDER_SQUID, chaindataBalances, inputs.sender ? inputs.sender : addresses)

  useAssetsWithBalances(balances, assets => dispatch({ setAssets: assets }))

  const sender = accounts.find(({ address }) => address === inputs.sender)
  const selectedRoute = filtered.routes?.length === 1 ? filtered.routes[0] : undefined
  const rpcs = selectedRoute ? all.sourcesMap[selectedRoute.from.id]?.rpcs ?? [] : []

  const { status, send } = useXcmSender(
    WAYFINDER_SQUID,
    balances,
    useMemo(
      () => Maybe.of(sender).mapOrUndefined(x => ({ ...x, signer: extension?.signer })),
      [sender, extension?.signer]
    ),
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
      <div css={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <SwapComponent
          accounts={accounts.map(x => ({
            name: x.name ?? x.address,
            address: x.address,
            balance: '',
          }))}
          selectedAccountIndex={accounts.findIndex(x => x.address === inputs.sender)}
          onSelectAccountIndex={useCallback(
            index => dispatch({ setSender: Maybe.of(index).mapOrUndefined(x => accounts[x]?.address) }),
            [accounts, dispatch]
          )}
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
      </div>
      <TokenSelectorDialog
        open={tokenSelectorOpen}
        onRequestDismiss={useCallback(() => setTokenSelectorOpen(false), [])}
      >
        {all.tokens?.map(x => {
          const balance = balances
            .filter(balance => balance.token.id === x.id)
            .reduce((sum, balance) => sum + BigInt(balance.amount), 0n)
            .toString()
          const decimal = Decimal.fromPlanck(balance, x.decimals, x.symbol)
          return (
            <TokenSelectorItem
              logoSrc={x.logo}
              name={x.name}
              network=""
              amount={decimal.toHuman()}
              fiatAmount=""
              onClick={() => {
                dispatch({ setToken: x.id })
                setTokenSelectorOpen(false)
              }}
            />
          )
        })}
      </TokenSelectorDialog>
    </>
  )
}

export default Swap
