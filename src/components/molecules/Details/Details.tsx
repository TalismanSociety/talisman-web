import Text from '@components/atoms/Text'
import { useTheme } from '@emotion/react'
import { ReactComponent as ChevronDownIcon } from '@icons/chevron-down.svg'
import { ReactNode } from 'react'

export type DetailsProps = React.DetailedHTMLProps<
  React.DetailsHTMLAttributes<HTMLDetailsElement>,
  HTMLDetailsElement
> & {
  summary: string
  contents: ReactNode
}

const Details = (props: DetailsProps) => {
  const theme = useTheme()

  return (
    <details
      {...props}
      css={{
        'padding': '3rem 3.2rem',
        'borderRadius': '1.6rem',
        'backgroundColor': theme.color.surface,
        '&[open]': {
          'summary': {
            marginBottom: '2.2rem',
          },
          '.marker': {
            transform: 'rotate(180deg)',
            transition: 'ease 0.25s',
          },
        },
      }}
    >
      <summary
        css={{
          'listStyle': 'none',
          'display': 'flex',
          'justifyContent': 'space-between',
          'alignItems': 'center',
          '::-webkit-details-marker': {
            display: 'none',
          },
        }}
      >
        <Text.H4 as="span" css={{ fontFamily: 'Surt', marginRight: '2rem' }}>
          {props.summary}
        </Text.H4>
        <ChevronDownIcon className="marker" />
      </summary>
      <Text.Body
        as={typeof props.contents === 'string' ? undefined : 'div'}
        css={{ height: props.open ? undefined : 0 }}
      >
        {props.contents}
      </Text.Body>
    </details>
  )
}

export default Details
