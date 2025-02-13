import React, { createContext, ReactNode, useContext, useState } from 'react'

import { type TokenAmountFromPlank } from '@/domains/common/hooks/useTokenAmount'

type BittensorStakeContextType = {
  talismanFeeTokenAmount: TokenAmountFromPlank | undefined
  setTalismanFeeTokenAmount: React.Dispatch<React.SetStateAction<TokenAmountFromPlank | undefined>>
}

const BittensorStakeContext = createContext<BittensorStakeContextType | undefined>(undefined)

type BittensorStakeProviderProps = {
  children: ReactNode
}

export const BittensorStakeProvider: React.FC<BittensorStakeProviderProps> = ({ children }) => {
  const [talismanFeeTokenAmount, setTalismanFeeTokenAmount] = useState<TokenAmountFromPlank | undefined>()

  return (
    <BittensorStakeContext.Provider value={{ talismanFeeTokenAmount, setTalismanFeeTokenAmount }}>
      {children}
    </BittensorStakeContext.Provider>
  )
}

export const useBittensorStake = (): BittensorStakeContextType => {
  const context = useContext(BittensorStakeContext)
  if (!context) {
    throw new Error('useBittensorStake must be used within a BittensorStakeProvider')
  }
  return context
}
