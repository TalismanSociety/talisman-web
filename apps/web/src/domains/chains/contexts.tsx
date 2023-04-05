import { PropsWithChildren, createContext } from 'react'
import { Chain, chains } from '.'
import { SubstrateApiContext } from '@domains/common'

export const ChainContext = createContext<Chain>(chains[0])

export const ChainProvider = (props: PropsWithChildren<{ value: Chain }>) => (
  <ChainContext.Provider value={props.value}>
    <SubstrateApiContext.Provider value={{ endpoint: props.value.rpcs[0].url }}>
      {props.children}
    </SubstrateApiContext.Provider>
  </ChainContext.Provider>
)
