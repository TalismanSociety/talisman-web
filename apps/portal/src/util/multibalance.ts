import { erc20Abi, PublicClient } from 'viem'

const multibalanceAddresses: Record<number, `0x${string}`> = {
  1: '0x99a17464c036309473004e43DBeB9665cc52bBa3',
  10: '0x99a17464c036309473004e43DBeB9665cc52bBa3',
  56: '0x99a17464c036309473004e43DBeB9665cc52bBa3',
  137: '0x99a17464c036309473004e43DBeB9665cc52bBa3',
  8453: '0x99a17464c036309473004e43DBeB9665cc52bBa3',
  42161: '0x99a17464c036309473004e43DBeB9665cc52bBa3',
  43114: '0x99a17464c036309473004e43DBeB9665cc52bBa3',
  8157: '0x99a17464c036309473004e43DBeB9665cc52bBa3',
}

const MultiBalanceAbi = [
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'payload',
        type: 'bytes',
      },
    ],
    name: 'getBalances',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const encodeOwnersAndTokens = (list: { owner: string; token: string }[]) => {
  let bytes = '0x'

  list.forEach(({ owner, token }) => {
    const ownerBytes = owner.startsWith('0x') ? owner.substring(2, 42) : owner
    const tokenBytes = token.startsWith('0x') ? token.substring(2, 42) : token
    bytes += `${ownerBytes}${tokenBytes}`
  })

  return bytes as `0x${string}`
}

export const getMultibalance = async (
  client: { readContract: PublicClient['readContract']; multicall: PublicClient['multicall'] },
  chainId: number,
  data: { owner: string; token: string }[]
): Promise<readonly bigint[]> => {
  const contractAddress = multibalanceAddresses[chainId]
  if (!contractAddress) {
    const balancesRes = await client.multicall({
      contracts: data.map(({ token, owner }) => ({
        abi: erc20Abi,
        functionName: 'balanceOf',
        address: token as `0x${string}`,
        args: [owner],
      })),
    })

    return balancesRes.map(({ result, status }) => {
      if (status === 'failure') return 0n
      return result as bigint
    })
  }

  const encodedData = encodeOwnersAndTokens(data)
  return await client.readContract({
    address: contractAddress,
    abi: MultiBalanceAbi,
    functionName: 'getBalances',
    args: [encodedData],
  })
}
