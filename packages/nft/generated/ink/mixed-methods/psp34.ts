/* This file is auto-generated */

import type { ContractPromise } from '@polkadot/api-contract'
import type { ApiPromise } from '@polkadot/api'
import type { KeyringPair } from '@polkadot/keyring/types'
import type { GasLimit, GasLimitAndRequiredValue, Result } from '@727-ventures/typechain-types'
import type { QueryReturnType } from '@727-ventures/typechain-types'
import { queryOkJSON, queryJSON, handleReturnType } from '@727-ventures/typechain-types'
import { txSignAndSend } from '@727-ventures/typechain-types'
import type * as ArgumentTypes from '../types-arguments/psp34.js'
import type * as ReturnTypes from '../types-returns/psp34.js'
import type BN from 'bn.js'
//@ts-ignore
import { ReturnNumber } from '@727-ventures/typechain-types'
import { getTypeDescription } from './../shared/utils.js'
// @ts-ignore
import type { EventRecord } from '@polkadot/api/submittable'
import { decodeEvents } from '../shared/utils.js'
import DATA_TYPE_DESCRIPTIONS from '../data/psp34.json'
import EVENT_DATA_TYPE_DESCRIPTIONS from '../event-data/psp34.json'

export default class Methods {
  readonly __nativeContract: ContractPromise
  readonly __keyringPair: KeyringPair
  readonly __callerAddress: string
  readonly __apiPromise: ApiPromise

  constructor(apiPromise: ApiPromise, nativeContract: ContractPromise, keyringPair: KeyringPair) {
    this.__apiPromise = apiPromise
    this.__nativeContract = nativeContract
    this.__keyringPair = keyringPair
    this.__callerAddress = keyringPair.address
  }

  /**
   * totalSupply
   *
   * @returns { Result<ReturnNumber, ReturnTypes.LangError> }
   */
  totalSupply(__options: GasLimit): Promise<QueryReturnType<Result<ReturnNumber, ReturnTypes.LangError>>> {
    return queryOkJSON(
      this.__apiPromise,
      this.__nativeContract,
      this.__callerAddress,
      'psp34::totalSupply',
      [],
      __options,
      result => {
        return handleReturnType(result, getTypeDescription(12, DATA_TYPE_DESCRIPTIONS))
      }
    )
  }

  /**
   * balanceOf
   *
   * @param { ArgumentTypes.AccountId } owner,
   * @returns { Result<number, ReturnTypes.LangError> }
   */
  balanceOf(
    owner: ArgumentTypes.AccountId,
    __options: GasLimit
  ): Promise<QueryReturnType<Result<number, ReturnTypes.LangError>>> {
    return queryOkJSON(
      this.__apiPromise,
      this.__nativeContract,
      this.__callerAddress,
      'psp34::balanceOf',
      [owner],
      __options,
      result => {
        return handleReturnType(result, getTypeDescription(13, DATA_TYPE_DESCRIPTIONS))
      }
    )
  }

  /**
   * ownerOf
   *
   * @param { ArgumentTypes.Id } id,
   * @returns { Result<ReturnTypes.AccountId | null, ReturnTypes.LangError> }
   */
  ownerOf(
    id: ArgumentTypes.Id,
    __options: GasLimit
  ): Promise<QueryReturnType<Result<ReturnTypes.AccountId | null, ReturnTypes.LangError>>> {
    return queryOkJSON(
      this.__apiPromise,
      this.__nativeContract,
      this.__callerAddress,
      'psp34::ownerOf',
      [id],
      __options,
      result => {
        return handleReturnType(result, getTypeDescription(15, DATA_TYPE_DESCRIPTIONS))
      }
    )
  }

  /**
   * collectionId
   *
   * @returns { Result<ReturnTypes.Id, ReturnTypes.LangError> }
   */
  collectionId(__options: GasLimit): Promise<QueryReturnType<Result<ReturnTypes.Id, ReturnTypes.LangError>>> {
    return queryOkJSON(
      this.__apiPromise,
      this.__nativeContract,
      this.__callerAddress,
      'psp34::collectionId',
      [],
      __options,
      result => {
        return handleReturnType(result, getTypeDescription(17, DATA_TYPE_DESCRIPTIONS))
      }
    )
  }

  /**
   * allowance
   *
   * @param { ArgumentTypes.AccountId } owner,
   * @param { ArgumentTypes.AccountId } operator,
   * @param { ArgumentTypes.Id | null } id,
   * @returns { Result<boolean, ReturnTypes.LangError> }
   */
  allowance(
    owner: ArgumentTypes.AccountId,
    operator: ArgumentTypes.AccountId,
    id: ArgumentTypes.Id | null,
    __options: GasLimit
  ): Promise<QueryReturnType<Result<boolean, ReturnTypes.LangError>>> {
    return queryOkJSON(
      this.__apiPromise,
      this.__nativeContract,
      this.__callerAddress,
      'psp34::allowance',
      [owner, operator, id],
      __options,
      result => {
        return handleReturnType(result, getTypeDescription(19, DATA_TYPE_DESCRIPTIONS))
      }
    )
  }

  /**
   * approve
   *
   * @param { ArgumentTypes.AccountId } operator,
   * @param { ArgumentTypes.Id | null } id,
   * @param { boolean } approved,
   * @returns { void }
   */
  approve(operator: ArgumentTypes.AccountId, id: ArgumentTypes.Id | null, approved: boolean, __options: GasLimit) {
    return txSignAndSend(
      this.__apiPromise,
      this.__nativeContract,
      this.__keyringPair,
      'psp34::approve',
      (events: EventRecord) => {
        return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS)
      },
      [operator, id, approved],
      __options
    )
  }

  /**
   * transfer
   *
   * @param { ArgumentTypes.AccountId } to,
   * @param { ArgumentTypes.Id } id,
   * @param { Array<(number | string | BN)> } data,
   * @returns { void }
   */
  transfer(to: ArgumentTypes.AccountId, id: ArgumentTypes.Id, data: Array<number | string | BN>, __options: GasLimit) {
    return txSignAndSend(
      this.__apiPromise,
      this.__nativeContract,
      this.__keyringPair,
      'psp34::transfer',
      (events: EventRecord) => {
        return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS)
      },
      [to, id, data],
      __options
    )
  }

  /**
   * burn
   *
   * @param { ArgumentTypes.AccountId } account,
   * @param { ArgumentTypes.Id } id,
   * @returns { void }
   */
  burn(account: ArgumentTypes.AccountId, id: ArgumentTypes.Id, __options: GasLimit) {
    return txSignAndSend(
      this.__apiPromise,
      this.__nativeContract,
      this.__keyringPair,
      'psp34Burnable::burn',
      (events: EventRecord) => {
        return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS)
      },
      [account, id],
      __options
    )
  }

  /**
   * mint
   *
   * @param { ArgumentTypes.AccountId } account,
   * @param { ArgumentTypes.Id } id,
   * @returns { void }
   */
  mint(account: ArgumentTypes.AccountId, id: ArgumentTypes.Id, __options: GasLimit) {
    return txSignAndSend(
      this.__apiPromise,
      this.__nativeContract,
      this.__keyringPair,
      'psp34Mintable::mint',
      (events: EventRecord) => {
        return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS)
      },
      [account, id],
      __options
    )
  }

  /**
   * ownersTokenByIndex
   *
   * @param { ArgumentTypes.AccountId } owner,
   * @param { (string | number | BN) } index,
   * @returns { Result<Result<ReturnTypes.Id, ReturnTypes.PSP34Error>, ReturnTypes.LangError> }
   */
  ownersTokenByIndex(
    owner: ArgumentTypes.AccountId,
    index: string | number | BN,
    __options: GasLimit
  ): Promise<QueryReturnType<Result<Result<ReturnTypes.Id, ReturnTypes.PSP34Error>, ReturnTypes.LangError>>> {
    return queryOkJSON(
      this.__apiPromise,
      this.__nativeContract,
      this.__callerAddress,
      'psp34Enumerable::ownersTokenByIndex',
      [owner, index],
      __options,
      result => {
        return handleReturnType(result, getTypeDescription(24, DATA_TYPE_DESCRIPTIONS))
      }
    )
  }

  /**
   * tokenByIndex
   *
   * @param { (string | number | BN) } index,
   * @returns { Result<Result<ReturnTypes.Id, ReturnTypes.PSP34Error>, ReturnTypes.LangError> }
   */
  tokenByIndex(
    index: string | number | BN,
    __options: GasLimit
  ): Promise<QueryReturnType<Result<Result<ReturnTypes.Id, ReturnTypes.PSP34Error>, ReturnTypes.LangError>>> {
    return queryOkJSON(
      this.__apiPromise,
      this.__nativeContract,
      this.__callerAddress,
      'psp34Enumerable::tokenByIndex',
      [index],
      __options,
      result => {
        return handleReturnType(result, getTypeDescription(24, DATA_TYPE_DESCRIPTIONS))
      }
    )
  }

  /**
   * getAttribute
   *
   * @param { ArgumentTypes.Id } id,
   * @param { string } key,
   * @returns { Result<string | null, ReturnTypes.LangError> }
   */
  getAttribute(
    id: ArgumentTypes.Id,
    key: string,
    __options: GasLimit
  ): Promise<QueryReturnType<Result<string | null, ReturnTypes.LangError>>> {
    return queryOkJSON(
      this.__apiPromise,
      this.__nativeContract,
      this.__callerAddress,
      'psp34Metadata::getAttribute',
      [id, key],
      __options,
      result => {
        return handleReturnType(result, getTypeDescription(26, DATA_TYPE_DESCRIPTIONS))
      }
    )
  }
}
