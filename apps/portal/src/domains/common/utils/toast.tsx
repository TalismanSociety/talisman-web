import { ExternalLink } from "@/icons"
import { Text } from "@/ui/atoms/Text"
import { ToastMessage } from "@/ui/molecules/ToastBar"
import { toast } from "@/ui/molecules/Toaster"

type TxHash = { toString(): string }

type ToastableResult = { txHash?: TxHash }

type ToastableError = { data?: unknown; message?: string; txHash?: TxHash }

export const toastExtrinsic = (
	extrinsics: Array<[string, string]>,
	promise: Promise<ToastableResult>,
	subscanUrl?: string
) => {
	void toast.promise(
		promise,
		{
			loading: "Your transaction is pending...",
			success: (data) => (
				<ToastMessage
					headlineContent="Your transaction was successful"
					supportingContent={
						<div>
							{extrinsics.length === 1 && (
								<div>
									Your{" "}
									<code>
										{extrinsics[0]?.[0]}:{extrinsics[0]?.[1]}
									</code>{" "}
									transaction was successful.
								</div>
							)}
							{subscanUrl !== undefined && (
								<Text.Body as="div">
									View details on{" "}
									<Text.Body
										as="a"
										alpha="high"
										href={`${subscanUrl}extrinsic/${data?.txHash?.toString()}`}
										target="_blank"
									>
										Subscan
									</Text.Body>
								</Text.Body>
							)}
						</div>
					}
				/>
			),
			error: (error: ToastableError) => {
				const rawErrorMsg = typeof error?.data === "string" ? error.data : error?.message
				const errorMsg = rawErrorMsg?.startsWith("Inability to pay some fees") ? (
					<Text.Body>
						Unable to pay some fees (e.g. low account balance
						<br />
						or approaching polkadot existential deposit limit, read{" "}
						<Text.Noop.A
							href="https://docs.talisman.xyz/talisman/help-and-support/troubleshooting/ed"
							target="_blank"
						>
							more
						</Text.Noop.A>
						)
					</Text.Body>
				) : (
					rawErrorMsg
				)

				return (
					<>
						<Text.Body as="div" alpha="high">
							Your transaction failed
						</Text.Body>
						{("data" in error || "message" in error) && <Text.Body as="div">{errorMsg}</Text.Body>}
						{subscanUrl && error?.txHash !== undefined && (
							<Text.Body as="div">
								View details on{" "}
								<Text.Body
									as="a"
									alpha="high"
									href={`${subscanUrl}extrinsic/${error.txHash.toString()}`}
									target="_blank"
								>
									Subscan <ExternalLink size="1.2rem" />
								</Text.Body>
							</Text.Body>
						)}
					</>
				)
			},
		},
		{
			success: { duration: 6000 },
			error: { duration: 6000 },
		}
	)
}
