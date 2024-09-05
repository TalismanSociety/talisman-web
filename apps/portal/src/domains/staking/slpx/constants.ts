import { utils } from 'ethers'

export const _dstGasForCall = 3000000n

const remark = import.meta.env.REACT_APP_APPLICATION_NAME ?? 'Talisman'

export const _adapterParams = utils.solidityPack(['uint16', 'uint256', 'string'], [1, 3200000, remark]) as `0x${string}`
