import Button from '@components/atoms/Button'
import { Edit } from '@components/atoms/Icon'
import Text from '@components/atoms/Text'
import { useTheme } from '@emotion/react'
import Identicon from '@polkadot/react-identicon'

import { PoolStatusIndicator } from '../PoolStatusIndicator'

export type PoolStakeProps = {
  accountName: string
  accountAddress: string
  stakingAmount: string
  stakingAmountInFiat: string
  rewardsAmount: string
  rewardsAmountInFiat: string
  poolName: string
}

const PoolStake = (props: PoolStakeProps) => {
  const theme = useTheme()
  return (
    <article
      css={{
        'display': 'flex',
        'flexDirection': 'column',
        'padding': '1.6rem',
        'borderRadius': '1.6rem',
        'backgroundColor': theme.color.surface,
        '@media (min-width: 1024px)': {
          flexDirection: 'row',
          alignItems: 'center',
        },
      }}
    >
      <Identicon value="143wN4e1nTTWJZHy1CFVXDHpAg6YJsNn2jDN52J2Xfjf8MWs" size={40} theme="polkadot" />
      <dl
        css={{
          'display': 'flex',
          'flexDirection': 'column',
          'gap': '2rem',
          '> div': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
          'dd': {
            textAlign: 'right',
          },
          '@media (min-width: 1024px)': {
            'flex': 1,
            'flexDirection': 'row',
            'alignItems': 'flex-start',
            'margin': 0,
            'overflow': 'hidden',
            'span': {
              display: 'block',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
            'dt': {
              display: 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            },
            'dd': {
              'textAlign': 'left',
              'marginLeft': '2rem',
              'overflow': 'hidden',
              '> div': {
                overflow: 'hidden',
              },
            },
            '> div': {
              flex: 1,
              overflow: 'hidden',
            },
            '> div:last-child': {
              flex: 2,
            },
          },
        }}
      >
        <div>
          <dt>Account</dt>
          <dd>
            <div>
              <Text.Body alpha="high">{props.accountName}</Text.Body>
            </div>
            <div>
              <Text.Body>{props.accountAddress}</Text.Body>
            </div>
          </dd>
        </div>
        <div>
          <dt>Staking</dt>
          <dd>
            <div>
              <Text.Body alpha="high">{props.stakingAmount}</Text.Body>
            </div>
            <div>
              <Text.Body>{props.stakingAmountInFiat}</Text.Body>
            </div>
          </dd>
        </div>
        <div>
          <dt>Rewards</dt>
          <dd>
            <div>
              <Text.Body alpha="high">{props.rewardsAmount}</Text.Body>
            </div>
            <div>
              <Text.Body>{props.rewardsAmountInFiat}</Text.Body>
            </div>
          </dd>
        </div>
        <div
          css={{
            '@media (min-width: 1024px)': { flex: 3 },
          }}
        >
          <dt>Pool</dt>
          <dd css={{ display: 'flex', alignItems: 'center', gap: '0.24rem' }}>
            <PoolStatusIndicator status="success" />
            <Text alpha="high" css={{ marginLeft: '0.8rem' }}>
              {props.poolName}
            </Text>
            <button css={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <Edit width="1.6rem" />
            </button>
          </dd>
        </div>
      </dl>
      <section
        css={{
          'display': 'flex',
          'gap': '1rem',
          'marginTop': '2.5rem',
          '> *': {
            flex: 1,
          },
          '@media (min-width: 1024px)': {
            marginTop: 0,
          },
        }}
      >
        <Button variant="outlined">Claim</Button>
        <Button variant="outlined">Add</Button>
        <Button variant="outlined">Unstake</Button>
      </section>
    </article>
  )
}

export default PoolStake
