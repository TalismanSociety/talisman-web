import path from "node:path"
import { cloudflare } from "@cloudflare/vite-plugin"
import babel from "@rolldown/plugin-babel"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import react from "@vitejs/plugin-react"
import {
	type ConfigEnv,
	type ConfigPluginContext,
	defineConfig,
	type Plugin,
	type UserConfig,
} from "vite"
import { nodePolyfills } from "vite-plugin-node-polyfills"
import svgr from "vite-plugin-svgr"
import wasm from "vite-plugin-wasm"

const isBrowser = (environment: { name: string }) => environment.name === "client"

const inBrowser = (plugin: Plugin): Plugin => ({ ...plugin, applyToEnvironment: isBrowser })

type PolyfillConfig = (this: ConfigPluginContext, config: UserConfig, env: ConfigEnv) => UserConfig

const browserNodePolyfills = (): Plugin[] => {
	const plugins = nodePolyfills()
	const polyfills = plugins.find((plugin) => plugin.name === "vite-plugin-node-polyfills")
	if (!polyfills) throw new Error("vite-plugin-node-polyfills no longer has its config plugin")
	const polyfillConfig = polyfills.config as PolyfillConfig
	let aliases: [string, string][] = []
	return [
		...plugins.filter((plugin) => plugin !== polyfills).map(inBrowser),
		{
			name: "browser-node-polyfills",
			config(userConfig, env) {
				const { resolve, ...config } = polyfillConfig.call(this, userConfig, env)
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
		react({ jsxImportSource: "@emotion/react" }),
		babel({ plugins: ["@emotion/babel-plugin"] }),
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
			"@": path.resolve(import.meta.dirname, "./src"),
		},
	},
})
