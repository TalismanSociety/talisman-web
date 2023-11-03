import { MultisigWithExtraData } from '../multisig'

const PERMISSIONS_BY_PROXY_TYPE = {
  transfer: ['Any'],
  governance: ['Any', 'Governance', 'NonTransfer'],
}

export const hasPermission = (
  multisig: MultisigWithExtraData,
  permission: keyof typeof PERMISSIONS_BY_PROXY_TYPE,
  allowDelay = false
) => {
  const permissions = PERMISSIONS_BY_PROXY_TYPE[permission]

  return multisig.proxies?.some(
    ({ proxyType, delay }) => permissions.includes(proxyType) && (allowDelay || delay === 0)
  )
}
