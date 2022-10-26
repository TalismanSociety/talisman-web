import Button from '@components/atoms/Button'
import { Lock } from '@components/atoms/Icon'
import Identicon from '@components/atoms/Identicon'
import Text from '@components/atoms/Text'
import { useTheme } from '@emotion/react'
import React, { ReactElement } from 'react'

export type PoolUnstakeProps = {
  accountName: string
  accountAddress: string
  unstakingAmount: string
  unstakingFiatAmount: string
  timeTilWithdrawable?: string
  onRequestWithdraw: () => unknown
  withdrawState?: 'pending' | 'disabled'
}

const PoolUnstake = (props: PoolUnstakeProps) => {
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
      <Identicon value={props.accountAddress} size={40} />
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
            '> div:first-child': {
              flex: 1,
              overflow: 'hidden',
              justifyContent: 'flex-start',
              dd: { textAlign: 'start' },
            },
            '> div': {
              justifyContent: 'flex-end',
            },
            '> div:last-child': {
              flex: 1,
              overflow: 'hidden',
              justifyContent: props.timeTilWithdrawable === undefined ? 'flex-start' : undefined,
            },
            'dt': {
              display: 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            },
            'dd': {
              'marginLeft': '2rem',
              'overflow': 'hidden',
              '> div': {
                overflow: 'hidden',
              },
            },
          },
        }}
      >
        <div>
          <dt>Account</dt>
          <dd>
            <div>
              <Text.Body alpha="high" css={{ '@media (min-width: 1024px)': { textAlign: 'left' } }}>
                {props.accountName}
              </Text.Body>
            </div>
            <div>
              <Text.Body>
                ({props.accountAddress.slice(0, 4)}...{props.accountAddress.slice(-4)})
              </Text.Body>
            </div>
          </dd>
        </div>
        <div>
          <dt>Unstaking</dt>
          <dd>
            <div>
              <Text.Body css={{ fontSize: '1.6rem', fontWeight: 'bold' }}>
                {props.unstakingAmount}
                {props.timeTilWithdrawable !== undefined && (
                  <Lock width="1.2rem" height="1.2rem" css={{ marginLeft: '0.4rem' }} />
                )}
              </Text.Body>
            </div>
            <div>
              <Text.Body>{props.unstakingFiatAmount}</Text.Body>
            </div>
          </dd>
        </div>
        {props.timeTilWithdrawable !== undefined && (
          <div
            css={{
              '@media (min-width: 1024px)': { flex: 1, display: 'flex' },
            }}
          >
            <dt>Status</dt>
            <dd>
              <div>
                <Text.Body alpha="high">Unstaking</Text.Body>
              </div>
              <div>
                <Text.Body>{props.timeTilWithdrawable}</Text.Body>
              </div>
            </dd>
          </div>
        )}
      </dl>
      {props.timeTilWithdrawable === undefined && (
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
          <Button
            variant="outlined"
            onClick={props.onRequestWithdraw}
            disabled={props.withdrawState === 'disabled'}
            loading={props.withdrawState === 'pending'}
          >
            Withdraw
          </Button>
        </section>
      )}
    </article>
  )
}

export type PoolUnstakeListProps = {
  children?: ReactElement<PoolUnstakeProps> | ReactElement<PoolUnstakeProps>[]
}

export const PoolUnstakeList = (props: PoolUnstakeListProps) => {
  const theme = useTheme()
  return (
    <ol
      css={{
        'listStyle': 'none',
        'margin': 0,
        'padding': 0,
        'li + li': {
          marginTop: '1.6rem',
        },
        '@media (min-width: 1024px)': {
          'background': theme.color.surface,
          'borderRadius': '1.6rem',
          'li + li': { marginTop: 0, borderTop: 'solid 1px #383838' },
        },
      }}
    >
      {props.children && React.Children.map(props.children, child => <li key={child.key}>{child}</li>)}
    </ol>
  )
}

export default PoolUnstake
