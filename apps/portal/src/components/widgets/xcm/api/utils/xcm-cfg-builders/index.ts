/**
 * These files are not exported by the `@galacticcouncil/xcm-cfg` npm package.
 * So they must instead be downloaded from https://github.com/galacticcouncil/sdk/tree/master/packages/xcm-cfg/src/builders.
 *
 * You can update them using these commands:
 * ```bash
 * cd apps/portal/src/components/widgets/xcm/api/utils/xcm-cfg-builders
 *
 * rm -rf builders
 *
 * curl -sL https://github.com/galacticcouncil/sdk/archive/master.tar.gz | tar -xz --strip=4 "sdk-master/packages/xcm-cfg/src/builders/BalanceBuilder.ts" "sdk-master/packages/xcm-cfg/src/builders/ExtrinsicBuilder.ts" "sdk-master/packages/xcm-cfg/src/builders/ExtrinsicBuilder.utils.ts" "sdk-master/packages/xcm-cfg/src/builders/types.ts" "sdk-master/packages/xcm-cfg/src/builders/extrinsics" "sdk-master/packages/xcm-cfg/src/builders/AssetMinBuilder.ts"
 * ```
 */
export const XCM_CFG_BUILDERS_UPDATE_INSTRUCTIONS = null

export * from './builders/AssetMinBuilder'
export * from './builders/BalanceBuilder'
export * from './builders/ExtrinsicBuilder'
