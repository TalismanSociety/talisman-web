import { useTheme } from "@emotion/react"
import type { DetailedHTMLProps, InputHTMLAttributes } from "react"

import { Surface, useSurfaceColor } from "./Surface"

export type SwitchProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export const Switch = (props: SwitchProps) => {
	const theme = useTheme()
	return (
		<Surface
			as="label"
			elevation={(x) => x + 3}
			css={[
				{
					display: "inline-flex",
					width: "3.3rem",
					borderRadius: theme.shape.full,
					padding: "0.2rem",
					cursor: "pointer",
					":has(input:checked)": {
						"> div": {
							backgroundColor: theme.color.primary,
							transform: "translateX(100%)",
						},
					},
					":has(input:focus-visible)": {
						outline: `2px solid ${theme.color.primary}`,
						outlineOffset: "2px",
					},
				},
			]}
		>
			<input
				{...props}
				type="checkbox"
				css={{ position: "absolute", width: 0, height: 0, margin: 0, opacity: 0 }}
			/>
			<div
				css={{
					width: "1.5rem",
					height: "1.5rem",
					borderRadius: theme.shape.full,
					backgroundColor: useSurfaceColor(),
					transition: "linear 0.125s",
				}}
			/>
		</Surface>
	)
}
