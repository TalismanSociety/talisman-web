import TeleportFormDialogComponent from '@components/recipes/TeleportDialog'
import TeleportFormComponent from '@components/recipes/TeleportForm'
import React, { Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import ErrorBoundary from '../ErrorBoundary'

const TeleportForm = React.lazy(async () => await import('./TeleportForm'))

const TeleportDialog = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const open = searchParams.get('action') === 'teleport'

  if (!open) {
    return null
  }

  return (
    <TeleportFormDialogComponent
      open={open}
      onRequestDismiss={() => setSearchParams(new URLSearchParams())}
      teleportForm={
        <ErrorBoundary renderFallback={fallback => <div css={{ width: 'max-content' }}>{fallback}</div>}>
          <Suspense fallback={<TeleportFormComponent.Skeleton />}>
            <TeleportForm />
          </Suspense>
        </ErrorBoundary>
      }
    />
  )
}

export default TeleportDialog
