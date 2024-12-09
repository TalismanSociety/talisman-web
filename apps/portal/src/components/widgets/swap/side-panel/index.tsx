import { Activity, FileSearch } from '@talismn/web-icons'
import { atom, useAtom } from 'jotai'
import { useMemo } from 'react'

import { cn } from '@/lib/utils'

import { SwapDetails } from './SwapDetails'
import { SwapHistory } from './SwapHistory'

type Tab = 'details' | 'activities'

export const swapInfoTabAtom = atom<Tab>('details')

export const shouldFocusDetailsAtom = atom<boolean>(false)

const TabItem: React.FC<React.PropsWithChildren & { onClick?: () => void; selected?: boolean }> = ({
  children,
  onClick,
  selected,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'hover:text-primary cursor-pointer p-[8px] duration-150',
        selected ? 'text-primary' : 'text-gray-600'
      )}
    >
      {children}
    </div>
  )
}

export const SidePanel: React.FC = () => {
  const [tab, setTab] = useAtom<Tab>(swapInfoTabAtom)

  const content = useMemo(() => {
    switch (tab) {
      case 'details':
        return <SwapDetails />
      case 'activities':
        return <SwapHistory />
      default:
        return null
    }
  }, [tab])

  return (
    <div className="md:rounded-l-0 mt-[16px] w-full rounded-[12px] border border-b border-r border-gray-700 md:mt-0 md:w-4/5 md:border-l-[64px] md:border-l-[transparent]">
      <div className="jsutify-between flex h-full w-full flex-1 flex-col gap-[16px] p-[16px] md:ml-[-64px] md:w-[calc(100%+64px)]">
        <div className="flex items-center justify-between">
          <h4 className="text-[16px] font-semibold">Swap</h4>
          <div className="flex items-center justify-end gap-[4px]">
            <TabItem selected={tab === 'details'} onClick={() => setTab('details')}>
              <FileSearch size={16} />
            </TabItem>
            <TabItem selected={tab === 'activities'} onClick={() => setTab('activities')}>
              <Activity size={16} />
            </TabItem>
          </div>
        </div>
        <div className="flex w-full flex-1 flex-col">
          <div className="md:max-h-auto max-h-[340px] overflow-auto md:h-0 md:min-h-full">{content}</div>
        </div>
      </div>
    </div>
  )
}
