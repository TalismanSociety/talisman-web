import SwapForm from './SwapForm'
import type { Meta, StoryObj } from '@storybook/react'
import { Chip, Select } from '@talismn/ui'
import { Repeat } from '@talismn/web-icons'

export default {
  component: SwapForm,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SwapForm>

type Story = StoryObj<typeof SwapForm>

export const Default: Story = {
  args: {
    accountSelect: <Select css={{ width: '100%' }}></Select>,
    destAccountSelect: <Select css={{ width: '100%' }}></Select>,
    tokenSelect: (
      <SwapForm.TokenSelect
        name="USDC"
        chain="Ethereum"
        iconSrc="https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/unknown.svg"
        onClick={() => {}}
      />
    ),
    destTokenSelect: (
      <SwapForm.TokenSelect
        name="USDC"
        chain="Ethereum"
        iconSrc="https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/unknown.svg"
        onClick={() => {}}
      />
    ),
    info: (
      <SwapForm.Info
        summary={
          <SwapForm.Info.Summary
            route={[
              {
                iconSrc: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/unknown.svg',
              },
              {
                iconSrc: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/unknown.svg',
              },
              {
                iconSrc: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/unknown.svg',
              },
            ]}
            descriptions={
              <SwapForm.Info.Summary.DescriptionList>
                <SwapForm.Info.Summary.DescriptionList.Description term="Origin fee" details="$0.12" />
                <SwapForm.Info.Summary.DescriptionList.Description term="Est. platform fees" details="$0.12" />
                <SwapForm.Info.Summary.DescriptionList.Description term="Est. gas fees" details="$0.12" />
                <SwapForm.Info.Summary.DescriptionList.Description
                  term="Est. rate"
                  details={
                    <span>
                      1 ETH <Repeat size="1em" /> 6 USDC
                    </span>
                  }
                />
                <SwapForm.Info.Summary.DescriptionList.Description
                  term="Price delta"
                  details={(0.125).toLocaleString(undefined, { style: 'percent' })}
                />
              </SwapForm.Info.Summary.DescriptionList>
            }
          />
        }
        activities={
          <SwapForm.Info.Activities>
            <SwapForm.Info.Activities.Item
              state="pending"
              srcAmount="500 DOT"
              destAmount="1 ETH"
              srcAssetIconSrc="https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/unknown.svg"
              destAssetIconSrc="https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/unknown.svg"
              date={new Date()}
              externalLink="/"
            />
            <SwapForm.Info.Activities.Item
              state="complete"
              srcAmount="500 DOT"
              destAmount="1 ETH"
              srcAssetIconSrc="https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/unknown.svg"
              destAssetIconSrc="https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/unknown.svg"
              date={new Date()}
              externalLink="/"
            />
            <SwapForm.Info.Activities.Item
              state="failed"
              srcAmount="500 DOT"
              destAmount="1 ETH"
              srcAssetIconSrc="https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/unknown.svg"
              destAssetIconSrc="https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/unknown.svg"
              date={new Date()}
              externalLink="/"
            />
          </SwapForm.Info.Activities>
        }
        faq={
          <SwapForm.Info.Faq footer={<SwapForm.Info.Faq.Footer discordUrl="https://discord.gg/talisman" />}>
            <SwapForm.Info.Faq.Question question="How does the swap works?" answer="foo" />
            <SwapForm.Info.Faq.Question question="What is included in the fees?" answer="foo" />
            <SwapForm.Info.Faq.Question question="What are the risks?" answer="foo" />
          </SwapForm.Info.Faq>
        }
        footer={
          <SwapForm.Info.Footer>
            Swap powered by <Chip css={{ textTransform: 'uppercase' }}>Chainflip</Chip>
          </SwapForm.Info.Footer>
        }
      />
    ),
  },
}
