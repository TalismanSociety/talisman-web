import { ClassNames, useTheme } from "@emotion/react"
import type { WalletPlatform } from "@kheopskit/core"
import { bind } from "@react-rxjs/core"
import { useSignetSdk } from "@talismn/signet-apps-sdk"
import { disconnect as disconnectCore } from "@wagmi/core"
import { AnimatePresence } from "motion/react"
import type { ButtonHTMLAttributes, DetailedHTMLProps, PropsWithChildren } from "react"
import { Suspense, useState } from "react"
import { BehaviorSubject } from "rxjs"
import { useConfig, useConnection, useDisconnect } from "wagmi"
import talismanWalletLogo from "@/assets/talisman-wallet.svg"
import { AddReadOnlyAccountDialog } from "@/components/widgets/AddReadOnlyAccountDialog"
import { useInjectedAccounts, useWriteableEvmAccounts } from "@/domains/accounts/accounts"
import { useConnectEvm, useEvmConnectors } from "@/domains/extension/evm"
import { useWalletConnectWallet } from "@/domains/extension/kheopskit"
import {
	useHasConnectedSubstrateWallet,
	useInstalledSubstrateWallets,
} from "@/domains/extension/substrate"
import { Eye, Wallet } from "@/icons"
import { Chip } from "@/ui/atoms/Chip"
import { Hr } from "@/ui/atoms/Hr"
import { Surface } from "@/ui/atoms/Surface"
import { Text } from "@/ui/atoms/Text"
import { ListItem } from "@/ui/molecules/ListItem"
import { SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR, SideSheet } from "@/ui/molecules/SideSheet"
import { toast } from "@/ui/molecules/Toaster"

const talismanInstalled = "talismanEth" in globalThis

const platformLabels = {
	polkadot: "Polkadot",
	ethereum: "Ethereum",
	solana: "Solana",
} satisfies Record<WalletPlatform, string>

const PlatformLabel = (props: { platforms: readonly WalletPlatform[] }) =>
	props.platforms.length > 0 && (
		<Text.BodySmall alpha="medium" css={{ marginLeft: "0.4rem" }}>
			({props.platforms.map((platform) => platformLabels[platform]).join(" + ")})
		</Text.BodySmall>
	)

const WalletName = (props: { name: string; platforms: readonly WalletPlatform[] }) => (
	<Text.BodyLarge alpha="high">
		{props.name}
		<PlatformLabel platforms={props.platforms} />
	</Text.BodyLarge>
)

type ConnectionButtonProps = DetailedHTMLProps<
	ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
> & {
	connected?: boolean
	hovered?: boolean
}

const ConnectionChip = (props: ConnectionButtonProps) => {
	const theme = useTheme()
	const toDisconnect = props.hovered && props.connected
	const connectionColor = toDisconnect
		? theme.color.error
		: props.connected
			? "#38D448"
			: theme.color.onSurface
	return (
		<Chip
			{...props}
			size="lg"
			css={{
				border: `1px solid ${connectionColor}`,
				borderRadius: "2rem",
				background: "transparent",
				padding: "0.6rem 0.8rem",
				pointerEvents: "none",
			}}
			leadingContent={
				<div
					css={{
						position: "relative",
						width: "1.4rem",
						height: "1.4rem",
						border: `0.2rem solid color-mix(in srgb, ${connectionColor}, transparent 70%)`,
						borderRadius: "0.7rem",
					}}
				>
					<div
						css={{
							position: "absolute",
							inset: "0.2rem",
							borderRadius: "50%",
							backgroundColor: connectionColor,
						}}
					/>
				</div>
			}
		>
			<Text.BodyLarge alpha="high">
				{toDisconnect ? "Disconnect" : props.connected ? "Connected" : "Connect"}
			</Text.BodyLarge>
		</Chip>
	)
}

type WalletConnectionProps = {
	name: string
	platforms: readonly WalletPlatform[]
	iconUrl?: string
	connected?: boolean
	onConnectRequest: () => unknown
	onDisconnectRequest: () => unknown
	nonInteractive?: boolean
}

const itemStyle = () => ({
	borderRadius: "1.2rem",
	cursor: "pointer",
	":hover": { filter: "brightness(1.2)" },
	[SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { minWidth: "40rem" },
})

const WalletConnection = (props: WalletConnectionProps) => {
	const [hovered, setHovered] = useState(false)
	return (
		<Surface
			as={ListItem}
			leadingContent={
				props.iconUrl ? (
					<img
						src={props.iconUrl}
						alt={props.name}
						css={{ width: "2.4rem", aspectRatio: "1 / 1" }}
					/>
				) : (
					<Wallet size="2.4rem" />
				)
			}
			headlineContent={<WalletName name={props.name} platforms={props.platforms} />}
			trailingContent={
				<ConnectionChip connected={props.connected} hovered={!props.nonInteractive && hovered} />
			}
			onClick={props.connected ? props.onDisconnectRequest : props.onConnectRequest}
			onMouseEnter={() => setHovered(!props.nonInteractive)}
			onMouseLeave={() => setHovered(false)}
			css={itemStyle}
		/>
	)
}

const InstallTalisman = () => {
	if (talismanInstalled) {
		return null
	}

	return (
		<a
			href="https://talisman.xyz/download"
			target="_blank"
			css={{ display: "contents" }}
			rel="noopener"
		>
			<Surface
				as={ListItem}
				headlineContent={<WalletName name="Talisman" platforms={["polkadot", "ethereum"]} />}
				leadingContent={
					<img
						src={talismanWalletLogo}
						alt="Talisman"
						css={{ width: "2.4rem", aspectRatio: "1 / 1" }}
					/>
				}
				trailingContent={
					<Chip
						size="lg"
						css={{
							border: `1px solid transparent`,
							borderRadius: "2rem",
							padding: "0.6rem 0.8rem",
						}}
					>
						Install wallet
					</Chip>
				}
				css={itemStyle}
			/>
		</a>
	)
}

const WalletSection = (props: PropsWithChildren<{ title: string }>) => (
	<section>
		<h4 className="mb-[16px] text-[1.8rem] font-bold">{props.title}</h4>
		<div css={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>{props.children}</div>
	</section>
)

const SubstrateWalletConnections = () => {
	const wallets = useInstalledSubstrateWallets()

	return wallets.map((wallet) => (
		<WalletConnection
			key={wallet.id}
			name={wallet.name}
			platforms={["polkadot"]}
			iconUrl={wallet.icon}
			connected={wallet.isConnected}
			onConnectRequest={() => wallet.connect().catch(() => undefined)}
			onDisconnectRequest={() => wallet.disconnect().catch(console.error)}
		/>
	))
}

const EvmWalletConnections = () => {
	const connectors = useEvmConnectors()
	const { connector } = useConnection()
	const connect = useConnectEvm()
	const disconnect = useDisconnect()
	const config = useConfig()
	const writeableEvmAccounts = useWriteableEvmAccounts()

	return connectors.map((x) => (
		<WalletConnection
			key={x.uid}
			name={x.name}
			platforms={["ethereum"]}
			iconUrl={x.icon}
			connected={x.id === connector?.id && writeableEvmAccounts.length > 0}
			onConnectRequest={async () => {
				const res = await connect.mutateAsync({ connector: x })
				if (res.accounts.length === 0) {
					toast.error("Please enable an ethereum account in your wallet.")
				}
			}}
			onDisconnectRequest={async () => {
				try {
					await disconnect.mutateAsync()
				} catch (error) {
					if (error instanceof Error && error.message.includes("disconnect is not a function")) {
						await disconnectCore(config)
					} else {
						throw error
					}
				}
			}}
		/>
	))
}

const ExternalWalletConnections = () => {
	const walletConnectWallet = useWalletConnectWallet()

	if (!walletConnectWallet) return null

	return (
		<WalletSection title="External wallets">
			<WalletConnection
				name={walletConnectWallet.name}
				platforms={walletConnectWallet.platforms}
				iconUrl={walletConnectWallet.icon}
				connected={walletConnectWallet.isConnected}
				onConnectRequest={() => {
					closeWalletConnectionSideSheet()
					walletConnectWallet.connect().catch(() => undefined)
				}}
				onDisconnectRequest={() => walletConnectWallet.disconnect().catch(console.error)}
			/>
		</WalletSection>
	)
}

const SubstrateAccountsHint = () => {
	const hasSubWallet = useHasConnectedSubstrateWallet()
	const hasSubAccounts = useInjectedAccounts().length !== 0

	return (
		hasSubWallet &&
		!hasSubAccounts && (
			<div className="text-center text-lg text-orange-400">
				Please enable some substrate accounts in your wallet.
			</div>
		)
	)
}

type WalletConnectionSideSheetProps = {
	onRequestDismiss: () => unknown
}

const WalletConnectionSideSheetComponent = (props: WalletConnectionSideSheetProps) => {
	const { inSignet } = useSignetSdk()
	return (
		<ClassNames>
			{({ css }) => (
				<SideSheet
					title="Connect wallet"
					headerClassName={css({ marginBottom: "3.2rem" })}
					onRequestDismiss={props.onRequestDismiss}
				>
					{!inSignet && (
						<Text.Body as="h3" css={{ marginBottom: "3.2rem" }}>
							Select the wallet to connect to Talisman Portal
						</Text.Body>
					)}
					{inSignet ? (
						<WalletConnection
							name="Signet"
							platforms={[]}
							// TODO: update to signet official domain for logo
							iconUrl="https://legendary-griffin-27eef8.netlify.app/logo192.png"
							connected
							nonInteractive
							onConnectRequest={() => {}}
							onDisconnectRequest={() => {}}
						/>
					) : (
						<div css={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}>
							<Suspense
								fallback={
									<div css={{ [SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { minWidth: "40rem" } }} />
								}
							>
								<WalletSection title="Installed wallets">
									<InstallTalisman />
									<SubstrateWalletConnections />
									<EvmWalletConnections />
								</WalletSection>
								<ExternalWalletConnections />
								<SubstrateAccountsHint />
							</Suspense>
							<div>
								<Hr css={{ marginTop: "1.6rem", marginBottom: "1.6rem" }}>
									Don't want to connect a wallet?
								</Hr>
								<AddReadOnlyAccountDialog>
									{({ onToggleOpen }) => (
										<button css={{ display: "contents", cursor: "pointer" }} onClick={onToggleOpen}>
											<Text.BodyLarge
												as="div"
												alpha="high"
												css={{
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													gap: "2rem",
												}}
											>
												<Eye size="2rem" css={{ verticalAlign: "text-top" }} /> Add watched account
											</Text.BodyLarge>
										</button>
									)}
								</AddReadOnlyAccountDialog>
							</div>
						</div>
					)}
				</SideSheet>
			)}
		</ClassNames>
	)
}

const walletConnectionSideSheetOpen$ = new BehaviorSubject(false)

const [useWalletConnectionSideSheetOpen] = bind(walletConnectionSideSheetOpen$)

export const openWalletConnectionSideSheet = () => walletConnectionSideSheetOpen$.next(true)

const closeWalletConnectionSideSheet = () => walletConnectionSideSheetOpen$.next(false)

export const WalletConnectionSideSheet = () => {
	const open = useWalletConnectionSideSheetOpen()

	return (
		<AnimatePresence>
			{open && (
				<WalletConnectionSideSheetComponent onRequestDismiss={closeWalletConnectionSideSheet} />
			)}
		</AnimatePresence>
	)
}
