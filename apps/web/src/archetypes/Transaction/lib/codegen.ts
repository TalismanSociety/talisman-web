import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: process.env.REACT_APP_TX_HISTORY_INDEXER || 'http://localhost:4350/graphql',
  documents: ['src/archetypes/Transaction/lib/**/*.ts', '!src/archetypes/Transaction/lib/graphql-codegen/**/*'],
  ignoreNoDocuments: true,
  generates: {
    './src/archetypes/Transaction/lib/graphql-codegen': { preset: 'client', plugins: [] },
  },
}

export default config
