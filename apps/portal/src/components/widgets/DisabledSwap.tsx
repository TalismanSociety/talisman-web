import type { ReactNode } from "react"

import { useSelectedCurrency } from "@/domains/balances/currency"
import { Activity, FileSearch, Repeat, Wallet } from "@/icons"
import { Button, SurfaceButton } from "@/ui/atoms/Button"
import { TonalIconButton } from "@/ui/atoms/IconButton"
import { Surface } from "@/ui/atoms/Surface"
import { Text } from "@/ui/atoms/Text"
import { TextInput } from "@/ui/molecules/TextInput"

const TokenAmountRow = ({ label, disabled }: { label: string; disabled?: boolean }) => {
	const currency = useSelectedCurrency()

	return (
		<TextInput
			disabled={disabled}
			className="text-ellipsis !text-[18px] !font-semibold"
			containerClassName="[&>div:nth-child(2)]:!py-[8px] [&>div]:!pr-[8px] [&>div:nth-child(2)]:border [&>div:nth-child(2)]:border-red-500/0"
			leadingLabel={label}
			placeholder="0.00"
			textBelowInput={
				<div className="flex items-center">
					<p className="text-[10px] leading-none text-gray-400">
						{(0).toLocaleString(undefined, { currency, style: "currency" })}
					</p>
				</div>
			}
			trailingIcon={
				<div className="flex items-center justify-end pr-2">
					<SurfaceButton className="flex !h-[40px] items-center !rounded-[8px] !px-[8px] !py-[4px]">
						<div>
							<p className="whitespace-nowrap text-[12px] text-gray-400 sm:text-[14px]">
								Select Token
							</p>
						</div>
					</SurfaceButton>
				</div>
			}
		/>
	)
}

const SwappingFrom = () => (
	<Surface className="bg-card flex w-full flex-col gap-[12px] rounded-[8px] p-[16px]">
		<div className="flex items-center justify-between">
			<h4 className="text-[16px] text-gray-500">Swapping From</h4>
			<div className="flex items-center gap-[8px] text-gray-500">
				<Wallet className="h-[16px] w-[16px]" />
				<p className="text-[14px] font-medium">Destination</p>
			</div>
		</div>
	</Surface>
)

const PanelTab = ({ selected, children }: { selected?: boolean; children: ReactNode }) => (
	<div className={selected ? "text-primary p-[8px]" : "p-[8px] text-gray-600"}>{children}</div>
)

const SwapIllustration = () => (
	<div className="relative">
		<svg width="48" height="46" viewBox="0 0 48 46" fill="none" aria-hidden="true">
			<rect y="0.818359" width="47.2911" height="44.8021" rx="7.74211" fill="#D5FF5C" />
			<path
				d="M12.4453 23.2143V19.9638C12.4453 17.2914 14.6117 15.125 17.2841 15.125H33.6018"
				stroke="black"
				strokeWidth="1.93553"
				strokeLinecap="round"
			/>
			<path
				d="M29.2461 9.52344L34.162 14.4394C34.54 14.8173 34.54 15.4301 34.162 15.808L29.2461 20.724"
				stroke="black"
				strokeWidth="1.93553"
				strokeLinecap="round"
			/>
			<path
				d="M34.8467 24.4537V27.7041C34.8467 30.3766 32.6803 32.543 30.0079 32.543H13.6901"
				stroke="black"
				strokeWidth="1.93553"
				strokeLinecap="round"
			/>
			<path
				d="M18.0459 38.1445L13.13 33.2286C12.752 32.8506 12.752 32.2379 13.13 31.86L18.0459 26.944"
				stroke="black"
				strokeWidth="1.93553"
				strokeLinecap="round"
			/>
		</svg>
		<svg
			width="12"
			height="12"
			viewBox="0 0 12 12"
			fill="none"
			aria-hidden="true"
			className="absolute left-[90%] top-0 -translate-y-[65%]"
		>
			<path
				d="M6.23701 -0.000172048L6.99138 3.41277C7.16865 4.21479 7.79502 4.84117 8.59704 5.01844L12.01 5.7728L8.59704 6.52716C7.79502 6.70443 7.16864 7.33081 6.99138 8.13283L6.23701 11.5458L5.48265 8.13283C5.30538 7.33081 4.679 6.70443 3.87699 6.52716L0.464039 5.7728L3.87699 5.01844C4.679 4.84117 5.30538 4.21479 5.48265 3.41277L6.23701 -0.000172048Z"
				fill="#D5FF5C"
			/>
		</svg>
	</div>
)

const UseTalismanWallet = () => (
	<div className="flex flex-col items-center justify-center gap-[8px] rounded-[8px] border border-gray-800 p-[16px] py-[12px]">
		<div className="bg-primary/5 flex h-[124px] w-[124px] items-center justify-center rounded-full">
			<SwapIllustration />
		</div>
		<div>
			<h4 className="text-center text-[14px] font-bold">Swap is no longer available on Portal</h4>
			<div className="flex w-full justify-center pt-[16px] text-center">
				<Text.Body as="p" className="w-[205px]">
					Please use the Swap feature in{" "}
					<Text.Body.A
						target="_blank"
						rel="noopener noreferrer"
						href="https://talisman.xyz/download/"
						css={(theme) => ({ color: theme.color.primary })}
					>
						Talisman Wallet
					</Text.Body.A>{" "}
					instead.
				</Text.Body>
			</div>
		</div>
	</div>
)

const SidePanel = () => (
	<div className="md:rounded-l-0 mt-[16px] w-full rounded-[12px] border border-b border-r border-gray-700 md:mt-0 md:w-4/5 md:border-l-[64px] md:border-l-[transparent]">
		<div className="flex h-full w-full flex-1 flex-col justify-between gap-[16px] p-[16px] md:ml-[-64px] md:w-[calc(100%+64px)]">
			<div className="flex items-center justify-between">
				<h4 className="text-[16px] font-semibold">Swap</h4>
				<div className="flex items-center justify-end gap-[4px]">
					<PanelTab selected>
						<FileSearch size={16} />
					</PanelTab>
					<PanelTab>
						<Activity size={16} />
					</PanelTab>
				</div>
			</div>
			<div className="flex w-full flex-1 flex-col">
				<div className="md:max-h-auto max-h-[340px] overflow-auto md:h-0 md:min-h-full">
					<UseTalismanWallet />
				</div>
			</div>
		</div>
	</div>
)

export const DisabledSwap = () => (
	<div className="mb-[40px] flex w-full flex-col md:flex-row">
		<div className="relative grid w-full cursor-not-allowed gap-[8px]">
			<div className="absolute inset-0 z-20 cursor-not-allowed rounded-[8px] bg-black/50" />
			<div inert className="contents">
				<Surface className="bg-card w-full rounded-[8px] p-[16px]">
					<h4 className="mb-[8px] text-[18px] font-semibold">Select asset</h4>
					<TokenAmountRow label="You're paying" />
					<div className="relative h-[12px] w-full">
						<TonalIconButton className="border-3 absolute -top-[8px] left-1/2 z-10 !h-[48px] !w-[48px] -translate-x-1/2 !rounded-full !border-solid !border-gray-900 !bg-[#2D3121]">
							<Repeat />
						</TonalIconButton>
					</div>
					<TokenAmountRow label="You're receiving" disabled />
				</Surface>
				<SwappingFrom />
				<Button className="!w-full !rounded-[8px]" disabled>
					Swap
				</Button>
			</div>
		</div>
		<SidePanel />
	</div>
)
