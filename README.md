# 🧿 Talisman Web Application

The Talisman Web Application front-end is a MVP UI built in React, using the following tech-stack:

1. React 
2. React Router
3. Styled Components
4. Polkadot.js

### Development

1. Clone repo  
2. Fetch all module dependencies: `$: yarn`  
3. Copy `.env.example` to `.env.local` or `.env` and update values (see below)  
4. start dev env: `$: yarn start`

### Deployment
1. [see above]
2. replace step 4 with: `$: yarn build`

### Environmental variables
`REACT_APP_APPLICATION_NAME=MyApplicationName` provide a name for the application, used in configuring the web3 object. Should be unique to the environment.  
`REACT_APP_DEFAULT_CHAIN_NAME=kusama` select a chain name for this application to use. options are polkadot|kusama|rococo|westend