import { type ComponentMeta, type Story } from '@storybook/react'

import Card, { type CardProps } from './Card'

export default {
  title: 'Molecules/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Card>

export const Default: Story<CardProps> = args => <Card {...args} />

Default.args = {
  headlineText: 'Spirit Key #3268',
  overlineText: 'Talisman Spirit Keys',
  media: <Card.Image src="https://ipfs2.rmrk.link/ipfs/bafybeicuuasrqnqndfw3k6rqacfpfil5sc5fhyjh63riqnd2imm5eucrk4" />,
  mediaLabel: '+3',
}

export const MultiMedia = Default.bind({})

MultiMedia.args = {
  ...Default.args,
  headlineText: 'Talisman Spirit Keys',
  overlineText: undefined,
  media: (
    <Card.MultiMedia>
      <Card.Image src="https://ipfs2.rmrk.link/ipfs/bafybeicuuasrqnqndfw3k6rqacfpfil5sc5fhyjh63riqnd2imm5eucrk4" />
      <Card.Image src="https://ipfs2.rmrk.link/ipfs/bafybeicuuasrqnqndfw3k6rqacfpfil5sc5fhyjh63riqnd2imm5eucrk4" />
      <Card.Image src="https://ipfs2.rmrk.link/ipfs/bafybeicuuasrqnqndfw3k6rqacfpfil5sc5fhyjh63riqnd2imm5eucrk4" />
      <Card.Image src="https://ipfs2.rmrk.link/ipfs/bafybeicuuasrqnqndfw3k6rqacfpfil5sc5fhyjh63riqnd2imm5eucrk4" />
    </Card.MultiMedia>
  ),
}
