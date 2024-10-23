import { assetsMap as assets, chainsMap as chains, routesMap as routes } from '@galacticcouncil/xcm-cfg'
import { ConfigService } from '@galacticcouncil/xcm-core'
import { atom } from 'jotai'

// TODO: Add externals: https://github.com/galacticcouncil/apps/blob/master/packages/apps/src/utils/external.ts#L18
// TODO: Add USDC for Centrifuge <-> Polkadot Asset Hub
export const configServiceAtom = atom(new ConfigService({ assets, chains, routes }))

// TODO: Add these to the config
// const newAssetHubPolkadotRoutes = [
//   {
//     to: 'centrifuge',
//     token: 'USDC',
//     xcm: {
//       fee: { token: 'USDC', amount: '4000' },
//       weightLimit: 'Unlimited',
//     },
//   },
//   {
//     to: 'astar',
//     token: 'PINK',
//     xcm: {
//       fee: { token: 'PINK', amount: '80370000' },
//       weightLimit: 'Unlimited',
//     },
//   },
// ]
// const newCentrifugeTokens = {
//   USDC: {
//     name: 'USD Coin',
//     symbol: 'USDC',
//     decimals: 6,
//     ed: '700000',
//     toRaw: () => 'USDC',
//   },
// }
// const newAstarTokens = {
//   PINK: {
//     name: 'PINK',
//     symbol: 'PINK',
//     decimals: 10,
//     ed: '1',
//     // TODO: get this value
//     // for now it doesn't matter what toRaw is, as long as PINK is only received
//     toRaw: () => '0x0000000000000000000000000000000000000000000000000000000000000000',
//     toQuery: () => '18446744073709551633',
//   },
// }
