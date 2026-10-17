import { evmErc20TokenId, evmNativeTokenId } from "@talismn/chaindata-provider"

import { lidoSuites } from "@/domains/staking/lido/config"

import type { Provider } from "../types"

// A dummy value for the genesis hash to play nice with ChainProvider context
// This is not used for Lido
const SUBSTRATE_GENESIS_HASH = "0x262e1b2ad728475fd6fe88e62d34c200abe6fd693931ddad144059b1eb884e5b"

const ETHEREUM_LOGO_URL =
	"https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/chains/1.svg"

const useLidoProviders = () => {
	const lidoProviders: Provider[] = lidoSuites.map((lidoSuite) => {
		const { symbol, decimals } = lidoSuite.chain.nativeCurrency
		return {
			balancesTokenIds: [
				evmNativeTokenId(String(lidoSuite.chain.id)),
				evmErc20TokenId(String(lidoSuite.chain.id), lidoSuite.token.address),
			],
			symbol: symbol,
			logo: ETHEREUM_LOGO_URL,
			chainName: lidoSuite.chain.name,
			chainId: lidoSuite.chain.id,
			type: "Liquid staking",
			typeId: "liquidStakingLido",
			provider: "Lido",
			actionLink: `?action=stake&type=lido&token-address=${lidoSuite.token.address}`,
			nativeToken: { symbol, decimals, address: lidoSuite.token.address },
			apiEndpoint: lidoSuite.apiEndpoint,
			genesisHash: SUBSTRATE_GENESIS_HASH,
		}
	})

	return lidoProviders
}

export default useLidoProviders
