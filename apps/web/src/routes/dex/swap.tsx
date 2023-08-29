import SectionHeader from '@components/molecules/SectionHeader'
import SwapForm from '@components/widgets/dex/SwapForm'
import { useTheme } from '@emotion/react'
import { Chip, OrderedDetailsList, Details, Text } from '@talismn/ui'
import { FaqLayout } from './layout'

const Swap = () => {
  const theme = useTheme()
  return (
    <FaqLayout
      content={<SwapForm />}
      faq={
        <>
          <SectionHeader
            headlineText={
              <>
                About Cross-Chain Swaps{' '}
                <Chip
                  size="lg"
                  containerColor={theme.color.primaryContainer}
                  contentColor={theme.color.onPrimaryContainer}
                  css={{
                    display: 'inline-block',
                    paddingInlineStart: '1.6rem',
                    paddingInlineEnd: '1.6rem',
                    verticalAlign: 'middle',
                  }}
                >
                  Beta
                </Chip>
              </>
            }
          />
          <OrderedDetailsList>
            <Details>
              <Details.Summary>How does the cross-chain swap work?</Details.Summary>
              <Details.Content>
                Cross-Chain Swaps utilize Privadex, a third-party service that determines the optimal route for your
                swap through a series of cross-chain transports and DEXes, and executes that on your behalf. Swaps may
                be routed to the same address on the destination chain, or a different address of your choosing.
              </Details.Content>
            </Details>
            <Details>
              <Details.Summary>What is included in the fees?</Details.Summary>
              <Details.Content>
                Privadex charges a fee of 0.05% of each transaction. This is automatically deducted from your balance as
                the transaction is performed. Please refer to{' '}
                <Text.Noop.A href="https://privadex.xyz" target="_blank">
                  Privadex
                </Text.Noop.A>{' '}
                for more information.
              </Details.Content>
            </Details>
          </OrderedDetailsList>
        </>
      }
    />
  )
}

export default Swap
