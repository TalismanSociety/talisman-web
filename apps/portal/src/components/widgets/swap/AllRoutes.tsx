import { useAtomValue } from 'jotai'
import { Suspense } from 'react'

import { ErrorBoundary } from '../ErrorBoundary'
import { allPairsCsvAtom as allSimpleswapPairsCsvAtom } from './swap-modules/simpleswap-swap-module'
import { allPairsCsvAtom as allStealthexPairsCsvAtom } from './swap-modules/stealthex-swap-module'

export const AllRoutes = () => {
  return (
    <div className="flex flex-col items-center gap-8">
      <h2 className="text-4xl">StealthEX + SimpleSwap Pairs</h2>

      <div className="flex items-center gap-4">
        <ErrorBoundary fallback={<div>Failed to load (try refreshing the page)</div>}>
          <Suspense fallback={<div className="animate-pulse">Loading StealthEX</div>}>
            <Stealthex />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary fallback={<div>Failed to load (try refreshing the page)</div>}>
          <Suspense fallback={<div className="animate-pulse">Loading SimpleSwap</div>}>
            <Simpleswap />
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
    <button
      className="bg-primary flex flex-col items-center rounded px-4 py-2 text-xl text-black active:opacity-80"
      onClick={download}
    >
      <span>Download</span> <span className="font-mono">{filename}</span>
    </button>
  )
}
