import { toHex } from "@polkadot-api/utils"
import { camelCase } from "lodash"
import type { Transaction, TxCallData, TxEvent } from "polkadot-api"
import { getFakeTxCreator } from "polkadot-api/tx-creator"
import { useCallback, useContext, useMemo, useRef, useState } from "react"
import { firstValueFrom, map } from "rxjs"

import { track } from "@/domains/analytics/client"
import { callOf, palletOf, substrateChainOf } from "@/domains/analytics/events/transactions"
import { type ChainRuntime, getChainRuntime$ } from "@/domains/chains/chain-runtime"
import { networksByGenesisHash$ } from "@/domains/chains/chaindata-provider"
import { feeSpendableBalance, InsufficientFeeBalanceError } from "@/domains/chains/fee-balance"
import { customSignedExtensionsFor } from "@/domains/chains/signed-extensions"
import { type SubmitWatch, TxInvalidError, type TxResult, watchTx } from "@/domains/chains/submit"
import { txCreatorFor } from "@/domains/chains/tx-creator"
import { isSubscanUrl } from "@/domains/chains/utils"
import { AnalyticsContext } from "@/domains/common/analytics"
import { bumpChainReadId } from "@/domains/common/chainReadId"
import { HarmlessError } from "@/domains/common/errors"
import { toastExtrinsic } from "@/domains/common/utils/toast"
import type { Signer } from "@/domains/extension/signer"
import { signetAccount$, signetSdk } from "@/domains/extension/signet"

export type TxLoadable =
	| { state: "idle"; contents: undefined }
	| { state: "loading"; contents: TxEvent | undefined }
	| { state: "hasValue"; contents: TxResult }
	| { state: "hasError"; contents: unknown }

const IDLE_TX: TxLoadable = { state: "idle", contents: undefined }

export const useTxLoadableState = () => useState<TxLoadable>(IDLE_TX)

export type TxBuilder<Args extends unknown[]> = (
	runtime: ChainRuntime,
	...args: Args
) => Transaction | Promise<Transaction>

type CallName = { module: string; section: string }

const callName = ({ type, value }: TxCallData): CallName => ({
	module: camelCase(type),
	section: camelCase(value.type),
})

const batchedCalls = ({ type, value }: TxCallData): TxCallData[] => {
	const batch = type === "Utility" && value.type.startsWith("batch")
	const calls = (value.value as { calls?: TxCallData[] } | undefined)?.calls
	return batch && Array.isArray(calls) ? calls : []
}

const trackInBlock = (chainId: string, call: TxCallData) => {
	const chain = substrateChainOf(chainId)
	const root = callName(call)
	track("Extrinsic in block", {
		chain,
		module: palletOf(root.module),
		section: callOf(root.section),
	})
	for (const inner of batchedCalls(call)) {
		const name = callName(inner)
		track("Extrinsic in block", {
			chain,
			module: palletOf(name.module),
			section: callOf(name.section),
			parent_module: palletOf(root.module),
			parent_section: callOf(root.section),
		})
	}
}

const isHarmless = (error: unknown) =>
	(error instanceof Error && error.message === "Cancelled") ||
	(error instanceof TxInvalidError && error.reason === "Payment") ||
	error instanceof InsufficientFeeBalanceError

const sendThroughSignet = async (tx: Transaction): Promise<TxResult> => {
	const { ok, error, receipt } = await signetSdk().send(toHex(await tx.getEncodedData()))
	if (error !== undefined)
		throw new Error("Failed to approve transaction in Signet", { cause: error })
	if (ok && receipt !== undefined) throw new HarmlessError("Please ignore this message")
	throw new HarmlessError("Signet did not confirm the transaction")
}

export const estimateTxFee = (genesisHash: string, address: string, tx: Transaction) =>
	tx.getEstimatedFees(getFakeTxCreator(address), {
		customSignedExtensions: customSignedExtensionsFor(genesisHash),
	})

const canPayFee = (genesisHash: string, address: string, tx: Transaction, runtime: ChainRuntime) =>
	Promise.all([
		estimateTxFee(genesisHash, address, tx),
		feeSpendableBalance(runtime, address),
	]).then(
		([fee, spendable]) => fee <= spendable,
		() => true
	)

const submitTx = async (
	genesisHash: string,
	signer: Signer,
	tx: Transaction,
	runtime: ChainRuntime,
	watch: SubmitWatch
) => {
	const txCreator = await txCreatorFor(genesisHash, signer)
	if (!txCreator) throw new Error(`No connected wallet can sign for ${signer.address}`)
	if (!(await canPayFee(genesisHash, signer.address, tx, runtime)))
		throw new InsufficientFeeBalanceError()
	return watchTx(
		tx.createSubmitAndWatch(txCreator, {
			customSignedExtensions: customSignedExtensionsFor(genesisHash),
		}),
		runtime.lookup,
		watch
	)
}

const networkOf = (genesisHash: `0x${string}`) =>
	firstValueFrom(networksByGenesisHash$.pipe(map((networks) => networks[genesisHash])))

export const useTx = <Args extends unknown[]>(
	genesisHash: `0x${string}`,
	build: TxBuilder<Args>
) => {
	const analytics = useContext(AnalyticsContext)
	const [loadable, setLoadable] = useTxLoadableState()
	const builder = useRef(build)
	builder.current = build

	const signAndSend = useCallback(
		async (signer: Signer, ...args: Args) => {
			setLoadable((previous) => ({
				state: "loading",
				contents: previous.state === "loading" ? previous.contents : undefined,
			}))
			try {
				const [runtime, network, signetAccount] = await Promise.all([
					firstValueFrom(getChainRuntime$(genesisHash)),
					networkOf(genesisHash),
					firstValueFrom(signetAccount$),
				])
				const tx = await builder.current(runtime, ...args)
				const signingWithSignet = signetAccount?.address === signer.address
				const promise = signingWithSignet
					? sendThroughSignet(tx)
					: submitTx(genesisHash, signer, tx, runtime, {
							onEvent: (event) => setLoadable({ state: "loading", contents: event }),
							onInBestBlock: (event) => {
								if (event.ok && analytics.enabled && network)
									trackInBlock(network.id, tx.decodedCall)
							},
						})
				if (!signingWithSignet) {
					const { module, section } = callName(tx.decodedCall)
					toastExtrinsic(
						[[module, section]],
						promise,
						network?.blockExplorerUrls.find(isSubscanUrl)
					)
				}
				const result = await promise
				bumpChainReadId()
				setLoadable({ state: "hasValue", contents: result })
				return result
			} catch (error) {
				setLoadable({ state: "hasError", contents: error })
				throw isHarmless(error) ? new HarmlessError(error) : error
			}
		},
		[analytics.enabled, genesisHash]
	)

	return useMemo(() => ({ ...loadable, signAndSend }), [loadable, signAndSend])
}
