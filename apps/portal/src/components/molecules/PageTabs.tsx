import { Link, type LinkProps } from "@tanstack/react-router"
import type { HTMLAttributeAnchorTarget, ReactNode } from "react"

import { cn } from "@/util/cn"

export const PageTabs = ({ className, children }: { className?: string; children?: ReactNode }) => {
	return (
		<nav
			className={cn(
				"flex list-none items-center justify-center gap-4 rounded-[16px] p-4 text-2xl",
				"bg-background border border-gray-700",
				className
			)}
		>
			{children}
		</nav>
	)
}

const pageTabClassName = (isActive: boolean, className?: string) =>
	cn(
		"flex w-full flex-1 items-center justify-center gap-2 whitespace-pre rounded-[8px] px-10 py-4",
		"text-foreground/60 hover:text-foreground hover:bg-white/10",
		isActive && "text-foreground bg-white/5",
		className
	)

export const PageTab = ({
	className,
	children,
	to,
	target,
}: {
	className?: string
	children?: ReactNode
	to: LinkProps["to"]
	target?: HTMLAttributeAnchorTarget
}) => {
	return (
		<Link
			activeProps={{ className: pageTabClassName(true, className) }}
			inactiveProps={{ className: pageTabClassName(false, className) }}
			to={to}
			target={target}
		>
			{children}
		</Link>
	)
}
