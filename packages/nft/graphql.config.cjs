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
    'statemine': {
      overwrite: true,
      schema: 'https://squid.subsquid.io/statemine-uniques/v/3/graphql',
      documents: 'src/generators/statemine.ts',
      extensions: extensions('generated/gql/statemine/'),
    },
    'rmrk2': {
      overwrite: true,
      schema: 'https://squid.subsquid.io/marck/v/v2/graphql',
      documents: 'src/generators/rmrk2.ts',
      extensions: extensions('generated/gql/rmrk2/'),
    },
    'polkadot-asset-hub': {
      overwrite: true,
      schema: 'https://squid.subsquid.io/speck/graphql',
      documents: 'src/generators/polkadot-asset-hub.ts',
      extensions: extensions('generated/gql/polkadot-asset-hub/'),
    },
    'kusama-asset-hub': {
      overwrite: true,
      schema: 'https://query-stick.stellate.sh/',
      documents: 'src/generators/kusama-asset-hub.ts',
      extensions: extensions('generated/gql/kusama-asset-hub/'),
    },
    'unique': {
      overwrite: true,
      schema: 'https://api-unique.uniquescan.io/v1/graphql',
      documents: 'src/generators/unique.ts',
      extensions: extensions('generated/gql/unique/'),
    },
  },
}
