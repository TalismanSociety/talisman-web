rm -rf generated

yarn graphql-codegen --config graphql.config.cjs --project statemine &
yarn graphql-codegen --config graphql.config.cjs --project rmrk2 &
yarn graphql-codegen --config graphql.config.cjs --project unique &
yarn graphql-codegen --config graphql.config.cjs --project onfinality &

wait
