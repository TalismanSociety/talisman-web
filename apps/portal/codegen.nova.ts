import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://api.subquery.network/sq/nova-wallet/nova-wallet-polkadot',
  documents: ['src/domains/staking/substrate/**/*.(ts|tsx)'],
  generates: {
    'generated/gql/nova/gql/': {
      preset: 'client',
      plugins: [],
      config: {
        useTypeImports: true,
      },
    },
  },
}

export default config
