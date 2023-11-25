# Talisman Web

<img src="apps/web/public/talisman.svg" alt="Talisman" width="15%" align="right" />

[![website-link](https://img.shields.io/website?label=app.talisman.xyz&style=flat-square&up_message=online&url=https%3A%2F%2Fapp.talisman.xyz)](https://app.talisman.xyz)
[![discord-link](https://img.shields.io/discord/858891448271634473?logo=discord&logoColor=white&style=flat-square)](https://discord.gg/talisman)

**Unlock the Paraverse** with Talisman Web.  
A Polkadot, Kusama & Parachain dashboard for the community.

With Talisman Web you can buy DOT and KSM, contribute to crowdloans, view NFTs and more.

**Want more?**  
[Talisman Polkadot Wallet](https://talisman.xyz) | [Blog](https://talisman.xyz/blog) | [Docs](https://docs.talisman.xyz) | [Twitter](https://twitter.com/wearetalisman) | [Discord](https://discord.gg/talisman)

## How to set up a development environment

1. Clone the repo:

```sh
git clone https://github.com/TalismanSociety/talisman-web.git
```

2. Use the project targeted Node version using [nvm](https://github.com/nvm-sh/nvm) (Optional but will ensure no funny business with Yarn)

```sh
nvm use
```

3. Install the project dependencies:

```sh
yarn
```

4. Copy `.env.example` to `.env` and update the values inside:

```sh
cp apps/web/.env.example apps/web/.env
```

5. Start the dev server:

```sh
yarn dev
```

### Deploying with Docker (IN PROGRESS)

1. Build the dockerfile

```sh
yarn build-signet:docker
```

2. Tag the built docker and push to your preferred registry [Learn how to use a local registry](https://www.docker.com/blog/how-to-use-your-own-registry-2/#:~:text=To%20push%20to%20or%20pull,address%3Aport%2Frepositoryname%20.):

```sh
docker tag signet-fe localhost:3031/signet-fe
docker push your-preferred-registry/signet-fe
```

3. Add this to your `docker-compose.yml` services:

```yml
version: '3.6'

services:
  ## ... other services
  signet-fe:
    image: localhost:3031/signet-fe
    ports:
      - '3000:80'
    restart: always
    environment:
      REACT_APP_APPLICATION_NAME: ${APPLICATION_NAME}
      REACT_APP_HASURA_ENDPOINT: ${HASURA_ENDPOINT}
      REACT_APP_SIWS_ENDPOINT: ${SIWS_ENDPOINT}
      REACT_APP_CONTACT_EMAIL: ${CONTACT_EMAIL}
  ## ... other services
```

4. Make sure you have the right values in `.env` next to your `docker-compose.yml`

- `APPLICATION_NAME`: Name of application
- `HASURA_ENDPOINT`: The hasura endpoint. If you have the backend service in the same docker compose: `host.docker.internal:3030`
- `SIWS_ENDPOINT`: The SIWS endpoint. If you have the backend service in the same docker compose: `host.docker.internal:3031`

5. Start the docker

```sh
docker compose up --build -d
```
