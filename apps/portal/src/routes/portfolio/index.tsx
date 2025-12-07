import type { RouteObject } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import { cn } from '@/util/cn'

const routes = {
  children: [
    { path: '', element: <InstallTalismanWalletPrompt /> },
    { path: '*', element: <Navigate to="/portfolio" /> },
  ],
} satisfies RouteObject
export default routes

function InstallTalismanWalletPrompt() {
  const talismanIsInstalled = useTalismanIsInstalled()
  if (talismanIsInstalled) return <TalismanIsInstalled />
  return <TalismanNotInstalled />
}

const TalismanIsInstalled = () => (
  <div className="mx-auto mt-8 w-full max-w-screen-sm rounded-[10px] bg-gradient-to-r from-[#2E3128] to-[#1B1B1B] to-[274%] p-[1px] text-[14px]">
    <div className="flex w-full items-center justify-between gap-4 rounded-[10px] bg-gradient-to-b from-[rgb(27,27,27)] to-[#3F3F0C] to-[287%] px-8 py-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center">
          <div className="font-semibold">View Portfolio in Talisman Wallet</div>
        </div>
        <div className="text-[12px] text-gray-400">
          Use Talisman extension to see <b>your full portfolio</b> across Ethereum, Solana and Polkadot.
        </div>
      </div>

      <ExtensionIcon className="h-12 w-12" />
    </div>
  </div>
)

const TalismanNotInstalled = () => (
  <div className="mx-auto mt-8 w-full max-w-screen-sm rounded-[10px] bg-gradient-to-r from-[#2E3128] to-[#1B1B1B] to-[274%] p-[1px] text-[14px]">
    <div className="flex w-full items-center justify-between gap-4 rounded-[10px] bg-gradient-to-b from-[rgb(27,27,27)] to-[#3F3F0C] to-[287%] px-8 py-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center">
          <div className="font-semibold">Download Talisman Wallet</div>
        </div>
        <div className="text-[12px] text-gray-400">
          Use Talisman to see <b>your full portfolio</b> across Ethereum, Solana and Polkadot.
        </div>
      </div>

      <a
        className={cn(
          'border-primary text-md rounded-full border px-7 py-3',
          'active:scale-101 transition-transform hover:scale-105 hover:no-underline'
        )}
        href="https://talisman.xyz/download"
        target="_blank"
        rel="noreferrer noopener"
      >
        Download
      </a>
    </div>
  </div>
)

const useTalismanIsInstalled = () => {
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>

    const checkTalismanInstalled = () => {
      const installed = Boolean((window as any).talismanEth) // eslint-disable-line @typescript-eslint/no-explicit-any
      setIsInstalled(installed)

      if (!installed) id = setTimeout(checkTalismanInstalled, 250)
    }

    checkTalismanInstalled()
    return () => clearInterval(id)
  }, [])

  return isInstalled
}

const ExtensionIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 16" className={className}>
    <path
      fill="#d5ff5c"
      fillRule="evenodd"
      d="M6.972.5c-1.13 0-2.045.916-2.045 2.046v.682H1.836a1 1 0 0 0-1 1v3.09h.682a2.045 2.045 0 0 1 0 4.091H.836V14.5a1 1 0 0 0 1 1h3.09v-.682a2.045 2.045 0 1 1 4.092 0v.682h3.09a1 1 0 0 0 1-1v-3.09h.682a2.045 2.045 0 1 0 0-4.092h-.681v-3.09a1 1 0 0 0-1-1H9.018v-.682C9.018 1.416 8.102.5 6.972.5"
      clipRule="evenodd"
    ></path>
  </svg>
)
