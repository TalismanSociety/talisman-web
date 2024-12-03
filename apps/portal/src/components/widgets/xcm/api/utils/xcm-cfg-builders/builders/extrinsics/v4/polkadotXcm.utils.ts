// @ts-nocheck

import { multiloc, Parachain } from '@galacticcouncil/xcm-core'

import { XcmTransferType, XcmVersion } from '../../types'

const ETHEREUM_CHAIN_ID = 1
const ETHEREUM_BRIDGE_LOCATION = {
  parents: 2,
  interior: {
    X1: [{ GlobalConsensus: { Ethereum: { chain_id: ETHEREUM_CHAIN_ID } } }],
  },
}
const HUB_PARACHAIN_ID = 1000

export const toDest = (version: XcmVersion, destination: Parachain) => {
  if (destination.key === 'polkadot' || destination.key === 'kusama') {
    return {
      [version]: {
        parents: 1,
        interior: 'Here',
      },
    }
  }

  const toParachain = {
    Parachain: destination.key === 'ethereum' ? HUB_PARACHAIN_ID : destination.parachainId,
  }
  return {
    [version]: {
      parents: 1,
      interior: {
        X1: [toParachain],
      },
    },
  }
}

export const toBeneficiary = (version: XcmVersion, account: any) => {
  return {
    [version]: {
      parents: 0,
      interior: {
        X1: [account],
      },
    },
  }
}

export const toTransferType = (version: XcmVersion, type: XcmTransferType, assetLocation: object) => {
  if (type === XcmTransferType.RemoteReserve) {
    const reserveChain = multiloc.findNestedKey(assetLocation, 'Parachain')
    return {
      RemoteReserve: {
        [version]: {
          parents: 1,
          interior: {
            X1: [reserveChain],
          },
        },
      },
    }
  }
  return type
}

export const toAsset = (assetLocation: object, amount: any) => {
  return {
    id: assetLocation,
    fun: {
      Fungible: amount,
    },
  }
}

export const toParaXcmOnDest = (version: XcmVersion, account: any) => {
  return {
    [version]: [
      {
        DepositAsset: {
          assets: { Wild: 'All' },
          beneficiary: {
            parents: 0,
            interior: {
              X1: [account],
            },
          },
        },
      },
    ],
  }
}

/**
 * Instructions are executed in 2 steps:
 *
 * 1) SetAppendix - Error Handling, return everything to sender on Asset hub
 * 2) InitiateReserveWithdraw - Initiate the bridged transfer
 *
 * @param version - XCM Version
 * @param account - destination account (receiver)
 * @param sender - sender account
 * @param transferAssetLocation - transfer asset xcm location
 * @returns xcm ethereum bridge instructions
 */
export const toBridgeXcmOnDest = (version: XcmVersion, account: any, sender: any, transferAssetLocation: object) => {
  return {
    [version]: [
      {
        SetAppendix: [
          {
            DepositAsset: {
              assets: { Wild: 'All' },
              beneficiary: {
                parents: 0,
                interior: {
                  X1: [sender],
                },
              },
            },
          },
        ],
      },
      {
        InitiateReserveWithdraw: {
          assets: {
            Wild: {
              AllOf: {
                id: transferAssetLocation,
                fun: 'Fungible',
              },
            },
          },
          reserve: ETHEREUM_BRIDGE_LOCATION,
          xcm: [
            {
              BuyExecution: {
                fees: {
                  id: reanchorLocation(transferAssetLocation),
                  fun: { Fungible: 1 },
                },
                weightLimit: 'Unlimited',
              },
            },
            {
              DepositAsset: {
                assets: {
                  Wild: {
                    AllCounted: 1,
                  },
                },
                beneficiary: {
                  parents: 0,
                  interior: {
                    X1: [account],
                  },
                },
              },
            },
          ],
        },
      },
    ],
  }
}

/**
 * Re-anchor location of transfer asset in case
 * of bridge transfer for "BuyExecution"
 *
 * @param assetLocation asset multilocation
 * @returns fixed location
 */
const reanchorLocation = (assetLocation: object) => {
  const erc20Key = multiloc.findNestedKey(assetLocation, 'key')
  return {
    parents: 0,
    interior: { X1: [{ AccountKey20: erc20Key }] },
  }
}

export const isParachainPrimaryNativeAsset = (specName: string, assetId?: string) => {
  // in case of empty array, undefined assetId is considered to be the relay chains primary native asset
  if (!assetId) {
    return true
  }

  // if assetId is an empty string
  // treat it as the parachains primary native asset
  if (assetId === '') {
    return true
  }

  // const currentChainId = registry.lookupChainIdBySpecName(specName);
  // const { tokens } = registry.currentRelayRegistry[currentChainId];
  // const primaryParachainNativeAsset = tokens[0];
  // if (primaryParachainNativeAsset.toLowerCase() === assetId.toLowerCase()) {
  // 	return true;
  // }

  return false
}
