import { ChainflipActivities } from './ChainflipActivities'
import { ChainflipDetails } from './ChainflipDetails'
import { ChainFlipFAQ } from './ChainflipFAQ'
import { cn } from '@/lib/utils'
import { Chip } from '@talismn/ui'
import { Activity, FileSearch, HelpCircle } from '@talismn/web-icons'
import { useMemo } from 'react'
import { atom, useRecoilState } from 'recoil'

type Tab = 'details' | 'activities' | 'faq'

export const swapInfoTabState = atom<Tab>({
  key: 'swapInfoTabState',
  default: 'details',
})

export const shouldFocusDetailsState = atom<boolean>({
  key: 'shouldFocusDetails',
  default: false,
})

const TabItem: React.FC<React.PropsWithChildren & { onClick?: () => void; selected?: boolean }> = ({
  children,
  onClick,
  selected,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'p-[8px] hover:text-primary cursor-pointer duration-150',
        selected ? 'text-primary' : 'text-gray-600'
      )}
    >
      {children}
    </div>
  )
}

export const SidePanel: React.FC = () => {
  const [tab, setTab] = useRecoilState<Tab>(swapInfoTabState)

  const content = useMemo(() => {
    switch (tab) {
      case 'details':
        return <ChainflipDetails />
      case 'activities':
        return <ChainflipActivities />
      default:
        return <ChainFlipFAQ />
    }
  }, [tab])

  return (
    <div className="mt-[16px] md:mt-0 w-full md:w-3/4 border border-gray-700 border-r border-b rounded-[12px] md:rounded-l-0 md:border-l-[64px] md:border-l-[transparent]">
      <div className="md:ml-[-64px] w-full md:w-[calc(100%+64px)] p-[16px] flex flex-col jsutify-between h-full gap-[16px] flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-[16px] font-semibold">Swap</h4>
          <div className="flex items-center justify-end gap-[4px]">
            <TabItem selected={tab === 'details'} onClick={() => setTab('details')}>
              <FileSearch size={16} />
            </TabItem>
            <TabItem selected={tab === 'activities'} onClick={() => setTab('activities')}>
              <Activity size={16} />
            </TabItem>
            <TabItem selected={tab === 'faq'} onClick={() => setTab('faq')}>
              <HelpCircle size={16} />
            </TabItem>
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-auto overflow-x-hidden w-full">{content}</div>
        <div className="bg-background mt-auto pt-3">
          <p className="text-center text-[12px] text-gray-500">
            Swap powered by {/* eslint-disable-next-line react/jsx-no-target-blank */}
            <a href="https://docs.chainflip.io/concepts/welcome" target="_blank" css={{ display: 'contents' }}>
              <Chip
                containerColor="linear-gradient(90deg, rgba(255, 73, 162, 0.10) 0%, rgba(70, 221, 147, 0.10) 100%)"
                size="sm"
                css={{ textTransform: 'uppercase', cursor: 'pointer' }}
              >
                <img src="https://chainflip.io/images/home/logo-white.svg" css={{ height: '1em' }} />
              </Chip>
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
