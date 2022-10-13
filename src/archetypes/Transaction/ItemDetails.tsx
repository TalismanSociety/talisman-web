import { Chain } from '@archetypes'
import { Info } from '@components'
import styled from '@emotion/styled'
import { ReactComponent as _ArrowRight } from '@icons/arrow-right.svg'
import { encodeAnyAddress, formatDecimals } from '@talismn/util'
import { truncateAddress } from '@util/helpers'
import startCase from 'lodash/startCase'
import { useTranslation } from 'react-i18next'

import { Avatar } from './Avatar'
import { ParsedTransaction } from './types'

type Props = {
  parsed: ParsedTransaction | null | undefined
  addresses: string[]
}
export const ItemDetails = ({ parsed, addresses }: Props) => {
  const { t } = useTranslation()
  if (!parsed) return <div />

  switch (parsed.type) {
    case 'transfer': {
      const genericAddresses = addresses.map(a => encodeAnyAddress(a))
      const from = encodeAnyAddress(parsed.from)
      const to = encodeAnyAddress(parsed.to)
      const isReceiver = genericAddresses.includes(to) && !genericAddresses.includes(from)

      const tokenInfo = (
        <Info
          title={`${formatDecimals(parsed.amount)} ${parsed.tokenSymbol}`}
          subtitle="$xx.xx"
          graphic={<Chain.LogoById id={parsed.chainId} />}
        />
      )
      const senderInfo = (
        <Info title="From" subtitle={truncateAddress(parsed.from, 4)} graphic={<Avatar value={parsed.from} />} />
      )
      const receiverInfo = (
        <Info title="To" subtitle={truncateAddress(parsed.to, 4)} graphic={<Avatar value={parsed.to} />} />
      )

      return (
        <div className="details">
          {isReceiver ? senderInfo : tokenInfo}

          <ArrowRight />

          {isReceiver ? tokenInfo : receiverInfo}
        </div>
      )
    }

    case 'contribute': {
      const tokenInfo = (
        <Info
          title={`${formatDecimals(parsed.amount)} ${parsed.tokenSymbol}`}
          subtitle="$xx.xx"
          graphic={<Chain.LogoById id={parsed.chainId} />}
        />
      )
      const fundInfo = (
        <Info
          title={t('To')}
          subtitle={`${t('Crowdloan')} ${parsed.fund}`}
          graphic={<Chain.LogoById id={parsed.chainId} />}
        />
      )

      return (
        <div className="details">
          {tokenInfo}

          <ArrowRight />

          {fundInfo}
        </div>
      )
    }

    case 'stake': {
      const tokenInfo = (
        <Info
          title={`${formatDecimals(parsed.amount)} ${parsed.tokenSymbol}`}
          subtitle="$xx.xx"
          graphic={<Chain.LogoById id={parsed.chainId} />}
        />
      )
      const stakeInfo = (
        <Info
          title={startCase(parsed.chainId)}
          subtitle={t('Staking balance')}
          graphic={<Chain.LogoById id={parsed.chainId} />}
        />
      )

      return (
        <div className="details">
          {tokenInfo}

          <ArrowRight />

          {stakeInfo}
        </div>
      )
    }

    case 'unstake': {
      return (
        <div className="details">
          {process.env.NODE_ENV === 'development' && <pre>{JSON.stringify(parsed, null, 2)}</pre>}
        </div>
      )
    }

    // case 'add liquidity': {
    //   return (
    //     <div className="details">
    //       {process.env.NODE_ENV === 'development' && <pre>{JSON.stringify(parsed, null, 2)}</pre>}
    //     </div>
    //   )
    // }
    // case 'remove liquidity': {
    //   return (
    //     <div className="details">
    //       {process.env.NODE_ENV === 'development' && <pre>{JSON.stringify(parsed, null, 2)}</pre>}
    //     </div>
    //   )
    // }

    // case 'add provision': {
    //   return (
    //     <div className="details">
    //       {process.env.NODE_ENV === 'development' && <pre>{JSON.stringify(parsed, null, 2)}</pre>}
    //     </div>
    //   )
    // }
    // case 'remove provision': {
    //   return (
    //     <div className="details">
    //       {process.env.NODE_ENV === 'development' && <pre>{JSON.stringify(parsed, null, 2)}</pre>}
    //     </div>
    //   )
    // }

    case 'swap': {
      return (
        <div className="details">
          {process.env.NODE_ENV === 'development' && <pre>{JSON.stringify(parsed, null, 2)}</pre>}
        </div>
      )
    }

    default:
      const exhaustiveCheck: never = parsed
      throw new Error(`Unhandled transaction type ${exhaustiveCheck}`)
  }
}

const ArrowRight = styled(_ArrowRight)`
  display: block;
  height: auto;
`
