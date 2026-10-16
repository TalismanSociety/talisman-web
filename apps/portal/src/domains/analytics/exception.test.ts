import { describe, expect, it } from "vitest"
import {
	createExceptionThrottle,
	ERROR_CLASSES,
	EXCEPTION_THROTTLE,
	errorClassOf,
	ownFrames,
	toExceptionProperties,
} from "./exception"

const ORIGIN = "https://app.talisman.xyz"
const SS58 = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
const BARE_EVM = "d8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

const admitAll = () => true

describe("errorClassOf", () => {
	it.each([...ERROR_CLASSES])("keeps the error class %s", (type) => {
		expect(errorClassOf(type)).toBe(type)
	})

	it.each([
		["an account name", "Alice"],
		["a class-shaped team name", "MySecretTeam"],
		["a class-shaped vault name", "TreasuryVault"],
		["a custom error class", "VaultError"],
		["free text", "Secret Vault"],
		["a lowercase name", "alice"],
		["an email", "bob@example.com"],
		["an address", `E${BARE_EVM}`],
		["an SS58 address", `X${SS58}`],
		["an empty name", ""],
	])("sends Error for %s", (_, type) => {
		expect(errorClassOf(type)).toBe("Error")
	})

	it("sends Error for a synthetic exception, whatever its type", () => {
		expect(errorClassOf("TypeError", true)).toBe("Error")
	})
})

const MAIN = `${ORIGIN}/assets/main-Ab12Cd34.js`
const CHUNK = `${ORIGIN}/assets/staking-DJ7LAi8J.js`
const isLoadedScript = (filename: string) => [MAIN, CHUNK].includes(filename)
const CHUNK_ID = "0f8fad5b-d9cb-469f-a165-70867728950e"

describe("ownFrames", () => {
	it("keeps the frames of loaded scripts with their positions, never a function name", () => {
		expect(
			ownFrames(
				[
					{ filename: MAIN, lineno: 9, colno: 10, chunk_id: CHUNK_ID },
					{ filename: CHUNK, lineno: 3 },
				],
				isLoadedScript
			)
		).toEqual([
			{
				platform: "web:javascript",
				filename: MAIN,
				function: "?",
				lineno: 9,
				colno: 10,
				chunk_id: CHUNK_ID,
				in_app: true,
			},
			{ platform: "web:javascript", filename: CHUNK, function: "?", lineno: 3, in_app: true },
		])
	})

	it("drops a chunk id that is not one", () => {
		expect(ownFrames([{ filename: MAIN, chunk_id: "Alice" }], isLoadedScript)).toEqual([
			{ platform: "web:javascript", filename: MAIN, function: "?", in_app: true },
		])
	})

	it.each([
		["a forged hashed asset", `${ORIGIN}/assets/AliceVault-Ab12Cd34.js`],
		["a forged name of 8 letters", `${ORIGIN}/assets/Alice-Guardian.js`],
		["a forged dotted asset", `${ORIGIN}/assets/kumquat.Guardians-abcdefgh.js`],
		["an unhashed asset", `${ORIGIN}/assets/AliceVault.js`],
		["an asset named after an address", `${ORIGIN}/assets/${SS58}-Ab12Cd34.js`],
		["another origin", "https://evil.example/assets/main-Ab12Cd34.js"],
		["a page of the app", `${ORIGIN}/portfolio/${SS58}`],
		["a loaded script with a query", `${MAIN}?account=${SS58}`],
		["a message line parsed as a frame", "Transfer from Alice failed"],
		["no filename", undefined],
	])("drops a frame from %s", (_, filename) => {
		expect(ownFrames([{ filename, lineno: 1 }], isLoadedScript)).toEqual([])
	})
})

describe("toExceptionProperties", () => {
	it("sends the category as the root value and nothing as a cause's value", () => {
		expect(
			toExceptionProperties(
				{
					$exception_list: [
						{
							type: "TypeError",
							value: "Transfer from Alice failed",
							mechanism: { type: "generic", handled: true, exception_id: 0 },
							module: "Alice",
						},
						{
							type: "Secret Vault",
							value: "Alice",
							mechanism: { type: "generic", exception_id: 1, parent_id: 0, source: "cause" },
						},
					],
					error_category: "network",
					mechanism: "uncaught",
				},
				isLoadedScript,
				admitAll
			)
		).toEqual({
			$exception_list: [
				{
					type: "TypeError",
					value: "network",
					mechanism: { type: "uncaught", handled: false, exception_id: 0 },
				},
				{
					type: "Error",
					value: "",
					mechanism: {
						type: "chained",
						handled: false,
						exception_id: 1,
						parent_id: 0,
						source: "cause",
					},
				},
			],
			$exception_level: "error",
			exception_type: "TypeError",
			error_category: "network",
			mechanism: "uncaught",
			handled: false,
		})
	})

	it("falls back to unknown and caught for values outside their catalog", () => {
		expect(
			toExceptionProperties(
				{ $exception_list: [{ type: "Error" }], error_category: "Alice", mechanism: "Alice" },
				isLoadedScript,
				admitAll
			)
		).toMatchObject({ error_category: "unknown", mechanism: "caught", handled: true })
	})

	it.each([
		["no exception list", {}],
		["an empty exception list", { $exception_list: [] }],
		["an exception list that is not a list", { $exception_list: "Alice" }],
	])("drops an exception with %s", (_, properties) => {
		expect(toExceptionProperties(properties, isLoadedScript, admitAll)).toBeUndefined()
	})

	it("keys the throttle by the thrown type and message, and drops what it refuses", () => {
		const keys: string[] = []
		const properties = { $exception_list: [{ type: "TypeError", value: "boom" }] }
		const refuse = (key: string) => {
			keys.push(key)
			return false
		}
		expect(toExceptionProperties(properties, isLoadedScript, refuse)).toBeUndefined()
		expect(keys).toEqual(["TypeError: boom"])
	})
})

describe("createExceptionThrottle", () => {
	it("admits three of a key and thirty in total per window", () => {
		const admit = createExceptionThrottle()
		const same = Array.from({ length: 5 }, () => admit("same", 0))
		const distinct = Array.from({ length: 40 }, (_, i) => admit(`distinct ${i}`, 0))
		expect(same).toEqual([true, true, true, false, false])
		expect(distinct.filter(Boolean)).toHaveLength(EXCEPTION_THROTTLE.total - 3)
		expect(admit("same", EXCEPTION_THROTTLE.windowMs - 1)).toBe(false)
		expect(admit("same", EXCEPTION_THROTTLE.windowMs)).toBe(true)
	})
})
