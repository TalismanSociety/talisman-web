// @vitest-environment node
import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { parse, stringify } from "yaml"

type Step = { uses?: string; run?: string }
type Job = { permissions?: Record<string, string>; env?: Record<string, string>; steps: Step[] }
type Workflow = { permissions: Record<string, string>; jobs: { generate: Job; publish: Job } }

const workflow: Workflow = parse(
	readFileSync(new URL("../../../.github/workflows/chaindata.yml", import.meta.url), "utf8")
)
const { generate, publish } = workflow.jobs

const stepKind = ({ uses, run }: Step) =>
	uses?.split("@")[0] ?? (run === undefined ? undefined : "run")

describe("chaindata workflow", () => {
	it("grants nothing at the top level", () => {
		expect(workflow.permissions).toEqual({})
	})

	it("grants generate read-only contents", () => {
		expect(generate.permissions).toEqual({ contents: "read" })
	})

	it("verifies the fresh chaindata before publishing", () => {
		expect(generate.steps.map(({ run }) => run).filter(Boolean)).toEqual(
			expect.arrayContaining(["pnpm --filter @talismn/portal chaindata", "pnpm verify"])
		)
	})

	it("publishes with checkout, download and one run step", () => {
		expect(publish.steps.map(stepKind)).toEqual([
			"actions/checkout",
			"actions/download-artifact",
			"run",
		])
	})

	it("publishes through a pull request from bot/chaindata", () => {
		expect(publish.env).toEqual({ BRANCH: "bot/chaindata" })
		expect(stringify(publish)).toMatch(/gh pr create/)
		expect(stringify(publish)).not.toMatch(/gh pr merge|refs\/heads\/main/)
	})

	it("runs no package manager or node in publish", () => {
		expect(stringify(publish)).not.toMatch(/\b(pnpm|npm|node)\b/)
	})
})
