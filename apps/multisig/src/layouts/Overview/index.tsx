import styled from '@emotion/styled'
import { PropsWithChildren } from 'react'

import Header from './Header'

const Landing = styled(({ className }: PropsWithChildren<{ className?: string }>) => (
  <div className={className}>
    <Header />
    <section>content</section>
  </div>
))`
  display: grid;
  grid-template: max-content auto max-content / 1fr;
  height: 100%;
`

export default Landing
