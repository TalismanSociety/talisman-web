import { checksumAddress } from "viem"

import { encodeAddress, isValidEthereumAddress } from "@/util/addresses"

export const encodeAnyAddress = (key: string, ss58Format?: number | undefined) => {
	if (typeof key === "string" && isValidEthereumAddress(key)) {
		return { type: "ethereum", address: checksumAddress(key as `0x${string}`) } as const
	}

	try {
		return { type: "substrate", address: encodeAddress(key, ss58Format) } as const
	} catch {
		/* empty */
	}

	return { type: undefined, address: key } as const
}
