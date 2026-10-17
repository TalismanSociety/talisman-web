import { StartClient } from "@tanstack/react-start/client"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<StartClient />
	</StrictMode>
)
