import { bind } from "@react-rxjs/core"
import { useContext } from "react"

import { ChainContext } from "@/domains/chains/contexts"
import { unlockDuration$ } from "@/domains/staking/dappStaking/chain"

const [useUnlockDurationOf] = bind(unlockDuration$)

const useUnlockDuration = () => useUnlockDurationOf(useContext(ChainContext).genesisHash)

export default useUnlockDuration
