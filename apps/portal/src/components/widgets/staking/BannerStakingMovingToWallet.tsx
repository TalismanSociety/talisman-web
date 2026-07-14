import { ExternalLink, ZapPlus } from '@talismn/web-icons'

const talismanWalletLink = 'https://talisman.xyz/download'

export const BannerStakingMovingToWallet = ({ className }: { className?: string }) => (
  <a
    href={talismanWalletLink}
    target="_blank"
    rel="noopener noreferrer"
    className={`group relative flex items-center gap-5 rounded-[12px] px-5 py-3 ${className ?? ''}`}
    style={{
      backgroundImage:
        'linear-gradient(90deg, rgba(221, 255, 118, 0.07) 0%, rgba(221, 255, 118, 0.07) 100%), linear-gradient(90deg, rgb(18, 18, 18) 0%, rgb(18, 18, 18) 100%)',
    }}
  >
    <ZapPlus className="h-8 w-8 flex-shrink-0 text-[#D5FF5C]" />
    <div className="flex flex-col gap-1">
      <div className="text-[14px] font-semibold leading-[140%] text-white">Staking is moving to Talisman Wallet</div>
      <div className="text-[11px] leading-[140%] text-[#BABABA]">
        In the coming weeks, Portal’s staking service will be migrated to a dedicated experience in Talisman Wallet. To
        continue staking and manage your assets, please use{' '}
        <span className="font-medium text-[#DDFF76]">Talisman Wallet</span>.
      </div>
    </div>
    <ExternalLink className="ml-auto h-4 w-4 flex-shrink-0 text-white" />
  </a>
)
