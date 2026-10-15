import { Copy } from "@/icons"
import { ToastMessage } from "@/ui/molecules/ToastBar"
import { toast } from "@/ui/molecules/Toaster"

export const copyAddressToClipboard = async (address: string) => {
	await navigator.clipboard.writeText(address)
	toast(
		<ToastMessage headlineContent="Address copied to clipboard" supportingContent={address} />,
		{ icon: <Copy /> }
	)
}
