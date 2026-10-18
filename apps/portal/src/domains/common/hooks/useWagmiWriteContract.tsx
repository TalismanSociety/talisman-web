import type { MutateOptions } from "@tanstack/react-query"
import type { Abi, ContractFunctionArgs, ContractFunctionName, WriteContractErrorType } from "viem"
import type { Config, ResolvedRegister, UseWriteContractParameters } from "wagmi"
import { useConnection, useSwitchChain, useWriteContract } from "wagmi"
import type { WriteContractData, WriteContractVariables } from "wagmi/query"
import { track } from "@/domains/analytics/client"
import { contractFunctionOf, evmChainOf } from "@/domains/analytics/events/transactions"
import { Text } from "@/ui/atoms/Text"
import { ToastMessage } from "@/ui/molecules/ToastBar"
import { toast } from "@/ui/molecules/Toaster"

export const useWagmiWriteContract = <
	TConfig extends Config = ResolvedRegister["config"],
	TContext = unknown,
>(
	config?: UseWriteContractParameters<TConfig, TContext>
) => {
	const switchChain = useSwitchChain()
	const { chain } = useConnection()

	const { writeContract: _, ...base } = useWriteContract(config)

	return {
		...base,
		writeContractAsync: async <
			const TAbi extends Abi | readonly unknown[],
			TFunctionName extends ContractFunctionName<TAbi, "nonpayable" | "payable">,
			TArgs extends ContractFunctionArgs<TAbi, "nonpayable" | "payable", TFunctionName>,
			TChainId extends TConfig["chains"][number]["id"],
		>(
			{
				etherscanUrl,
				...variables
			}: WriteContractVariables<TAbi, TFunctionName, TArgs, TConfig, TChainId> & {
				etherscanUrl: string
			},
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
				await switchChain.mutateAsync({ chainId: variables.chainId })
			}

			const promise = base.mutateAsync(
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
				error: "Your transaction was unsuccessful",
				success: (hash) => {
					const url = new URL(`/tx/${hash}`, etherscanUrl)
					return (
						<ToastMessage
							headlineContent="Your transaction was successful"
							supportingContent={
								<Text.Body as="div">
									View details on{" "}
									<Text.Body as="a" alpha="high" href={url.toString()} target="_blank">
										Etherscan
									</Text.Body>
								</Text.Body>
							}
						/>
					)
				},
			})

			void promise.then(() =>
				track("Write to EVM contract", {
					chain: evmChainOf(variables.chainId ?? chain?.id),
					functionName: contractFunctionOf(variables.functionName),
				})
			)

			return await promise
		},
	}
}
