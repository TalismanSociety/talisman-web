import { Address, defineChain } from 'viem'

const addresses: Record<number, Record<VanaContract, Address>> = {
  // Moksha Testnet
  14800: {
    DataRegistryProxy: '0x8C8788f98385F6ba1adD4234e551ABba0f82Cb7C',
    TeePoolProxy: '0xE8EC6BD73b23Ad40E6B9a6f4bD343FAc411bD99A',
    DataLiquidityPoolProxy: '0x0161DFbf70a912668dd1B4365b43c1348e8bD3ab',
  },
  // Mainnet
  1480: {
    DataRegistryProxy: '0x8C8788f98385F6ba1adD4234e551ABba0f82Cb7C',
    TeePoolProxy: '0xE8EC6BD73b23Ad40E6B9a6f4bD343FAc411bD99A',
    DataLiquidityPoolProxy: '0x0161DFbf70a912668dd1B4365b43c1348e8bD3ab',
  },
}

type VanaContracts = 'DataRegistryProxy' | 'TeePoolProxy' | 'DataLiquidityPoolProxy'
type VanaContract = VanaContracts[number]

export const vanaMainnet = defineChain({
  id: 1480,
  caipNetworkId: 'eip155:1480',
  chainNamespace: 'eip155',
  name: 'VANA - Mainnet',
  nativeCurrency: {
    name: 'VANA',
    symbol: 'VANA',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.vana.org'],
    },
  },
  blockExplorers: {
    default: {
      url: 'https://vanascan.io',
      name: 'VANAScan',
    },
    etherscan: {
      url: 'https://vanascan.io',
      name: 'VANAScan',
    },
  },
  contracts: {
    dataRegistry: { address: getContractAddress(1480, 'DataRegistryProxy') },
  },
  abis: {
    dataRegistry: getDataRegistryImplementationAbi(),
  },
})

function getContractAddress(chainId: number, contract: VanaContract) {
  const contractAddress = addresses[chainId]?.[contract]
  if (!contractAddress) {
    throw new Error(`Contract address not found for ${contract} on chain ${chainId}`)
  }
  return contractAddress
}

function getDataRegistryImplementationAbi() {
  return [
    { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
    { inputs: [], name: 'AccessControlBadConfirmation', type: 'error' },
    {
      inputs: [
        { internalType: 'address', name: 'account', type: 'address' },
        { internalType: 'bytes32', name: 'neededRole', type: 'bytes32' },
      ],
      name: 'AccessControlUnauthorizedAccount',
      type: 'error',
    },
    {
      inputs: [{ internalType: 'address', name: 'target', type: 'address' }],
      name: 'AddressEmptyCode',
      type: 'error',
    },
    {
      inputs: [{ internalType: 'address', name: 'implementation', type: 'address' }],
      name: 'ERC1967InvalidImplementation',
      type: 'error',
    },
    { inputs: [], name: 'ERC1967NonPayable', type: 'error' },
    { inputs: [], name: 'EnforcedPause', type: 'error' },
    { inputs: [], name: 'ExpectedPause', type: 'error' },
    { inputs: [], name: 'FailedInnerCall', type: 'error' },
    { inputs: [], name: 'FileUrlAlreadyUsed', type: 'error' },
    { inputs: [], name: 'InvalidInitialization', type: 'error' },
    { inputs: [], name: 'NotFileOwner', type: 'error' },
    { inputs: [], name: 'NotInitializing', type: 'error' },
    { inputs: [], name: 'UUPSUnauthorizedCallContext', type: 'error' },
    {
      inputs: [{ internalType: 'bytes32', name: 'slot', type: 'bytes32' }],
      name: 'UUPSUnsupportedProxiableUUID',
      type: 'error',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'uint256',
          name: 'fileId',
          type: 'uint256',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'ownerAddress',
          type: 'address',
        },
        { indexed: false, internalType: 'string', name: 'url', type: 'string' },
      ],
      name: 'FileAdded',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint64',
          name: 'version',
          type: 'uint64',
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
          indexed: true,
          internalType: 'uint256',
          name: 'fileId',
          type: 'uint256',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
      ],
      name: 'PermissionGranted',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'uint256',
          name: 'fileId',
          type: 'uint256',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'ownerAddress',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'proofIndex',
          type: 'uint256',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'dlpId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'score',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'string',
          name: 'proofUrl',
          type: 'string',
        },
      ],
      name: 'ProofAdded',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'previousAdminRole',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'newAdminRole',
          type: 'bytes32',
        },
      ],
      name: 'RoleAdminChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleGranted',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleRevoked',
      type: 'event',
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
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'implementation',
          type: 'address',
        },
      ],
      name: 'Upgraded',
      type: 'event',
    },
    {
      inputs: [],
      name: 'DEFAULT_ADMIN_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'MAINTAINER_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'UPGRADE_INTERFACE_VERSION',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'string', name: 'url', type: 'string' }],
      name: 'addFile',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'uint256', name: 'fileId', type: 'uint256' },
        { internalType: 'address', name: 'account', type: 'address' },
        { internalType: 'string', name: 'key', type: 'string' },
      ],
      name: 'addFilePermission',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'url', type: 'string' },
        { internalType: 'address', name: 'ownerAddress', type: 'address' },
        {
          components: [
            { internalType: 'address', name: 'account', type: 'address' },
            { internalType: 'string', name: 'key', type: 'string' },
          ],
          internalType: 'struct IDataRegistry.Permission[]',
          name: 'permissions',
          type: 'tuple[]',
        },
      ],
      name: 'addFileWithPermissions',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'uint256', name: 'fileId', type: 'uint256' },
        {
          components: [
            { internalType: 'bytes', name: 'signature', type: 'bytes' },
            {
              components: [
                { internalType: 'uint256', name: 'score', type: 'uint256' },
                { internalType: 'uint256', name: 'dlpId', type: 'uint256' },
                { internalType: 'string', name: 'metadata', type: 'string' },
                { internalType: 'string', name: 'proofUrl', type: 'string' },
                { internalType: 'string', name: 'instruction', type: 'string' },
              ],
              internalType: 'struct IDataRegistry.ProofData',
              name: 'data',
              type: 'tuple',
            },
          ],
          internalType: 'struct IDataRegistry.Proof',
          name: 'proof',
          type: 'tuple',
        },
      ],
      name: 'addProof',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'string', name: 'url', type: 'string' }],
      name: 'fileIdByUrl',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'uint256', name: 'fileId', type: 'uint256' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'filePermissions',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'uint256', name: 'fileId', type: 'uint256' },
        { internalType: 'uint256', name: 'index', type: 'uint256' },
      ],
      name: 'fileProofs',
      outputs: [
        {
          components: [
            { internalType: 'bytes', name: 'signature', type: 'bytes' },
            {
              components: [
                { internalType: 'uint256', name: 'score', type: 'uint256' },
                { internalType: 'uint256', name: 'dlpId', type: 'uint256' },
                { internalType: 'string', name: 'metadata', type: 'string' },
                { internalType: 'string', name: 'proofUrl', type: 'string' },
                { internalType: 'string', name: 'instruction', type: 'string' },
              ],
              internalType: 'struct IDataRegistry.ProofData',
              name: 'data',
              type: 'tuple',
            },
          ],
          internalType: 'struct IDataRegistry.Proof',
          name: '',
          type: 'tuple',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint256', name: 'fileId', type: 'uint256' }],
      name: 'files',
      outputs: [
        {
          components: [
            { internalType: 'uint256', name: 'id', type: 'uint256' },
            { internalType: 'address', name: 'ownerAddress', type: 'address' },
            { internalType: 'string', name: 'url', type: 'string' },
            { internalType: 'uint256', name: 'addedAtBlock', type: 'uint256' },
          ],
          internalType: 'struct IDataRegistry.FileResponse',
          name: '',
          type: 'tuple',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'filesCount',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleAdmin',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'grantRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'hasRole',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'trustedForwarderAddress',
          type: 'address',
        },
        { internalType: 'address', name: 'ownerAddress', type: 'address' },
      ],
      name: 'initialize',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'forwarder', type: 'address' }],
      name: 'isTrustedForwarder',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes[]', name: 'data', type: 'bytes[]' }],
      name: 'multicall',
      outputs: [{ internalType: 'bytes[]', name: 'results', type: 'bytes[]' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'pause',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'paused',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'proxiableUUID',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'callerConfirmation', type: 'address' },
      ],
      name: 'renounceRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'revokeRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
      name: 'supportsInterface',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'trustedForwarder',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
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
      inputs: [
        {
          internalType: 'address',
          name: 'trustedForwarderAddress',
          type: 'address',
        },
      ],
      name: 'updateTrustedForwarder',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'newImplementation', type: 'address' },
        { internalType: 'bytes', name: 'data', type: 'bytes' },
      ],
      name: 'upgradeToAndCall',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'version',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'pure',
      type: 'function',
    },
  ]
}
