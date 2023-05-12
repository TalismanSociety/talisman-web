import { type ComponentMeta, type Story } from '@storybook/react'

import Card, { type CardProps } from './Card'

export default {
  title: 'Molecules/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div css={{ width: 300, height: 300 }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof Card>

export const Default: Story<CardProps> = args => <Card {...args} />

Default.args = {
  headlineText: 'Spirit Key #3268',
  overlineText: 'Talisman Spirit Keys',
  media: (
    <Card.Preview
      src="https://ipfs2.rmrk.link/ipfs/bafybeicuuasrqnqndfw3k6rqacfpfil5sc5fhyjh63riqnd2imm5eucrk4"
      fetchMime
    />
  ),
  mediaLabel: '+3',
}

export const Video = Default.bind({})

Video.args = {
  ...Default.args,
  media: <Card.Preview src="foo.mov" />,
}

export const Audio = Default.bind({})

Audio.args = {
  ...Default.args,
  media: <Card.Preview src="foo.aac" />,
}

export const Model = Default.bind({})

Model.args = {
  ...Default.args,
  media: <Card.Preview src="foo.glb" />,
}

export const Unknown = Default.bind({})

Unknown.args = {
  ...Default.args,
  media: <Card.Preview src="foo.invalid" />,
}

export const Collection = Default.bind({})

Collection.args = {
  ...Default.args,
  headlineText: 'Talisman Spirit Keys',
  overlineText: undefined,
  media: (
    <Card.MultiPreview>
      <Card.Preview
        src="https://ipfs2.rmrk.link/ipfs/bafybeicuuasrqnqndfw3k6rqacfpfil5sc5fhyjh63riqnd2imm5eucrk4"
        fetchMime
      />
      <Card.Preview
        src="https://ipfs2.rmrk.link/ipfs/bafybeicuuasrqnqndfw3k6rqacfpfil5sc5fhyjh63riqnd2imm5eucrk4"
        fetchMime
      />
      <Card.Preview
        src="https://ipfs2.rmrk.link/ipfs/bafybeicuuasrqnqndfw3k6rqacfpfil5sc5fhyjh63riqnd2imm5eucrk4"
        fetchMime
      />
      <Card.Preview
        src="https://ipfs2.rmrk.link/ipfs/bafybeicuuasrqnqndfw3k6rqacfpfil5sc5fhyjh63riqnd2imm5eucrk4"
        fetchMime
      />
    </Card.MultiPreview>
  ),
}

export const Skeleton = () => <Card.Skeleton />
