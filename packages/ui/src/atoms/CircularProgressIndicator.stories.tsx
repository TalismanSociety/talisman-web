import type { ComponentMeta, Story } from "@storybook/react"

import type { CircularProgressIndicatorProps } from "./CircularProgressIndicator"
import { CircularProgressIndicator } from "./CircularProgressIndicator"

export default {
	title: "Atoms/CircularProgressIndicator",
	component: CircularProgressIndicator,
	parameters: {
		layout: "centered",
	},
} as ComponentMeta<typeof CircularProgressIndicator>

const Template: Story<CircularProgressIndicatorProps> = (args: any) => (
	<CircularProgressIndicator {...args} />
)

export const Default = Template.bind({})

Default.args = {}
