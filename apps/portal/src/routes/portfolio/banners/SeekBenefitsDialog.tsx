import { Button } from '@talismn/ui/atoms/Button'
import { AlertDialog } from '@talismn/ui/molecules/AlertDialog'
import { ArrowRight } from 'lucide-react'

import SeekInfoBenefitsDialogBg from '@/assets/seek-benefits-dialog-bg.svg?react'

type SeekBenefitsDialogProps = {
  isOpen: boolean
  onToggleIsOpen: () => void
}

const SeekBenefitsDialog = ({ isOpen, onToggleIsOpen }: SeekBenefitsDialogProps) => {
  return (
    <AlertDialog
      open={isOpen}
      title="SEEK Benefits"
      targetWidth="40rem"
      dismissButton={<Button onClick={onToggleIsOpen}>Coming Soon</Button>}
      onRequestDismiss={onToggleIsOpen}
      // className="h-[60rem] bg-gradient-to-t from-[#262626] to-[#505F2E] to-[98%]"
      className="h-[60rem]"
    >
      <div className="absolute right-0 top-0">
        <SeekInfoBenefitsDialogBg />
      </div>
      <div className="absolute left-0 right-0 top-0 z-[-1] h-[20rem] bg-gradient-to-t from-[#262626] to-[#505F2E] to-[98%]" />
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
        </div>
        <div className="mt-[20rem]">Other stuff</div>
      </div>
    </AlertDialog>
  )
}

export default SeekBenefitsDialog
