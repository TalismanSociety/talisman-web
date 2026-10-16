import type { ReactNode } from "react"
import { useState, useTransition } from "react"
import { useRecoilValue } from "recoil"
import type { SmartContract } from "@/domains/chains/portal-runtime"
import { useNativeTokenAmountState } from "@/domains/chains/recoils"
import { useRegisteredDapps } from "@/domains/staking/dappStaking/dapps"
import type { Stake } from "@/domains/staking/dappStaking/hooks/useStake"
import { CircularProgressIndicator } from "@/ui/atoms/CircularProgressIndicator"
import { Clickable } from "@/ui/atoms/Clickable"
import { Surface } from "@/ui/atoms/Surface"
import { Text } from "@/ui/atoms/Text"
import { AlertDialog } from "@/ui/molecules/AlertDialog"
import { truncateAddress } from "@/util/truncateAddress"

type DappPickerDialogProps = {
	title: ReactNode
	stake: Stake
	onSelect: (dapp: SmartContract) => void
	onRequestDismiss: () => void
}

const DappPickerDialog = (props: DappPickerDialogProps) => {
	const tokenAmount = useRecoilValue(useNativeTokenAmountState())
	const registeredDapps = useRegisteredDapps()

	const [dappInTransition, setDappInTransition] = useState<SmartContract>()
	const [inTransition, startTransition] = useTransition()

	const selectDapp = (dapp: SmartContract) => {
		setDappInTransition(dapp)
		startTransition(() => props.onSelect(dapp))
	}

	return (
		<AlertDialog title={props.title} onRequestDismiss={props.onRequestDismiss} targetWidth="45rem">
			<div css={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
				{props.stake.dapps.map(([dapp, info]) => {
					const total = tokenAmount.fromPlanck(info.staked.voting + info.staked.build_and_earn)

					const address = dapp.value

					const registeredDapp = registeredDapps.find(
						(x) => x.address.toLowerCase() === address.toLowerCase()
					)

					return (
						<Clickable.WithFeedback
							key={`${dapp.type}:${dapp.value}`}
							onClick={() => selectDapp(dapp)}
						>
							<Surface
								css={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									borderRadius: "1.6rem",
									padding: "1rem 1.6rem",
								}}
							>
								<div css={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
									{inTransition && dappInTransition === dapp ? (
										<CircularProgressIndicator size="4rem" />
									) : (
										<img
											src={registeredDapp?.iconUrl}
											css={{ borderRadius: "2rem", width: "4rem", aspectRatio: "1 / 1" }}
										/>
									)}
									<Text.BodyLarge as="div" alpha="high" css={{ fontWeight: "bold" }}>
										{registeredDapp?.name ?? truncateAddress(address)}{" "}
									</Text.BodyLarge>
								</div>
								<div>
									<Text.Body as="div" alpha="high">
										{total.decimalAmount?.toLocaleString()}
									</Text.Body>
									<Text.BodySmall as="div">{total.localizedFiatAmount}</Text.BodySmall>
								</div>
							</Surface>
						</Clickable.WithFeedback>
					)
				})}
			</div>
		</AlertDialog>
	)
}

export default DappPickerDialog
