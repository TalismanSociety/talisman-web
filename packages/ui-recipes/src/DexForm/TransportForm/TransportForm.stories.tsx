import type { Meta, StoryObj } from '@storybook/react'
import { Chip, Select } from '@talismn/ui'
import TransportForm from './TransportForm'

export default {
  component: TransportForm,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TransportForm>

type Story = StoryObj<typeof TransportForm>

export const Default: Story = {
  args: {
    accountSelect: <Select css={{ width: '100%' }}></Select>,
    availableAmount: '1 DOT',
    destAccountSelect: <Select css={{ width: '100%' }}></Select>,
    tokenSelect: (
      <TransportForm.TokenSelect
        name="USDC"
        chain="Ethereum"
        iconSrc="https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/unknown.svg"
        onClick={() => {}}
      />
    ),
    destTokenSelect: (
      <TransportForm.TokenSelect
        name="USDC"
        chain="Ethereum"
        iconSrc="https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/unknown.svg"
        onClick={() => {}}
      />
    ),
    info: (
      <TransportForm.Info
        summary={<TransportForm.Info.Summary originFee="0.01 DOT" destinationFee="0.01 DOT" />}
        faq={
          <TransportForm.Info.Faq>
            <TransportForm.Info.Faq.Question question="How does the swap works?" answer="foo" />
            <TransportForm.Info.Faq.Question question="What is included in the fees?" answer="foo" />
            <TransportForm.Info.Faq.Question question="What are the risks?" answer="foo" />
          </TransportForm.Info.Faq>
        }
        footer={
          <TransportForm.Info.Footer>
            XCM transport provided by <Chip css={{ textTransform: 'uppercase' }}>Polkadot</Chip>
          </TransportForm.Info.Footer>
        }
      />
    ),
  },
}