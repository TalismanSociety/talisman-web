import { Button, Text, Tooltip, useSurfaceColor, useSurfaceColorAtElevation } from '@talismn/ui'
import { ExternalLink, TalismanHand, User } from '@talismn/web-icons'
import type { ReactNode } from 'react'

export type StakeTargetSelectorItemProps = {
  selected?: boolean
  highlighted?: boolean
  name: string
  logo?: string
  detailUrl?: string
  balance: string
  balancePlanck?: bigint
  balanceDescription: string
  commissionFeeDescription?: string
  commissionFee?: string
  estimatedReturn?: number | bigint
  estimatedApr?: string
  estimatedAprDescription?: string
  talismanRecommended: boolean
  talismanRecommendedDescription: string
  rating?: 0 | 1 | 2 | 3
  count: ReactNode
  countDescription: string
  onClick?: () => unknown
}

const StakeTargetSelectorItem = (props: StakeTargetSelectorItemProps) => {
  const alpha = props.selected || props.highlighted ? 'high' : 'disabled'
  const surfaceVariant = useSurfaceColorAtElevation(x => x + 1)

  return (
    <article
      onClick={props.onClick}
      css={[
        {
          padding: '0.8rem 1.6rem',
          borderRadius: '0.8rem',
          border: '1px solid transparent',
          backgroundColor: useSurfaceColor(),
          cursor: 'pointer',
          ':hover': {
            filter: 'brightness(1.8)',
          },
        },
        (props.selected || props.highlighted) && {
          borderColor: surfaceVariant,
          filter: 'brightness(1.6)',
        },
      ]}
    >
      <header
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '1rem',
          marginBottom: '0.6rem',
        }}
      >
        <Tooltip content={props.name}>
          <div
            css={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.8rem',
              overflow: 'hidden',
            }}
          >
            {props.logo && (
              <img src={props.logo} css={{ borderRadius: '0.8rem', width: '1.6rem', aspectRatio: '1 / 1' }} />
            )}
            <Text.Body
              alpha={alpha}
              css={{
                flex: 1,
                fontWeight: 'bold',
                margin: 0,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {props.name}
            </Text.Body>
          </div>
        </Tooltip>
        {props.detailUrl !== undefined && (
          <Button as="a" variant="noop" href={props.detailUrl} target="_blank">
            <ExternalLink size="1.4rem" />
          </Button>
        )}
      </header>
      <Tooltip content={props.balanceDescription}>
        <Text.Body alpha={alpha}>{props.balance}</Text.Body>
      </Tooltip>
      <Text.Body
        as="div"
        alpha={alpha}
        css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem' }}
      >
        <div css={{ display: 'flex', alignItems: 'center' }}>
          <div css={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Tooltip content={props.countDescription}>
              {props.count ? (
                <div css={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Text.Body alpha={alpha}>{props.count}</Text.Body>
                  <User size="1.4rem" />
                </div>
              ) : null}
            </Tooltip>
          </div>
        </div>
        <Tooltip content={props.estimatedAprDescription}>
          {props.estimatedApr ? <div>{props.estimatedApr}</div> : null}
        </Tooltip>
        {props.talismanRecommended && (
          <Tooltip content={props.talismanRecommendedDescription}>
            <TalismanHand size="1.4rem" />
          </Tooltip>
        )}
      </Text.Body>
      <Tooltip content={<div className="max-w-[276px]">{props.commissionFeeDescription}</div>}>
        {props.commissionFee ? (
          <div className="text-[14px] flex justify-between">
            <div className="flex gap-2 items-center">
              <Text.Body alpha={alpha}>Commission fee</Text.Body>
            </div>
            <Text.Body alpha={alpha}>{props.commissionFee}</Text.Body>
          </div>
        ) : null}
      </Tooltip>
    </article>
  )
}

export const PoolSelectorItem = (
  props: Omit<
    StakeTargetSelectorItemProps,
    'balanceDescription' | 'countDescription' | 'talismanRecommendedDescription'
  >
) => (
  <StakeTargetSelectorItem
    {...props}
    balanceDescription="Total staked in this pool"
    countDescription="Number of pool members"
    talismanRecommendedDescription="Talisman top recommended pool"
  />
)

export const DappSelectorItem = (
  props: Omit<
    StakeTargetSelectorItemProps,
    'balanceDescription' | 'countDescription' | 'talismanRecommendedDescription'
  >
) => (
  <StakeTargetSelectorItem
    {...props}
    balanceDescription="Total staked with this DApp"
    countDescription="Number of DApp stakers"
    talismanRecommendedDescription="Talisman top recommended DApp"
  />
)

export default StakeTargetSelectorItem
