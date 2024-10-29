import { solidityPacked } from 'ethers'

export const _dstGasForCall = 3000000n
export const _adapterParams = solidityPacked(['uint16', 'uint256'], [1, 3200000]) as `0x${string}`
