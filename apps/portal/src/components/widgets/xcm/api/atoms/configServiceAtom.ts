import { assetsMap as assets, chainsMap as chains, routesMap as routes } from '@galacticcouncil/xcm-cfg'
import { ConfigService } from '@galacticcouncil/xcm-core'
import { atom } from 'jotai'

import { insertTalismanRoutes } from '../utils/insertTalismanRoutes'

insertTalismanRoutes({ assets, chains, routes })

export const configServiceAtom = atom(new ConfigService({ assets, chains, routes }))
