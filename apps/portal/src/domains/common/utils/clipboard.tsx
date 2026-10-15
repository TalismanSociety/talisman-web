import { ToastMessage } from "@talismn/ui/molecules/ToastBar"
import { toast } from "@talismn/ui/molecules/Toaster"
import { Copy } from "@talismn/web-icons"

export const copyAddressToClipboard = async (address: string) => {
	await navigator.clipboard.writeText(address)
	toast(
		<ToastMessage headlineContent="Address copied to clipboard" supportingContent={address} />,
		{ icon: <Copy /> }
	)
}
