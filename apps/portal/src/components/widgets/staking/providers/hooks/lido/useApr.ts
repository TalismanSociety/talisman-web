import { useLidoApr } from "@/domains/staking/lido/apr"

type UseAprProps = {
	apiEndpoint: string
}

const useApr = ({ apiEndpoint }: UseAprProps) => useLidoApr(apiEndpoint ?? "")

export default useApr
