import { toHex } from '@polkadot-api/utils'
import { AccountId } from 'polkadot-api'
import { Vector, u8 } from 'scale-ts'

export const BittensorAccountPrefix = 42
export const BittensorAccountId = AccountId(BittensorAccountPrefix)

/**
 * Subtensor runtime APIs are double-encoded.
 *
 * For requests, the parameters are first SCALE-encoded using their types.
 * The result of this type encoding is a byte array (`requestBytes`).
 * This byte array is then *again* encoded as a `Vector(u8)`, and **those** bytes are submitted to the chain.
 */
export const vecEncodeParams = (requestBytes: Uint8Array) => toHex(Vector(u8).enc(Array.from(requestBytes)))

/**
 * Subtensor runtime APIs are double-encoded.
 *
 * For responses, the bytes of the result are first SCALE-decoded as a `Vector(u8)`.
 * The result of this decoding is a byte array (which is the return value of this function).
 * This byte array is then *again* decoded using the SCALE type of the response.
 */
export const vecDecodeResult = (resultBytes: string) => new Uint8Array(Vector(u8).dec(resultBytes))
