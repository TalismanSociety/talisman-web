import TransportFormDialogComponent from '@components/recipes/TransportDialog'
import TransportFormComponent from '@components/recipes/TransportForm'
import React, { Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import ErrorBoundary from '../ErrorBoundary'

const TransportForm = React.lazy(async () => await import('./TransportForm'))

const TransportDialog = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const open = searchParams.get('action') === 'transport'

  if (!open) {
    return null
  }

  return (
    <TransportFormDialogComponent
      open={open}
      onRequestDismiss={() => setSearchParams(new URLSearchParams())}
      transportForm={
        <ErrorBoundary renderFallback={fallback => <div css={{ width: 'max-content' }}>{fallback}</div>}>
          <Suspense fallback={<TransportFormComponent.Skeleton />}>
            <TransportForm />
          </Suspense>
        </ErrorBoundary>
      }
    />
  )
}

export default TransportDialog
