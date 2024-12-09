import type { MutateOptions } from '@tanstack/react-query'
import type { Abi, ContractFunctionArgs, ContractFunctionName, WriteContractErrorType } from 'viem'
import type { Config, ResolvedRegister, UseWriteContractParameters } from 'wagmi'
import type { WriteContractData, WriteContractVariables } from 'wagmi/query'
import { Text, toast, ToastMessage } from '@talismn/ui'
import { usePostHog } from 'posthog-js/react'
import { useAccount, useSwitchChain, useWriteContract } from 'wagmi'

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.entries(object).map(([key, value]): [any, any] => [key, sanitizePostHogProperties(value)])
  )
}

export const useWagmiWriteContract = <TConfig extends Config = ResolvedRegister['config'], TContext = unknown>(
  config?: UseWriteContractParameters<TConfig, TContext>
) => {
  const posthog = usePostHog()
  const { switchChainAsync } = useSwitchChain()
  const { chain } = useAccount()

  const { writeContract: _, ...base } = useWriteContract(config)

  return {
    ...base,
    writeContractAsync: async <
      const TAbi extends Abi | readonly unknown[],
      TFunctionName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'>,
      TArgs extends ContractFunctionArgs<TAbi, 'nonpayable' | 'payable', TFunctionName>,
      TChainId extends TConfig['chains'][number]['id']
    >(
      {
        etherscanUrl,
        ...variables
      }: WriteContractVariables<TAbi, TFunctionName, TArgs, TConfig, TChainId> & { etherscanUrl: string },
      options?:
        | MutateOptions<
            WriteContractData,
            WriteContractErrorType,
            WriteContractVariables<
              TAbi,
              TFunctionName,
              TArgs,
              TConfig,
              TChainId,
              // use `functionName` to make sure it's not union of all possible function names
              TFunctionName
            >,
            TContext
          >
        | undefined
    ) => {
      if (variables.chainId !== undefined && chain?.id !== variables.chainId) {
        await switchChainAsync({ chainId: variables.chainId })
      }

      const promise = base.writeContractAsync(
        // @ts-expect-error
        variables,
        options
      )
      void toast.promise(promise, {
        loading: (
          <ToastMessage
            headlineContent="Your transaction is pending..."
            supportingContent="Your transaction has been confirmed"
          />
        ),
        error: 'Your transaction was unsuccessful',
        success: hash => {
          const url = new URL('/tx/' + hash, etherscanUrl)
          return (
            <ToastMessage
              headlineContent="Your transaction was successful"
              supportingContent={
                <Text.Body as="div">
                  View details on{' '}
                  <Text.Body as="a" alpha="high" href={url.toString()} target="_blank">
                    Etherscan
                  </Text.Body>
                </Text.Body>
              }
            />
          )
        },
      })

      void promise.then(result =>
        posthog.capture('Write to EVM contract', {
          chainId: variables.chainId,
          hash: result,
          contractAddress: variables.address,
          functionName: variables.functionName,
          ...('args' in variables ? { args: sanitizePostHogProperties(variables.args) } : undefined),
          ...('value' in variables ? { value: sanitizePostHogProperties(variables.value) } : undefined),
        })
      )

      return await promise
    },
  }
}
