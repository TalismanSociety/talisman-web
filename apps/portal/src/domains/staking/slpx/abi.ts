export default [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_BNCAddress',
        type: 'address',
      },
      {
        internalType: 'uint32',
        name: '_bifrostParaId',
        type: 'uint32',
      },
      {
        internalType: 'bytes2',
        name: '_nativeCurrencyId',
        type: 'bytes2',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'minter',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'assetAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'callcode',
        type: 'bytes',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'remark',
        type: 'string',
      },
    ],
    name: 'Mint',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'assetAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'remark',
        type: 'string',
      },
    ],
    name: 'mintVAsset',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'remark',
        type: 'string',
      },
    ],
    name: 'mintVNativeAsset',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'redeemer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'assetAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'callcode',
        type: 'bytes',
      },
    ],
    name: 'Redeem',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'vAssetAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
    ],
    name: 'redeemAsset',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'assetAddress',
        type: 'address',
      },
      {
        internalType: 'bytes2',
        name: 'currencyId',
        type: 'bytes2',
      },
      {
        internalType: 'uint256',
        name: 'minimumValue',
        type: 'uint256',
      },
    ],
    name: 'setAssetAddressInfo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum MoonbeamSlpx.Operation',
        name: '_operation',
        type: 'uint8',
      },
      {
        internalType: 'uint64',
        name: '_transactRequiredWeightAtMost',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: '_overallWeight',
        type: 'uint64',
      },
      {
        internalType: 'uint256',
        name: '_feeAmount',
        type: 'uint256',
      },
    ],
    name: 'setOperationToFeeInfo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'poolId',
        type: 'uint32',
      },
      {
        internalType: 'address',
        name: 'assetInAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'assetOutAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'assetInAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint128',
        name: 'minDy',
        type: 'uint128',
      },
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
    ],
    name: 'stablePoolSwap',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'swapper',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'poolId',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'assetInAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'assetOutAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'assetInAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'minDy',
        type: 'uint128',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'callcode',
        type: 'bytes',
      },
    ],
    name: 'StablePoolSwap',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'swapper',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'assetInAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'assetOutAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'assetInAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'assetOutMin',
        type: 'uint128',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'callcode',
        type: 'bytes',
      },
    ],
    name: 'Swap',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'assetInAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'assetOutAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'assetInAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint128',
        name: 'assetOutMin',
        type: 'uint128',
      },
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
    ],
    name: 'swapAssetsForExactAssets',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'assetInAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'assetInAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint128',
        name: 'assetOutMin',
        type: 'uint128',
      },
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
    ],
    name: 'swapAssetsForExactNativeAssets',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'assetOutAddress',
        type: 'address',
      },
      {
        internalType: 'uint128',
        name: 'assetOutMin',
        type: 'uint128',
      },
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
    ],
    name: 'swapNativeAssetsForExactAssets',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'addressToAssetInfo',
    outputs: [
      {
        internalType: 'bytes2',
        name: 'currencyId',
        type: 'bytes2',
      },
      {
        internalType: 'uint256',
        name: 'operationalMin',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'bifrostParaId',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'BNCAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum MoonbeamSlpx.Operation',
        name: '',
        type: 'uint8',
      },
    ],
    name: 'operationToFeeInfo',
    outputs: [
      {
        internalType: 'uint64',
        name: 'transactRequiredWeightAtMost',
        type: 'uint64',
      },
      {
        internalType: 'uint256',
        name: 'feeAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint64',
        name: 'overallWeight',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
