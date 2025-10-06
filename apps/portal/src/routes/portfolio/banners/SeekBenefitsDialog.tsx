import { Button } from '@talismn/ui/atoms/Button'
import { AlertDialog } from '@talismn/ui/molecules/AlertDialog'
import { ArrowRight, ZapIcon } from 'lucide-react'
import { FC, SVGProps } from 'react'
import { useNavigate } from 'react-router-dom'

import ClockIcon from '@/assets/clock-icon.svg?react'
import CoinsIcon from '@/assets/coins-hand-icon.svg?react'
import SeekInfoBenefitsDialogBg from '@/assets/seek-benefits-dialog-bg.svg?react'
import ZapFastIcon from '@/assets/zap-fast-icon.svg?react'
import useGetSeekAvailableBalance from '@/components/widgets/staking/providers/hooks/seek/useGetSeekAvailableBalance'
import useGetSeekStakeApr from '@/components/widgets/staking/providers/hooks/seek/useGetSeekStakeApr'
import useSeekProviders from '@/components/widgets/staking/providers/hooks/seek/useSeekProviders'

type SeekBenefitsDialogProps = {
  isOpen: boolean
  onToggleIsOpen: () => void
}

const SeekBenefitsDialog = ({ isOpen, onToggleIsOpen }: SeekBenefitsDialogProps) => {
  const [seekProvider] = useSeekProviders()
  const { actionLink } = seekProvider ?? { actionLink: '' }
  const navigate = useNavigate()
  const apy = useGetSeekStakeApr()
  const { totalAvailableFormatted } = useGetSeekAvailableBalance()

  const seekStakingLink = `/staking/providers/${actionLink}`

  return (
    <AlertDialog
      open={isOpen}
      title="SEEK Benefits"
      targetWidth="40rem"
      dismissButton={<Button onClick={onToggleIsOpen}>Coming Soon</Button>}
      onRequestDismiss={onToggleIsOpen}
      className="h-[60rem]"
    >
      <div className="absolute right-0 top-0 z-[-1]">
        <SeekInfoBenefitsDialogBg />
      </div>
      <div className="absolute left-0 right-0 top-0 z-[-2] h-[20rem] bg-gradient-to-t from-[#1b1b1b] to-[#505F2E] to-[98%]" />
      <div className="h-[40rem]">
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-3xl font-bold text-white">Talisman SEEK is live</div>
          </div>
          <div className="flex flex-col gap-10 text-gray-400">
            <div className="w-[22rem] text-[14px]">
              Become part of the Seeker community.{' '}
              <a
                className="inline-flex items-center justify-center gap-1 text-white"
                href="https://talisman.xyz/seek"
                target="_blank"
                rel="noreferrer"
              >
                <span className="text-primary">Learn more</span>
                <ArrowRight className="text-primary" size={14} />
              </a>
            </div>
          </div>
          <div className="w-fit rounded-[8px] bg-[#D5FF5C] bg-opacity-[0.1] px-5 py-2 text-[12px]">
            You have: <span className="text-primary">{totalAvailableFormatted}</span> SEEK
          </div>
        </div>
        <div className="mt-[2rem] rounded-[10px] border-2 border-[#393939] text-[14px]">
          <div className="gap 1 flex h-[46px] items-center gap-3 bg-[#393939] px-5">
            <div>Earn SEEK rewards</div>

            <div className="size-2 shrink-0 rounded-full bg-[#5A5A5A]" />

            <div className="text-primary">{apy}% APY</div>

            <button
              className="ml-auto flex items-center gap-2 rounded-[43px] bg-[#D5FF5C] bg-opacity-[0.1] px-5 py-2
              transition-all duration-300 hover:hover:bg-opacity-[0.2]"
              onClick={() => navigate(seekStakingLink, { replace: true })}
            >
              <ZapIcon className="text-primary m-[0px] size-6 p-[0px]" />
              <div className="text-primary text-[14px]">Stake</div>
            </button>
          </div>
          <div className="flex flex-col gap-[3rem] p-6">
            <ListItem
              Icon={ZapFastIcon}
              color="#D5FF5C"
              backgroundColor="rgba(213, 255, 92, 0.12)"
              title="Up to 50% rewards"
              description="Maximize your staking power with SEEK."
            />
            <ListItem
              Icon={CoinsIcon}
              color="rgba(253, 143, 255, 1)"
              backgroundColor="rgba(255, 92, 225, 0.12)"
              title="Earn fee discounts on Bittensor"
              description="Stake SEEK and trade with lower fees."
            />
            <ListItem
              Icon={ClockIcon}
              color="rgba(186, 143, 255, 1)"
              backgroundColor="rgba(121, 112, 255, 0.19)"
              title="More benefits coming soon"
              description="Unlock future perks by staking SEEK."
            />
          </div>
        </div>
      </div>
    </AlertDialog>
  )
}

export default SeekBenefitsDialog

type ListItemProps = {
  Icon: FC<SVGProps<SVGSVGElement>>
  color: string
  backgroundColor: string
  title: string
  description: string
}

const ListItem = ({ Icon, color, backgroundColor, title, description }: ListItemProps) => {
  return (
    <div className="flex h-20 w-full items-center gap-8">
      <div
        className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor }}
      >
        <Icon className="size-10" style={{ color }} />
      </div>
      <div className="flex grow flex-col gap-2">
        <div>{title}</div>
        <div className="text-[12px] text-gray-400">{description}</div>
      </div>
    </div>
  )
}
