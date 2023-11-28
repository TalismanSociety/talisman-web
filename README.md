# Signet

## How to start Signet locally

1. Clone the repo:

```sh
git clone https://github.com/TalismanSociety/talisman-web.git
```

2. Switch to `multisig` branch

```sh
git checkout multisig
```

3. Copy `.env.example` to `.env` and update the values inside:

```sh
cp .env.example .env
```

4. Start the docker instance:

```sh
docker compose up --build
```
