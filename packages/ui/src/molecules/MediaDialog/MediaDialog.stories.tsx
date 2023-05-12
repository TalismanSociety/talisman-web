import { Global, css } from '@emotion/react'
import { type ComponentMeta, type Story } from '@storybook/react'
import { Text } from '../../atoms'
import MediaDialog, { type MediaDialogProps } from './MediaDialog'
// @ts-expect-error
import testTrack from './test-track.mp3'

export default {
  title: 'Molecules/MediaDialog',
  component: MediaDialog,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof MediaDialog>

export const Default: Story<MediaDialogProps> = (args: any) => (
  <>
    <Global
      styles={css`
        body {
          background-image: url('https://815904063-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F2G9cEppDnwuwiGautnGv%2Fuploads%2FY0qwQL5TJki0pJbWrjdJ%2Ftalismanmeeting.jpg?alt=media&token=aca2fd60-fe9e-4d5e-84fa-5b8dfa77b0ed');
          background-size: cover;
        }
      `}
    />
    <MediaDialog {...args} />
  </>
)

Default.args = {
  open: true,
  title: 'Spirit Key #1690',
  overline: 'Talisman spirit keys',
  media: (
    <MediaDialog.Player src="https://ipfs2.rmrk.link/ipfs/bafybeicuuasrqnqndfw3k6rqacfpfil5sc5fhyjh63riqnd2imm5eucrk4" />
  ),
  content: (
    <Text.Body as="p">
      Vitae ullamcorper egestas est tellus vitae. Tincidunt in sagittis vulputate velit porttitor in scelerisque eget
      egestas. Non lobortis risus integer erat nec ac viverra nisl. In risus interdum faucibus purus commodo netus in
      lectus enim. Neque slds dsakdk loo...
    </Text.Body>
  ),
}

export const Video = Default.bind({})

Video.args = {
  ...Default.args,
  media: <MediaDialog.Player src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" />,
}

export const Audio = Default.bind({})

Audio.args = {
  ...Default.args,
  media: <MediaDialog.Player src={testTrack} type="audio" subType="mp3" />,
}

export const Pdf = Default.bind({})

Pdf.args = {
  ...Default.args,
  media: <MediaDialog.Player src="https://assets.polkadot.network/Polkadot-whitepaper.pdf" />,
}

export const Model = Default.bind({})

Model.args = {
  ...Default.args,
  media: (
    <MediaDialog.Player
      src="https://ipfs-cdn.bit.country/Qma9i9246AsSjGvjsutaxpnSPHF2LxDLCo37UmBkxfJyYW"
      type="model"
    />
  ),
}

export const Overflow = Default.bind({})

Overflow.args = {
  ...Default.args,
  content: Array.from({ length: 20 }).map((_, index) => (
    <Text.Body key={index} as="p">
      Vitae ullamcorper egestas est tellus vitae. Tincidunt in sagittis vulputate velit porttitor in scelerisque eget
      egestas. Non lobortis risus integer erat nec ac viverra nisl. In risus interdum faucibus purus commodo netus in
      lectus enim. Neque slds dsakdk loo...
    </Text.Body>
  )),
}
