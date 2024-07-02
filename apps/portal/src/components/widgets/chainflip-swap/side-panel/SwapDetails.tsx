import ErrorBoundary from '../../ErrorBoundary'
import { fromAmountAtom, fromAssetAtom, swappingAtom, toAssetAtom } from '../swap-modules/common.swap-module'
import { swapQuoteAtom, useEstimateSwapGas } from '../swaps.api'
import { ChainflipDetails } from './details/ChainflipDetails'
import { CircularProgressIndicator } from '@talismn/ui'
import { useAtomValue } from 'jotai'
import { Suspense, useMemo } from 'react'

const PlaceholderUI: React.FC = () => (
  <div className="flex items-center justify-center gap-[8px] flex-col border-gray-800 border rounded-[8px] p-[16px] py-[12px]">
    <svg width="97" height="96" viewBox="0 0 97 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="48.5" cy="48" r="48" fill="url(#paint0_linear_3285_23038)" fillOpacity="0.04" />
      <path
        d="M26 38L34 30M34 30L42 38M34 30V58C34 60.1217 34.8429 62.1566 36.3431 63.6569C37.8434 65.1571 39.8783 66 42 66H46M70 58L62 66M62 66L54 58M62 66V38C62 35.8783 61.1571 33.8434 59.6569 32.3431C58.1566 30.8429 56.1217 30 54 30H50"
        stroke="url(#paint1_linear_3285_23038)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_3285_23038"
          x1="82.3182"
          y1="-10.6667"
          x2="0.418275"
          y2="80.193"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF519F" />
          <stop offset="1" stopColor="#47DC94" />
        </linearGradient>
        <linearGradient id="paint1_linear_3285_23038" x1="63.5" y1="26" x2="34" y2="66" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF519F" />
          <stop offset="1" stopColor="#47DC94" />
        </linearGradient>
      </defs>
    </svg>
    <div>
      <h4 className="font-bold text-[14px] text-center">Seamless native cross-chain swaps</h4>
      <p className="text-gray-400 text-[14px] text-center">
        Swap assets effortlessly across different chains and enjoy the convenience of fire-and-forget transactions.
      </p>
    </div>
  </div>
)

const LoadingUI: React.FC<{ title?: string; description?: React.ReactNode }> = ({ title, description }) => (
  <div className="flex items-center justify-center gap-[8px] flex-col border-gray-800 border rounded-[8px] p-[16px]">
    <div className="flex items-center justify-center h-[94px] w-[94px]">
      <CircularProgressIndicator size={48} />
    </div>
    <div>
      <h4 className="font-bold text-[14px] text-center">{title}</h4>
      <p className="text-gray-400 text-[14px] text-center">{description}</p>
    </div>
  </div>
)

const ErrorUI: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex items-center justify-center gap-[8px] flex-col border-gray-800 border rounded-[8px] p-[16px]">
    <svg width="97" height="96" viewBox="0 0 97 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="48.5" cy="48" r="48" fill="url(#paint0_linear_3285_12864)" />
      <path
        d="M64 45V37.6C64 34.2397 64 32.5595 63.346 31.2761C62.7708 30.1471 61.8529 29.2292 60.7239 28.654C59.4405 28 57.7603 28 54.4 28H41.6C38.2397 28 36.5595 28 35.2761 28.654C34.1471 29.2292 33.2292 30.1471 32.654 31.2761C32 32.5595 32 34.2397 32 37.6V58.4C32 61.7603 32 63.4405 32.654 64.7239C33.2292 65.8529 34.1471 66.7708 35.2761 67.346C36.5595 68 38.2397 68 41.6 68H47M68 68L65 65M67 60C67 63.866 63.866 67 60 67C56.134 67 53 63.866 53 60C53 56.134 56.134 53 60 53C63.866 53 67 56.134 67 60Z"
        stroke="url(#paint1_linear_3285_12864)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M44 38L54 48M54 38L44 48"
        stroke="url(#paint2_linear_3285_12864)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="paint0_linear_3285_12864" x1="48.5" y1="0" x2="48.5" y2="96" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1B1B1B" />
          <stop offset="1" stopColor="#1B1B1B" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_3285_12864"
          x1="38.3108"
          y1="21.1934"
          x2="68.025"
          y2="76.7462"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A5A5A5" />
          <stop offset="1" stopColor="#A5A5A5" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_3285_12864"
          x1="49"
          y1="38"
          x2="55.1056"
          y2="52.5215"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A5A5A5" />
          <stop offset="1" stopColor="#A5A5A5" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>

    <div>
      <h4 className="font-bold text-[14px] text-center">Failed to get quote</h4>
      <p className="text-gray-400 text-[14px] text-center">{message}</p>
    </div>
  </div>
)

const Details: React.FC = () => {
  const quote = useAtomValue(swapQuoteAtom)
  const swapping = useAtomValue(swappingAtom)
  const gas = useEstimateSwapGas()
  // handle gas here

  const renderProtocolDetails = useMemo(() => {
    if (quote.state !== 'hasData' || !quote.data) return null
    switch (quote.data.protocol) {
      case 'chainflip':
        return <ChainflipDetails data={quote.data.data} gas={gas} />
      default:
        return null
    }
  }, [gas, quote])

  if (quote.state === 'loading' || swapping)
    return (
      <LoadingUI
        title={swapping ? 'Processing Swap' : 'Getting Quote'}
        description={
          swapping ? (
            <span>
              We are processing this swap.
              <br />
              It shouldn't take too long...
            </span>
          ) : (
            "This shouldn't take too long."
          )
        }
      />
    )
  if (quote.state === 'hasError') return <ErrorUI message={(quote.error as any)?.message ?? ''} />
  if (!quote.data) return <PlaceholderUI />

  return renderProtocolDetails
}

export const SwapDetails: React.FC = () => {
  const fromAsset = useAtomValue(fromAssetAtom)
  const toAsset = useAtomValue(toAssetAtom)
  const fromAmount = useAtomValue(fromAmountAtom)

  if (!fromAsset || !toAsset || !fromAmount.planck) return <PlaceholderUI />

  return (
    // Details component handles its own error already. This is just in case there is unhandled error
    <ErrorBoundary>
      <Suspense fallback={<LoadingUI />}>
        <Details />
      </Suspense>
    </ErrorBoundary>
  )
}
