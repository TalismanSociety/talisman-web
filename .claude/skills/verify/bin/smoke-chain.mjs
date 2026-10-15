#!/usr/bin/env node
import { createRequire } from "node:module"
import { fail, sleep } from "./lib.mjs"

const ETHEREUM_RPC = { 1: "https://ethereum-rpc.publicnode.com" }
const ETHERSCAN = { 1: "https://etherscan.io" }
const TIMEOUT = 180_000

const [submissionJson, signer] = process.argv.slice(2)
if (!submissionJson || !signer) fail("usage: smoke-chain.mjs <submission json> <signer address>", 2)
const submission = JSON.parse(submissionJson)

async function ethereum({ chainId, hash }) {
	const rpc = ETHEREUM_RPC[chainId] ?? fail(`no RPC for chain ${chainId} in smoke-chain.mjs`)
	const call = async (method, params) => {
		const reply = await (
			await fetch(rpc, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }) })
		).json()
		if (reply.error) throw new Error(`${method}: ${reply.error.message}`)
		return reply.result
	}
	const deadline = Date.now() + TIMEOUT
	while (Date.now() < deadline) {
		const receipt = await call("eth_getTransactionReceipt", [hash]).catch(() => null)
		if (receipt) {
			const wei = BigInt(receipt.gasUsed) * BigInt(receipt.effectiveGasPrice)
			return {
				hash,
				block: Number(receipt.blockNumber),
				success: receipt.status === "0x1",
				fee: `${Number(wei) / 1e18} ETH`,
				explorer: `${ETHERSCAN[chainId]}/tx/${hash}`,
			}
		}
		await sleep(3000)
	}
	return { hash, success: false, error: `no receipt within ${TIMEOUT / 1000}s` }
}

async function substrate({ url, extrinsic }) {
	const tools = process.env.SMOKE_TOOLS ?? fail("SMOKE_TOOLS names the directory holding @polkadot/api: smoke.sh sets it")
	const require = createRequire(`${tools}/package.json`)
	const { ApiPromise, WsProvider } = require("@polkadot/api")
	const { blake2AsHex } = require("@polkadot/util-crypto")
	const api = await ApiPromise.create({ provider: new WsProvider(url), noInitWarn: true })
	const hash = blake2AsHex(extrinsic)
	const seen = new Set()
	const find = async (blockHash) => {
		if (seen.has(blockHash)) return undefined
		seen.add(blockHash)
		const { block } = await api.rpc.chain.getBlock(blockHash)
		const index = block.extrinsics.findIndex((candidate) => candidate.toHex() === extrinsic)
		return index === -1 ? undefined : { blockHash, number: block.header.number.toNumber(), index }
	}
	try {
		const deadline = Date.now() + TIMEOUT
		let found
		while (!found && Date.now() < deadline) {
			let header = await api.rpc.chain.getHeader()
			for (let depth = 0; depth < 20 && !found; depth++) {
				found = await find(header.hash.toHex())
				header = await api.rpc.chain.getHeader(header.parentHash)
			}
			if (!found) await sleep(3000)
		}
		if (!found) return { hash, success: false, error: `not in a block within ${TIMEOUT / 1000}s` }
		const events = (await (await api.at(found.blockHash)).query.system.events()).filter(
			({ phase }) => phase.isApplyExtrinsic && phase.asApplyExtrinsic.toNumber() === found.index
		)
		const named = (section, method) => events.filter(({ event }) => event.section === section && event.method === method)
		const failed = named("system", "ExtrinsicFailed")[0]
		const error = failed && (() => {
			const dispatchError = failed.event.data[0]
			if (!dispatchError.isModule) return dispatchError.toString()
			const { section, name } = api.registry.findMetaError(dispatchError.asModule)
			return `${section}.${name}`
		})()
		const [decimals] = api.registry.chainDecimals
		const [symbol] = api.registry.chainTokens
		const amount = (planck) => `${Number(BigInt(planck.toString())) / 10 ** decimals} ${symbol}`
		const fee = named("transactionPayment", "TransactionFeePaid").map(({ event }) => amount(event.data[1].add(event.data[2])))
		const transfers = named("balances", "Transfer")
			.filter(({ event }) => event.data[0].toString() === api.createType("AccountId", signer).toString())
			.map(({ event }) => `${amount(event.data[2])} to ${event.data[1].toString()}`)
		return {
			chain: (await api.rpc.system.chain()).toString(),
			hash,
			block: found.number,
			blockHash: found.blockHash,
			index: found.index,
			success: named("system", "ExtrinsicSuccess").length > 0,
			...(error ? { error } : {}),
			fee: fee.join(", "),
			transfers,
			explorer: `https://polkadot.js.org/apps/?rpc=${encodeURIComponent(url)}#/explorer/query/${found.blockHash}`,
		}
	} finally {
		await api.disconnect()
	}
}

console.log(JSON.stringify(await (submission.extrinsic ? substrate(submission) : ethereum(submission))))
