import { TalismanOrb } from "@talismn/orb"

export type IdenticonProps = {
	value: string
	size?: number | string
	className?: string
}

export const Identicon = ({ value, size = "2.4rem", className }: IdenticonProps) => (
	<TalismanOrb
		seed={value}
		className={className}
		css={{ display: "inline-block", width: size, height: size }}
	/>
)
