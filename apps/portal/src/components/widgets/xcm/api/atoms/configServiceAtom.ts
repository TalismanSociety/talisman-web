import { assetsMap as assets, chainsMap as chains, routesMap as routes } from '@galacticcouncil/xcm-cfg'
import { ConfigService } from '@galacticcouncil/xcm-core'
import { atom } from 'jotai'

import { disableChainAndItsRoutes } from '../utils/disableChainAndItsRoutes'
import { disableRoute } from '../utils/disableRoute'
import { insertTalismanRoutes } from '../utils/insertTalismanRoutes'
import { overrideChainApis, overrideRoutesChainApis } from '../utils/wrapChainApi'

insertTalismanRoutes({ assets, chains, routes })

// We disable this route for now because MYTH is not an `isSufficient` asset on assethub.
// This means that when a user sends MYTH to an account with no existential deposit on assethub,
// all of the MYTH that they transfer is deleted.
//
// We can add this route back after we or @galacticcouncil add support for checking asset sufficiency.
disableRoute(routes, 'mythos', 'myth-assethub')

// Remove these because it's confusing having two DOT tokens to select from.
disableChainAndItsRoutes(chains, routes, 'polkadot_cex')
disableChainAndItsRoutes(chains, routes, 'assethub_cex')

export const configServiceAtom = atom(
  new ConfigService({
    assets,
    chains: overrideChainApis(chains),
    routes: overrideRoutesChainApis(routes),
  })
)
