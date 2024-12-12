import { Clickable } from '@talismn/ui/atoms/Clickable'
import { ChevronDown, Ethereum, Polkadot } from '@talismn/web-icons'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useAccount as useWagmiAccount } from 'wagmi'

import { walletConnectionSideSheetOpenState } from '@/components/widgets/WalletConnectionSideSheet'
import { substrateInjectedAccountsState, writeableAccountsState } from '@/domains/accounts/recoils'
import { connectedSubstrateWalletState } from '@/domains/extension/substrate'
import { cn } from '@/util/cn'

export const WalletConnectionButton = () => {
  const setOpen = useSetRecoilState(walletConnectionSideSheetOpenState)

  const hasSubWallet = useRecoilValue(connectedSubstrateWalletState) !== undefined
  const hasSubAccounts = useRecoilValue(substrateInjectedAccountsState).length !== 0
  const subConnected = hasSubWallet && hasSubAccounts
  const evmConnected = useWagmiAccount().isConnected

  const hasActiveConnection = subConnected || evmConnected
  const accounts = useRecoilValue(writeableAccountsState)

  return (
    <Clickable.WithFeedback>
      <div
        className={cn(
          'flex h-12 select-none items-center justify-center gap-2 rounded-full border border-gray-600 bg-gray-950 p-4 text-white'
        )}
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center">
          {subConnected && <Polkadot className="shrink-0 text-sm text-[#e6007a]" size="1em" />}
          {evmConnected && <Ethereum className="shrink-0 text-sm text-[#62688f]" size="1em" />}
        </div>

        <div className="whitespace-pre text-xl">
          {hasActiveConnection ? `${accounts.length} Connected` : 'Connect wallet'}
        </div>

        <ChevronDown size="1em" />
      </div>
    </Clickable.WithFeedback>
  )
}
