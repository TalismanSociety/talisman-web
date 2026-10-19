import { keyframes, useTheme } from "@emotion/react"

import { useSurfaceColor, useSurfaceColorAtElevation } from "./Surface"

export type SkeletonProps = React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
> & {
	animate?: boolean
}

const pulse = keyframes`
  50% {
    opacity: 0.5;
  }
`

const pulseAnimation = { animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite` }

export const Skeleton = {
	Surface: ({ animate = true, ...props }: SkeletonProps) => {
		const theme = useTheme()
		const surfaceColor = useSurfaceColor()
		return (
			<div
				{...props}
				css={[
					{
						borderRadius: theme.shape.medium,
						background: surfaceColor,
					},
					animate && pulseAnimation,
				]}
			/>
		)
	},
	Foreground: ({ animate, ...props }: SkeletonProps) => {
		const theme = useTheme()
		const elevatedSurfaceColor = useSurfaceColorAtElevation((x) => x + 1)
		return (
			<div
				{...props}
				css={[
					{
						backgroundColor: elevatedSurfaceColor,
						borderRadius: theme.shape.medium,
					},
					animate && pulseAnimation,
				]}
			/>
		)
	},
}
