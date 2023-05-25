import { type ComponentMeta, type Story } from '@storybook/react'

import PortfolioAllocationGraph, { type PortfolioAllocationGraphProps } from './PortfolioAllocationGraph'

export default {
  title: 'Recipes/PortfolioAllocationGraph',
  component: PortfolioAllocationGraph,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof PortfolioAllocationGraph>

export const Default: Story<PortfolioAllocationGraphProps> = args => <PortfolioAllocationGraph {...args} />

Default.args = {
  assetChip: <PortfolioAllocationGraph.AssetChip />,
  stateChip: <PortfolioAllocationGraph.StateChip />,
  data: [
    { label: 'GLMR', value: 0.55, color: '#6A7AEB' },
    { label: 'DOT', value: 0.36, color: '#E6007A' },
    { label: 'KSM', value: 0.18, color: '#FFD966' },
    { label: 'Other', value: 0.05, color: '#5A5A5A' },
  ],
}

export const Skeleton = () => <PortfolioAllocationGraph.Skeleton />
