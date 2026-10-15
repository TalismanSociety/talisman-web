import { useTheme } from "@emotion/react"
import type { ElementType, PropsWithChildren } from "react"
import { useCallback, useTransition } from "react"
import { CircularProgressIndicator } from "./CircularProgressIndicator"
import type { IconProps } from "./Icon"
import { Icon, SurfaceIcon, TonalIcon } from "./Icon"

type IconButtonElementType = Extract<ElementType, "button" | "a" | "figure"> | ElementType<any>

export type IconButtonProps<T extends IconButtonElementType = "button"> = PropsWithChildren<
	IconProps<T> & {
		loading?: boolean
		disabledContainerColor?: string
		disabledContentColor?: string
		withTransition?: boolean
	}
>

const BaseIconButtonFactory =
	(Element: any) =>
	<T extends IconButtonElementType = "button">({
		loading: _loading = false,
		disabledContainerColor,
		disabledContentColor,
		withTransition = false,
		...props
	}: IconButtonProps<T>) => {
		const [isPending, startTransition] = useTransition()
		const loading = _loading || isPending

		const onClick = useCallback(
			(...args: any[]) => {
				if (withTransition) {
					return startTransition(() => {
						;(props as any).onClick?.(...args)
					})
				} else {
					return (props as any).onClick?.(...args)
				}
			},
			[props, withTransition]
		)

		const theme = useTheme()
		return (
			<Element
				as="button"
				{...props}
				onClick={onClick}
				css={[
					{
						cursor: "pointer",
						":hover": {
							filter: "brightness(1.2)",
						},
					},
					props.disabled && {
						opacity: theme.contentAlpha.disabled,
						color: disabledContentColor,
						backgroundColor: disabledContainerColor,
						cursor: "not-allowed",
					},
				]}
			>
				{loading ? <CircularProgressIndicator /> : props.children}
			</Element>
		)
	}

export const IconButton = BaseIconButtonFactory(Icon)

export const TonalIconButton = BaseIconButtonFactory(TonalIcon)

export const SurfaceIconButton = BaseIconButtonFactory(SurfaceIcon)
