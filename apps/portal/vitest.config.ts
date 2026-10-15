import { defineConfig, mergeConfig } from "vitest/config"

import viteConfig from "./vite.config"

const nodeHasTheseGlobals = (plugin: unknown) =>
	!(plugin instanceof Object && "name" in plugin && plugin.name === "vite-plugin-node-polyfills")

export default mergeConfig(
	{ ...viteConfig, plugins: viteConfig.plugins?.filter(nodeHasTheseGlobals) },
	defineConfig({
		test: {
			name: "portal",
			environment: "jsdom",
			include: ["src/**/*.test.{ts,tsx}"],
			setupFiles: ["src/vitest.setup.ts"],
		},
	})
)
