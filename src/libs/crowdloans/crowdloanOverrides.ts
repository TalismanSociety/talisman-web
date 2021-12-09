import { decodeAnyAddress } from '@talismn/util'

export const Acala = makeOverride({
  relayId: 0,
  paraId: 2000,
  referrer: encodePolkadotAddressAsHexadecimalPublicKey('1564oSHxGVQEaSwHgeYKD1z1A8BXeuqL3hqBSWMA6zHmKnz1'),
  api: 'https://crowdloan.aca-api.network',
  apiBearerToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGFsaXNtYW4iLCJpYXQiOjE2MzYwNTM5NTV9.vplu8f6JI-T7SLuKwKU001KDPof04Lp6cCFyJXLWSKg',
})
export const Moonbeam = makeOverride({
  relayId: 0,
  paraId: 2004,
  api: 'https://yy9252r9jh.api.purestake.io',
  apiKey: 'QIOqO3FFNj1nmpmGQ0hq7aV3MMdj7r6q8N1hJBh7',
  needsVerifierSignature: true,
})
export const Astar = makeOverride({
  relayId: 0,
  paraId: 2006,
  referrer: encodePolkadotAddressAsHexadecimalPublicKey('1564oSHxGVQEaSwHgeYKD1z1A8BXeuqL3hqBSWMA6zHmKnz1'),
})
export const Zeitgeist = makeOverride({
  relayId: 2,
  paraId: 2101,
  terms: {
    label: 'Zeitgeist Parachain Crowdloan Commitment Terms',
    href: 'https://zeitgeist.pm/CrowdloanTerms.pdf',
  },
})

export const overrides = [Acala, Astar, Moonbeam, Zeitgeist]
export const overrideByIds = (relayId: number, paraId: number) =>
  overrides.find(override => override.is(relayId, paraId))

function makeOverride(props: {
  relayId: number
  paraId: number
  referrer?: string
  api?: string
  apiKey?: string
  apiBearerToken?: string
  needsVerifierSignature?: true
  terms?: { label: string; href: string }
}) {
  return { ...props, is: (relayId: number, paraId: number) => relayId === props.relayId && paraId === props.paraId }
}

function encodePolkadotAddressAsHexadecimalPublicKey(polkadotAddress: string): string {
  const byteArray = decodeAnyAddress(polkadotAddress)
  const hexEncoded = [...byteArray].map(x => x.toString(16).padStart(2, '0')).join('')
  return `0x${hexEncoded}`
}
