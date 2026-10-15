import { useTheme } from "@emotion/react"
import { useId } from "react"
import {
	openPrivacySettings,
	usePrivacySettingsOpen,
} from "@/components/widgets/PrivacySettings/privacySettingsOpen"
import { acceptAll, rejectAll, useConsent } from "@/domains/analytics/consent"
import { Button } from "@/ui/atoms/Button"
import { Text } from "@/ui/atoms/Text"

const PILL = { borderRadius: "2.4rem" }

export const ConsentBanner = () => {
	const theme = useTheme()
	const consent = useConsent()
	const settingsOpen = usePrivacySettingsOpen()
	const messageId = useId()

	if (consent !== null) return null

	return (
		<section
			hidden={settingsOpen}
			aria-labelledby={messageId}
			css={{
				position: "fixed",
				right: "1.6rem",
				bottom: "1.6rem",
				left: "1.6rem",
				zIndex: 11,
				display: "flex",
				flexDirection: "column",
				gap: "1.6rem",
				border: `solid 1px ${theme.color.onBackground}`,
				borderRadius: "1.2rem",
				padding: "2.4rem",
				backgroundColor: theme.color.background,
				"@media(min-width: 640px)": {
					right: "2.4rem",
					bottom: "2.4rem",
					left: "auto",
					width: "40rem",
				},
			}}
		>
			<Text.Body id={messageId} as="p" alpha="high">
				We use cookies to help improve your experience.
			</Text.Body>
			<div
				css={{
					display: "grid",
					gridTemplateColumns: "repeat(3, 1fr)",
					gap: "0.8rem",
					"> *": { width: "100%" },
				}}
			>
				<Button variant="outlined" css={PILL} onClick={rejectAll}>
					Reject
				</Button>
				<Button variant="outlined" css={PILL} onClick={openPrivacySettings}>
					Settings
				</Button>
				<Button css={PILL} onClick={acceptAll}>
					Accept
				</Button>
			</div>
		</section>
	)
}
