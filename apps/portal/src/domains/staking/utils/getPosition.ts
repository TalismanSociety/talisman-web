/**
 * To add a provider,insert it into the ordered array as provider_tokensymbol.
 * The index of the array determines its position automatically.
 */
const orderedProviders: string[] = [
  'polkadot_dot',
  'bittensor_tao',
  'bittensor_testnet_testtao',
  'kusama_asset_hub_ksm',
  'astar_astr',
  'analog_timechain_anlog',
  'aleph_zero_azero',
  'vara_vara',
  'avail_avail',
  'cere_cere',
  'bifrost_slpx_manta',
  'bifrost_slpx_glmr',
  'bifrost_slpx_dot',
  'lido_eth',
]

/** Convert the array into a map for quick lookup */
const positionMap: Record<string, number> = Object.fromEntries(orderedProviders.map((key, index) => [key, index]))

export const getPosition = ({
  providerName,
  tokenSymbol,
}: {
  providerName: string | undefined
  tokenSymbol: string | undefined
}) => {
  const provider = providerName?.trim().replace(/\s+/g, '_').toLowerCase()
  return positionMap[`${provider}_${tokenSymbol?.toLowerCase()}`] ?? 99
}
