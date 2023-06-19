/* This file is auto-generated */

import type { ContractPromise } from '@polkadot/api-contract'
import type { KeyringPair } from '@polkadot/keyring/types'
import type { ApiPromise } from '@polkadot/api'
import type { GasLimit, GasLimitAndRequiredValue, Result } from '@727-ventures/typechain-types'
import { txSignAndSend } from '@727-ventures/typechain-types'
import type * as ArgumentTypes from '../types-arguments/psp34.js'
import type BN from 'bn.js'
// @ts-ignore
import type { EventRecord } from '@polkadot/api/submittable'
import { decodeEvents } from '../shared/utils.js'
import EVENT_DATA_TYPE_DESCRIPTIONS from '../event-data/psp34.json'

export default class Methods {
  readonly __nativeContract: ContractPromise
  readonly __keyringPair: KeyringPair
  readonly __apiPromise: ApiPromise

  constructor(apiPromise: ApiPromise, nativeContract: ContractPromise, keyringPair: KeyringPair) {
    this.__apiPromise = apiPromise
    this.__nativeContract = nativeContract
    this.__keyringPair = keyringPair
  }

  /**
   * totalSupply
   *
   */
  totalSupply(__options?: GasLimit) {
    return txSignAndSend(
      this.__apiPromise,
      this.__nativeContract,
      this.__keyringPair,
      'psp34::totalSupply',
      (events: EventRecord) => {
        return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS)
      },
      [],
      __options
    )
  }

  /**
   * balanceOf
   *
   * @param { ArgumentTypes.AccountId } owner,
   */
  balanceOf(owner: ArgumentTypes.AccountId, __options?: GasLimit) {
    return txSignAndSend(
      this.__apiPromise,
      this.__nativeContract,
      this.__keyringPair,
      'psp34::balanceOf',
      (events: EventRecord) => {
        return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS)
      },
      [owner],
      __options
    )
  }

  /**
   * ownerOf
   *
   * @param { ArgumentTypes.Id } id,
   */
  ownerOf(id: ArgumentTypes.Id, __options?: GasLimit) {
    return txSignAndSend(
      this.__apiPromise,
      this.__nativeContract,
      this.__keyringPair,
      'psp34::ownerOf',
      (events: EventRecord) => {
        return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS)
      },
      [id],
      __options
    )
  }

  /**
   * collectionId
   *
   */
  collectionId(__options?: GasLimit) {
    return txSignAndSend(
      this.__apiPromise,
      this.__nativeContract,
      this.__keyringPair,
      'psp34::collectionId',
      (events: EventRecord) => {
        return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS)
      },
      [],
      __options
    )
  }

  /**
   * allowance
   *
   * @param { ArgumentTypes.AccountId } owner,
   * @param { ArgumentTypes.AccountId } operator,
   * @param { ArgumentTypes.Id | null } id,
   */
  allowance(
    owner: ArgumentTypes.AccountId,
    operator: ArgumentTypes.AccountId,
    id: ArgumentTypes.Id | null,
    __options?: GasLimit
  ) {
    return txSignAndSend(
      this.__apiPromise,
      this.__nativeContract,
      this.__keyringPair,
      'psp34::allowance',
      (events: EventRecord) => {
        return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS)
      },
      [owner, operator, id],
      __options
    )
  }

  /**
   * approve
   *
   * @param { ArgumentTypes.AccountId } operator,
   * @param { ArgumentTypes.Id | null } id,
   * @param { boolean } approved,
   */
  approve(operator: ArgumentTypes.AccountId, id: ArgumentTypes.Id | null, approved: boolean, __options?: GasLimit) {
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
   */
  transfer(to: ArgumentTypes.AccountId, id: ArgumentTypes.Id, data: Array<number | string | BN>, __options?: GasLimit) {
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
   */
  burn(account: ArgumentTypes.AccountId, id: ArgumentTypes.Id, __options?: GasLimit) {
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
   */
  mint(account: ArgumentTypes.AccountId, id: ArgumentTypes.Id, __options?: GasLimit) {
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
   */
  ownersTokenByIndex(owner: ArgumentTypes.AccountId, index: string | number | BN, __options?: GasLimit) {
    return txSignAndSend(
      this.__apiPromise,
      this.__nativeContract,
      this.__keyringPair,
      'psp34Enumerable::ownersTokenByIndex',
      (events: EventRecord) => {
        return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS)
      },
      [owner, index],
      __options
    )
  }

  /**
   * tokenByIndex
   *
   * @param { (string | number | BN) } index,
   */
  tokenByIndex(index: string | number | BN, __options?: GasLimit) {
    return txSignAndSend(
      this.__apiPromise,
      this.__nativeContract,
      this.__keyringPair,
      'psp34Enumerable::tokenByIndex',
      (events: EventRecord) => {
        return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS)
      },
      [index],
      __options
    )
  }

  /**
   * getAttribute
   *
   * @param { ArgumentTypes.Id } id,
   * @param { string } key,
   */
  getAttribute(id: ArgumentTypes.Id, key: string, __options?: GasLimit) {
    return txSignAndSend(
      this.__apiPromise,
      this.__nativeContract,
      this.__keyringPair,
      'psp34Metadata::getAttribute',
      (events: EventRecord) => {
        return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS)
      },
      [id, key],
      __options
    )
  }
}
