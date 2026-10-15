import { Link, type LinkProps } from "@tanstack/react-router"
import {
	cloneElement,
	type HTMLAttributeAnchorTarget,
	type MouseEventHandler,
	type ReactElement,
	type ReactNode,
} from "react"

import { cn } from "@/util/cn"

const siteNavItemClassName = (isActive: boolean) =>
	cn(
		"text-foreground/60 hover:text-foreground flex items-center gap-1 font-bold lg:gap-2",
		isActive && "text-foreground"
	)

type Destination = { to: LinkProps["to"] } | { href: string }

export const SiteNavItem = ({
	icon,
	label,
	onClick,
	target,
	...destination
}: Destination & {
	icon: ReactElement
	label: ReactNode
	onClick?: MouseEventHandler<HTMLAnchorElement>
	target?: HTMLAttributeAnchorTarget
}) => {
	const content = (
		<>
			{cloneElement(icon, { className: "h-[1.2em] w-[1.2em] shrink-0 [&_*]:stroke-[1.6]" })}
			&nbsp;
			{label}
		</>
	)

	if ("href" in destination)
		return (
			<a
				className={siteNavItemClassName(false)}
				href={destination.href}
				onClick={onClick}
				target={target}
			>
				{content}
			</a>
		)

	return (
		<Link
			activeProps={{ className: siteNavItemClassName(true) }}
			inactiveProps={{ className: siteNavItemClassName(false) }}
			to={destination.to}
			onClick={onClick}
			target={target}
		>
			{content}
		</Link>
	)
}
