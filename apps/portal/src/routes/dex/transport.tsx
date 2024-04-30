import { TitlePortal } from '@routes/layout'
import { TalismanHandProgressIndicator } from '@talismn/ui'
import React, { Suspense } from 'react'

const TransportForm = React.lazy(async () => await import('@components/widgets/dex/TransportForm'))

const Transport = () => (
  <>
    <TitlePortal>Transport</TitlePortal>
    <Suspense fallback={<TalismanHandProgressIndicator />}>
      <TransportForm />
    </Suspense>
  </>
)

export default Transport
