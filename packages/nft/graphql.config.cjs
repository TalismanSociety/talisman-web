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
    rmrk2: {
      overwrite: true,
      schema: 'https://squid.subsquid.io/marck/v/v2/graphql',
      documents: 'src/generators/rmrk2.ts',
      extensions: extensions('generated/gql/rmrk2/'),
    },
    statemine: {
      overwrite: true,
      schema: 'https://squid.subsquid.io/statemine-uniques/v/3/graphql',
      documents: 'src/generators/statemine.ts',
      extensions: extensions('generated/gql/statemine/'),
    },
    substrateNftKusamaAssetHub: {
      overwrite: true,
      schema: 'https://ahk.gql.api.kodadot.xyz/',
      documents: 'src/generators/substrateNftKusamaAssetHub.ts',
      extensions: extensions('generated/gql/substrateNftKusamaAssetHub/'),
    },
    substrateNftPolkadotAssetHub: {
      overwrite: true,
      schema: 'https://ahp.gql.api.kodadot.xyz/',
      documents: 'src/generators/substrateNftPolkadotAssetHub.ts',
      extensions: extensions('generated/gql/substrateNftPolkadotAssetHub/'),
    },
    unique: {
      overwrite: true,
      schema: 'https://api-unique.uniquescan.io/v1/graphql',
      documents: 'src/generators/unique.ts',
      extensions: extensions('generated/gql/unique/'),
    },
  },
}
