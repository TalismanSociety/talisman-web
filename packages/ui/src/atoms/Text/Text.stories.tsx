import { type ComponentMeta, type Story } from '@storybook/react'

import Text, { type TextProps } from './Text'

export default {
  title: 'Atoms/Text',
  component: Text,
} as ComponentMeta<typeof Text>

export const Default: Story<TextProps<'span'>> = (args: any) => (
  <table
    css={{
      tr: {
        'td:first-of-type': {
          fontWeight: 'bold',
        },
      },
      td: {
        'padding': '1rem',
        '> *': {
          margin: 0,
        },
      },
    }}
  >
    <tr>
      <Text.Body as="td" alpha="high">
        H1
      </Text.Body>
      <td>
        <Text.H1 {...args} />
      </td>
    </tr>
    <tr>
      <Text.Body as="td" alpha="high">
        H2
      </Text.Body>
      <td>
        <Text.H2 {...args} />
      </td>
    </tr>
    <tr>
      <Text.Body as="td" alpha="high">
        H3
      </Text.Body>
      <td>
        <Text.H3 {...args} />
      </td>
    </tr>
    <tr>
      <Text.Body as="td" alpha="high">
        H4
      </Text.Body>
      <td>
        <Text.H4 {...args} />
      </td>
    </tr>
    <tr>
      <Text.Body as="td" alpha="high">
        BodyLarge
      </Text.Body>
      <td>
        <Text.BodyLarge {...args} />
      </td>
    </tr>
    <tr>
      <Text.Body as="td" alpha="high">
        Body
      </Text.Body>
      <td>
        <Text.Body {...args} />
      </td>
    </tr>
    <tr>
      <Text.Body as="td" alpha="high">
        BodySmall
      </Text.Body>
      <td>
        <Text.BodySmall {...args} />
      </td>
    </tr>
  </table>
)

Default.args = {
  children: 'The quick brown fox jumps over the lazy dog',
}

export const Redacted: Story<TextProps<'del'>> = args => <Text.H1.Redacted {...args} />

Redacted.parameters = {
  layout: 'centered',
}

Redacted.args = { ...Default.args, as: 'del' }
