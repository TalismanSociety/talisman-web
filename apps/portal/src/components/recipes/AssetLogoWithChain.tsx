import { useNetworksById } from "@/domains/chains/chaindata-provider"
import { cn } from "@/util/cn"

const UNKNOWN_TOKEN_LOGO_URL =
	"https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/unknown.svg"

type Props = {
	className?: string
	chainId?: string | number
	assetLogoUrl: string | undefined
}

export const AssetLogoWithChain = ({ className, assetLogoUrl, chainId }: Props) => {
	const networks = useNetworksById()
	const networkLogo = chainId ? networks[chainId]?.logo : undefined
	const roundAssetLogo = !isTalismanLogo(assetLogoUrl)

	return (
		<div className={cn("relative text-[24px] sm:text-[40px]", className)}>
			{networkLogo ? (
				<img
					src={networkLogo}
					className={cn(
						"absolute right-0 top-0 h-[0.5rem] min-h-[0.5em] w-[0.5em] min-w-[0.5em] -translate-y-1/4 translate-x-1/4",
						"rounded-full border-[0.05em] border-gray-800 bg-gray-800",
						className
					)}
				/>
			) : null}
			<img
				src={assetLogoUrl ?? UNKNOWN_TOKEN_LOGO_URL}
				className={cn(
					"h-[1em] min-h-[1em] w-[1em] min-w-[1em]",
					roundAssetLogo && "rounded-full",
					className
				)}
			/>
		</div>
	)
}

/** We should only round logos which aren't hosted on our chaindata repo */
function isTalismanLogo(url?: string | null) {
	if (!url) return false
	return (
		/^https:\/\/raw\.githubusercontent\.com\/TalismanSociety\/chaindata\//i.test(url) &&
		!/assets\/tokens\/coingecko/i.test(url)
	)
}
