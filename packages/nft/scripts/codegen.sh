rm -rf generated

yarn graphql-codegen --config graphql.config.cjs --project statemine &
yarn graphql-codegen --config graphql.config.cjs --project rmrk2 &
yarn graphql-codegen --config graphql.config.cjs --project unique &
npx @727-ventures/typechain-polkadot --in src/generators/ink/contracts --out generated/ink

wait

yarn prettier --write generated

find generated/ink -type f -name "*.ts" -exec sed -i '' -e "s/from '\.\(.*\)'/from '\.\1.js'/" {} +
find generated/ink -type f -name "*.ts" -exec sed -i '' -e "s/\.json\.js/\.json/" {} +

