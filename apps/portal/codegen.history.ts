import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.VITE_EX_HISTORY_INDEXER,
  documents: ['src/components/widgets/history/**/*.tsx', 'src/routes/history.tsx'],
  generates: {
    'src/generated/gql/extrinsicHistory/gql/': {
      preset: 'client',
      plugins: [],
      config: {
        useTypeImports: true,
      },
    },
  },
}

export default config
