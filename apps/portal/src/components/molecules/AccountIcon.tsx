import { useTheme } from "@emotion/react"
import type { Account } from "@/domains/accounts/recoils"
import { Eye } from "@/icons"
import { Badge, BadgedBox } from "@/ui/atoms/Badge"
import type { IdenticonProps } from "@/ui/atoms/Identicon"
import { Identicon } from "@/ui/atoms/Identicon"
import { useSurfaceColorAtElevation } from "@/ui/atoms/Surface"
import { Tooltip } from "@/ui/atoms/Tooltip"

export type AccountIconProps = Omit<IdenticonProps, "value"> & {
	account: Pick<Account, "readonly" | "address">
}

export const AccountIcon = ({ account, ...props }: AccountIconProps) => {
	const theme = useTheme()
	const surfaceColor = useSurfaceColorAtElevation((x) => x + 1)
	const size = typeof props.size === "number" ? `${props.size}px` : (props.size ?? "2.4rem")

	return (
		<BadgedBox
			overlap="circular"
			badge={
				account.readonly && (
					<Tooltip content="Watch only account">
						<Badge
							containerColor={surfaceColor}
							contentColor={theme.color.onSurface}
							css={{ fontSize: `calc(${size} / 3.5)` }}
						>
							<Eye />
						</Badge>
					</Tooltip>
				)
			}
		>
			<Identicon {...props} size={size} value={account.address} />
		</BadgedBox>
	)
}
