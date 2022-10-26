import Button from '@components/atoms/Button'
import { ExternalLink, Star, Union, User } from '@components/atoms/Icon'
import Text from '@components/atoms/Text'
import { useTheme } from '@emotion/react'

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
      {...props}
      onClick={props.onClick}
      css={{
        'padding': '0.8rem 1.6rem',
        'borderRadius': '0.8rem',
        'backgroundColor': theme.color.foreground,
        'cursor': 'pointer',
        ':hover': {
          filter: 'brightness(1.2)',
        },
      }}
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
        <Text.Body alpha={alpha} css={{ fontWeight: 'bold', margin: 0 }}>
          {props.poolName}
        </Text.Body>
        {props.poolDetailUrl !== undefined && (
          <Button as="a" variant="noop" href={props.poolDetailUrl} target="_blank">
            <ExternalLink width="1.4rem" height="1.4rem" />
          </Button>
        )}
      </header>
      <Text.Body alpha={alpha}>{props.stakedAmount}</Text.Body>
      <Text.Body
        as="div"
        alpha={alpha}
        css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div css={{ display: 'flex', alignItems: 'center', marginTop: '0.6rem' }}>
          <Union width="1.4rem" height="1.4rem" css={{ marginRight: '0.8rem' }} />
          {Array(3)
            .fill(undefined)
            .map((_, index) => (
              <Star width="1.4rem" height="1.4rem" fill={index < props.rating ? 'currentColor' : 'none'} />
            ))}
          <Text.Body alpha={alpha} css={{ marginLeft: '0.8rem', marginRight: '0.4rem' }}>
            {props.memberCount}
          </Text.Body>
          <User width="1.4rem" height="1.4rem" />
        </div>
      </Text.Body>
    </article>
  )
}

export default PoolSelectorItem
