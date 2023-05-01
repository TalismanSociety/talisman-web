const extensions = outDir => ({
  codegen: {
    generates: {
      [outDir]: {
        preset: 'client',
        plugins: [{ add: { content: '// @ts-nocheck' } }],
      },
    },
  },
})

/** @type {import('graphql-config').IGraphQLConfig } */
module.exports = {
  projects: {
    statemine: {
      overwrite: true,
      schema: 'https://squid.subsquid.io/statemine-uniques/v/3/graphql',
      documents: 'src/statemine.ts',
      extensions: extensions('src/gql/statemine/'),
    },
    rmrk1: {
      overwrite: true,
      schema: 'https://gql-rmrk1.rmrk.link/v1/graphql',
      documents: 'src/rmrk1.ts',
      extensions: extensions('src/gql/rmrk1/'),
    },
    rmrk2: {
      overwrite: true,
      schema: 'https://gql-rmrk2-prod.graphcdn.app/',
      documents: 'src/rmrk2.ts',
      extensions: extensions('src/gql/rmrk2/'),
    },
    unique: {
      overwrite: true,
      schema: 'https://api-unique.uniquescan.io/v1/graphql',
      documents: 'src/unique.ts',
      extensions: extensions('src/gql/unique/'),
    },
  },
}
