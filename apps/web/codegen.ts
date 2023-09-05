import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.REACT_APP_EX_HISTORY_INDEXER,
  documents: ['src/routes/history.tsx', 'src/components/widgets/ExportTxHistoryWidget.tsx'],
  generates: {
    'generated/gql/extrinsicHistory/gql/': {
      preset: 'client',
      plugins: [],
    },
  },
}

export default config
