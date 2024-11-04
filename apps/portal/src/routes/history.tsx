import { Text } from '@talismn/ui'

export default () => (
  <section className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
    <Text.H3>Transaction history is deprecated due to an increase in infrastructure cost</Text.H3>
    <Text.BodyLarge>
      To view your transaction history, we recommend{' '}
      <Text.Noop.A href="https://www.subscan.io/" target="_blank" rel="noreferrer noopener">
        Subscan
      </Text.Noop.A>{' '}
      and{' '}
      <Text.Noop.A href="https://etherscan.io/" target="_blank" rel="noreferrer noopener">
        Etherscan
      </Text.Noop.A>
      .
    </Text.BodyLarge>
  </section>
)
