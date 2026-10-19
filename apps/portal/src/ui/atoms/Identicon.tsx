import type { TalismanOrbProps } from "@talismn/orb"
import { TalismanOrb } from "@talismn/orb"
import type { FC } from "react"

type Size = number | string

const Orb = TalismanOrb as FC<
	Omit<TalismanOrbProps, "width" | "height"> & { width?: Size; height?: Size }
>

export type IdenticonProps = {
	value: string
	size?: Size
	className?: string
}

export const Identicon = ({ value, size = "2.4rem", className }: IdenticonProps) => (
	<Orb
		seed={value}
		width={size}
		height={size}
		className={className}
		css={{ display: "inline-block" }}
	/>
)
