import type { ElementType } from "react"
import { Zap } from "@/icons"
import type { ButtonProps } from "@/ui/atoms/Button"
import { Button } from "@/ui/atoms/Button"

const StakeButton = <T extends ElementType>(props: Omit<ButtonProps<T>, "children">) => (
	// @ts-expect-error
	<Button
		{...props}
		variant="surface"
		leadingIcon={<Zap />}
		css={(theme) => ({ color: theme.color.primary })}
	>
		Stake
	</Button>
)

export default StakeButton
