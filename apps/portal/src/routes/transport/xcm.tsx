import { TitlePortal } from '../layout'
import React from 'react'

const XcmForm = React.lazy(async () => await import('../../components/widgets/dex/TransportForm'))

const Xcm = () => (
  <>
    <TitlePortal>XCM</TitlePortal>
    <XcmForm />
  </>
)

export default Xcm
