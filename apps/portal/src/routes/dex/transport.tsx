import { TitlePortal } from '../layout'
import React from 'react'

const TransportForm = React.lazy(async () => await import('../../components/widgets/dex/TransportForm'))

const Transport = () => (
  <>
    <TitlePortal>Transport</TitlePortal>
    <TransportForm />
  </>
)

export default Transport
