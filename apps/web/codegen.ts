import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4350/graphql',
  documents: 'src/routes/history.tsx',
  generates: {
    'generated/gql/extrinsicHistory/gql/': {
      preset: 'client',
      plugins: [],
    },
  },
}

export default config
