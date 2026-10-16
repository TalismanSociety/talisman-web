import { isAddress as isEvmAddress, isHex } from "viem"

import { decodeAddress, encodeAddress } from "@/util/addresses"

export const tryParseSubstrateOrEthereumAddress = (
	address: string,
	options = { acceptSubstratePublicKey: true }
) => {
	if (isEvmAddress(address)) {
		return address
	}

	if (isHex(address) && !options.acceptSubstratePublicKey) {
		return undefined
	}

	try {
		return encodeAddress(decodeAddress(address))
	} catch (_error) {
		return undefined
	}
}
