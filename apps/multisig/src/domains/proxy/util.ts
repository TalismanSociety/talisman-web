import { MultisigWithExtraData } from '../multisig'

const PERMISSIONS_BY_PROXY_TYPE = {
  transfer: ['Any'],
  governance: ['Any', 'Governance', 'NonTransfer'],
}

export const hasPermission = (multisig: MultisigWithExtraData, permission: keyof typeof PERMISSIONS_BY_PROXY_TYPE) => {
  const permissions = PERMISSIONS_BY_PROXY_TYPE[permission]

  return {
    hasNonDelayedPermission: multisig.proxies?.some(
      ({ proxyType, delay }) => permissions.includes(proxyType) && delay === 0
    ),

    hasDelayedPermission: multisig.proxies?.some(
      ({ proxyType, delay }) => permissions.includes(proxyType) && delay > 0
    ),
  }
}
