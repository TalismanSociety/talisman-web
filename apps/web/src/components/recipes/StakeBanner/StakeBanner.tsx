import { Calculate, Zap } from '@talismn/icons'
import { Button, ListItem, Text, TonalIcon } from '@talismn/ui'
import type { ReactNode } from 'react'

export type StakeBannerProps = {
  className?: string
  balance?: ReactNode
  rewards?: ReactNode
  onClickSimulateRewards: () => unknown
  onClickStake: () => unknown
}

const StakeBanner = (props: StakeBannerProps) => (
  <div className={props.className} css={{ containerType: 'inline-size' }}>
    <div
      css={{
        'display': 'grid',
        'gridAutoColumns': 'fit-content',
        'gridTemplateAreas': `
          'header        actions'
          'stake-balance rewards'
        `,
        'justifyContent': 'space-between',
        'gap': '2.4rem',
        'borderRadius': '1.6rem',
        'background': 'rgba(0, 0, 0, 0.55) linear-gradient(125deg, #182F4F, #445587, #C36A9B, #974570)',
        'backgroundBlendMode': 'darken',
        'padding': '2.4rem',
        '@container(min-width: 60rem)': {
          gridTemplateAreas: `
            'header        header  header'
            'stake-balance rewards actions'
          `,
          gridTemplateColumns: 'repeat(2, fit-content) 1fr',
          gap: '4rem',
        },
      }}
    >
      <header>
        <Text.H2 css={{ gridArea: 'header', marginBottom: 0 }}>Staking</Text.H2>
        <Text.Body css={{ 'display': 'none', '@container(min-width: 60rem)': { display: 'revert' } }}>
          Stake your favorite assets in one click and start earning rewards
        </Text.Body>
      </header>
      <div
        css={{
          'gridArea': 'actions',
          'placeSelf': 'start end',
          'display': 'flex',
          'justifyContent': 'flex-end',
          'alignItems': 'center',
          'gap': '0.8rem',
          'flexWrap': 'wrap-reverse',
          '@container(min-width: 60rem)': { placeSelf: 'end' },
        }}
      >
        <Button variant="outlined" leadingIcon={<Calculate />} onClick={props.onClickSimulateRewards}>
          <span css={{ '@container(min-width: 60rem)': { display: 'none' } }}>Calculate</span>
          <span css={{ 'display': 'none', '@container(min-width: 60rem)': { display: 'revert' } }}>
            Simulate rewards
          </span>
        </Button>
        <Button leadingIcon={<Zap />} onClick={props.onClickStake}>
          Stake
        </Button>
      </div>
      <ListItem
        css={{ gridArea: 'stake-balance', padding: 0, visibility: props.balance ? 'visible' : 'hidden' }}
        leadingContent={
          <TonalIcon size="5.6rem" css={{ 'display': 'none', '@container(min-width: 60rem)': { display: 'flex' } }}>
            <Zap />
          </TonalIcon>
        }
        overlineText={
          <Text.BodyLarge as="div" css={{ marginBottom: '0.8rem' }}>
            Staking balance
          </Text.BodyLarge>
        }
        headlineText={
          <Text.H3
            css={{
              'marginBottom': 0,
              ':empty::after': {
                content: `"\u200B"`,
              },
            }}
            alpha="high"
          >
            {props.balance}
          </Text.H3>
        }
      />
      <ListItem
        css={{ gridArea: 'rewards', placeSelf: 'end', padding: 0, visibility: props.rewards ? 'visible' : 'hidden' }}
        overlineText={
          <Text.BodyLarge as="div" css={{ marginBottom: '0.8rem' }}>
            Total rewards
          </Text.BodyLarge>
        }
        headlineText={
          <Text.H3
            css={{
              'marginBottom': 0,
              ':empty::after': {
                content: `"\u200B"`,
              },
            }}
            alpha="high"
          >
            {props.rewards}
          </Text.H3>
        }
      />
    </div>
  </div>
)

export default StakeBanner
