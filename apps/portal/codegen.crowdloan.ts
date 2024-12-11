import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.VITE_DOT_CROWDLOAN_INDEXER,
  documents: ['src/libs/crowdloans/useCrowdloanContributions.ts'],
  generates: {
    'src/generated/gql/crowdloan/gql/': {
      preset: 'client',
      plugins: [],
      config: {
        useTypeImports: true,
      },
    },
  },
}

export default config
