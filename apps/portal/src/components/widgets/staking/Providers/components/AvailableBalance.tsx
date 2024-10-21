import useAvailableBalance from '../hooks/nominationPools/useAvailableBalance'
import { StakeProvider } from '../hooks/useProvidersData'
import { IToken } from '@talismn/chaindata-provider'
import { Decimal } from '@talismn/math'

const balanceFormatter = (balance: bigint, nativeToken: IToken | undefined) => {
  const formattedBalance = Decimal.fromPlanck(balance ?? 0n, nativeToken?.decimals ?? 0, {
    currency: nativeToken?.symbol,
  }).toLocaleString()
  return formattedBalance
}

const NominationPoolAvailableBalance = ({ rpcId, nativeToken }: { rpcId: string; nativeToken: IToken | undefined }) => {
  const availableBalance = useAvailableBalance({ rpcId })

  return <>{balanceFormatter(availableBalance, nativeToken)}</>
}

const AvailableBalance = ({
  type,
  rpcId,
  nativeToken,
}: {
  type: StakeProvider
  rpcId: string
  nativeToken: IToken | undefined
}) => {
  switch (type) {
    case 'Nomination pool':
      return <NominationPoolAvailableBalance rpcId={rpcId} nativeToken={nativeToken} />
    default:
      return <div>Banana</div>
  }
}

export default AvailableBalance
