import { createContext, useContext } from 'react'
import { Text } from '../../atoms'

export type DescriptionListProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDListElement>, HTMLDListElement> & {
  emphasis?: 'term' | 'details'
}

const DescriptionListContext = createContext<{
  emphasis: 'term' | 'details'
}>({ emphasis: 'term' })

const Term = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) => (
  <Text.Body as="dt" alpha={useContext(DescriptionListContext).emphasis === 'term' ? 'high' : undefined} {...props} />
)

const Details = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) => (
  <Text.Body
    as="dd"
    alpha={useContext(DescriptionListContext).emphasis === 'details' ? 'high' : undefined}
    css={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'end' }}
    {...props}
  />
)

const Description = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
  <div css={{ display: 'flex', justifyContent: 'space-between' }} {...props} />
)

const DescriptionList = Object.assign(
  (props: DescriptionListProps) => (
    <DescriptionListContext.Provider value={{ emphasis: props.emphasis ?? 'term' }}>
      <dl {...props} css={{ '> * + *': { marginTop: '1.6rem' } }} />
    </DescriptionListContext.Provider>
  ),
  { Description, Term, Details }
)

export default DescriptionList
