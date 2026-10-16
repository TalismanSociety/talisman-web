import { fromBufferToBase58, getSs58AddressInfo } from "@polkadot-api/substrate-bindings"
import { fromHex } from "@polkadot-api/utils"
import { checksumAddress, isHex } from "viem"

const ACCOUNT_ID_LENGTHS = [32, 33]

const isEvenHex = (value: string) => isHex(value) && value.length % 2 === 0

const accountIdOf = (publicKey: Uint8Array) => {
	if (!ACCOUNT_ID_LENGTHS.includes(publicKey.length)) throw new Error("Invalid public key length")
	return publicKey
}

export const decodeAddress = (address: string) => {
	if (isEvenHex(address)) return fromHex(address)
	const info = getSs58AddressInfo(address)
	if (!info.isValid) throw new Error("Invalid address")
	return accountIdOf(info.publicKey)
}

export const encodeAddress = (key: string | Uint8Array, ss58Format = 42) =>
	fromBufferToBase58(ss58Format)(accountIdOf(typeof key === "string" ? decodeAddress(key) : key))

export const isValidEthereumAddress = (address: string) =>
	/^0x([0-9a-f]{40}|[0-9A-F]{40})$/.test(address) ||
	(/^0x[0-9a-fA-F]{40}$/.test(address) && checksumAddress(address as `0x${string}`) === address)

export const isEthereumAddress = (address: string | undefined): address is string =>
	!!address && address.startsWith("0x") && address.length === 42

export const encodeAnyAddress = (key: string, ss58Format?: number) => {
	try {
		return encodeAddress(key, ss58Format)
	} catch (error) {
		if (!isValidEthereumAddress(key)) throw error
		return checksumAddress(key as `0x${string}`)
	}
}
