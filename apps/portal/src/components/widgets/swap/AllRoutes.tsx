import { SurfaceButton } from '@talismn/ui/atoms/Button'
import { useAtomValue } from 'jotai'
import { ReactNode, Suspense } from 'react'

import { ErrorBoundary } from '../ErrorBoundary'
import { allPairsCsvAtom as allLifiPairsCsvAtom } from './swap-modules/lifi.swap-module'
import { allPairsCsvAtom as allSimpleswapPairsCsvAtom } from './swap-modules/simpleswap-swap-module'
import { allPairsCsvAtom as allStealthexPairsCsvAtom } from './swap-modules/stealthex-swap-module'

export const AllRoutes = () => {
  return (
    <div className="flex flex-col items-center gap-8">
      <h2 className="text-4xl">StealthEX + SimpleSwap + Lifi Pairs</h2>

      <div className="flex items-center gap-4">
        <ErrorBoundary fallback={<FailedButton>Failed to load (try refreshing the page)</FailedButton>}>
          <Suspense fallback={<LoadingButton>Loading StealthEX</LoadingButton>}>
            <Stealthex />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary fallback={<FailedButton>Failed to load (try refreshing the page)</FailedButton>}>
          <Suspense fallback={<LoadingButton>Loading SimpleSwap</LoadingButton>}>
            <Simpleswap />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary fallback={<FailedButton>Failed to load (try refreshing the page)</FailedButton>}>
          <Suspense fallback={<LoadingButton>Loading LI.FI</LoadingButton>}>
            <Lifi />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  )
}

const Stealthex = () => (
  <DownloadButton filename="stealthex-pairs.csv" content={useAtomValue(allStealthexPairsCsvAtom)} />
)

const Simpleswap = () => (
  <DownloadButton filename="simpleswap-pairs.csv" content={useAtomValue(allSimpleswapPairsCsvAtom)} />
)

const Lifi = () => <DownloadButton filename="lifi-tokens.csv" content={useAtomValue(allLifiPairsCsvAtom)} />

const DownloadButton = ({ filename, content }: { filename: string; content: string }) => {
  const download = () => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <SurfaceButton className="!rounded-3xl" onClick={download}>
      <div className="flex flex-col items-center">
        <span>Download</span>
        <span className="font-mono">{filename}</span>
      </div>
    </SurfaceButton>
  )
}

const LoadingButton = ({ children }: { children?: ReactNode }) => (
  <SurfaceButton className="animate-pulse !rounded-3xl" disabled>
    {children}
  </SurfaceButton>
)

const FailedButton = ({ children }: { children?: ReactNode }) => (
  <SurfaceButton className="!rounded-3xl" disabled>
    {children}
  </SurfaceButton>
)
