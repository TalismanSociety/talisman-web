import { describe, expect, it } from "vitest"
import { CLIENT_CONFIG } from "../../src/domains/analytics/client"
import {
	findGeoip,
	PRIVATE_SETTINGS,
	PROPERTY_FILTER_TEMPLATE,
	projectSettingsPatch,
	propertyFilterIds,
	type Transformation,
	transformationProblems,
} from "./settings"

const LOOSE_VALUES: { readonly [K in keyof typeof PRIVATE_SETTINGS]: boolean } = {
	anonymize_ips: false,
	autocapture_opt_out: false,
	heatmaps_opt_in: true,
	capture_dead_clicks: true,
	capture_console_log_opt_in: true,
	capture_performance_opt_in: true,
	session_recording_opt_in: true,
	surveys_opt_in: true,
	autocapture_exceptions_opt_in: true,
	autocapture_web_vitals_opt_in: true,
}

const PRIVACY_KEYS = Object.keys(LOOSE_VALUES) as (keyof typeof LOOSE_VALUES)[]

describe("projectSettingsPatch", () => {
	it.each(
		PRIVACY_KEYS.flatMap((key) => [true, false, null].map((current) => [key, current] as const))
	)("never writes the loose value of %s when it is %s", (key, current) => {
		const patch: Record<string, unknown> = projectSettingsPatch({ [key]: current })
		expect(patch[key]).not.toBe(LOOSE_VALUES[key])
		if (current !== !LOOSE_VALUES[key]) expect(patch[key]).toBe(!LOOSE_VALUES[key])
	})

	it("tightens every privacy key of a fully loose project", () => {
		const patch: Record<string, unknown> = projectSettingsPatch(LOOSE_VALUES)
		for (const key of PRIVACY_KEYS) expect(patch[key]).toBe(!LOOSE_VALUES[key])
	})

	it("filters test accounts down to the production hosts, checked by default", () => {
		expect(
			projectSettingsPatch({
				test_account_filters: [
					{ key: "$host", type: "event", value: "localhost", operator: "not_icontains" },
				],
			})
		).toMatchObject({
			test_account_filters: [
				{
					key: "$host",
					type: "event",
					operator: "exact",
					value: ["app.talisman.xyz", "talisman.pages.dev"],
				},
			],
			test_account_filters_default_checked: true,
		})
	})

	it("never sets the project's primary dashboard", () => {
		expect(projectSettingsPatch({ primary_dashboard: 78310 })).not.toHaveProperty(
			"primary_dashboard"
		)
	})

	it("agrees with every capture feature the client turns off", () => {
		expect({
			autocapture_opt_out: !CLIENT_CONFIG.autocapture,
			heatmaps_opt_in: CLIENT_CONFIG.capture_heatmaps,
			capture_dead_clicks: CLIENT_CONFIG.capture_dead_clicks,
			capture_console_log_opt_in: CLIENT_CONFIG.enable_recording_console_log,
			capture_performance_opt_in: CLIENT_CONFIG.capture_performance,
			autocapture_web_vitals_opt_in: CLIENT_CONFIG.capture_performance,
			session_recording_opt_in: !CLIENT_CONFIG.disable_session_recording,
			surveys_opt_in: !CLIENT_CONFIG.disable_surveys,
			autocapture_exceptions_opt_in: CLIENT_CONFIG.capture_exceptions,
		}).toEqual({ ...PRIVATE_SETTINGS, anonymize_ips: undefined })
	})
})

describe("transformationProblems", () => {
	const geoip = (enabled = true): Transformation => ({
		id: "geoip",
		name: "GeoIP",
		enabled,
		execution_order: 1,
		template: { id: "template-geoip" },
	})
	const filter = (value: string, order = 2): Transformation => ({
		id: "filter",
		name: "Keep country and continent only",
		enabled: true,
		execution_order: order,
		template: { id: PROPERTY_FILTER_TEMPLATE },
		inputs: { propertiesToFilter: { value } },
	})
	const allDropped =
		"$geoip_city_name,$geoip_city_confidence,$geoip_subdivision_1_code,$geoip_subdivision_1_name,$geoip_subdivision_2_code,$geoip_subdivision_2_name,$geoip_subdivision_3_code,$geoip_subdivision_3_name,$geoip_postal_code,$geoip_latitude,$geoip_longitude,$geoip_accuracy_radius,$geoip_time_zone,$set,$set_once"

	it("passes a project with GeoIP missing or disabled, since no location is derived", () => {
		expect(transformationProblems(undefined, [])).toEqual([])
		expect(transformationProblems(geoip(false), [])).toEqual([])
	})

	it("finds GeoIP and the property filters by their templates", () => {
		const fns = [{ id: "other" }, geoip(), filter(allDropped)]
		expect(findGeoip(fns)?.id).toBe("geoip")
		expect(propertyFilterIds(fns)).toEqual(["filter"])
	})

	it("passes GeoIP followed by a filter dropping every precise field", () => {
		expect(transformationProblems(geoip(), [filter(allDropped)])).toEqual([])
		expect(transformationProblems(geoip(), [filter(""), filter(allDropped)])).toEqual([])
	})

	it("names GeoIP with no filter, a precise field kept and a filter running first", () => {
		expect(transformationProblems(geoip(), [])).toEqual([
			"GeoIP is enabled with no property filter after it: drop the precise GeoIP fields or disable GeoIP",
		])
		expect(
			transformationProblems(geoip(), [filter(allDropped.replace("$geoip_city_name,", ""))])
		).toEqual(['"Keep country and continent only" keeps $geoip_city_name'])
		expect(transformationProblems(geoip(), [filter(allDropped, 0)])).toEqual([
			'GeoIP must run before "Keep country and continent only" (orders 1 and 0)',
		])
	})
})
