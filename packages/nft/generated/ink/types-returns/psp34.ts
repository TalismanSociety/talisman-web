import type BN from 'bn.js'
import type { ReturnNumber } from '@727-ventures/typechain-types'

export type AccountId = string | number[]

export enum LangError {
  couldNotReadInput = 'CouldNotReadInput',
}

export interface Id {
  u8?: number
  u16?: number
  u32?: number
  u64?: number
  u128?: ReturnNumber
  bytes?: Array<number>
}

export class IdBuilder {
  static U8(value: number): Id {
    return {
      u8: value,
    }
  }
  static U16(value: number): Id {
    return {
      u16: value,
    }
  }
  static U32(value: number): Id {
    return {
      u32: value,
    }
  }
  static U64(value: number): Id {
    return {
      u64: value,
    }
  }
  static U128(value: ReturnNumber): Id {
    return {
      u128: value,
    }
  }
  static Bytes(value: Array<number>): Id {
    return {
      bytes: value,
    }
  }
}

export interface PSP34Error {
  custom?: string
  selfApprove?: null
  notApproved?: null
  tokenExists?: null
  tokenNotExists?: null
  safeTransferCheckFailed?: string
}

export class PSP34ErrorBuilder {
  static Custom(value: string): PSP34Error {
    return {
      custom: value,
    }
  }
  static SelfApprove(): PSP34Error {
    return {
      selfApprove: null,
    }
  }
  static NotApproved(): PSP34Error {
    return {
      notApproved: null,
    }
  }
  static TokenExists(): PSP34Error {
    return {
      tokenExists: null,
    }
  }
  static TokenNotExists(): PSP34Error {
    return {
      tokenNotExists: null,
    }
  }
  static SafeTransferCheckFailed(value: string): PSP34Error {
    return {
      safeTransferCheckFailed: value,
    }
  }
}
