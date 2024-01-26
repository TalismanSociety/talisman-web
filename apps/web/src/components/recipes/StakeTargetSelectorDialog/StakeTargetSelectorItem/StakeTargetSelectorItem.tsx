import { useTheme } from '@emotion/react'
import { ExternalLink, TalismanHand, User } from '@talismn/icons'
import { Button, Text, Tooltip } from '@talismn/ui'
import type { ReactNode } from 'react'

export type StakeTargetSelectorItemProps = {
  selected?: boolean
  highlighted?: boolean
  name: string
  logo?: string
  detailUrl?: string
  balance: string
  talismanRecommended: boolean
  rating?: 0 | 1 | 2 | 3
  count: ReactNode
  onClick?: () => unknown
}

const StakeTargetSelectorItem = (props: StakeTargetSelectorItemProps) => {
  const theme = useTheme()
  const alpha = props.selected || props.highlighted ? 'high' : 'disabled'
  return (
    <article
      onClick={props.onClick}
      css={[
        {
          'padding': '0.8rem 1.6rem',
          'borderRadius': '0.8rem',
          'border': '1px solid transparent',
          'backgroundColor': theme.color.foreground,
          'cursor': 'pointer',
          ':hover': {
            filter: 'brightness(1.8)',
          },
        },
        (props.selected || props.highlighted) && {
          borderColor: theme.color.foregroundVariant,
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
            }}
          >
            {props.logo && <img src={props.logo} css={{ width: '1.6rem', aspectRatio: '1 / 1' }} />}
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
      <Tooltip content="Total staked in this pool">
        <Text.Body alpha={alpha}>{props.balance}</Text.Body>
      </Tooltip>
      <Text.Body
        as="div"
        alpha={alpha}
        css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem' }}
      >
        <div css={{ display: 'flex', alignItems: 'center' }}>
          {/* <Tooltip content="Talisman pool rating">
              <div>
                {Array(3)
                  .fill(undefined)
                  .map((_, index) => (
                    <Star size="1.4rem" fill={index < props.rating ? 'currentColor' : 'none'} />
                  ))}
              </div>
          </Tooltip> */}
          <Tooltip content="Number of pool members">
            <div css={{ display: 'flex', alignItems: 'center' }}>
              <Text.Body
                alpha={alpha}
                css={{
                  // marginLeft: '0.8rem',
                  marginRight: '0.4rem',
                }}
              >
                {props.count}
              </Text.Body>
              <User size="1.4rem" />
            </div>
          </Tooltip>
        </div>
        {props.talismanRecommended && (
          <Tooltip content="Talisman top recommended pool">
            <TalismanHand size="1.4rem" />
          </Tooltip>
        )}
      </Text.Body>
    </article>
  )
}

export const PoolSelectorItem = StakeTargetSelectorItem

export default StakeTargetSelectorItem
