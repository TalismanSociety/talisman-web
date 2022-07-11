import { TokenList } from './types'

const parseTokenList = (tokens: Array<any>): TokenList => {
  return Object.fromEntries(
    tokens
      .flatMap(chainToken => [
        {
          ...chainToken?.nativeToken,
          type: 'native',
          chainId: chainToken?.id,
          isTestnet: chainToken?.isTestnet || false,
        },
        ...(chainToken?.tokens || []).map((ormlToken: any) => ({
          ...ormlToken,
          type: 'orml',
          chainId: chainToken?.id,
          isTestnet: chainToken?.isTestnet || false,
        })),
      ])
      .map(token => [token.id, token])
  )
}

export default parseTokenList
