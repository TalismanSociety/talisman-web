import path from "node:path"
import babel from "@rolldown/plugin-babel"
import react from "@vitejs/plugin-react"
import svgr from "vite-plugin-svgr"
import { defineConfig, mergeConfig } from "vitest/config"

export default mergeConfig(
	{
		plugins: [
			react({ jsxImportSource: "@emotion/react" }),
			babel({ plugins: ["@emotion/babel-plugin"] }),
			svgr(),
		],
		resolve: {
			alias: {
				"@": path.resolve(import.meta.dirname, "./src"),
				"cloudflare:workers": path.resolve(import.meta.dirname, "./src/test/cloudflare-workers.ts"),
			},
		},
	},
	defineConfig({
		test: {
			name: "portal",
			environment: "jsdom",
			include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.ts"],
			setupFiles: ["src/vitest.setup.ts"],
			server: { deps: { inline: ["@talismn/balances"] } },
		},
	})
)
