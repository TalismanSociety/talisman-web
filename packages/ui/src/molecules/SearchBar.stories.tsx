import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

import type { SearchBarProps } from "./SearchBar"
import { SearchBar } from "./SearchBar"

export default {
	title: "Molecules/SearchBar",
	component: SearchBar,
	parameters: {
		layout: "centered",
	},
} satisfies Meta<SearchBarProps>

type Story = StoryObj<SearchBarProps>

export const Default: Story = {
	args: {},
	render: (args) => {
		const [value, setValue] = useState("")
		return <SearchBar {...args} value={value} onChangeText={setValue} />
	},
}
