export type AnalyticsEnvironment = "production" | "preview" | "development"

const PRODUCTION_HOSTS = new Set(["app.talisman.xyz", "talisman.pages.dev"])
const PREVIEW_HOST_SUFFIX = ".talismn.workers.dev"

export const environmentOf = (hostname: string): AnalyticsEnvironment => {
	if (PRODUCTION_HOSTS.has(hostname)) return "production"
	if (hostname.endsWith(PREVIEW_HOST_SUFFIX)) return "preview"
	return "development"
}

export const isAnalyticsEnabled = (
	environment: AnalyticsEnvironment,
	localFlag: string | undefined
) => environment !== "development" || localFlag === "true"
