// @vitest-environment node
import { readFileSync } from "node:fs"
import { gunzipSync } from "node:zlib"
import { describe, expect, it } from "vitest"

import { encodeAnyAddress as encodeAnyAddressTyped } from "@/ui/utils/encodeAnyAddress"
import { tryParseSubstrateOrEthereumAddress } from "@/util/addressValidation"

import { encodeAnyAddress, isEthereumAddress } from "./addresses"

const ALICE = "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d"
const ALICE_GENERIC = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
const ALICE_POLKADOT = "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5"
const ALICE_KUSAMA = "HNZata7iMYWmk5RvZRTiAsSDhV8366zq2YGb3tLH5Upf74F"
const VITALIK = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

describe("address helpers, as polkadot.js wrote them on main", () => {
	it("encodes a public key as generic, Polkadot and Kusama addresses", () => {
		expect(encodeAnyAddress(ALICE)).toBe(ALICE_GENERIC)
		expect(encodeAnyAddress(ALICE, 0)).toBe(ALICE_POLKADOT)
		expect(encodeAnyAddress(ALICE, 2)).toBe(ALICE_KUSAMA)
		expect(encodeAnyAddress(ALICE_KUSAMA, 0)).toBe(ALICE_POLKADOT)
		expect(tryParseSubstrateOrEthereumAddress(ALICE_POLKADOT)).toBe(ALICE_GENERIC)
	})

	it("checksums Ethereum addresses", () => {
		expect(encodeAnyAddress(VITALIK.toLowerCase(), 0)).toBe(VITALIK)
		expect(encodeAnyAddressTyped(VITALIK.toUpperCase().replace("0X", "0x"))).toEqual({
			type: "ethereum",
			address: VITALIK,
		})
		expect(isEthereumAddress(VITALIK)).toBe(true)
	})

	it("rejects invalid input and broken checksums", () => {
		expect(() => encodeAnyAddress("alice.eth")).toThrow()
		expect(() => encodeAnyAddress(`${ALICE_GENERIC.slice(0, -1)}Z`)).toThrow()
		expect(() => encodeAnyAddress(`${VITALIK.slice(0, -1)}6`, 0)).toThrow()
		expect(encodeAnyAddressTyped(`${VITALIK.slice(0, -1)}6`)).toEqual({
			type: undefined,
			address: `${VITALIK.slice(0, -1)}6`,
		})
		expect(tryParseSubstrateOrEthereumAddress(`${ALICE_GENERIC.slice(0, -1)}Z`)).toBeUndefined()
		expect(
			tryParseSubstrateOrEthereumAddress(ALICE, { acceptSubstratePublicKey: false })
		).toBeUndefined()
	})
})

type FrozenCase = { fn: string; input: string; format?: number } & (
	| { value: unknown }
	| { throws: true }
)

const FUNCTIONS: Record<string, (input: string, format?: number) => unknown> = {
	"ui encodeAnyAddress": encodeAnyAddressTyped,
	"@talismn/util encodeAnyAddress": encodeAnyAddress,
	"@talismn/util isEthereumAddress": isEthereumAddress,
	tryParseSubstrateOrEthereumAddress: (input) => tryParseSubstrateOrEthereumAddress(input),
	"tryParseSubstrateOrEthereumAddress without public keys": (input) =>
		tryParseSubstrateOrEthereumAddress(input, { acceptSubstratePublicKey: false }),
}

const frozen = JSON.parse(
	gunzipSync(readFileSync(new URL("./fixtures/addresses.pjs.json.gz", import.meta.url))).toString()
) as FrozenCase[]

const outcomeOf = (run: () => unknown) => {
	try {
		return { value: run() ?? null }
	} catch {
		return { throws: true }
	}
}

describe.each(Object.keys(FUNCTIONS))("%s", (name) => {
	const cases = frozen.filter(({ fn }) => fn === name)

	it("returns what polkadot.js returned on main for every frozen input", () => {
		const encode = FUNCTIONS[name]!
		const mismatches = cases.flatMap(({ fn: _fn, input, format, ...expected }) => {
			const actual = outcomeOf(() => encode(input, format))
			return JSON.stringify(actual) === JSON.stringify(expected)
				? []
				: [{ input, format, expected, actual }]
		})
		expect(cases.length).toBeGreaterThanOrEqual(300)
		expect(mismatches).toEqual([])
	})
})
