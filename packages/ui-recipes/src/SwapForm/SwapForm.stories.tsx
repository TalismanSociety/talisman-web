import type { Meta, StoryObj } from '@storybook/react'
import SwapForm from './SwapForm'
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
    summary: (
      <SwapForm.Summary
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
          <SwapForm.Summary.DescriptionList>
            <SwapForm.Summary.DescriptionList.Description term="Origin fee" details="$0.12" />
            <SwapForm.Summary.DescriptionList.Description term="Est. platform fees" details="$0.12" />
            <SwapForm.Summary.DescriptionList.Description term="Est. gas fees" details="$0.12" />
            <SwapForm.Summary.DescriptionList.Description
              term="Est. rate"
              details={
                <span>
                  1 ETH <Repeat size="1em" /> 6 USDC
                </span>
              }
            />
            <SwapForm.Summary.DescriptionList.Description
              term="Price delta"
              details={(0.125).toLocaleString(undefined, { style: 'percent' })}
            />
          </SwapForm.Summary.DescriptionList>
        }
        faq={
          <SwapForm.Summary.Faq>
            <SwapForm.Summary.Faq.Question question="How does the swap works?" answer="foo" />
            <SwapForm.Summary.Faq.Question question="What is included in the fees?" answer="foo" />
            <SwapForm.Summary.Faq.Question question="What are the risks?" answer="foo" />
          </SwapForm.Summary.Faq>
        }
        footer={
          <SwapForm.Summary.Footer>
            Swap provided by <Chip css={{ textTransform: 'uppercase' }}>Chainflip</Chip>
          </SwapForm.Summary.Footer>
        }
      />
    ),
  },
}
