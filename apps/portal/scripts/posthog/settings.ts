import { TEST_ACCOUNT_FILTERS } from "./queries"
import { changedFields } from "./reconcile"

export const PRIVATE_SETTINGS = {
	anonymize_ips: true,
	autocapture_opt_out: true,
	heatmaps_opt_in: false,
	capture_dead_clicks: false,
	capture_console_log_opt_in: false,
	capture_performance_opt_in: false,
	session_recording_opt_in: false,
	surveys_opt_in: false,
	autocapture_exceptions_opt_in: false,
	autocapture_web_vitals_opt_in: false,
} as const

export type ProjectSettings = { readonly [key: string]: unknown }

export const projectSettingsPatch = (current: ProjectSettings) =>
	changedFields(current, {
		...PRIVATE_SETTINGS,
		test_account_filters: TEST_ACCOUNT_FILTERS,
		test_account_filters_default_checked: true,
	})

const GEOIP_TEMPLATES = ["template-geoip", "plugin-posthog-plugin-geoip"]
export const PROPERTY_FILTER_TEMPLATE = "template-filter-properties"

const PRECISE_GEOIP_FIELDS_AND_THEIR_PERSON_COPIES = [
	"$geoip_city_name",
	"$geoip_city_confidence",
	"$geoip_subdivision_1_code",
	"$geoip_subdivision_1_name",
	"$geoip_subdivision_2_code",
	"$geoip_subdivision_2_name",
	"$geoip_subdivision_3_code",
	"$geoip_subdivision_3_name",
	"$geoip_postal_code",
	"$geoip_latitude",
	"$geoip_longitude",
	"$geoip_accuracy_radius",
	"$geoip_time_zone",
	"$set",
	"$set_once",
]

export type Transformation = {
	readonly id: string
	readonly name?: string
	readonly enabled?: boolean
	readonly execution_order?: number | null
	readonly template?: { readonly id: string } | null
	readonly template_id?: string | null
	readonly inputs?: { readonly propertiesToFilter?: { readonly value?: string } } | null
}

const templateOf = (fn: Transformation) => fn.template?.id ?? fn.template_id

export const enabledGeoips = (transformations: readonly Transformation[]) =>
	transformations.filter(
		(fn) => fn.enabled && GEOIP_TEMPLATES.some((template) => template === templateOf(fn))
	)

export const propertyFilterIds = (transformations: readonly Transformation[]) =>
	transformations.filter((fn) => templateOf(fn) === PROPERTY_FILTER_TEMPLATE).map((fn) => fn.id)

const filterProblems = (geoip: Transformation, filter: Transformation): string[] => {
	const dropped = new Set(
		(filter.inputs?.propertiesToFilter?.value ?? "").split(",").map((name) => name.trim())
	)
	const kept = PRECISE_GEOIP_FIELDS_AND_THEIR_PERSON_COPIES.filter((name) => !dropped.has(name))
	return [
		...(filter.enabled ? [] : [`"${filter.name}" is disabled`]),
		...((geoip.execution_order ?? Number.POSITIVE_INFINITY) <
		(filter.execution_order ?? Number.NEGATIVE_INFINITY)
			? []
			: [
					`GeoIP must run before "${filter.name}" (orders ${geoip.execution_order} and ${filter.execution_order})`,
				]),
		...(kept.length ? [`"${filter.name}" keeps ${kept.join(", ")}`] : []),
	]
}

const geoipProblems = (geoip: Transformation, filters: readonly Transformation[]) => {
	const problems = filters.map((filter) => filterProblems(geoip, filter))
	if (problems.some((list) => list.length === 0)) return []
	return (
		problems[0] ?? [
			`"${geoip.name}" is enabled with no "${PROPERTY_FILTER_TEMPLATE}" filter after it: drop the precise GeoIP fields or disable GeoIP`,
		]
	)
}

export const transformationProblems = (
	geoips: readonly Transformation[],
	filters: readonly Transformation[]
): string[] => geoips.flatMap((geoip) => geoipProblems(geoip, filters))
