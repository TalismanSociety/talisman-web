/**
 * To add a position to a provider use the following patter:
 * providerName_tokenSymbol: position
 */
const position: Record<string, number> = {
  analog_timechain_anlog: 0,
  polkadot_dot: 1,
  bittensor_tao: 2,
  kusama_ksm: 3,
  aleph_zero_azero: 4,
  vara_vara: 5,
  avail_avail: 6,
  cere_cere: 7,
  bifrost_slpx_manta: 8,
  bifrost_slpx_glmr: 9,
  bifrost_slpx_dot: 10,
  lido_eth: 11,
  astar_astar: 12,
}

export const getPosition = ({
  providerName,
  tokenSymbol,
}: {
  providerName: string | undefined
  tokenSymbol: string | undefined
}) => {
  const provider = providerName?.trim().replace(/\s+/g, '_').toLowerCase()
  return position[`${provider}_${tokenSymbol?.toLowerCase()}`] ?? 99
}
