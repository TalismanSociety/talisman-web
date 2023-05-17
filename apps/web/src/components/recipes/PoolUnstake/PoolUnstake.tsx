import { useTheme } from '@emotion/react'
import { Lock } from '@talismn/icons'
import { Button, Identicon, Text } from '@talismn/ui'
import { shortenAddress } from '@util/format'
import React, { type ReactElement } from 'react'

import StakeList from '../StakeList'

export type PoolUnstakeProps = {
  accountName: string
  accountAddress: string
  unstakingAmount: string
  unstakingFiatAmount: string
  timeTilWithdrawable?: string
  onRequestWithdraw: () => unknown
  withdrawState?: 'pending' | 'disabled'
  variant?: 'compact'
  readonly?: boolean
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
      {props.variant !== 'compact' && <Identicon value={props.accountAddress} size="4rem" />}
      <dl
        css={[
          {
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
                flex: 0.4,
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
          },
          props.variant === 'compact' && {
            'dd:first-of-type': {
              marginLeft: 0,
            },
          },
        ]}
      >
        {props.variant !== 'compact' && (
          <div>
            <dt>Account</dt>
            <dd>
              <div>
                <Text.Body alpha="high" css={{ '@media (min-width: 1024px)': { textAlign: 'left' } }}>
                  {props.accountName}
                </Text.Body>
              </div>
              <div>
                <Text.Body>({shortenAddress(props.accountAddress)})</Text.Body>
              </div>
            </dd>
          </div>
        )}
        <div>
          <dt>Unstaking</dt>
          <dd>
            <div>
              <Text.Body css={{ fontSize: '1.6rem', fontWeight: 'bold' }}>
                {props.unstakingAmount}
                {props.timeTilWithdrawable !== undefined && <Lock size="1.2rem" css={{ marginLeft: '0.4rem' }} />}
              </Text.Body>
            </div>
            <div>
              <Text.Body>{props.unstakingFiatAmount}</Text.Body>
            </div>
          </dd>
        </div>
        {props.timeTilWithdrawable !== undefined && (
          <div>
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
            hidden={props.readonly}
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
  showHeader?: boolean
  children?:
    | undefined
    | null
    | false
    | ReactElement<PoolUnstakeProps>
    | Array<undefined | null | false | ReactElement<PoolUnstakeProps>>
}

export const PoolUnstakeList = (props: PoolUnstakeListProps) => (
  <div>
    {props.showHeader !== false && (
      <div
        css={{
          'display': 'none',
          '@media (min-width: 1024px)': {
            display: React.Children.count(props.children) === 0 ? 'none' : 'block',
            margin: '0.5rem 1rem',
          },
        }}
      >
        <Text.Body>Nomination pool unstaking</Text.Body>
      </div>
    )}
    <StakeList>
      {props.children && React.Children.map(props.children, child => child && <li key={child.key}>{child}</li>)}
    </StakeList>
  </div>
)

export const ValidatorUnstakeList = (props: PoolUnstakeListProps) => (
  <div>
    {props.showHeader !== false && (
      <div
        css={{
          'display': 'none',
          '@media (min-width: 1024px)': {
            display: React.Children.count(props.children) === 0 ? 'none' : 'block',
            margin: '0.5rem 1rem',
          },
        }}
      >
        <Text.Body>Validator unstaking</Text.Body>
      </div>
    )}
    <StakeList>
      {props.children && React.Children.map(props.children, child => child && <li key={child.key}>{child}</li>)}
    </StakeList>
  </div>
)

export default PoolUnstake
