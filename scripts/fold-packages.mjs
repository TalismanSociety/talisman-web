import { execFileSync } from "node:child_process"
import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	rmSync,
	statSync,
	writeFileSync,
} from "node:fs"
import { dirname, join, relative, resolve } from "node:path"

const root = process.cwd()
const portalSrc = join(root, "apps/portal/src")
const uiPackage = join(root, "packages/ui")
const iconsPackage = join(root, "packages/icons")
const uiTarget = join(portalSrc, "ui")
const iconsTarget = join(portalSrc, "icons")

const specifierPattern = /(\bfrom\s+|\bimport\s*\(\s*|\bimport\s+)(["'])([^"']+)\2/g

const walk = (dir) =>
	readdirSync(dir).flatMap((name) => {
		const path = join(dir, name)
		return statSync(path).isDirectory() ? walk(path) : [path]
	})

const isSource = (path) => /\.(ts|tsx)$/.test(path)

const sources = [...walk(portalSrc), ...walk(join(uiPackage, "src"))].filter(isSource)

const importedIcons = new Set()
for (const file of sources) {
	const text = readFileSync(file, "utf8")
	if (/import\s+\*\s+as\s+\w+\s+from\s+["']@talismn\/web-icons["']/.test(text)) {
		throw new Error(`${file} imports every icon`)
	}
	for (const [, names] of text.matchAll(
		/import\s+(?:type\s+)?\{([^}]*)\}\s+from\s+["']@talismn\/web-icons["']/g
	)) {
		for (const name of names.split(",")) {
			const imported = name
				.trim()
				.replace(/^type\s+/, "")
				.split(/\s+as\s+/)[0]
			if (imported) importedIcons.add(imported)
		}
	}
}

const iconBarrel = join(iconsPackage, "src/components/index.ts")
const iconExports = readFileSync(iconBarrel, "utf8")
	.split("\n")
	.filter(Boolean)
	.map((line) => {
		const match = /^export \{ default as (\w+) \} from "\.\/(\w+)"$/.exec(line)
		if (!match) throw new Error(`unexpected icon barrel line: ${line}`)
		return { name: match[1], file: match[2], line }
	})
const keptIcons = iconExports.filter((icon) => importedIcons.has(icon.name))

const moves = new Map()
const plan = (from, to) => moves.set(from, to)
for (const entry of ["atoms", "molecules", "utils", "theme.tsx"]) {
	for (const file of statSync(join(uiPackage, "src", entry)).isDirectory()
		? walk(join(uiPackage, "src", entry))
		: [join(uiPackage, "src", entry)]) {
		plan(file, join(uiTarget, relative(join(uiPackage, "src"), file)))
	}
}
for (const file of walk(join(uiPackage, "assets"))) {
	plan(file, join(uiTarget, "assets", relative(join(uiPackage, "assets"), file)))
}
for (const file of ["index.ts", "context.ts", "utils.ts", "components/index.ts"]) {
	plan(join(iconsPackage, "src", file), join(iconsTarget, file))
}
for (const icon of keptIcons) {
	plan(
		join(iconsPackage, "src/components", `${icon.file}.tsx`),
		join(iconsTarget, "components", `${icon.file}.tsx`)
	)
}

const resolveRelative = (fromFile, specifier) => {
	const base = resolve(dirname(fromFile), specifier)
	const candidates = [
		base,
		`${base}.ts`,
		`${base}.tsx`,
		join(base, "index.ts"),
		join(base, "index.tsx"),
	]
	const target = candidates.find(
		(candidate) => existsSync(candidate) && statSync(candidate).isFile()
	)
	if (!target) throw new Error(`${fromFile}: cannot resolve ${specifier}`)
	return { target, suffix: target.slice(base.length) }
}

const packageSpecifier = (specifier) => {
	if (specifier === "@talismn/web-icons") return "@/icons"
	if (specifier === "@talismn/web-icons/utils") return "@/icons/utils"
	if (specifier === "@talismn/ui/theme") return "@/ui/theme"
	const ui = /^@talismn\/ui\/((?:atoms|molecules|utils|assets)\/.+)$/.exec(specifier)
	if (ui) return `@/ui/${ui[1]}`
	if (/^@talismn\/(ui|web-icons)(\/|$)/.test(specifier))
		throw new Error(`unmapped specifier ${specifier}`)
	return specifier
}

const rewrite = (oldFile, newFile, text) =>
	text.replace(specifierPattern, (whole, keyword, quote, specifier) => {
		let next = packageSpecifier(specifier)
		if (specifier.startsWith(".") && moves.has(oldFile)) {
			const { target, suffix } = resolveRelative(oldFile, specifier)
			const movedTarget = moves.get(target)
			if (!movedTarget) throw new Error(`${oldFile}: ${specifier} points outside the fold`)
			const path = relative(
				dirname(newFile),
				movedTarget.slice(0, movedTarget.length - suffix.length)
			)
			next = path.startsWith(".") ? path : `./${path}`
		}
		return next === specifier ? whole : `${keyword}${quote}${next}${quote}`
	})

const contents = new Map(
	[...moves].map(([from, to]) => [
		from,
		from === iconBarrel
			? `${keptIcons.map((icon) => icon.line).join("\n")}\n`
			: isSource(from)
				? rewrite(from, to, readFileSync(from, "utf8"))
				: readFileSync(from),
	])
)
const portalRewrites = walk(portalSrc)
	.filter(isSource)
	.map((file) => [file, readFileSync(file, "utf8")])
	.map(([file, text]) => [file, text, rewrite(file, file, text)])
	.filter(([, text, next]) => next !== text)
const touched = portalRewrites.map(([file]) => file)

for (const [file, , next] of portalRewrites) writeFileSync(file, next)
for (const [from, to] of moves) {
	mkdirSync(dirname(to), { recursive: true })
	writeFileSync(to, contents.get(from))
}

rmSync(uiPackage, { recursive: true })
rmSync(iconsPackage, { recursive: true })

execFileSync(
	join(root, "node_modules/.bin/biome"),
	[
		"check",
		"--write",
		relative(root, uiTarget),
		relative(root, iconsTarget),
		...touched.map((file) => relative(root, file)),
	],
	{ stdio: "inherit" }
)

console.log(
	`moved ${moves.size} files, rewrote ${touched.length} portal files, kept ${keptIcons.length} of ${iconExports.length} icons`
)
