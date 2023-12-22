import { Text, toast } from '@talismn/ui'
import { Maybe } from '@util/monads'
import { type WriteContractMode } from '@wagmi/core'
import { type Abi } from 'abitype'
import { usePostHog } from 'posthog-js/react'
import { useContractWrite, useNetwork, useSwitchNetwork, type UseContractWriteConfig } from 'wagmi'

/**
 * PostHog can't handle BigInt
 */
const sanitizePostHogProperties = (object: unknown) => {
  if (typeof object === 'bigint') {
    return object.toString()
  }

  if (typeof object !== 'object' || object === null) {
    return object
  }

  return Object.fromEntries(
    Object.entries(object).map(([key, value]): [any, any] => [key, sanitizePostHogProperties(value)])
  )
}

export const useWagmiContractWrite = <
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined
>({
  etherscanUrl,
  ...config
}: UseContractWriteConfig<TAbi, TFunctionName, TMode> & {
  etherscanUrl: string
}) => {
  const posthog = usePostHog()
  const { switchNetworkAsync } = useSwitchNetwork()
  const { chain } = useNetwork()

  // @ts-expect-error
  const { write: _, ...base } = useContractWrite(config)

  return {
    ...base,
    writeAsync: Maybe.of(base.writeAsync).mapOrUndefined(writeAsync => async (...args: any[]) => {
      if (config.chainId !== undefined && chain?.id !== config.chainId) {
        await switchNetworkAsync?.(config.chainId)
      }

      const promise = writeAsync(...args)
      void toast.promise(promise, {
        loading: (
          <>
            <Text.Body as="div" alpha="high">
              Your transaction is pending...
            </Text.Body>
            <Text.Body as="div">Your transaction has been confirmed</Text.Body>
          </>
        ),
        error: (
          <Text.Body as="div" alpha="high">
            Your transaction was unsuccessful
          </Text.Body>
        ),
        success: result => {
          const url = new URL('/tx/' + result.hash, etherscanUrl)
          return (
            <>
              <Text.Body as="div" alpha="high">
                Your transaction was successful
              </Text.Body>
              {etherscanUrl && (
                <Text.Body as="div">
                  View details on{' '}
                  <Text.Body as="a" alpha="high" href={url.toString()} target="_blank">
                    Etherscan
                  </Text.Body>
                </Text.Body>
              )}
            </>
          )
        },
      })

      void promise.then(result =>
        posthog.capture('Write to EVM contract', {
          chainId: config.chainId,
          hash: result.hash,
          contractAddress: config.address,
          functionName: config.functionName,
          ...('args' in config ? { args: sanitizePostHogProperties(config.args) } : undefined),
          ...('value' in config ? { value: sanitizePostHogProperties(config.value) } : undefined),
        })
      )

      return await promise
    }) as (typeof base)['writeAsync'],
  }
}
