import { createLucideIcon } from "lucide-react"
import type { ReactNode } from "react"

import Discord from "@/assets/icons/discord.svg?react"
import GitHub from "@/assets/icons/github.svg?react"
import XSocial from "@/assets/icons/x-social.svg?react"
import { PRIVACY_POLICY_URL } from "@/components/widgets/PrivacySettings/PrivacySettingsDialog"
import { openPrivacySettings } from "@/components/widgets/PrivacySettings/privacySettingsOpen"
import { cn } from "@/util/cn"

const LucideZeroCookie = createLucideIcon({
	name: "cookie",
	node: [
		["path", { d: "M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5", key: "laymnq" }],
		["path", { d: "M8.5 8.5v.01", key: "ue8clq" }],
		["path", { d: "M16 15.5v.01", key: "14dtrp" }],
		["path", { d: "M12 12v.01", key: "u5ubse" }],
		["path", { d: "M11 17v.01", key: "1hyl5a" }],
		["path", { d: "M7 14v.01", key: "uct60s" }],
	],
})

export const SiteFooter = ({ className }: { className?: string }) => {
	return (
		<footer className={cn("pb-8", className)}>
			<div className="flex items-center justify-center gap-8">
				<FooterLink href="https://x.com/wearetalisman">
					<XSocial width="1em" />
				</FooterLink>
				<FooterLink href="https://discord.gg/talisman">
					<Discord width="1em" />
				</FooterLink>
				<FooterLink href="https://github.com/talismansociety">
					<GitHub width="1em" />
				</FooterLink>
				<FooterLink href="https://docs.talisman.xyz">Docs</FooterLink>
				<FooterLink href="https://docs.talisman.xyz/talisman/about/terms-of-use">Terms</FooterLink>
				<FooterLink href={PRIVACY_POLICY_URL}>Privacy</FooterLink>
				<button
					type="button"
					className={FOOTER_ITEM}
					onClick={openPrivacySettings}
					aria-label="Privacy settings"
					title="Privacy settings"
				>
					<span className="hidden sm:inline">Privacy settings</span>
					<LucideZeroCookie className="sm:hidden" size="1em" aria-hidden />
				</button>
			</div>
		</footer>
	)
}

const FOOTER_ITEM = "text-foreground/60 hover:text-foreground focus:text-foreground"

const FooterLink = ({ href, children }: { href: string; children: ReactNode }) => (
	<a className={FOOTER_ITEM} href={href} target="_blank" rel="noreferrer noopener">
		{children}
	</a>
)
