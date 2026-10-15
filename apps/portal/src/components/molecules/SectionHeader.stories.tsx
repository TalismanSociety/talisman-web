import type { ComponentMeta, Story } from "@storybook/react"

import type { SectionHeaderProps } from "./SectionHeader"
import { SectionHeader } from "./SectionHeader"

export default {
	title: "Molecules/SectionHeader",
	component: SectionHeader,
	parameters: {
		layout: "centered",
	},
} as ComponentMeta<typeof SectionHeader>

export const Default: Story<SectionHeaderProps> = (args: any) => <SectionHeader {...args} />

Default.args = {
	headlineContent: "Assets",
	supportingContent: "$19,495.23",
}
