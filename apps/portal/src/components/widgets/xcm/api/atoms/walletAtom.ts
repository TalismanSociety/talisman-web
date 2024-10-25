import { validations as transferValidations } from '@galacticcouncil/xcm-cfg'
import { Wallet } from '@galacticcouncil/xcm-sdk'
import { atom } from 'jotai'

import { configServiceAtom } from './configServiceAtom'
import { poolServiceAtom } from './poolServiceAtom'

export const walletAtom = atom(async get => {
  const configService = get(configServiceAtom)
  if (!configService) return

  const poolService = await get(poolServiceAtom)
  if (!poolService) return

  return new Wallet({ configService, poolService, transferValidations })
})
