import { Subscribe } from "@react-rxjs/core"
import { fireEvent, render, screen } from "@testing-library/react"
import { useEffect } from "react"
import { describe, expect, it, vi } from "vitest"
import { ThemeProvider, theme } from "@/ui/theme"
import type { Provider } from "../hooks/types"
import StakeProvidersTable from "./StakeProvidersTable"

vi.mock("@/domains/analytics/client", () => ({ captureError: vi.fn() }))

const fixture = [
	["DOT", "Nomination pool", "Polka", 12, 28, 40, 55],
	["aUSD", "Liquid staking", "acala", 3, 7, 900, 10],
	["KSM", "Delegation", "Kusama", 18, 7.5, 2, 61],
	["vDOT", "Liquid staking", "bifrost", 15, 1, 75, 33],
	["TAO", "Subnet Staking", "Bittensor", 9, 0.5, 13, 72],
	["ETH", "Liquid staking", "Lido", 2.8, 5, 1.5, 28],
	["AZERO", "Nomination pool", "Aleph Zero", 11, 14, 300, 40],
	["bnc", "DApp staking", "Bifrost", 21, 21, 6, 19],
	["ASTR", "DApp staking", "Astar", 13, 9, 120, 47],
	["GLMR", "Delegation", "moonbeam", 6, 2, 58, 66],
	["VARA", "Nomination pool", "Vara", 8, 3, 33, 24],
	["avail", "Nomination pool", "avail", 4, 10, 81, 51],
] as const

const rows = fixture.map(([symbol, type, provider, apr, unbonding, balance, staked]) => ({
	symbol,
	type,
	provider,
	apr,
	unbonding,
	balance,
	staked,
}))

const byHash = Object.fromEntries(rows.map((row, index) => [hashOf(index), row]))

function hashOf(index: number): `0x${string}` {
	return `0x${index.toString(16).padStart(64, "0")}`
}

const Reports = ({ value, report }: { value: number; report: (value: number) => void }) => {
	useEffect(() => report(value), [report, value])
	return <>{value}</>
}

vi.mock("./Asset", () => ({
	default: ({ symbol }: { symbol: string }) => <span data-symbol={symbol}>{symbol}</span>,
}))
vi.mock("./Apr", () => ({
	default: (props: { genesisHash: string; setAprValues: (value: number) => void }) => (
		<Reports value={byHash[props.genesisHash]!.apr} report={props.setAprValues} />
	),
}))
vi.mock("./UnbondingPeriod", () => ({
	default: (props: { genesisHash: string; setUnbondingValues: (value: number) => void }) => (
		<Reports value={byHash[props.genesisHash]!.unbonding} report={props.setUnbondingValues} />
	),
}))
vi.mock("./AvailableBalance", () => ({
	default: (props: { genesisHash: string; setAvailableBalanceValue: (value: number) => void }) => (
		<Reports value={byHash[props.genesisHash]!.balance} report={props.setAvailableBalanceValue} />
	),
}))
vi.mock("./StakePercentage", () => ({
	default: (props: { genesisHash: string; setStakePercentage: (value: number) => void }) => (
		<Reports value={byHash[props.genesisHash]!.staked} report={props.setStakePercentage} />
	),
}))
vi.mock("./StakeButton", () => ({
	default: () => <button type="button">Stake</button>,
	StakeLinkButton: () => <a href="/">Stake</a>,
}))

const providers: Provider[] = rows.map((row, index) => ({
	balancesTokenIds: [],
	symbol: row.symbol,
	logo: "",
	chainName: row.provider,
	chainId: `chain-${index}`,
	type: row.type,
	typeId: "nominationPool",
	provider: row.provider,
	actionLink: "",
	genesisHash: hashOf(index),
}))

const renderTable = () =>
	render(
		<ThemeProvider theme={theme.greenDark}>
			<Subscribe>
				<StakeProvidersTable dataQuery={providers} />
			</Subscribe>
		</ThemeProvider>
	)

const symbolOrder = (container: HTMLElement) =>
	[...container.querySelectorAll("article.xl\\:grid [data-symbol]")].map((cell) =>
		cell.getAttribute("data-symbol")
	)

const header = (label: string) => {
	const element = screen.getAllByText(label).find((candidate) => candidate.closest("[title]"))
	if (!element) throw new Error(`No sortable header ${label}`)
	return element.closest("[title]") as HTMLElement
}

const clickThrough = (container: HTMLElement, label: string) =>
	[1, 2, 3].map(() => {
		fireEvent.click(header(label))
		return symbolOrder(container)
	})

const unsorted = rows.map((row) => row.symbol)

describe("StakeProvidersTable sorting", () => {
	it.each([
		{
			label: "Asset",
			orders: [
				"ASTR aUSD avail AZERO bnc DOT ETH GLMR KSM TAO VARA vDOT",
				"vDOT VARA TAO KSM GLMR ETH DOT bnc AZERO avail aUSD ASTR",
			],
		},
		{
			label: "Type",
			orders: [
				"bnc ASTR KSM GLMR aUSD vDOT ETH DOT AZERO VARA avail TAO",
				"TAO DOT AZERO VARA avail aUSD vDOT ETH KSM GLMR bnc ASTR",
			],
		},
		{
			label: "Provider",
			orders: [
				"aUSD AZERO ASTR avail vDOT bnc TAO KSM ETH GLMR DOT VARA",
				"VARA DOT GLMR ETH KSM TAO vDOT bnc avail ASTR AZERO aUSD",
			],
		},
		{
			label: "Est. return",
			orders: [
				"bnc KSM vDOT ASTR DOT AZERO TAO VARA GLMR avail aUSD ETH",
				"ETH aUSD avail GLMR VARA TAO AZERO DOT ASTR vDOT KSM bnc",
			],
		},
		{
			label: "Unbonding period",
			orders: [
				"DOT bnc AZERO avail ASTR KSM aUSD ETH VARA GLMR vDOT TAO",
				"TAO vDOT GLMR VARA ETH aUSD KSM ASTR avail AZERO bnc DOT",
			],
		},
		{
			label: "Available balance",
			orders: [
				"aUSD AZERO ASTR avail vDOT GLMR DOT VARA TAO bnc KSM ETH",
				"ETH KSM bnc TAO VARA DOT GLMR vDOT avail ASTR AZERO aUSD",
			],
		},
		{
			label: "Staked (%)",
			orders: [
				"TAO GLMR KSM DOT avail ASTR AZERO vDOT ETH VARA bnc aUSD",
				"aUSD bnc VARA ETH vDOT AZERO ASTR avail DOT KSM GLMR TAO",
			],
		},
	])("cycles $label through its sort orders", ({ label, orders }) => {
		const { container } = renderTable()
		expect(symbolOrder(container)).toEqual(unsorted)
		expect(clickThrough(container, label)).toEqual([
			...orders.map((order) => order.split(" ")),
			unsorted,
		])
	})
})

const typeAsc = "bnc ASTR KSM GLMR aUSD vDOT ETH DOT AZERO VARA avail TAO"
const typeDesc = "TAO DOT AZERO VARA avail aUSD vDOT ETH KSM GLMR bnc ASTR"
const assetAsc = "ASTR aUSD avail AZERO bnc DOT ETH GLMR KSM TAO VARA vDOT"
const providerAsc = "aUSD AZERO ASTR avail vDOT bnc TAO KSM ETH GLMR DOT VARA"
const typeAscAssetAsc = "ASTR bnc GLMR KSM aUSD ETH vDOT avail AZERO DOT VARA TAO"
const typeAscAssetDesc = "bnc ASTR KSM GLMR vDOT ETH aUSD VARA DOT AZERO avail TAO"
const typeDescAssetAsc = "TAO avail AZERO DOT VARA aUSD ETH vDOT GLMR KSM ASTR bnc"
const typeAscReturnDesc = "bnc ASTR KSM GLMR vDOT aUSD ETH DOT AZERO VARA avail TAO"
const typeAscReturnAsc = "ASTR bnc GLMR KSM ETH aUSD vDOT avail VARA AZERO DOT TAO"

describe("StakeProvidersTable multi-column sorting", () => {
	it.each([
		{
			sequence: "shift-click on an unsorted table",
			steps: [{ click: "shift+Asset", order: assetAsc }],
		},
		{
			sequence: "shift-add, then shift-toggle and shift-remove the added column",
			steps: [
				{ click: "Type", order: typeAsc },
				{ click: "shift+Asset", order: typeAscAssetAsc },
				{ click: "shift+Asset", order: typeAscAssetDesc },
				{ click: "shift+Asset", order: typeAsc },
			],
		},
		{
			sequence: "plain clicks on the last sorted column toggle and remove it in place",
			steps: [
				{ click: "Type", order: typeAsc },
				{ click: "shift+Asset", order: typeAscAssetAsc },
				{ click: "Asset", order: typeAscAssetDesc },
				{ click: "Asset", order: typeAsc },
			],
		},
		{
			sequence: "plain clicks on a descending-first last sorted column",
			steps: [
				{ click: "Type", order: typeAsc },
				{ click: "shift+Est. return", order: typeAscReturnDesc },
				{ click: "Est. return", order: typeAscReturnAsc },
				{ click: "Est. return", order: typeAsc },
			],
		},
		{
			sequence: "plain click on an earlier sorted column replaces the sort",
			steps: [
				{ click: "Type", order: typeAsc },
				{ click: "shift+Asset", order: typeAscAssetAsc },
				{ click: "Type", order: typeDesc },
			],
		},
		{
			sequence: "plain click on an earlier sorted column due for removal sorts it ascending",
			steps: [
				{ click: "Type", order: typeAsc },
				{ click: "Type", order: typeDesc },
				{ click: "shift+Asset", order: typeDescAssetAsc },
				{ click: "Type", order: typeAsc },
			],
		},
		{
			sequence: "plain click on an unsorted column replaces the sort",
			steps: [
				{ click: "Type", order: typeAsc },
				{ click: "shift+Asset", order: typeAscAssetAsc },
				{ click: "Provider", order: providerAsc },
			],
		},
		{
			sequence: "shift-toggle and shift-remove an earlier sorted column",
			steps: [
				{ click: "Type", order: typeAsc },
				{ click: "shift+Asset", order: typeAscAssetAsc },
				{ click: "shift+Type", order: typeDescAssetAsc },
				{ click: "shift+Type", order: assetAsc },
			],
		},
	])("$sequence", ({ steps }) => {
		const { container } = renderTable()
		const orders = steps.map(({ click }) => {
			fireEvent.click(header(click.replace("shift+", "")), { shiftKey: click.startsWith("shift+") })
			return symbolOrder(container).join(" ")
		})
		expect(orders).toEqual(steps.map(({ order }) => order))
	})
})
