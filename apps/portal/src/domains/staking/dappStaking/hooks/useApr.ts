import { bind } from "@react-rxjs/core"
import { useContext } from "react"
import { map } from "rxjs"

import { ChainContext } from "@/domains/chains/contexts"

import { aprInput$ } from "../chain"
import { aprOf } from "../stake"

const [useAprOf] = bind((genesisHash: string) => aprInput$(genesisHash).pipe(map(aprOf)))

export const useApr = () => useAprOf(useContext(ChainContext).genesisHash)
