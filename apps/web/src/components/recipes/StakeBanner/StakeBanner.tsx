import { Button, ListItem, Text } from '@talismn/ui'

export type StakeBannerProps = { className?: string }

const StakeBanner = (props: StakeBannerProps) => (
  <div className={props.className} css={{ containerType: 'inline-size' }}>
    <div
      css={{
        'display': 'grid',
        'gridAutoColumns': 'max-content',
        'gridTemplateAreas': `
          'header        actions'
          'stake-balance rewards'
        `,
        'justifyContent': 'space-between',
        'gap': '2.4rem',
        'borderRadius': '1.6rem',
        'background': 'rgba(0, 0, 0, 0.5) linear-gradient(125deg, #182F4F, #445587, #C36A9B, #974570)',
        'backgroundBlendMode': 'darken',
        'padding': '2.4rem',
        '@container(min-width: 60rem)': {
          gridTemplateAreas: `
            'header        header  header'
            'stake-balance rewards actions'
          `,
          gridTemplateColumns: 'repeat(2, max-content) 1fr',
          gap: '4rem',
        },
      }}
    >
      <Text.H2 css={{ gridArea: 'header', marginBottom: 0 }}>Staking</Text.H2>
      <div
        css={{
          'gridArea': 'actions',
          'placeSelf': 'start end',
          'display': 'flex',
          'alignItems': 'center',
          'gap': '0.8rem',
          '@container(min-width: 60rem)': { placeSelf: 'end' },
        }}
      >
        <Button variant="outlined">Simulate rewards</Button>
        <Button>Stake</Button>
      </div>
      <ListItem
        css={{ gridArea: 'stake-balance', padding: 0 }}
        overlineText={
          <Text.BodyLarge as="div" css={{ marginBottom: '0.8rem' }}>
            Staking balance
          </Text.BodyLarge>
        }
        headlineText={
          <Text.H3 css={{ marginBottom: 0 }} alpha="high">
            $495.11
          </Text.H3>
        }
      />
      <ListItem
        css={{ gridArea: 'rewards', placeSelf: 'end', padding: 0 }}
        overlineText={
          <Text.BodyLarge as="div" css={{ marginBottom: '0.8rem' }}>
            Total rewards
          </Text.BodyLarge>
        }
        headlineText={
          <Text.H3 css={{ marginBottom: 0 }} alpha="high">
            $495.11
          </Text.H3>
        }
      />
    </div>
  </div>
)

export default StakeBanner
