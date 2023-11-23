import { selector } from 'recoil'
import { lidoMainnet } from './config'

export const lidoSuitesState = selector({ key: 'LidoSuites', get: () => [lidoMainnet] })
