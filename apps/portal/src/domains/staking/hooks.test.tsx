import { Balances, type IBalance } from "@talismn/balances"
import type { Token } from "@talismn/chaindata-provider"
import { newTokenRates } from "@talismn/token-rates"
import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useTotalStaked } from "./hooks"

const ADDRESS = "5DXdHixxtCvoa6GHKs2Jgrdzc61882Ftx1zN2sYFQuwgL1S1"
const EVM_ADDRESS = "0x52908400098527886E0F7030069857D2E4169EE7"
const UNSELECTED_EVM_ADDRESS = "0x0000000000000000000000000000000000000002"
const TAO_ID = "bittensor:substrate-native"
const STETH_ID = "1:evm-erc20:0xae7ab96520de3a18e5e111b5eaab095312d7fe84"

const tokens = {
	[TAO_ID]: {
		id: TAO_ID,
		platform: "polkadot",
		networkId: "bittensor",
		type: "substrate-native",
		symbol: "TAO",
		decimals: 9,
		name: "Bittensor",
		existentialDeposit: "500",
	},
	[STETH_ID]: {
		id: STETH_ID,
		platform: "ethereum",
		networkId: "1",
		type: "evm-erc20",
		symbol: "stETH",
		decimals: 18,
		name: "Lido Staked ETH",
		contractAddress: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
	},
} as unknown as Record<string, Token>

const subtensorStake = (netuid: number, taoPlanck: string) => ({
	type: "extra" as const,
	label: "subtensor-staking",
	amount: taoPlanck,
	includeInTotal: true,
	meta: { netuid, hotkey: ADDRESS, amountStaked: taoPlanck },
})

const balanceJsons: IBalance[] = [
	{
		source: "substrate-native",
		status: "live",
		address: ADDRESS,
		tokenId: TAO_ID,
		networkId: "bittensor",
		values: [
			{ type: "free", label: "free", amount: "1000000000" },
			subtensorStake(0, "2000000000"),
			subtensorStake(64, "500000000"),
		],
	},
	{
		source: "evm-erc20",
		status: "live",
		address: EVM_ADDRESS,
		tokenId: STETH_ID,
		networkId: "1",
		value: "1000000000000000000",
	},
]

const balances = new Balances(balanceJsons, {
	tokens,
	tokenRates: {
		[TAO_ID]: { ...newTokenRates(), usd: { price: 400 } },
		[STETH_ID]: { ...newTokenRates(), usd: { price: 3000 } },
	},
})

vi.mock("@/domains/chains/chain-connectors", () => ({ chainConnectors: {} }))
vi.mock("@/domains/balances/currency", () => ({ useSelectedCurrency: () => "usd" }))
vi.mock("@/domains/balances/hooks", () => ({ useSelectedBalances: () => balances }))
vi.mock("./substrate/useTotalStaked", () => ({ useTotalStaked: () => 10 }))
vi.mock("./dappStaking/hooks/useTotalStaked", () => ({ useTotalStaked: () => 20 }))
vi.mock("@/domains/accounts/accounts", () => ({
	useSelectedEvmAccounts: () => [{ address: EVM_ADDRESS.toLowerCase() }],
}))
vi.mock("@/components/widgets/staking/providers/hooks/seek/useGetSeekStaked", () => ({
	default: () => ({
		data: {
			balances: [
				{ address: EVM_ADDRESS, fiatBalance: 50 },
				{ address: UNSELECTED_EVM_ADDRESS, fiatBalance: 7 },
			],
		},
	}),
}))

describe("useTotalStaked", () => {
	it("sums every selected staking position, Bittensor root and subnet stakes included", () => {
		const { result } = renderHook(() => useTotalStaked())

		expect(result.current).toBe(3000 + (2 + 0.5) * 400 + 10 + 20 + 50)
	})
})
