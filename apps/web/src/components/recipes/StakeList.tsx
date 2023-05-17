import { useTheme } from '@emotion/react'
import { type DetailedHTMLProps, type OlHTMLAttributes } from 'react'

const StakeList = (props: DetailedHTMLProps<OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>) => {
  const theme = useTheme()
  return (
    <ol
      css={{
        'listStyle': 'none',
        'margin': 0,
        'padding': 0,
        'li + li': {
          marginTop: '1.6rem',
        },
        '@media (min-width: 1024px)': {
          'background': theme.color.surface,
          'borderRadius': '1.6rem',
          'li + li': { marginTop: 0, borderTop: 'solid 1px #383838' },
          '> li:not(:first-child):not(:last-child) >:first-child': { borderRadius: 0 },
          '> li:first-child:not(:last-child) >:first-child': { borderEndStartRadius: 0, borderEndEndRadius: 0 },
          '> li:last-child:not(:first-child) >:first-child': { borderStartStartRadius: 0, borderStartEndRadius: 0 },
        },
      }}
      {...props}
    />
  )
}

export default StakeList
