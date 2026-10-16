import path from "node:path"
import { cloudflare } from "@cloudflare/vite-plugin"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import react from "@vitejs/plugin-react"
import { type ConfigEnv, defineConfig, type Plugin, type UserConfig } from "vite"
import { nodePolyfills } from "vite-plugin-node-polyfills"
import svgr from "vite-plugin-svgr"
import wasm from "vite-plugin-wasm"

const isBrowser = (environment: { name: string }) => environment.name === "client"

const inBrowser = (plugin: Plugin): Plugin => ({ ...plugin, applyToEnvironment: isBrowser })

const browserNodePolyfills = (): Plugin[] => {
	const plugin = nodePolyfills()
	const polyfillConfig = plugin.config as (config: UserConfig, env: ConfigEnv) => UserConfig
	let aliases: [string, string][] = []
	return [
		{
			name: "browser-node-polyfills",
			config: (userConfig, env) => {
				const { resolve, ...config } = polyfillConfig(userConfig, env)
				aliases = Object.entries(resolve?.alias ?? {})
				return config
			},
		},
		inBrowser({
			name: "browser-node-polyfills-alias",
			enforce: "pre",
			resolveId(source, importer, options) {
				const alias = aliases.find(([find]) => source === find || source.startsWith(`${find}/`))
				if (!alias) return null
				const [find, replacement] = alias
				return this.resolve(replacement + source.slice(find.length), importer, {
					...options,
					skipSelf: true,
				})
			},
		}),
	]
}

export default defineConfig({
	build: { sourcemap: "hidden" },
	environments: { ssr: { build: { sourcemap: true } } },
	optimizeDeps: {
		// getting dev error without this setting
		exclude: ["node_modules/.vite/deps"],
	},
	plugins: [
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		tanstackStart({ spa: { enabled: true, prerender: { outputPath: "/index" } } }),
		react({
			jsxImportSource: "@emotion/react",
			babel: {
				plugins: ["@emotion/babel-plugin"],
			},
		}),
		svgr(),
		browserNodePolyfills(),
		inBrowser(wasm()),
	],
	server: { allowedHosts: [".orb.local"] },
	worker: {
		// https://github.com/vitejs/vite/pull/12629
		format: "es",
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
})
