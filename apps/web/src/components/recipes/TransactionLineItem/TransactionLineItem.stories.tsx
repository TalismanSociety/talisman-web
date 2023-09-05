import { type Meta, type StoryObj } from '@storybook/react'
import TransactionLineItem, { TransactionList } from './TransactionLineItem'

export default {
  title: 'Recipes/TransactionLineItem',
  component: TransactionLineItem,
} satisfies Meta<typeof TransactionLineItem>

type Story = StoryObj<typeof TransactionLineItem>

export const Default: Story = {
  render: args => <TransactionLineItem {...args} />,
  args: {
    id: '16682150-7',
    signer: { name: 'foo', address: '1qnJN7FViy3HZaxZK9tGAA71zxHSBeUweirKqCaox4t8GT7' },
    module: 'Staking',
    call: 'bond_extra',
    transfer: { amount: '100', symbol: 'DOT' },
    fee: { amount: '0.01', symbol: 'DOT' },
    timestamp: new Date(),
  },
}

export const List: Story = {
  render: () => (
    <TransactionList
      data={[1, 2, 3, 4]}
      keyExtractor={x => String(x)}
      // @ts-expect-error
      renderItem={() => Default.render(Default.args, undefined)}
    />
  ),
}
