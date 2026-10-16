type CustomSignedExtensions = Record<string, { value?: unknown; additionalSigned?: unknown }>

const customSignedExtensionsByGenesisHash: Record<string, CustomSignedExtensions> = {}

export const customSignedExtensionsFor = (genesisHash: string): CustomSignedExtensions =>
	customSignedExtensionsByGenesisHash[genesisHash] ?? {}
