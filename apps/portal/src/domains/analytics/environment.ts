export type AnalyticsEnvironment = "production" | "preview" | "development"

export const PRODUCTION_HOSTS = ["app.talisman.xyz", "talisman.pages.dev"] as const
const PREVIEW_HOST_SUFFIX = ".talismn.workers.dev"

export const environmentOf = (hostname: string): AnalyticsEnvironment => {
	if (PRODUCTION_HOSTS.some((host) => host === hostname)) return "production"
	if (hostname.endsWith(PREVIEW_HOST_SUFFIX)) return "preview"
	return "development"
}

export const isAnalyticsEnabled = (
	environment: AnalyticsEnvironment,
	localFlag: string | undefined
) => environment !== "development" || localFlag === "true"
