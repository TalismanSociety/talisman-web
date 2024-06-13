import { Tabs } from '@talismn/ui'
import { useState } from 'react'

type Tab = 'details' | 'activities' | 'faq'

export const SidePanel: React.FC = () => {
  const [tab, setTab] = useState<Tab>('details')
  return (
    <div
      className="mt-[16px] md:mt-0 w-full md:w-2/3 border border-gray-700 border-r border-b rounded-[12px] md:rounded-l-0 md:border-l-[64px] md:border-l-[transparent]"
      //   style={{
      //     borderLeft: '64px solid transparent',
      //   }}
    >
      <div className="md:ml-[-64px] w-full md:w-[calc(100%+64px)] p-[16px]">
        <div className="flex items-center justify-between">
          <h4 className="text-[16px] font-semibold">Swap</h4>
          <Tabs>
            <Tabs.Item onClick={() => setTab('details')}></Tabs.Item>
            <Tabs.Item onClick={() => setTab('activities')}></Tabs.Item>
            <Tabs.Item onClick={() => setTab('faq')}></Tabs.Item>
          </Tabs>
          <p>{tab}</p>
        </div>
      </div>
    </div>
  )
}
