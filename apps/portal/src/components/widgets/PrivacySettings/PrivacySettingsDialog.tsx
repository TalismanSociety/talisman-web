import { useTheme } from "@emotion/react"
import { AnimatePresence } from "motion/react"
import { useId, useState } from "react"
import { type Consent, type ConsentKind, setConsent, useConsent } from "@/domains/analytics/consent"
import { Button } from "@/ui/atoms/Button"
import { Surface } from "@/ui/atoms/Surface"
import { Switch } from "@/ui/atoms/Switch"
import { Text } from "@/ui/atoms/Text"
import { AlertDialog } from "@/ui/molecules/AlertDialog"
import { closePrivacySettings, usePrivacySettingsOpen } from "./privacySettingsOpen"

export const PRIVACY_POLICY_URL = "https://docs.talisman.xyz/talisman/about/privacy-policy"

type Category = { title: string; description: string }

const ESSENTIAL: Category = {
	title: "Essential",
	description: "Your accounts and preferences, stored on this device. Always on.",
}

const CATEGORIES = {
	analytics: {
		title: "Analytics",
		description: "Anonymous usage events that show which parts of the Portal people use.",
	},
	errors: {
		title: "Error reporting",
		description: "Anonymous crash and error reports that help us fix bugs.",
	},
} satisfies Record<ConsentKind, Category>

const NOTHING_GRANTED: Consent = { analytics: false, errors: false }

const CategoryRow = ({
	category,
	checked,
	disabled,
	onChange,
}: {
	category: Category
	checked: boolean
	disabled?: boolean
	onChange?: (checked: boolean) => void
}) => {
	const theme = useTheme()
	const id = useId()
	return (
		<Surface
			css={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				gap: "1.6rem",
				borderRadius: theme.shape.medium,
				padding: "1.6rem",
			}}
		>
			<div css={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
				<Text.Body id={`${id}-title`} alpha="high">
					{category.title}
				</Text.Body>
				<Text.BodySmall id={`${id}-description`}>{category.description}</Text.BodySmall>
			</div>
			<Switch
				role="switch"
				aria-labelledby={`${id}-title`}
				aria-describedby={`${id}-description`}
				checked={checked}
				disabled={disabled}
				onChange={(event) => onChange?.(event.target.checked)}
			/>
		</Surface>
	)
}

const PrivacySettingsBody = () => {
	const stored = useConsent()
	const [draft, setDraft] = useState<Consent>(stored ?? NOTHING_GRANTED)

	const save = () => {
		setConsent(draft)
		closePrivacySettings()
	}

	return (
		<AlertDialog
			title="Privacy settings"
			targetWidth="48rem"
			onRequestDismiss={closePrivacySettings}
			dismissButton={
				<Button variant="outlined" onClick={closePrivacySettings}>
					Close
				</Button>
			}
			confirmButton={<Button onClick={save}>Save</Button>}
		>
			<div css={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
				<Text.Body as="p">
					Choose what the Talisman Portal may collect to improve the app. It never collects wallet
					addresses or names, and does not store your IP address.{" "}
					<Text.Body.A href={PRIVACY_POLICY_URL} target="_blank" rel="noreferrer noopener">
						Privacy policy
					</Text.Body.A>
				</Text.Body>
				<div css={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
					<CategoryRow category={ESSENTIAL} checked disabled />
					{(Object.entries(CATEGORIES) as [ConsentKind, Category][]).map(([kind, category]) => (
						<CategoryRow
							key={kind}
							category={category}
							checked={draft[kind]}
							onChange={(checked) => setDraft((current) => ({ ...current, [kind]: checked }))}
						/>
					))}
				</div>
			</div>
		</AlertDialog>
	)
}

export const PrivacySettingsDialog = () => {
	const open = usePrivacySettingsOpen()
	return <AnimatePresence>{open && <PrivacySettingsBody />}</AnimatePresence>
}
