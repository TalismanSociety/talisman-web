// @ts-nocheck

import { ExtrinsicConfig, ExtrinsicConfigBuilder, Parachain } from '@galacticcouncil/xcm-core'

import { getExtrinsicAccount } from '../ExtrinsicBuilder.utils'

const pallet = 'xTransfer'

export function xTransfer() {
  return {
    transfer: () => {
      const method = 'transfer'
      return {
        here: (): ExtrinsicConfigBuilder => ({
          build: ({ address, amount, destination }) => {
            const rcv = destination.chain as Parachain
            return new ExtrinsicConfig({
              module: pallet,
              func: method,
              getArgs: () => [
                {
                  id: {
                    Concrete: {
                      parents: 0,
                      interior: 'Here',
                    },
                  },
                  fun: {
                    Fungible: amount,
                  },
                },
                {
                  parents: 1,
                  interior: {
                    X2: [
                      {
                        Parachain: rcv.parachainId,
                      },
                      getExtrinsicAccount(address),
                    ],
                  },
                },
                {
                  refTime: 5_000_000_000,
                  proofSize: 0,
                },
              ],
            })
          },
        }),
      }
    },
  }
}
