import { useAccounts, useAllAccountAddresses, useBalances } from '@libs/talisman'
import { formatDecimals, planckToTokens } from '@talismn/util'
import { useAssetsWithBalances, useWayfinder, useXcmBalances, useXcmSender } from '@talismn/wayfinder-react'

const WAYFINDER_SQUID =
  ((import.meta as any).env as Record<string, string | undefined>)?.VITE_WAYFINDER_SQUID ??
  'https://squid.subsquid.io/wayfinder/v/0/graphql'

export default function XcmDemo() {
  const accounts = useAccounts()
  const addresses = useAllAccountAddresses()

  const {
    inputs: { dispatch, ...inputs },
    all,
    filtered,
  } = useWayfinder(WAYFINDER_SQUID)

  const { balances } = useBalances()
  const xcmBalances = useXcmBalances(WAYFINDER_SQUID, balances, inputs.sender ? inputs.sender : addresses)
  useAssetsWithBalances(xcmBalances, assets => dispatch({ setAssets: assets }))

  const sender = accounts.find(({ address }) => address === inputs.sender)
  const selectedRoute = filtered.routes?.length === 1 ? filtered.routes[0] : undefined
  const rpcs = selectedRoute ? all.sourcesMap[selectedRoute.from.id]?.rpcs ?? [] : []
  const { status, send } = useXcmSender(
    WAYFINDER_SQUID,
    xcmBalances,
    sender,
    inputs.recipient,
    selectedRoute,
    rpcs,
    inputs.amount
  )

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ padding: '2em', width: '25%' }}>
        <h2>User Input</h2>
        <form
          onSubmit={e => {
            e.stopPropagation()
            e.preventDefault()
            send()
          }}
        >
          <fieldset>
            <legend>From Account</legend>
            <select
              style={{ width: '100%' }}
              value={inputs.sender ?? '-1'}
              onChange={e => dispatch({ setSender: e.target.value === '-1' ? undefined : e.target.value })}
            >
              <option value={-1}>Select</option>
              {accounts.map(({ name, address }) => (
                <option key={address} value={address}>
                  {name}
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset style={{ display: 'flex' }}>
            <legend>Source Chain</legend>
            <select
              style={{ width: '100%' }}
              disabled={!!inputs.from}
              value={inputs.from ?? '-1'}
              onChange={e => dispatch({ setFrom: e.target.value === '-1' ? undefined : e.target.value })}
            >
              <option value={'-1'}>Select</option>
              <optgroup label="Available">
                {(filtered.sources ?? []).map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Unavailable">
                {(all.sources ?? [])
                  .filter(source => !filtered.sources.some(({ id }) => id === source.id))
                  .map(({ id, name }) => (
                    <option key={id} value={id} disabled={true}>
                      {name}
                    </option>
                  ))}
              </optgroup>
            </select>
            <button type="button" onClick={() => dispatch({ setFrom: undefined })}>
              x
            </button>
          </fieldset>

          <fieldset style={{ display: 'flex' }}>
            <legend>Destination Chain</legend>
            <select
              style={{ width: '100%' }}
              disabled={!!inputs.to}
              value={inputs.to ?? '-1'}
              onChange={e => dispatch({ setTo: e.target.value === '-1' ? undefined : e.target.value })}
            >
              <option value={'-1'}>Select</option>
              <optgroup label="Available">
                {(filtered.destinations ?? []).map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Unavailable">
                {(all.destinations ?? [])
                  .filter(destination => !filtered.destinations.some(({ id }) => id === destination.id))
                  .map(({ id, name }) => (
                    <option key={id} value={id} disabled={true}>
                      {name}
                    </option>
                  ))}
              </optgroup>
            </select>
            <button type="button" onClick={() => dispatch({ setTo: undefined })}>
              x
            </button>
          </fieldset>

          <fieldset style={{ display: 'flex' }}>
            <legend>Destination Token</legend>
            <select
              style={{ width: '100%' }}
              disabled={!!inputs.token}
              value={inputs.token ?? '-1'}
              onChange={e => dispatch({ setToken: e.target.value === '-1' ? undefined : e.target.value })}
            >
              <option value={'-1'}>Select</option>
              <optgroup label="Available">
                {(filtered.tokens ?? []).map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Unavailable">
                {(all.tokens ?? [])
                  .filter(token => !filtered.tokens.some(({ id }) => id === token.id))
                  .map(({ id, name }) => (
                    <option key={id} value={id} disabled={true}>
                      {name}
                    </option>
                  ))}
              </optgroup>
            </select>
            <button type="button" onClick={() => dispatch({ setToken: undefined })}>
              x
            </button>
          </fieldset>

          <fieldset>
            <legend>Amount</legend>
            <input
              style={{ width: '100%' }}
              type="number"
              min="0"
              max="10000000"
              step="any"
              value={parseFloat(inputs.amount ?? '0')}
              onChange={e => dispatch({ setAmount: e.target.value.length < 1 ? undefined : e.target.value })}
            />
          </fieldset>

          <button disabled={!('READY' in status)}>{'LOADING' in status ? 'Loading' : 'Submit'}</button>
          <button
            type="button"
            disabled={'PROCESSING' in status || 'SUBMITTING' in status}
            onClick={() => dispatch({ reset: true })}
          >
            Reset
          </button>

          {'ERROR' in status && <div>ERROR</div>}
          {'ERROR' in status && <div>{status.ERROR}</div>}
          {'SUBMITTING' in status && <div>{status.SUBMITTING}</div>}
          {'TX_SUCCESS' in status && (
            <div>
              <a href={status.TX_SUCCESS.url}>TX success</a>
            </div>
          )}
          {'TX_FAILED' in status && (
            <div>
              <a href={status.TX_FAILED.url}>TX failed</a>
            </div>
          )}
        </form>
      </div>

      <div style={{ padding: '2em', width: '25%' }}>
        <h2>Selected Inputs</h2>

        <pre>
          <p>
            <strong>Account</strong>
            <br />
            {inputs.sender
              ? (account => (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>{account?.name ?? 'Not found'}</div>
                    <div style={{ opacity: '0.5' }}>
                      ({inputs.sender.substring(0, 4)}...{inputs.sender.substring(inputs.sender.length - 4)})
                    </div>
                  </div>
                ))(accounts.find(({ address }) => address === inputs.sender))
              : 'None'}
          </p>
          <p>
            <strong>Assets</strong>
            <br />
            {(inputs.assets ?? [])
              .map(asset => ({
                asset,
                chain: { ...all.destinationsMap, ...all.sourcesMap }[asset.chainId],
                token: all.tokensMap[asset.tokenId],
                balance: xcmBalances
                  .filter(balance => balance.chain.id === asset.chainId && balance.token.id === asset.tokenId)
                  .reduce((sum, balance) => sum + BigInt(balance.amount), 0n)
                  .toString(),
              }))
              .filter(({ balance }) => balance !== '0')
              .map(
                ({ chain, token, balance }) =>
                  `${chain?.name ?? 'Unknown'}: ${formatDecimals(planckToTokens(balance, token?.decimals))} ${
                    token?.symbol ?? 'Unknown'
                  }`
              )
              .join('\n')}
          </p>
          <p>
            <strong>Source</strong>
            <br />
            {inputs.from ?? 'None'}
          </p>
          <p>
            <strong>Destination</strong>
            <br />
            {inputs.to ?? 'None'}
          </p>
          <p>
            <strong>Token</strong>
            <br />
            {inputs.token ?? 'None'}
          </p>
          <p>
            <strong>Amount</strong>
            <br />
            {inputs.amount ?? 'None'}
          </p>
        </pre>
      </div>

      <div style={{ padding: '2em', width: '25%' }}>
        <h2>Routes</h2>
        <pre>
          <p>
            <strong>Filtered (by user assets/input)</strong>
          </p>
          {(filtered.routes ?? []).map(({ id, from, to, token }) => (
            <p key={id}>
              Route {id}
              <br />
              {`${all.sourcesMap[from.id]?.name} --${all.tokensMap[token.id]?.symbol}-> ${
                all.destinationsMap[to.id]?.name
              }`}
            </p>
          ))}
        </pre>
      </div>
    </div>
  )
}
