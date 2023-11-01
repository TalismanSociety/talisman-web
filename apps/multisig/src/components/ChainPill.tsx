import { Chain } from '../domains/chains'

type Props = {
  chain: Chain
}

export const ChainPill: React.FC<Props> = ({ chain }) => {
  return (
    <div css={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <img css={{ marginBottom: '2px' }} height={24} src={chain.logo} alt={chain.chainName} />
      <p>{chain.chainName}</p>
    </div>
  )
}
