import { solidityPacked } from 'ethers'

const TALISMAN_BIFROST_CHANNEL_ID = 4

export const channel_id = Number(import.meta.env.VITE_TALISMAN_BIFROST_CHANNEL_ID ?? TALISMAN_BIFROST_CHANNEL_ID)
export const _dstGasForCall = 4000000n
export const _adapterParams = solidityPacked(['uint16', 'uint256'], [1, 4200000]) as `0x${string}`
