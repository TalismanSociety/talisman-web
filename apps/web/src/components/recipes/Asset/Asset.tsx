import Text from '@components/atoms/Text'
import { useTheme } from '@emotion/react'
import { Children, ReactElement } from 'react'

export type AssetProps = {
  className?: string
}

const Asset = Object.assign((props: AssetProps) => {
  return (
    <article
      className={props.className}
      css={{
        padding: '1.6rem',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div css={{ flex: 2 }}>Amount</div>
      <div
        css={{
          'display': 'none',
          '@media (min-width: 1024px)': {
            display: 'flex',
            flex: 1,
            justifyContent: 'flex-end',
          },
        }}
      >
        Locked
      </div>
      <div css={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>Available</div>
    </article>
  )
})

export type AssetsListProps = {
  children?: ReactElement<AssetProps> | ReactElement<AssetProps>[]
}

export const AssetsList = (props: AssetsListProps) => {
  const theme = useTheme()
  return (
    <div>
      <div
        css={{
          'display': 'none',
          '@media (min-width: 1024px)': {
            display: Children.count(props.children) === 0 ? 'none' : 'flex',
            alignItems: 'flex-end',
            marginBottom: '0.8em',
            padding: '0 1.6rem',
          },
        }}
      >
        <Text.Body css={{ flex: 2 }}>Asset</Text.Body>
        <Text.Body css={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>Locked</Text.Body>
        <Text.Body css={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>Available</Text.Body>
      </div>
      <ol
        css={{
          'listStyle': 'none',
          'margin': 0,
          'padding': 0,
          'background': theme.color.surface,
          'borderRadius': '1.6rem',
          'li + li': { marginTop: 0, borderTop: 'solid 1px #383838' },
          '> li:not(:first-child):not(:last-child) >:first-child': { borderRadius: 0 },
          '> li:first-child:not(:last-child) >:first-child': { borderEndStartRadius: 0, borderEndEndRadius: 0 },
          '> li:last-child:not(:first-child) >:first-child': { borderStartStartRadius: 0, borderStartEndRadius: 0 },
        }}
      >
        {Children.map(props.children, child => child !== undefined && <li key={child.key}>{child}</li>)}
      </ol>
    </div>
  )
}

export default Asset
