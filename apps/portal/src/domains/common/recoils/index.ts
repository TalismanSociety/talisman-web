import { chainReadId$ } from "@/domains/common/chainReadId"
import { atomFromSubject } from "@/domains/common/recoil-bridge"

export const chainReadIdState = atomFromSubject("ChainReadId", chainReadId$)
