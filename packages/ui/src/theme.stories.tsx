import { type ComponentMeta, type Story } from '@storybook/react'
import { TalismanHand } from '@talismn/icons'
import { type JSXElementConstructor } from 'react'

import { Text } from './atoms'
import { type TalismanTheme, theme } from './theme'

export default {
  title: 'Theme/Color',
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<JSXElementConstructor<Props>>

type Props = { theme: TalismanTheme }

export const DarkGreen: Story<Props> = args => {
  return (
    <div>
      <section>
        <header>
          <Text.H1>Container</Text.H1>
        </header>
        <div css={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(140px, 1fr))', gap: '1rem' }}>
          {Object.entries(args.theme.color)
            .filter(([key]) => !key.startsWith('on'))
            .map(([key, value]) => {
              const contentColor =
                args.theme.color[`on${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof TalismanTheme['color']]
              return (
                <figcaption
                  key={key}
                  css={{
                    padding: '2.5rem 0',
                  }}
                >
                  <figure
                    css={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: value,
                      width: '100%',
                      height: 140,
                      borderRadius: '1rem',
                      margin: 0,
                    }}
                  >
                    <TalismanHand css={{ color: contentColor }} />
                  </figure>
                  <Text.H4>{key}</Text.H4>
                  <Text.BodyLarge>{value}</Text.BodyLarge>
                </figcaption>
              )
            })}
        </div>
      </section>
      <section>
        <header>
          <Text.H1>Content</Text.H1>
        </header>
        <div css={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(140px, 1fr))', gap: '1rem' }}>
          {Object.entries(args.theme.color)
            .filter(([key]) => key.startsWith('on'))
            .map(([key, value]) => {
              return (
                <figcaption
                  key={key}
                  css={{
                    padding: '2.5rem 0',
                  }}
                >
                  <figure
                    css={{
                      background: value,
                      width: '100%',
                      height: 140,
                      borderRadius: '1rem',
                      margin: 0,
                    }}
                  ></figure>
                  <Text.H4>{key}</Text.H4>
                  <Text.BodyLarge>{value}</Text.BodyLarge>
                </figcaption>
              )
            })}
        </div>
      </section>
    </div>
  )
}

DarkGreen.args = {
  theme: theme.greenDark,
}
