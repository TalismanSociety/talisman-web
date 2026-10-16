import { blake2b } from "@noble/hashes/blake2.js"
import { fromHex } from "@polkadot-api/utils"
import { base58 } from "@scure/base"
import { checksumAddress } from "viem"

const GENERIC_SS58_FORMAT = 42
const DECODED_LENGTHS = [1, 2, 4, 8, 32, 33]
const ENCODED_LENGTHS = [3, 4, 6, 10, 35, 36, 37, 38]
const RESERVED_SS58_FORMATS = [46, 47]
const SS58_HASH_PREFIX = new TextEncoder().encode("SS58PRE")

const ss58Hash = (bytes: Uint8Array) =>
	blake2b(Uint8Array.of(...SS58_HASH_PREFIX, ...bytes), { dkLen: 64 })

const isHex = (value: string) =>
	(value === "0x" || /^0x[\da-fA-F]+$/.test(value)) && value.length % 2 === 0

const isPublicKeyLength = (length: number) => length === 32 || length === 33

export const decodeAddress = (address: string) => {
	if (!address) throw new Error("Invalid empty address")
	if (isHex(address)) return fromHex(address)
	const decoded = base58.decode(address)
	if (!ENCODED_LENGTHS.includes(decoded.length)) throw new Error("Invalid decoded address length")
	const first = decoded[0] ?? 0
	const prefixLength = first & 0b0100_0000 ? 2 : 1
	const end = decoded.length - (isPublicKeyLength(decoded.length - prefixLength - 2) ? 2 : 1)
	const hash = ss58Hash(decoded.subarray(0, end))
	const checksumValid =
		decoded[end] === hash[0] && (end + 1 === decoded.length || decoded[end + 1] === hash[1])
	if ((first & 0b1000_0000) !== 0 || RESERVED_SS58_FORMATS.includes(first) || !checksumValid)
		throw new Error("Invalid decoded address checksum")
	return decoded.slice(prefixLength, end)
}

const ss58PrefixBytes = (ss58Format: number) =>
	ss58Format < 64
		? [ss58Format]
		: [
				((ss58Format & 0b0000_0000_1111_1100) >> 2) | 0b0100_0000,
				(ss58Format >> 8) | ((ss58Format & 0b0000_0000_0000_0011) << 6),
			]

export const encodeAddress = (
	key: string | Uint8Array,
	ss58Format: number = GENERIC_SS58_FORMAT
) => {
	const publicKey = typeof key === "string" ? decodeAddress(key) : key
	if (ss58Format < 0 || ss58Format > 16383 || RESERVED_SS58_FORMATS.includes(ss58Format))
		throw new Error("Out of range ss58Format specified")
	if (!DECODED_LENGTHS.includes(publicKey.length))
		throw new Error(`Expected a valid key to convert, with length ${DECODED_LENGTHS.join(", ")}`)
	const input = new Uint8Array([...ss58PrefixBytes(ss58Format), ...publicKey])
	const checksum = ss58Hash(input).subarray(0, isPublicKeyLength(publicKey.length) ? 2 : 1)
	return base58.encode(Uint8Array.of(...input, ...checksum))
}

export const isValidEthereumAddress = (address: string) =>
	address.length === 42 &&
	isHex(address) &&
	(/^0x[0-9a-f]{40}$/.test(address) ||
		/^0x[0-9A-F]{40}$/.test(address) ||
		checksumAddress(address as `0x${string}`) === address)

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
