import { type Meta, type StoryObj } from '@storybook/react'
import Details, { OrderedDetailsList } from './Details'

export default {
  title: 'Molecules/Details',
  component: Details,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Details>

type Story = StoryObj<typeof Details>

export const Default: Story = {
  args: {
    children: (
      <>
        <Details.Summary>What is nomination pool staking?</Details.Summary>
        <Details.Content>
          Unlike nominating staking using pools requires a smaller amount of DOT, and the pool manages nominees on your
          behalf.
        </Details.Content>
      </>
    ),
  },
}

export const OrderedList: Story = {
  render: args => (
    <OrderedDetailsList>
      <Details {...args} />
      <Details {...args} />
      <Details {...args} />
      <Details {...args} />
    </OrderedDetailsList>
  ),
  args: {
    children: (
      <>
        <Details.Summary>What is nomination pool staking?</Details.Summary>
        <Details.Content>
          Unlike nominating staking using pools requires a smaller amount of DOT, and the pool manages nominees on your
          behalf.
        </Details.Content>
      </>
    ),
  },
}

export const WithMaxWidth: Story = {
  render: args => <Details {...args} css={{ maxWidth: '400px' }} />,
  args: {
    children: (
      <>
        <Details.Summary>What is nomination pool staking?</Details.Summary>
        <Details.Content>
          Unlike nominating staking using pools requires a smaller amount of DOT, and the pool manages nominees on your
          behalf.
        </Details.Content>
      </>
    ),
  },
}
