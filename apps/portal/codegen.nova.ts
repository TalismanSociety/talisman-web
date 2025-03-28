import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://subquery-history-polkadot-prod.novasama-tech.org',
  documents: ['src/domains/staking/substrate/**/*.(ts|tsx)'],
  generates: {
    'src/generated/gql/nova/gql/': {
      preset: 'client',
      plugins: [],
      config: {
        useTypeImports: true,
      },
    },
  },
}

export default config
