/**
 * To add a position to a provider use the following patter:
 * providerName_tokenSymbol: position
 */
const position: Record<string, number> = {
  polkadot_dot: 0,
  bittensor_tao: 1,
  kusama_ksm: 2,
  aleph_zero_azero: 3,
  vara_vara: 4,
  avail_avail: 5,
  cere_cere: 6,
  bifrost_slpx_manta: 7,
  bifrost_slpx_glmr: 8,
  bifrost_slpx_dot: 9,
  lido_eth: 10,
  astar_astar: 11,
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
