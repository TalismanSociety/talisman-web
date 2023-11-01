import { Zap } from '@talismn/icons'
import { Button, LinearProgressIndicator, Surface, Text, type ButtonProps } from '@talismn/ui'
import type { ReactNode } from 'react'

export type StakeableAssetProps = {
  logo: string
  symbol: ReactNode
  chain: ReactNode
  apr: ReactNode
  type: ReactNode
  provider: ReactNode
  stakePercentage: number
  stakeButton: ReactNode
}

const StakeButton = (props: Omit<ButtonProps, 'children'>) => (
  <Button {...props} leadingIcon={<Zap />}>
    Stake
  </Button>
)

const StakeableAsset = Object.assign(
  (props: StakeableAssetProps) => {
    return (
      <div css={{ containerType: 'inline-size' }}>
        <Surface
          as="article"
          css={{
            'borderRadius': '0.8rem',
            'padding': '1.6rem',
            'display': 'grid',
            'gridTemplateAreas': `
            'asset   action'
            'divider divider'
            'apr     type'
          `,
            'gap': '0.6rem',
            '@container (min-width: 100rem)': {
              alignItems: 'center',
              gridTemplateAreas: `'asset apr type provider stake-percentage action'`,
              gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
            },
          }}
        >
          <div css={{ gridArea: 'asset', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <img
              src={props.logo}
              css={{
                width: '2em',
                height: '2em',
                borderRadius: '50%',
              }}
            />
            <div>
              <Text.Body as="div" alpha="high">
                {props.symbol}
              </Text.Body>
              <Text.BodySmall as="div">{props.provider}</Text.BodySmall>
            </div>
          </div>
          <div css={{ gridArea: 'action', justifySelf: 'end', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {props.stakeButton}
          </div>
          <div css={{ gridArea: 'type' }}>
            <Text.BodySmall as="div">Type</Text.BodySmall>
            <Text.Body as="div" alpha="high">
              {props.type}
            </Text.Body>
          </div>
          <div
            css={{ 'gridArea': 'provider', 'display': 'none', '@container (min-width: 100rem)': { display: 'revert' } }}
          >
            <Text.BodySmall as="div">Provider</Text.BodySmall>
            <Text.Body as="div" alpha="high">
              {props.provider}
            </Text.Body>
          </div>
          <div
            css={{
              'gridArea': 'stake-percentage',
              'display': 'none',
              '@container (min-width: 100rem)': { display: 'revert' },
            }}
          >
            <Text.BodySmall as="div" alpha="high" css={{ textAlign: 'end', marginBottom: '0.6rem' }}>
              {props.stakePercentage.toLocaleString(undefined, { style: 'percent' })}
            </Text.BodySmall>
            <LinearProgressIndicator value={props.stakePercentage} optimum={0.7} least={0.5} />
          </div>
          <Surface
            css={{
              'gridArea': 'divider',
              'height': 1,
              '@container (min-width: 100rem)': { display: 'none' },
            }}
          />
          <div css={{ gridArea: 'apr' }}>
            <Text.BodySmall as="div">APR</Text.BodySmall>
            <Text.Body as="div" alpha="high">
              {props.apr}
            </Text.Body>
          </div>
        </Surface>
      </div>
    )
  },
  { StakeButton }
)

export default StakeableAsset
