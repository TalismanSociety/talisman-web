import { SwapDetails } from './SwapDetails'
import { SwapHistory } from './SwapHistory'
import { cn } from '@/lib/utils'
import { Activity, FileSearch } from '@talismn/web-icons'
import { atom, useAtom } from 'jotai'
import { useMemo } from 'react'

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
        'p-[8px] hover:text-primary cursor-pointer duration-150',
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
          </div>
        </div>
        <div className="flex-1 flex flex-col w-full">
          <div className="md:h-0 md:min-h-full overflow-auto max-h-[340px] md:max-h-auto">{content}</div>
        </div>
      </div>
    </div>
  )
}
