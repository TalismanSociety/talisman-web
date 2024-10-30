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
 * FILES="builders/BalanceBuilder.ts builders/ExtrinsicBuilder.ts builders/ExtrinsicBuilder.utils.ts builders/types.ts builders/extrinsics builders/AssetMinBuilder.ts"
 * curl -sL https://github.com/galacticcouncil/sdk/archive/master.tar.gz | tar -xz --strip=4 $(echo $FILES | sed 's#[^ ]*#sdk-master/packages/xcm-cfg/src/&#g' | xargs -n 1)
 * sed -i '1i// @ts-nocheck\n' $(find $(echo $FILES) -type f)
 * ```
 */
export const XCM_CFG_BUILDERS_UPDATE_INSTRUCTIONS = null

export * from './builders/AssetMinBuilder'
export * from './builders/BalanceBuilder'
export * from './builders/ExtrinsicBuilder'
