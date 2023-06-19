/* This file is auto-generated */

import type { ContractPromise } from '@polkadot/api-contract'
import type { GasLimit, GasLimitAndRequiredValue } from '@727-ventures/typechain-types'
import { buildSubmittableExtrinsic } from '@727-ventures/typechain-types'
import type * as ArgumentTypes from '../types-arguments/psp34.js'
import type BN from 'bn.js'
import type { ApiPromise } from '@polkadot/api'

export default class Methods {
  readonly __nativeContract: ContractPromise
  readonly __apiPromise: ApiPromise

  constructor(nativeContract: ContractPromise, apiPromise: ApiPromise) {
    this.__nativeContract = nativeContract
    this.__apiPromise = apiPromise
  }
  /**
   * totalSupply
   *
   */
  totalSupply(__options: GasLimit) {
    return buildSubmittableExtrinsic(this.__apiPromise, this.__nativeContract, 'psp34::totalSupply', [], __options)
  }

  /**
   * balanceOf
   *
   * @param { ArgumentTypes.AccountId } owner,
   */
  balanceOf(owner: ArgumentTypes.AccountId, __options: GasLimit) {
    return buildSubmittableExtrinsic(this.__apiPromise, this.__nativeContract, 'psp34::balanceOf', [owner], __options)
  }

  /**
   * ownerOf
   *
   * @param { ArgumentTypes.Id } id,
   */
  ownerOf(id: ArgumentTypes.Id, __options: GasLimit) {
    return buildSubmittableExtrinsic(this.__apiPromise, this.__nativeContract, 'psp34::ownerOf', [id], __options)
  }

  /**
   * collectionId
   *
   */
  collectionId(__options: GasLimit) {
    return buildSubmittableExtrinsic(this.__apiPromise, this.__nativeContract, 'psp34::collectionId', [], __options)
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
    __options: GasLimit
  ) {
    return buildSubmittableExtrinsic(
      this.__apiPromise,
      this.__nativeContract,
      'psp34::allowance',
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
  approve(operator: ArgumentTypes.AccountId, id: ArgumentTypes.Id | null, approved: boolean, __options: GasLimit) {
    return buildSubmittableExtrinsic(
      this.__apiPromise,
      this.__nativeContract,
      'psp34::approve',
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
  transfer(to: ArgumentTypes.AccountId, id: ArgumentTypes.Id, data: Array<number | string | BN>, __options: GasLimit) {
    return buildSubmittableExtrinsic(
      this.__apiPromise,
      this.__nativeContract,
      'psp34::transfer',
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
  burn(account: ArgumentTypes.AccountId, id: ArgumentTypes.Id, __options: GasLimit) {
    return buildSubmittableExtrinsic(
      this.__apiPromise,
      this.__nativeContract,
      'psp34Burnable::burn',
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
  mint(account: ArgumentTypes.AccountId, id: ArgumentTypes.Id, __options: GasLimit) {
    return buildSubmittableExtrinsic(
      this.__apiPromise,
      this.__nativeContract,
      'psp34Mintable::mint',
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
  ownersTokenByIndex(owner: ArgumentTypes.AccountId, index: string | number | BN, __options: GasLimit) {
    return buildSubmittableExtrinsic(
      this.__apiPromise,
      this.__nativeContract,
      'psp34Enumerable::ownersTokenByIndex',
      [owner, index],
      __options
    )
  }

  /**
   * tokenByIndex
   *
   * @param { (string | number | BN) } index,
   */
  tokenByIndex(index: string | number | BN, __options: GasLimit) {
    return buildSubmittableExtrinsic(
      this.__apiPromise,
      this.__nativeContract,
      'psp34Enumerable::tokenByIndex',
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
  getAttribute(id: ArgumentTypes.Id, key: string, __options: GasLimit) {
    return buildSubmittableExtrinsic(
      this.__apiPromise,
      this.__nativeContract,
      'psp34Metadata::getAttribute',
      [id, key],
      __options
    )
  }
}
