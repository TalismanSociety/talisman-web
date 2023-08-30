import { useTheme } from '@emotion/react'
import { ExternalLink, TalismanHand, User } from '@talismn/icons'
import { Button, Text, Tooltip } from '@talismn/ui'

export type PoolSelectorItemProps = {
  selected?: boolean
  highlighted?: boolean
  poolName: string
  poolDetailUrl?: string
  stakedAmount: string
  talismanRecommended: boolean
  rating: 0 | 1 | 2 | 3
  memberCount: number | string
  onClick?: () => unknown
}

const PoolSelectorItem = (props: PoolSelectorItemProps) => {
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
        <Tooltip content={props.poolName}>
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
            {props.poolName}
          </Text.Body>
        </Tooltip>
        {props.poolDetailUrl !== undefined && (
          <Button as="a" variant="noop" href={props.poolDetailUrl} target="_blank">
            <ExternalLink size="1.4rem" />
          </Button>
        )}
      </header>
      <Tooltip content="Total staked in this pool">
        <Text.Body alpha={alpha}>{props.stakedAmount}</Text.Body>
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
                {props.memberCount}
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

export default PoolSelectorItem
