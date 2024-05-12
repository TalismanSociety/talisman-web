import AccountIcon from '../../molecules/AccountIcon/AccountIcon'
import type { Account } from '../../../domains/accounts'
import { keyframes, useTheme } from '@emotion/react'
import { ArrowDown, ArrowUp, ChevronRight } from '@talismn/web-icons'
import { Identicon, Surface, Text, TonalIcon, Tooltip, useSurfaceColorAtElevation } from '@talismn/ui'
import { shortenAddress } from '../../../util/format'
import type React from 'react'
import { Fragment, useMemo, type PropsWithChildren, type ReactElement } from 'react'
import { getSubstrateModuleColor } from '../extrinsicColor'

type TokenAmount = {
  amount: string
  symbol: string
}

export type TransactionLineItemProps = {
  id: string
  origin: 'self' | 'others'
  signer?: Account
  module: string
  call: string
  transfer?: TokenAmount
  fee?: TokenAmount
  timestamp: Date
  subscanUrl?: string
  chain?: string
  chainLogo?: string
  onClick?: () => unknown
}

const WIDE_CONTAINER_QUERY = '@container(min-width: 90rem)'

const Grid = (props: PropsWithChildren<{ className?: string }>) => (
  <div
    css={{
      display: 'grid',
      gridTemplateAreas: `
    'origin identicon account amount see-more'
    'origin identicon type    time   see-more'
  `,
      gridTemplateColumns: 'repeat(2, min-content) repeat(2, minmax(0, 1fr))',
      gap: '0 0.8rem',
      padding: '1.6rem',
      [WIDE_CONTAINER_QUERY]: {
        gridTemplateAreas: `'origin identicon account type amount fee id time see-more'`,
        gridTemplateColumns:
          'repeat(2, min-content) minmax(0, 0.5fr) minmax(0, 1fr) repeat(4, minmax(0, 0.75fr)) min-content',
        alignItems: 'center',
      },
    }}
    {...props}
  />
)

const TransactionLineItem = (props: TransactionLineItemProps) => {
  const theme = useTheme()
  const IdText = props.subscanUrl !== undefined ? Text.Body.A : Text.Body

  return (
    <div
      css={{ containerType: 'inline-size', cursor: props.onClick !== undefined ? 'pointer' : undefined }}
      onClick={props.onClick}
    >
      <Grid>
        <div css={{ gridArea: 'origin', display: 'flex', alignItems: 'center' }}>
          <Tooltip content={props.origin === 'self' ? 'Outgoing transaction' : 'Incoming transaction'}>
            {props.origin === 'self' ? (
              <TonalIcon size="1.6rem" contentColor="#F48F45">
                <ArrowUp />
              </TonalIcon>
            ) : (
              <TonalIcon size="1.6rem" contentColor="#D5FF5C">
                <ArrowDown />
              </TonalIcon>
            )}
          </Tooltip>
        </div>
        <IdText
          alpha="high"
          css={{ gridArea: 'id', display: 'none', [WIDE_CONTAINER_QUERY]: { display: 'revert' } }}
          href={props.subscanUrl}
          target="_blank"
          onClick={(event: React.MouseEvent<HTMLAnchorElement>) => event.stopPropagation()}
        >
          {props.id}
        </IdText>
        <div css={{ gridArea: 'identicon', display: 'flex', alignItems: 'center' }}>
          <div css={{ position: 'relative' }}>
            {props.signer && <AccountIcon account={props.signer} size="1.75em" />}
            {props.chainLogo && (
              <Tooltip content={props.chain}>
                <img
                  src={props.chainLogo}
                  alt={props.chain}
                  css={
                    props.signer === undefined
                      ? { width: '1.75em', height: '1.75em' }
                      : { position: 'absolute', top: '-0.2em', right: '-0.2em', width: '1em', height: '1em' }
                  }
                />
              </Tooltip>
            )}
          </div>
        </div>
        <Text.Body alpha="high" css={{ gridArea: 'account' }}>
          {props.signer === undefined ? props.chain : props.signer.name ?? shortenAddress(props.signer.address)}
        </Text.Body>
        <Text.BodySmall alpha="high" css={{ gridArea: 'type', [WIDE_CONTAINER_QUERY]: theme.typography.body }}>
          <span
            css={{
              [WIDE_CONTAINER_QUERY]: {
                borderRadius: '3.2rem',
                padding: '0.4rem 0.8rem',
                backgroundColor: `color-mix(in srgb, ${getSubstrateModuleColor(props.module)}, transparent 95%)`,
                color: getSubstrateModuleColor(props.module),
              },
            }}
          >
            {props.module}
          </span>{' '}
          <Text.BodySmall alpha="medium">{props.call}</Text.BodySmall>
        </Text.BodySmall>
        <Text.BodySmall
          alpha="high"
          css={{
            gridArea: 'time',
            textAlign: 'end',
            [WIDE_CONTAINER_QUERY]: [theme.typography.body, { textAlign: 'revert' }],
          }}
        >
          {useMemo(
            () =>
              new Intl.DateTimeFormat(undefined, { dateStyle: 'short', timeStyle: 'short' }).format(props.timestamp),
            [props.timestamp]
          )}
        </Text.BodySmall>
        <Text.Body
          alpha="high"
          css={{ gridAread: 'amount', textAlign: 'end', [WIDE_CONTAINER_QUERY]: { textAlign: 'revert' } }}
        >
          {props.transfer && (
            <>
              {props.transfer.amount} <Text.Body alpha="medium">{props.transfer.symbol}</Text.Body>
            </>
          )}
        </Text.Body>
        <Text.Body
          alpha="high"
          css={{
            gridArea: 'fee',
            display: 'none',
            [WIDE_CONTAINER_QUERY]: { display: 'revert' },
          }}
        >
          {props.fee && (
            <>
              {props.fee.amount}{' '}
              <Text.Body
                alpha="medium"
                css={{
                  [WIDE_CONTAINER_QUERY]: theme.typography.body,
                }}
              >
                {props.fee.symbol}
              </Text.Body>
            </>
          )}
        </Text.Body>
        <div css={{ gridArea: 'see-more', display: 'flex', alignItems: 'center' }}>
          <ChevronRight />
        </div>
      </Grid>
    </div>
  )
}

export type TransactionListProps<T> = {
  data: T[]
  keyExtractor: (data: T, index: number) => string
  renderItem: (data: T) => ReactElement
}

const slideDown = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`

export const TransactionList = <T,>(props: TransactionListProps<T>) => {
  const borderColor = useSurfaceColorAtElevation(x => x + 1)

  if (props.data.length === 0) {
    return null
  }

  return (
    <section>
      <div css={{ containerType: 'inline-size' }}>
        <Grid css={{ display: 'none', [WIDE_CONTAINER_QUERY]: { display: 'grid' } }}>
          <div css={{ gridArea: 'origin', width: '1.5rem' }} />
          <Identicon value="spacer" css={{ gridArea: 'identicon', visibility: 'hidden' }} />
          <Text.BodyLarge css={{ gridArea: '1 / 2 / 2 / 4' }}>Signer</Text.BodyLarge>
          <Text.BodyLarge css={{ gridArea: 'type' }}>Module</Text.BodyLarge>
          <Text.BodyLarge css={{ gridArea: 'amount' }}>Amount</Text.BodyLarge>
          <Text.BodyLarge css={{ gridArea: 'fee' }}>Fee</Text.BodyLarge>
          <Text.BodyLarge css={{ gridArea: 'id' }}>ID</Text.BodyLarge>
          <Text.BodyLarge css={{ gridArea: 'time' }}>Time</Text.BodyLarge>
          <ChevronRight css={{ gridArea: 'see-more', visibility: 'hidden' }} />
        </Grid>
      </div>
      <Surface
        css={{
          borderRadius: '1.2rem',
          overflow: 'hidden',
          '> *': { animation: `${slideDown} 0.3s ease-in-out` },
          '> *:hover': { backdropFilter: 'brightness(1.2)' },
          '> *:not(:last-child)': { borderBottom: `1px solid ${borderColor}` },
        }}
      >
        {props.data.map((data, index) => (
          <Fragment key={props.keyExtractor(data, index)}>{props.renderItem(data)}</Fragment>
        ))}
      </Surface>
    </section>
  )
}

export default TransactionLineItem
