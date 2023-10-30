# Signet

## Usage

1. In the root of repo, run `yarn build`

2. cd into this folder `cd apps/multisig` to install packages `yarn install`

3. Create `.env` and copy values from `.env.example`

4. Note that the prod url SIWS service will only work with `https`. This dev server will be running on localhost over `http`, so you will have to run a local instance of the backend, then replace the values below:
   `REACT_APP_HASURA_ENDPOINT`: http://localhost:8080
   `REACT_APP_SIWS_ENDPOINT`: http://localhost:3031

5. Run `yarn dev` and acess the app at `http://localhost:3000`
