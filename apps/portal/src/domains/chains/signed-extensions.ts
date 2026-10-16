type CustomSignedExtensions = Record<string, { value?: unknown; additionalSigned?: unknown }>

export const AVAIL_GENESIS_HASH =
	"0xb91746b45e0346cc2f815a520b9c6cb4d5c0902af848db0a80f85932d2e8276a"

const customSignedExtensionsByGenesisHash: Record<string, CustomSignedExtensions> = {
	[AVAIL_GENESIS_HASH]: { CheckAppId: { value: 0 } },
}

export const customSignedExtensionsFor = (genesisHash: string): CustomSignedExtensions =>
	customSignedExtensionsByGenesisHash[genesisHash] ?? {}
