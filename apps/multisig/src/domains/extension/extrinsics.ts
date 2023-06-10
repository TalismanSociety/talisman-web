// Trying to create some semblance of sanity by moving extrinsic sending logic to a seperate file
// TODO: refactor code to remove repititon

import { Chain } from '@domains/chains'
import { ApiPromise, SubmittableResult, WsProvider } from '@polkadot/api'
import { web3FromAddress } from '@polkadot/extension-dapp'

export const createProxy = async (
  extensionAddress: string,
  chain: Chain,
  onSuccess: (proxyAddress: string) => void,
  onFailure: (r: string) => void
) => {
  const provider = new WsProvider(chain.rpc)
  const api = await ApiPromise.create({ provider })
  const signer = (await web3FromAddress(extensionAddress)).signer
  // @ts-ignore
  api.tx.proxy
    .createPure('Any', 0, 0)
    .signAndSend(
      extensionAddress,
      {
        signer,
      },
      result => {
        if (!result || !result.status) {
          return
        }

        if (result.status.isFinalized) {
          result.events
            .filter(({ event: { section } }) => section === 'proxy')
            .forEach(({ event }): void => {
              const { method, data } = event

              if (method === 'PureCreated') {
                // @ts-ignore
                const pure = data[0].toString()
                onSuccess(pure)
              }
            })

          result.events
            .filter(({ event: { section } }) => section === 'system')
            .forEach(({ event: { method } }): void => {
              if (method === 'ExtrinsicFailed') {
                onFailure(result.toString())
              }
            })
        } else if (result.isError) {
          onFailure(result.toString())
        }
      }
    )
    .catch(e => {
      onFailure(e.toString())
    })
}

// utils.batchAll(
//   balances.transferKeepAlive(proxyAddress, initialBalance)
//   proxy.proxy(proxyAddress, None, call(
//     utils.batchAll(
//       proxy.addProxy(multisigAddress, Any, 0)
//       proxy.removeProxy(setterUppererAddress)
//     )
//   )
// )
export const transferProxyToMultisig = async (
  extensionAddress: string,
  chain: Chain,
  proxyAddress: string,
  multisigAddress: string,
  reservedAmount: string,
  onSuccess: (r: SubmittableResult) => void,
  onFailure: (r: string) => void
) => {
  const provider = new WsProvider(chain.rpc)
  const api = await ApiPromise.create({ provider })
  const signer = (await web3FromAddress(extensionAddress)).signer

  // define the inner batch call
  // @ts-ignore
  const innerBatchCall = api.tx.utility.batchAll([
    // @ts-ignore
    api.tx.proxy.addProxy(multisigAddress, 'Any', 0),
    // @ts-ignore
    api.tx.proxy.removeProxy(extensionAddress, 'Any', 0),
  ])

  // create the outer call
  // @ts-ignore
  const outerCall = api.tx.proxy.proxy(proxyAddress, undefined, innerBatchCall)

  // define the outer batch call
  // @ts-ignore
  const batchCall = api.tx.utility.batchAll([
    // @ts-ignore
    api.tx.balances.transferKeepAlive(proxyAddress, reservedAmount),
    outerCall,
  ])

  // send the batch call
  batchCall
    .signAndSend(
      extensionAddress,
      {
        signer,
      },
      result => {
        if (!result || !result.status) {
          return
        }

        if (result.status.isFinalized) {
          result.events
            .filter(({ event: { section } }) => section === 'system')
            .forEach(({ event }): void => {
              if (event.method === 'ExtrinsicFailed') {
                onFailure(result.toString())
              } else if (event.method === 'ExtrinsicSuccess') {
                // TODO: make sure this doesnt fire if any inner calls fail
                onSuccess(result)
              }
            })
        } else if (result.isError) {
          onFailure(result.toString())
        }
      }
    )
    .catch(e => {
      onFailure(e.toString())
    })
}
