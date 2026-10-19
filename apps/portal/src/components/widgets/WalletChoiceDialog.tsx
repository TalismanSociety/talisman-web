import { AccountIcon } from "@/components/molecules/AccountIcon"
import { useWalletChoice } from "@/domains/extension/signer"
import { Clickable } from "@/ui/atoms/Clickable"
import { Surface } from "@/ui/atoms/Surface"
import { AlertDialog } from "@/ui/molecules/AlertDialog"
import { ListItem } from "@/ui/molecules/ListItem"
import { truncateAddress } from "@/util/truncateAddress"

export const WalletChoiceDialog = () => {
	const choice = useWalletChoice()

	if (choice === undefined) return null

	return (
		<AlertDialog
			title="Choose the signing wallet"
			targetWidth="40rem"
			onRequestDismiss={() => choice.choose(undefined)}
		>
			<div css={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
				{choice.options.map((option) => (
					<Clickable.WithFeedback
						key={option.walletAccountId}
						onClick={() => choice.choose(option)}
					>
						<Surface css={{ borderRadius: "1.6rem" }}>
							<ListItem
								leadingContent={<AccountIcon account={option} size="3.2rem" />}
								headlineContent={option.walletName}
								supportingContent={option.name ?? truncateAddress(option.address)}
							/>
						</Surface>
					</Clickable.WithFeedback>
				))}
			</div>
		</AlertDialog>
	)
}
