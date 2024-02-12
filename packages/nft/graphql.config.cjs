const extensions = outDir => ({
  codegen: {
    emitLegacyCommonJSImports: false,
    generates: {
      [outDir]: {
        preset: 'client',
        config: {
          useTypeImports: true,
        },
      },
    },
    hooks: { afterOneFileWrite: ['prettier --write'] },
  },
})

/** @type {import('graphql-config').IGraphQLConfig } */
module.exports = {
  projects: {
    statemine: {
      overwrite: true,
      schema: 'https://squid.subsquid.io/statemine-uniques/v/3/graphql',
      documents: 'src/generators/statemine.ts',
      extensions: extensions('generated/gql/statemine/'),
    },
    rmrk2: {
      overwrite: true,
      schema: 'https://gql-rmrk2-prod.graphcdn.app/',
      documents: 'src/generators/rmrk2.ts',
      extensions: extensions('generated/gql/rmrk2/'),
    },
    unique: {
      overwrite: true,
      schema: 'https://api-unique.uniquescan.io/v1/graphql',
      documents: 'src/generators/unique.ts',
      extensions: extensions('generated/gql/unique/'),
    },
    onfinality: {
      overwrite: true,
      schema: 'https://nft-beta.api.onfinality.io/public',
      documents: 'src/generators/onfinality.ts',
      extensions: extensions('generated/gql/onfinality/'),
    },
  },
}
