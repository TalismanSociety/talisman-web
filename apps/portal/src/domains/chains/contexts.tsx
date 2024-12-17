import { createContext } from 'react'

import type { ChainConfig } from './config'
import { chainConfigs } from './config'

export const ChainContext = createContext<ChainConfig>(chainConfigs[0]!)
