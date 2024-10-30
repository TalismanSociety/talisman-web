// @ts-nocheck

import { Abi, ContractConfigBuilder, ExtrinsicConfig, ExtrinsicConfigBuilder } from '@galacticcouncil/xcm-core'
import { encodeFunctionData } from 'viem'

import { XcmVersion } from '../types'

const pallet = 'ethereumXcm'

const transact = (config: ContractConfigBuilder): ExtrinsicConfigBuilder => {
  const func = 'transact'
  return {
    build: params => {
      return new ExtrinsicConfig({
        module: pallet,
        func,
        getArgs: () => {
          const contract = config.build(params)
          const version = XcmVersion.v1
          const call = encodeFunctionData({
            abi: Abi[contract.module],
            functionName: contract.func,
            args: contract.args,
          })
          return [
            {
              [version]: {
                gasLimit: 5000000n,
                feePayment: 'Auto',
                action: {
                  Call: contract.address,
                },
                value: 0n,
                input: call,
              },
            },
          ]
        },
      })
    },
  }
}

export const ethereumXcm = () => {
  return {
    transact,
  }
}
