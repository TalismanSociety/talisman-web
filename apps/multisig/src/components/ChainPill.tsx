import { Chain } from '../domains/chains'

type Props = {
  chain: Chain
  identiconSize?: number
}

export const ChainPill: React.FC<Props> = ({ chain, identiconSize = 24 }) => {
  return (
    <div css={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <img css={{ marginBottom: '2px', height: identiconSize }} src={chain.logo} alt={chain.chainName} />
      <p css={{ marginTop: 4 }}>{chain.chainName}</p>
    </div>
  )
}
