import { useTheme } from '@emotion/react'
import { type ComponentMeta, type Story } from '@storybook/react'
import * as Icon from '@talismn/icons'

export default {
  title: 'Atoms/Icons',
  component: Icon.Activity,
  argTypes: {
    fill: { control: 'color', required: false },
    stroke: { control: 'color', required: false },
  },
} as ComponentMeta<typeof Icon.Activity>

export const Default: Story<React.SVGProps<SVGSVGElement> & { title?: string }> = (args: any) => {
  const theme = useTheme()
  return (
    <div css={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
      {Object.entries(Icon)
        .filter(([name]) => name !== 'IconContext')
        .map(([name, Icon]) => (
          <figure
            key={name}
            css={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2rem',
              background: theme.color.surface,
              padding: '2.5rem 0',
              margin: 0,
              borderRadius: '1rem',
            }}
          >
            <Icon {...args} />
            <figcaption>{name}</figcaption>
          </figure>
        ))}
    </div>
  )
}
