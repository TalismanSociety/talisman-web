import Text from '@components/atoms/Text'

export type PillProps = {
  headerText: string
  text: string
}

const Pill = (props: PillProps) => {
  return (
    <article
      css={{
        'display': 'flex',
        'flexDirection': 'column',
        'alignItems': 'flex-start',
        'justifyContent': 'center',
        'padding': '.5em',
        'borderRadius': '.5em',
        'backgroundColor': '#262626',
        'color': '#fff',
        'width': 'fit-content',
        'maxWidth': '200px',
        '> *': {
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          width: '100%',
        },
      }}
    >
      <Text.Body css={{ fontSize: '12px', marginBottom: '.25em', color: '#A5A5A5' }}>{props.headerText}</Text.Body>
      <Text.Body css={{ fontSize: '14px', color: '#FAFAFA' }}>{props.text}</Text.Body>
    </article>
  )
}

export default Pill
