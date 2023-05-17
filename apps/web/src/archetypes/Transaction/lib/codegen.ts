import { resolve } from 'path'

import { CodegenConfig } from '@graphql-codegen/cli'

const codegenOutputDir = `${resolve(__dirname, 'graphql-codegen')}/`
const config: CodegenConfig = {
  schema: import.meta.env.REACT_APP_TX_HISTORY_INDEXER || 'https://squid.subsquid.io/tx-history/v/v0b/graphql',
  documents: ['src/archetypes/Transaction/lib/**/*.ts', '!src/archetypes/Transaction/lib/graphql-codegen/**/*'],
  ignoreNoDocuments: true,
  generates: {
    [codegenOutputDir]: { preset: 'client', plugins: [] },
  },
}

export default config
