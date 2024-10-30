import { ExtrinsicConfig, ExtrinsicConfigBuilder, ExtrinsicConfigBuilderParams } from '@galacticcouncil/xcm-core'

const pallet = 'utility'

const batchAll = (configs: ExtrinsicConfigBuilder[]) => {
  const func = 'batchAll'
  return {
    build: (params: ExtrinsicConfigBuilderParams) =>
      new ExtrinsicConfig({
        module: pallet,
        func,
        getArgs: () => configs.map(c => c.build(params)),
      }),
  }
}

export const utility = () => {
  return {
    batchAll,
  }
}
