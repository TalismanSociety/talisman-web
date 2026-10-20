// @vitest-environment node
import { existsSync, readFileSync } from "node:fs"
import { dirname, join, relative } from "node:path"
import { describe, expect, it } from "vitest"
import { parse, stringify } from "yaml"

type Step = { id?: string; uses?: string; run?: string; with?: Record<string, string> }
type Job = { permissions?: Record<string, string>; env?: Record<string, string>; steps: Step[] }
type Workflow = { permissions: Record<string, string>; jobs: { generate: Job; publish: Job } }

const workflow: Workflow = parse(
	readFileSync(new URL("../../../.github/workflows/chaindata.yml", import.meta.url), "utf8")
)
const { generate, publish } = workflow.jobs

const stepKind = ({ uses, run }: Step) =>
	uses?.split("@")[0] ?? (run === undefined ? undefined : "run")

const stepUsing = (job: Job, action: string) => {
	const step = job.steps.find((candidate) => stepKind(candidate) === action)
	if (!step?.with) throw new Error(`${action} step with inputs not found`)
	return step.with
}

const pathsAfterDashes = (job: Job, command: RegExp) => {
	const line = job.steps
		.flatMap(({ run }) => run?.split("\n") ?? [])
		.find((candidate) => command.test(candidate))
	const paths = line?.split(" -- ")[1]?.split(" || ")[0]
	if (!paths) throw new Error(`${command} not found`)
	return paths.trim().split(/\s+/)
}

const commonDirectory = (paths: string[]) =>
	paths.map(dirname).reduce((common, directory) => {
		while (relative(common, directory).startsWith("..")) common = dirname(common)
		return common
	})

const uploaded = stepUsing(generate, "actions/upload-artifact")["path"]?.trim().split("\n") ?? []
const diffed = pathsAfterDashes(generate, /^git diff /)
const committed = pathsAfterDashes(publish, /^git commit /)

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

	it("uploads, diffs and commits the same chaindata files", () => {
		expect(uploaded).toEqual(committed)
		expect(diffed).toEqual(committed)
		for (const path of committed)
			expect(existsSync(new URL(`../../../${path}`, import.meta.url))).toBe(true)
	})

	it("downloads the artifact to the paths it commits", () => {
		const root = commonDirectory(uploaded)
		const downloadPath = stepUsing(publish, "actions/download-artifact")["path"] ?? ""
		const landed = uploaded.map((path) => join(downloadPath, relative(root, path)))
		expect(landed).toEqual(committed)
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
