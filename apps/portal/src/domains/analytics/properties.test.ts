import { describe, expect, it } from "vitest"
import { isPropertyValue, p, USD_BUCKETS, usdBucketOf } from "./properties"

describe("enum properties", () => {
	const wallet = p.enum(["talisman", "other"], "Wallet")

	it.each(["talisman", "other"])("accepts the listed value %s", (value) => {
		expect(isPropertyValue(wallet, value)).toBe(true)
	})

	it.each([
		"Talisman",
		"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
		"",
		["talisman"],
		1,
		undefined,
		null,
	])("rejects %j", (value) => {
		expect(isPropertyValue(wallet, value)).toBe(false)
	})
})

describe("boolean properties", () => {
	const handled = p.bool("Handled")

	it.each([true, false])("accepts %j", (value) => {
		expect(isPropertyValue(handled, value)).toBe(true)
	})

	it.each(["true", 1, 0, null, undefined])("rejects %j", (value) => {
		expect(isPropertyValue(handled, value)).toBe(false)
	})
})

describe("enum list properties", () => {
	const symbols = p.enumList(["DOT", "TAO", "other"], "Symbols")

	it.each([[[]], [["DOT"]], [["DOT", "TAO", "other"]]])("accepts %j", (value) => {
		expect(isPropertyValue(symbols, value)).toBe(true)
	})

	it.each([
		[["DOT", "SHADYCOIN"]],
		[["DOT", "DOT"]],
		[["dot"]],
		[[1]],
		["DOT"],
		[{ 0: "DOT" }],
		[undefined],
	])("rejects %j", (value) => {
		expect(isPropertyValue(symbols, value)).toBe(false)
	})
})

describe("USD buckets", () => {
	it.each([
		[0, "<10"],
		[9.99, "<10"],
		[10, "10-100"],
		[99.99, "10-100"],
		[100, "100-1k"],
		[999.99, "100-1k"],
		[1_000, "1k-10k"],
		[9_999.99, "1k-10k"],
		[10_000, "10k-100k"],
		[99_999.99, "10k-100k"],
		[100_000, "100k+"],
		[1e12, "100k+"],
		[Number.POSITIVE_INFINITY, "100k+"],
		[-5, "<10"],
		[Number.NaN, "<10"],
	])("puts $%d in %s", (usd, bucket) => {
		expect(usdBucketOf(usd)).toBe(bucket)
	})

	it("only ever returns a listed bucket", () => {
		const bucket = p.enum(USD_BUCKETS, "Bucket")
		for (const usd of [0, 10, 1e3, 1e5, Number.NaN]) {
			expect(isPropertyValue(bucket, usdBucketOf(usd))).toBe(true)
		}
	})
})
