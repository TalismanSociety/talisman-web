# PostHog project as code

`provision.ts` sets up the portal's PostHog project from the analytics catalog in `src/domains/analytics`. It writes the privacy settings, the test-account filter, the event and property definitions, the dashboards with their insights, and the alerts. Each run compares the live project with the spec and writes only the difference, so a second run writes nothing.

## Run the provisioning

1. Put these variables in `apps/portal/.env`, or in another file you pass with `--env-file <path>`:

   | Variable | Value |
   | --- | --- |
   | `POSTHOG_API_KEY` | A personal API key with the scopes listed under "API key scopes" |
   | `POSTHOG_PROJECT_ID` | `13668` |
   | `VITE_POSTHOG_AUTH_TOKEN` | The project token, read by `--seed` only |

2. Read what a run would change:

   ```sh
   pnpm --filter @talismn/portal posthog:provision --dry-run --check-queries
   ```

   The dry run reads the live project and writes nothing. `--check-queries` runs every tile's query through `/query/`, which writes nothing either, and prints `ok <tile>: data`, `ok <tile>: empty` or the error for each tile.

3. Apply the spec from `main`. On a first run, or when the catalog has events that PostHog has not received yet, add `--seed`:

   ```sh
   pnpm --filter @talismn/portal posthog:provision --seed
   ```

   Then check that the run converged: `--dry-run` must print no `create` line and no `update insight … query` line. A create line means PostHog dropped the `managed-by-code` tag; the create step fails and names the object to delete by hand. A `query` line means PostHog stores the query in another shape than the spec; `withoutSchemaVersion` in `reconcile.ts` is where to strip it.

   `--seed` sends one event for each catalog event that has no definition yet to `https://z.talisman.xyz/batch/`, prints each event, then waits up to 10 minutes for the definitions. A seed event carries an enum's first value, a one-item list for an enum list and `0` for a count, plus `environment: "development"`, `$process_person_profile: false` and `$geoip_disable: true`. It has no `$host`, so the test-account filter hides it. `$exception` is never seeded.

On a branch, run `--dry-run --check-queries` only. There is one live project, so a real run from a branch would write the branch's spec before review. Note in the PR that a real run is due from `main` after merge, with `--seed` when the PR adds events.

## Add a tile, a dashboard or an alert

- Tiles and dashboards live in `DASHBOARDS` in `dashboards.ts`; build queries with the helpers in `queries.ts`. Start each tile description with its measure: events, sessions (`$session_id`), visitors (unique `distinct_id`) or reports. Persons are never created, so never use person properties or cohorts.
- A SQL tile needs `{filters}` in its `WHERE`, which applies the date range and the test-account filter. Read an enum list with `JSONExtract(ifNull(properties.<name>, '[]'), 'Array(String)')`.
- A tile that compares environments sets `allEnvironments: true`, which keeps the test-account filter off for that tile.
- Alerts live in `ALERTS`. An alert watches one series of a trend tile. Give that series the production-host filter itself, as the `Exceptions` tile does, so the alert counts production only whatever the project's filter.

`specErrors` checks the spec against the catalog and runs in `pnpm verify` through `dashboards.test.ts`. Every event and property that a tile reads must be in the catalog, and the event that a tile reads a property on must declare it. In SQL the check matches these forms only: `event = '<name>'`, `event IN ('<name>', …)`, a bare `event` column after `SELECT` or `BY`, and `properties.<name>` or `properties['<name>']`. It rejects any other use of `event` or `properties`, and any SQL comment. The super property `environment` and the PostHog properties `$session_id` and `$host` are exempt. Tile names must be unique and a description must fit in 400 characters. A real run refuses to start on an error.

Descriptions come from the catalog. To change one, edit the catalog, not PostHog: the next run overwrites a description written in the PostHog UI.

## Reference

### Flags

| Flag | Effect |
| --- | --- |
| `--env-file <path>` | Read the env from this file instead of `.env` |
| `--dry-run` | Read the live project and print each write instead of sending it. Without credentials, print the plan only |
| `--check-queries` | Run every tile's query through `/query/`, recomputed rather than cached. Before a real run has written the test-account filter, each query carries the spec's filter inline |
| `--seed` | Seed the missing definitions, then wait for them |
| `--only <slug>` | Reconcile one dashboard: `overview`, `wallets`, `portfolio`, `transactions` or `errors`. Repeatable |
| `--prune` | Soft-delete managed insights that left the spec, and delete their alerts. Skipped when any dashboard step fails |
| `--skip-definitions` | Leave the event and property definitions alone |
| `--show-test-accounts` | Save every insight, and run every query check, with the test-account filter off. The alerts still count production only |
| `--verbose` | Print request bodies |

### What a run does, in order

1. Lists the dashboards and insights.
2. Project settings (`settings.ts`). It writes only the private value of each privacy key, so a run can tighten a setting and never loosen it: IP anonymization on, and autocapture, heatmaps, dead clicks, console logs, performance, web vitals, exception autocapture, session replay and surveys off. It sets the test-account filter to the production hosts (`$host` is `app.talisman.xyz` or `talisman.pages.dev`, the hosts `environment.ts` maps to `production`) and checks it by default. Builds from before the consent banner send no `environment`, so the filter reads the host. It never changes the primary dashboard. It prints each setting before and after.
3. Transformations. With GeoIP off, nothing is checked. With GeoIP on, a property filter must run after it and drop every precise GeoIP field and `$set`/`$set_once`. It never writes a transformation.
4. Seed events, with `--seed`.
5. Event and property definitions: description, `verified`, the `managed-by-code` tag, `super` on `environment`, and the PostHog property type. An enum list is typed `String`.
6. Each dashboard, its insights and the tile layout. A 403 on the layout fails the step, and any other layout error is only reported.
7. Alerts, each subscribing the API key's owner.
8. Prune, with `--prune`, when every dashboard step succeeded.
9. The query check, with `--check-queries`.

A step that PostHog refuses with a 403 prints `✗ <step>: <PostHog's message>`, which names the missing scope. The run goes on with the next step and exits 1 at the end. The first line of the output is the git HEAD the run used.

### Ownership

The script owns every dashboard and insight tagged `managed-by-code`, and never reads or writes an untagged one. It matches a dashboard by its title and an insight by its tile name. Renaming a tile creates a new insight: run `--prune` to remove the old one. Alerts carry no tags: the script owns every alert on a managed insight and matches it by name. A removal sets `deleted: true`, which the PostHog UI can restore.

### API key scopes

`project:read`, `project:write`, `dashboard:read`, `dashboard:write`, `insight:read`, `insight:write`, `query:read`, `alert:read`, `alert:write`, `user:read`, `hog_function:read`, `event_definition:read`, `event_definition:write`, `property_definition:read` and `property_definition:write`.

### Files

| File | Owns |
| --- | --- |
| `provision.ts` | The CLI: flags, env, the real PostHog client and the exit code |
| `run.ts` | The steps, each behind the 403 guard, and the query check |
| `catalog.ts` | The snapshot of the app catalog: events, merged properties, `$exception` and the super property |
| `dashboards.ts`, `queries.ts` | The dashboards and alerts as data, the query builders and the spec check |
| `sync.ts`, `reconcile.ts` | Matching and writing dashboards, insights, layouts and alerts |
| `settings.ts`, `definitions.ts` | The project settings patch, the transformation check, definitions and seed events |
| `api.ts` | The `Api` interface, the HTTP client and the ingest call |
| `fakePosthog.ts` | An in-memory PostHog that records writes, for the tests |
