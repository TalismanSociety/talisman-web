import { validations as transferValidations } from '@galacticcouncil/xcm-cfg'
import { Wallet } from '@galacticcouncil/xcm-sdk'
import { atom } from 'jotai'

import { configServiceAtom } from './configServiceAtom'

export const walletAtom = atom(async get => {
  const configService = get(configServiceAtom)
  if (!configService) return

  return new Wallet({ configService, transferValidations })
})
