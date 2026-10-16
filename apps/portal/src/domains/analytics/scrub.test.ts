import { describe, expect, it } from "vitest"
import { scrubEvent } from "./scrub"

const ORIGIN = "https://app.talisman.xyz"
const UUID = "3f2a9c1e-8b7d-4e6f-a5b4-c3d2e1f0a9b8"
const SS58 = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
const SS58_2 = "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5"
const EVM = "0x9858EfFD232B4033E47d90003D41EC34EcaEda94"
const HASH = `0x${"ab12".repeat(16)}`
const CALLDATA = `0x0503${"00".repeat(40)}`
const DAVE = "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y"
const BARE_EVM = "d8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
const SDK_ID = "01a12ec6-99af-77c8-a0ea-965a98c6e0f9"
const IPV4 = "192.168.1.42"

const scrubPageview = (properties: Record<string, unknown>) =>
	scrubEvent({ event: "$pageview", properties }, ORIGIN).properties

const scrubExtrinsic = (properties: Record<string, unknown>) =>
	scrubEvent({ event: "Extrinsic in block", properties }, ORIGIN).properties

describe("scrubEvent URLs", () => {
	it.each([
		[`${ORIGIN}/staking/providers?account=${SS58}`, `${ORIGIN}/staking/providers`],
		[
			`${ORIGIN}/staking/providers?action=stake&type=nomination-pools&chain=polkadot-asset-hub&account=${SS58}&pool=12`,
			`${ORIGIN}/staking/providers`,
		],
		[`${ORIGIN}/staking/positions?address=${EVM}#rewards`, `${ORIGIN}/staking/positions`],
		[`${ORIGIN}/portfolio/${SS58}`, `${ORIGIN}/portfolio/:rest`],
		[`${ORIGIN}/portfolio/assets/${HASH}?calldata=${CALLDATA}`, `${ORIGIN}/portfolio/:rest`],
		[`${ORIGIN}/portfolio/?account=${SS58}`, `${ORIGIN}/portfolio`],
		[`${ORIGIN}/transport/xcm?from=${SS58}&to=${SS58_2}`, `${ORIGIN}/transport/:rest`],
		[`${ORIGIN}/staking/`, `${ORIGIN}/staking`],
		[`${ORIGIN}/`, `${ORIGIN}/`],
		[`${ORIGIN}/${SS58}/unknown`, `${ORIGIN}/:unknown`],
		[`${ORIGIN}/assets/index-B2x9.js?v=${UUID}#${SS58}`, `${ORIGIN}/:unknown`],
		[`https://polkadot.js.org/apps/?rpc=wss://x#/accounts/${SS58}`, "https://polkadot.js.org"],
		[`https://${EVM}.example.com/private?account=${SS58}`, "https://<address>.example.com"],
		[`https://${BARE_EVM}.example.com/`, "https://<address>.example.com"],
		[`https://${SS58.toLowerCase()}.example.com/`, "https://<address>.example.com"],
		[`https://${DAVE}.example.com/`, "https://<address>.example.com"],
		[`https://${"a".repeat(32)}.example.com/`, "https://<address>.example.com"],
		[`https://${"a".repeat(31)}.example.com/`, `https://${"a".repeat(31)}.example.com`],
		[`http://${IPV4}:3000/staking?account=${SS58}`, "http://<ip>"],
		["http://[::1]:8080/x", "http://<ip>"],
	])("%s becomes %s", (url, expected) => {
		expect(
			scrubPageview({
				$current_url: url,
				$referrer: url,
				$initial_current_url: url,
				$session_entry_url: url,
				$session_entry_referrer: url,
			})
		).toEqual({
			$current_url: expected,
			$referrer: expected,
			$initial_current_url: expected,
			$session_entry_url: expected,
			$session_entry_referrer: expected,
		})
	})

	it("keeps $direct and host names", () => {
		expect(
			scrubPageview({
				$referrer: "$direct",
				$referring_domain: "$direct",
				$host: "app.talisman.xyz",
			})
		).toEqual({ $referrer: "$direct", $referring_domain: "$direct", $host: "app.talisman.xyz" })
	})

	it("redacts IP and address-like hosts", () => {
		expect(
			scrubPageview({
				$host: `${IPV4}:3000`,
				$referring_domain: "[::1]:8080",
				$initial_referring_domain: `${BARE_EVM}.example.com`,
			})
		).toEqual({
			$host: "<ip>",
			$referring_domain: "<ip>",
			$initial_referring_domain: "<address>.example.com",
		})
	})

	it("drops a URL or path field that is neither a URL, a path nor $direct", () => {
		expect(
			scrubPageview({ $current_url: "Alice", $referrer: "Alice", $pathname: "Alice" })
		).toEqual({})
	})

	it("maps every pathname property to its route pattern", () => {
		expect(
			scrubPageview({
				$pathname: `/portfolio/${SS58}`,
				$prev_pageview_pathname: "/staking/providers/",
				$session_entry_pathname: "/staking/positions",
				$initial_pathname: `/${SS58}`,
			})
		).toEqual({
			$pathname: "/portfolio/:rest",
			$prev_pageview_pathname: "/staking/providers",
			$session_entry_pathname: "/staking/positions",
			$initial_pathname: "/:unknown",
		})
	})
})

describe("scrubEvent metadata", () => {
	it.each([
		[`signer ${SS58}`, "signer <address>"],
		[`evm ${EVM}.`, "evm <address>."],
		[`failed for ${BARE_EVM}`, "failed for <address>"],
		[`tx ${HASH}`, "tx <hash>"],
		[`bare ${"ab".repeat(32)}`, "bare <hash>"],
		[`call ${CALLDATA}`, "call <hash>"],
		[`pool ${UUID.toUpperCase()}`, "pool <id>"],
	])("%s becomes %s", (text, expected) => {
		expect(scrubPageview({ $os: text })).toEqual({ $os: expected })
	})

	it("sends the page title only when it is the portal's own title", () => {
		expect(scrubPageview({ title: "Talisman Portal" })).toEqual({ title: "Talisman Portal" })
		expect(scrubPageview({ title: `${SS58} | Talisman Portal` })).toEqual({})
		expect(scrubPageview({ title: "Talisman Portal | Alice" })).toEqual({})
	})

	it("keeps the SDK's own ids and numbers", () => {
		const fields = {
			token: "phc_test",
			distinct_id: SDK_ID,
			$device_id: SDK_ID,
			$session_id: SDK_ID,
			$window_id: SDK_ID,
			$pageview_id: SDK_ID,
			$process_person_profile: false,
			$is_identified: false,
			$screen_width: 1920,
			$browser_version: null,
		}
		expect(scrubExtrinsic(fields)).toEqual(fields)
	})
})

describe("scrubEvent keys", () => {
	it("sends only the keys the SDK table or the event's catalog names", () => {
		expect(
			scrubPageview({
				route: "/staking",
				$os: "Linux",
				message: "Transfer from Alice failed",
				[SS58]: 1,
				"Alice failed": true,
				[IPV4]: 2,
				$exception_message: "boom",
				$set: { portfolioBalances: [{ addressDigest: "ab".repeat(64) }] },
				context: { [BARE_EVM]: true },
			})
		).toEqual({ route: "/staking", $os: "Linux" })
	})

	it("drops an object or an array under a listed key", () => {
		expect(scrubPageview({ $os: { name: "Alice" }, $browser: [SS58] })).toEqual({})
	})

	it("drops every legacy property of the five portal events", () => {
		expect(
			scrubExtrinsic({
				chain: "polkadot-asset-hub",
				module: "nominationPools",
				section: "join",
				chainProperties: { ss58Format: 0, tokenSymbol: ["DOT"] },
				args: { amount: "1000000000", pool_id: "12" },
				parentCall: { module: "utility", section: "batchAll" },
				hash: HASH,
				contractAddress: EVM,
				chainId: 1,
				functionName: "stake",
				value: "1000",
			})
		).toEqual({ chain: "polkadot-asset-hub", module: "nominationPools", section: "join" })
	})

	it("bounds $set and $set_once by the same table", () => {
		const event = scrubEvent(
			{
				event: "$pageview",
				properties: {},
				$set: { substrateExtensions: ["talisman"], $os: "Linux" },
				$set_once: {
					$initial_current_url: `${ORIGIN}/staking/providers?account=${SS58}`,
					$initial_person_info: { r: "$direct", u: `${ORIGIN}/portfolio/${SS58}` },
				},
			},
			ORIGIN
		)
		expect(event).toEqual({
			event: "$pageview",
			properties: {},
			$set: { $os: "Linux" },
			$set_once: { $initial_current_url: `${ORIGIN}/staking/providers` },
		})
	})
})

describe("scrubEvent catalog", () => {
	it("keeps a catalog value of the event's own catalog property", () => {
		expect(scrubPageview({ route: "/staking/providers" })).toEqual({ route: "/staking/providers" })
		expect(scrubExtrinsic({ parent_section: "batchAll" })).toEqual({ parent_section: "batchAll" })
	})

	it("drops a catalog property whose value is outside the catalog", () => {
		expect(scrubPageview({ route: "Alice" })).toEqual({})
		expect(scrubExtrinsic({ chain: SS58, module: "Alice" })).toEqual({})
	})

	it("drops a catalog property on an event whose catalog does not declare it", () => {
		expect(scrubExtrinsic({ route: "/staking" })).toEqual({})
		expect(scrubPageview({ chain: "polkadot-asset-hub" })).toEqual({})
	})
})
