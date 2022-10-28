# tx-history client library

This library is a small typescript client for the [Talisman TX History](https://github.com/TalismanSociety/firesquid-tx-history/) project.

We use a package called `@graphql-codegen/cli` in order to sync the typescript types in this library with the transaction types available in the indexer's graphql schema.

To sync the types:

```bash
#
# Step 1
#

# Get the production value of REACT_APP_TX_HISTORY_INDEXER from the `netlify.toml` config file inside the talisman-web repo.
cat netlify.toml | grep REACT_APP_TX_HISTORY_INDEXER
# > REACT_APP_TX_HISTORY_INDEXER = "https://squid.subsquid.io/tx-history/v/v0b/graphql"

# Alternatively, if you are working on the indexer locally you can pass the URL of your development instance
REACT_APP_TX_HISTORY_INDEXER=http://localhost:4350/graphql

# Or if you are running the indexer as a docker container, you might need to get the IP of the container, e.g.
docker ps -a # get the container name
docker network ls # find the network the container is attached to
docker network inspect <network-name> | grep -E '(Name|IPv4)' # get the ip address of the container
REACT_APP_TX_HISTORY_INDEXER=http://172.17.0.2:4350/graphql

#
# Step 2
#

# Run graphql-codegen with the indexer url from step 1
REACT_APP_TX_HISTORY_INDEXER=https://squid.subsquid.io/tx-history/v/v0b/graphql yarn tx-history:graphql:codegen
```

The types should be synced whenever changes are made to the indexer.

They should also be synced whenever changes are made to the graphql query in `./consts.ts`.

When you are working on `./consts.ts` you have the option to run graphql-codegen in watch mode:

```bash
REACT_APP_TX_HISTORY_INDEXER=https://squid.subsquid.io/tx-history/v/v0b/graphql yarn tx-history:graphql:codegen --watch
```

This will automatically update the generated types after each change made to the graphql query in `./consts.ts`.
