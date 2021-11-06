export type RelayChaindata = { id: number; name: string; subscanUrl: string; subqueryCrowdloansUrl: string }
export const relayChainsChaindata: RelayChaindata[] = [
  {
    id: 0,
    name: 'Polkadot',
    subscanUrl: 'https://polkadot.subscan.io',
    subqueryCrowdloansUrl: 'https://api.subquery.network/sq/bianyunjian/polkadot-crowdloans',
  },
  {
    id: 2,
    name: 'Kusama',
    subscanUrl: 'https://kusama.subscan.io',
    subqueryCrowdloansUrl: 'https://api.subquery.network/sq/TalismanSociety/kusama-crowdloans',
  },
]

export const statusOptions = {
  INITIALIZED: 'INITIALIZED',
  PROCESSING: 'PROCESSING',
  READY: 'READY',
  ERROR: 'ERROR',
}

export type Parachain = {
  id: number
  name: string
  rpc: string
  genesisHash: string
  subqueryEndpoint: string
  tokenDecimals: number
  tokenSymbol: string
  blockPeriod: number
}

// https://wiki.polkadot.network/docs/build-ss58-registry
export const SupportedParachains: { [key: number]: Parachain } = {
  0: {
    id: 0,
    name: 'Polkadot',
    rpc: 'wss://rpc.polkadot.io',
    genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
    subqueryEndpoint: 'https://api.subquery.network/sq/subvis-io/kusama-auction',
    tokenDecimals: 10,
    tokenSymbol: "DOT",
    blockPeriod: 6
  },
  2: {
    id: 2,
    name: 'Kusama',
    rpc: 'wss://kusama-rpc.polkadot.io',
    genesisHash: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe',
    subqueryEndpoint: 'https://api.subquery.network/sq/subvis-io/kusama-auction',
    tokenDecimals: 12,
    tokenSymbol: "KSM",
    blockPeriod: 6
  },
}

export type ParachainDetails = {
  id: string
  name: string
  slug: string
  token: string
  subtitle: string
  info: string
  links: { [key: string]: string }
  tags?: string[]
}

export const parachainDetails: ParachainDetails[] = [
  {
    id: '0-2000',
    name: 'Acala',
    slug: 'acala',
    token: 'ACA',
    subtitle: 'Acala is the DeFi and Liquidity Hub of Polkadot',
    info: `Acala is an Ethereum-compatible smart contract platform optimized for DeFi and scaling DApps to Polkadot. The blockchain has built-in DeFi protocols for application developers to leverage, including a decentralized stablecoin (Acala Dollar - aUSD), a trustless staking derivatives (liquid DOT - LDOT), and a decentralized exchange.`,
    links: {
      Website: 'https://acala.network',
      Twitter: 'https://twitter.com/AcalaNetwork',
      Telegram: 'https://t.me/acalaofficial',
      Discord: 'https://discord.com/invite/6QHVY4X',
      Github: 'https://github.com/AcalaNetwork',
    },
  },
  {
    id: '2-2000',
    name: 'Karura',
    slug: 'karura',
    token: 'KAR',
    subtitle: 'Karura is the all-in-one DeFi hub of Kusama.',
    info: `Founded by the Acala Foundation, Karura is a scalable, EVM-compatible network optimized for DeFi. The platform offers a suite of financial applications including: a trustless staking derivative (liquid KSM), a multi-collateralized stablecoin backed by cross-chain assets (kUSD), and an AMM DEX – all with micro gas fees that can be paid in any token.\n\nAcala and Karura will operate in parallel and serve the users of the Polkadot and Kusama communities. Once Kusama is bridged to Polkadot, Karura and Acala will also be fully interoperable.`,
    links: {
      Website: 'https://acala.network',
      Twitter: 'https://twitter.com/AcalaNetwork',
      Telegram: 'https://t.me/acalaofficial',
      Discord: 'https://discord.com/invite/6QHVY4X',
      Github: 'https://github.com/AcalaNetwork',
    },
  },
  {
    id: '2-2001',
    name: 'Bifrost',
    slug: 'bifrost',
    token: 'BNC',
    subtitle:
      'As a DeFi project in the Polkadot ecosystem, Bifrost launches vToken which allows users to exchange PoS tokens to vTokens and obtain liquidity and Staking rewards through Bifrost protocol at any time.',
    info: `Participants staking KSMs with the Bifrost parachain slot will receive rewards in the native token BNC. There will be no new tokens released as rewards for the Kusama parachain.\n\nThe vesting schedules provided in Bifrost’s whitepaper are split into quarters. There is no indicated vesting period for Kusama parachain auction participants, however Bifrost has indicated a vesting period for rewards in the Polkadot parachain auctions. Details of Kusama auction reward vesting are to be determined.`,
    links: {
      Website: 'https://ksm.vtoken.io/?ref=polkadotjs',
      Twitter: 'https://twitter.com/bifrost_finance',
      Discord: 'https://discord.gg/XjnjdKBNXj',
      Telegram: 'https://t.me/bifrost_finance',
      Medium: 'https://medium.com/bifrost-finance',
      Github: 'https://github.com/bifrost-finance',
    },
  },
  {
    id: '2-2004',
    name: 'Khala Network',
    slug: 'khala-network',
    token: 'PHA',
    subtitle: 'Khala Network is the Phala pre-mainnet on Kusama, as published on the roadmap last year.',
    info: `Phala will implement its mainnet on Polkadot, as the parachain to serve enterprise-scale blockchains and DeFi service.\n\nKhala will implement its mainnet on Kusama, as the parachain to serve creative and growth blockchains and DeFi service.`,
    links: {
      Website: 'https://crowdloan.phala.network/en/',
      Twitter: 'https://twitter.com/PhalaNetwork',
      Telegram: 'https://t.me/phalanetwork',
      Medium: 'https://medium.com/phala-network',
      Github: 'https://github.com/Phala-Network',
      Discord: 'https://discord.gg/myBmQu5',
    },
  },
  // {
  //   id: '2-2006',
  //   name: 'Darwinia Crab Redirect',
  //   slug: 'darwinia-crab-redirect',
  //   token: 'CRING',
  //   subtitle:
  //     'Crab is the canary network of Darwinia, and is the first blockchain in the Kusama ecosystem to natively support cross-chain as well as smart contract and NFT.',
  //   info: `Crab Network intends to participate in the Kusama Parachain Slot Auctions.\n\nThe Crab network is a network with long-term value. Some RINGs are allocated to Crab Network as backing assets to make it serve as a canary network having real economic incentives and massive gaming theory testing, not just working a testnet.\n\nThe economic model parameters of the Crab network are the same as those of the Darwinia Mainnet, and use the same staking and inflation models.`,
  //   links: {
  //     Website: 'https://crab.network/',
  //     Twitter: 'https://twitter.com/DarwiniaNetwork',
  //     Telegram: 'https://t.me/DarwiniaNetwork',
  //     Medium: 'https://darwinianetwork.medium.com/',
  //     Github: 'https://github.com/darwinia-network/darwinia/tree/master/runtime/crab',
  //   },
  // },
  {
    id: '2-2007',
    name: 'Shiden',
    slug: 'shiden',
    token: 'SDN',
    subtitle: 'Shiden Network is a multi-chain decentralized application layer on Kusama Network. ',
    info: 'Kusama Relaychain does not support smart contract functionality by design - Kusama Network needs a smart contract layer. This is where Shiden Network comes in. Shiden supports Ethereum Virtual Machine, WebAssembly, and Layer2 solutions from day one. The platform supports various applications like DeFi, NFTs and more.',
    links: {
      Website: 'https://crowdloan.plasmnet.io/',
      Twitter: 'https://twitter.com/ShidenNetwork',
      Telegram: 'https://t.me/PlasmOfficial',
      Discord: 'https://discord.com/invite/Dnfn5eT',
    },
  },
  {
    id: '2-2008',
    name: 'Mars',
    slug: 'mars',
    token: 'ARES',
    subtitle: 'Ares is an on-chain verifying oracle protocol powered by Polkadot.',
    info: ` It provides reliable off-chain data efficiently and in a trustless manner. Ares is built on Substrate and constructed as a parachain to link to Polkadot's ecology and share its security consensus. It is a scalable oracle network that provides decentralized data services to the Polkadot ecosystem and its parachains.`,
    links: {
      Website: 'https://www.aresprotocol.io/',
      Twitter: 'https://twitter.com/AresProtocolLab',
      Telegram: 'https://t.me/aresprotocol',
      Medium: 'https://aresprotocollab.medium.com/',
      Github: 'https://github.com/aresprotocols',
      Discord: 'https://discord.gg/EsaFRr7xmc',
    },
  },
  {
    id: '2-2009',
    name: 'PolkaSmith by PolkaFoundry',
    slug: 'polkasmith-by-polkafoundry',
    token: 'PKS',
    subtitle:
      'Implemented on Kusama Network, PolkaSmith is a canary chain of PolkaFoundry, a one-stop production hub creating borderless and frictionless DeFi & NFT applications.',
    info: `PolkaSmith will be a reliable platform for early-stage startups to unleash their creativity, experiment with bold new ideas, and hack the growth.\n\nPKS is the native token of PolkaSmith. There is no pegging or mapping between PKS and PKF (PolkaFoundry’s native token).`,
    links: {
      Website: 'https://polkasmith.polkafoundry.com/',
      Twitter: 'https://twitter.com/PolkaFoundry',
      Telegram: 'https://t.me/polkafoundry',
      Medium: 'https://medium.com/@polkafoundry',
    },
  },
  {
    id: '2-2012',
    name: 'Crust Shadow',
    slug: 'crust-shadow',
    token: 'CSM',
    subtitle: 'CRUST provides a decentralized storage network of Web3.0 ecosystem.',
    info: 'It supports multiple storage layer protocols such as IPFS, and exposes storage interfaces to application layer. Crust’s technical stack is also capable of supporting a decentralized computing layer. It is designed to build a decentralized cloud ecosystem that values data privacy and ownership.',
    links: {
      Website: 'https://crust.network/',
      Twitter: 'https://twitter.com/CommunityCrust',
      Telegram: 'https://t.me/CrustNetwork',
      Medium: 'https://crustnetwork.medium.com/',
      Github: 'https://github.com/crustio',
      Discord: 'https://discord.com/invite/Jbw2PAUSCR',
    },
  },
  {
    id: '2-2013',
    name: 'SherpaX',
    slug: 'sherpax',
    token: 'KSX',
    subtitle:
      'SherpaX is the canary network of ChainX and will serve as a testbed for new developments in Bitcoin Layer 2 technology.',
    info: 'As the canary network of ChainX, SherpaX will participate in the auction of the Kusama slot and access Kusama as a parachain. SherpaX will share the security of the entire Kusama network and can communicate with other parachains through the XCMP protocol to truly realize multi-chain and cross-chain.\n\nKusama parachains connect to the network by leasing a slot on the Relay Chain via permissionless auction. Kusama is rolling out the second batch of parachain auctions as we speak. In order to have the community support us in winning a slot, we’ve opened a crowdloan.',
    links: {
      Website: 'https://chainx.org/en/',
      Twitter: 'https://twitter.com/chainx_org',
      Telegram: 'https://t.me/chainx_org',
      Medium: 'https://chainx-org.medium.com/',
      Github: 'https://github.com/chainx-org/ChainX',
    },
  },
  {
    id: '2-2015',
    name: 'Integritee Network',
    slug: 'integritee-network',
    token: 'TEER',
    subtitle:
      'Integritee Network enables developers and firms to process sensitive data, without compromising on privacy.',
    info: 'Our platform combines the trust of blockchain with the confidentiality of off-chain, trusted execution environments (TEEs). This enables developers and firms to create decentralized data-driven apps and services that can securely process sensitive data, without revealing it on chain.\n\nThe Integritee ecosystem, across all instances on Kusama, Polkadot and elsewhere, will be powered by our native token, TEER. Backers who support our parachain bids by temporarily locking in KSM will be rewarded in TEER.',
    links: {
      Website: 'https://www.integritee.network/',
      Twitter: 'https://twitter.com/integri_t_e_e',
      Telegram: 'https://t.me/Integritee_Official',
      Medium: 'https://medium.com/integritee',
      Github: 'https://github.com/integritee-network',
      Subsocial: 'https://app.subsocial.network/4638',
    },
  },
  {
    id: '2-2016',
    name: 'Sakura',
    slug: 'sakura',
    token: 'SKU',
    subtitle:
      'Sakura is a substrate-based parachain candidate specifically built for the cross-chain DeFi ecosystem on Kusama.',
    info: `Building on the success of the Rococo testnet, the stage for Kusama has been set as the first “mainnet” to utilize the power of Substrate. Kusama is regarded as a layer zero protocol and as the CanaryNet of Polkadot. The Clover Finance team envisions Sakura to live on as the innovative sister network of Clover, with both Clover and Sakura continuing to serve their communities simultaneously. The unique on-chain governance parameters of Kusama enables DeFi applications built on top of the Sakura network to have higher performance and scalability right away. This will lower the barrier to entry for the development community to deploy their dApps on Sakura without having to meet the stricter guidelines of Polkadot.\n\nSakura will utilize all of the core underlying technology stack that Clover has created and is continuously innovating. The Clover extension wallet will natively support Sakura dApps on EVM, polkadot.js based injections, and a native-built SKU<->ETH and SKU<->BSC bridge. The trustless cross-chain bridge for Ethereum and Bitcoin will be utilized on both Sakura and Clover. Sakura will ultimately aim to be a parachain Operating System with a storage layer, smart contract layer, DeFi protocol layer and eApp layer built on top of Kusama.`,
    links: {
      Website: 'https://auction.clover.finance/#/',
      Twitter: 'https://twitter.com/clover_finance/',
      Telegram: 'https://t.me/clover_en/',
      Medium: 'https://projectclover.medium.com/',
      //Discord: 'https://discord.com/invite/z2egJBsBWx/'
    },
  },
  {
    id: '2-2018',
    name: 'SubGame Gamma',
    slug: 'subgame-gamma',
    token: 'GSGB',
    subtitle: 'SubGame is a public chain development team based on the Polkadot Parachain.',
    info: `It hopes to build a public chain with cross-chain interoperability. In addition to creating game applications, it can also build various types of application scenarios to create a common cross-chain industry. The blockchain infrastructure provides unlimited possibilities for distributed mobile applications.`,
    links: {
      Website: 'https://www.subgame.org',
      Twitter: 'https://twitter.com/SubgameBase',
      Telegram: 'https://t.me/subgamenetwork',
    },
  },
  {
    id: '2-2019',
    name: 'Kpron',
    slug: 'kpron',
    token: 'KPN',
    subtitle: 'Kpron Network is the testnet that Apron Network deployed on the Kusama Network.',
    info: `The Kpron Network’s token: KPN, is the APN on Kusama.\n\nKPN was issued on Kpron Network as a portion of the tokens allocated by Apron Network and can be swapped with APN at a 1:1 rate (1KPN=1APN). There is no change on Apron’s tokenomics, and the total amount of APN remains the same.`,
    links: {
      Website: 'http://apron.network/',
      Twitter: 'https://twitter.com/apronofficial1',
      Telegram: 'https://t.me/apronnetwork',
      Medium: 'https://apron-network.medium.com/',
      Github: 'https://github.com/Apron-Network/',
      Discord: 'https://discord.gg/Bu6HzJP2YY',
    },
  },
  // {
  //   id: '2-2021',
  //   name: 'Altair',
  //   slug: 'altair',
  //   token: 'AIR',
  //   subtitle:
  //     'Altair combines the industry-leading infrastructure built by Centrifuge to finance real-world assets (RWA) on Centrifuge Chain, with the newest experimental features — before they go live on Centrifuge Chain.',
  //   info: `Altair is built using Substrate, and will have nearly the same codebase as Centrifuge Chain (just like Kusama is to Polkadot!). It is an experimental network for users who want to test the bounds of asset financing. From art NFTs to undiscovered assets — Altair enables users to tokenize their most experimental assets and finance them. It is the next step for anyone looking to unlock financing for their assets.\n\nInteroperability is the key to increasing liquidity in DeFi. Altair will bridge across the Kusama, Polkadot, and Ethereum ecosystems to allow assets to access financing wherever it is available. In the future, Altair can connect more and more projects across these ecosystems — using Kusama to allow anyone to access DeFi liquidity. The more connected chains, protocols, and Dapps are — the greater the flow of liquidity will be.`,
  //   links: {
  //     Website: 'https://centrifuge.io/altair/',
  //     Twitter: 'https://twitter.com/centrifuge',
  //     Telegram: 'https://t.me/centrifuge_chat',
  //     Medium: 'https://medium.com/centrifuge',
  //     Github: 'https://github.com/centrifuge/',
  //     Discord: 'https://centrifuge.io/discord',
  //   },
  // },
  {
    id: '2-2023',
    name: 'Moonriver',
    slug: 'moonriver',
    token: 'MOVR',
    subtitle: 'A Community-Led Sister Parachain on Kusama',
    info: `Like Moonbeam, Moonriver is a complete Ethereum-like environment and works with industry-standard Ethereum tools, DApps, and protocols. Moonriver is a companion network to Moonbeam and provides a permanently incentivized canary network. New code ships to Moonriver first, where it can be tested and verified under real economic conditions. Once proven, the same code ships to Moonbeam on Polkadot. The Moonriver network is currently launching to Kusama. Track the launch status here: https://moonbeam.network/networks/moonriver/launch/`,
    links: {
      Website: 'https://moonbeam.network/networks/moonriver/',
      Twitter: 'https://twitter.com/moonbeamnetwork',
      Telegram: 'https://t.me/Moonbeam_Official',
      Medium: 'https://medium.com/moonbeam-network',
      Github: 'https://github.com/PureStake/moonbeam',
      Discord: 'https://discord.gg/PfpUATX',
    },
  },
  {
    id: '2-2024',
    name: 'Genshiro',
    slug: 'genshiro',
    token: 'GENS',
    subtitle: 'Genshiro is a canary network of equilibrium that shares the experimental spirit of Kusama.',
    info: `Genshiro is EquilibriumDeFi's DeFi one-stop shop on Kusama that can do all things that existing DeFi primitives do, but with less risk and cross-chain.`,
    links: {
      Website: 'https://genshiro.equilibrium.io/',
      Twitter: 'https://twitter.com/GenshiroDeFi',
      Telegram: 'https://t.me/genshiro_official',
      Medium: 'https://medium.com/equilibrium-eosdt',
      Github: 'https://github.com/equilibrium-eosdt',
    },
  },
  {
    id: '2-2077',
    name: 'Robonomics',
    slug: 'robonomics',
    token: 'XRT',
    subtitle:
      'Robonomics is a project with a long history that started in 2015, after the launch of the Ethereum network.',
    info: `During the project’s development, the team published more than 10 academic articles and created more than 15 R&D projects which included control of drones, industrial manipulators, sensor networks, and even a Boston Dynamics’ robot dog over Ethereum and Polkadot networks.\n\nRobonomics is a project that integrates new technologies into the real economy. However, to fuel this, a reasonable ‘gas’ price is required. Kusama makes the costs of communication between IoT devices and humans affordable.`,
    links: {
      Website: 'https://robonomics.network/',
      Twitter: 'https://twitter.com/AIRA_Robonomics',
      Telegram: 'https://t.me/robonomics',
      Medium: 'https://blog.aira.life/',
      Github: 'https://github.com/airalab',
    },
  },
  {
    id: '2-2080',
    name: 'Loom Network',
    slug: 'loom-network',
    token: 'LOOM',
    subtitle:
      'At Loom Network, we want to enable developers to build dapps that are easily accessible across all major blockchains, and for users to be able to use dapps without wasting time trying to figure out the intricacies of the blockchain each dapp happens to be running on.',
    info: `To that end we’ve already built integrations with Ethereum, TRON, and Binance Smart Chain.\n\nWe are going to be giving out 100 LOOM tokens for each KSM token contributed to our Crowdloan. If we win a parachain auction, we will start distributing the rewards ASAP, there will be no vesting or lockup periods for these rewards.`,
    links: {
      Website: 'https://loomx.io/',
      Twitter: 'https://twitter.com/loomnetwork',
      Telegram: 'https://t.me/loomnetwork',
      Github: 'https://github.com/loomnetwork',
      Reddit: 'https://www.reddit.com/r/loomnetwork/',
      Medium: 'https://medium.com/loom-network',
    },
  },
  {
    id: '2-2084',
    name: 'Calamari',
    slug: 'calamari',
    token: 'KMA',
    subtitle: `Calamari, Manta Network's canary-net, is the plug-and-play privacy-preservation parachain built to service the Kusama DeFi world.`,
    info: `It combines Kusama and zkSNARKs to bring on-chain privacy to transactions and swaps.`,
    links: {
      Website: 'https://www.calamari.network/',
      Twitter: 'https://twitter.com/CalamariNetwork',
      Telegram: 'https://t.me/mantanetworkofficial',
      Medium: 'https://medium.com/@mantanetwork',
      Github: 'https://github.com/Manta-Network',
    },
  },
  {
    id: '2-2085',
    name: 'Parallel Heiko',
    slug: 'parallel-heiko',
    token: 'HKO',
    subtitle: `Parallel Finance is a decentralized money market protocol that offers lending, staking, and borrowing in the Polkadot ecosystem.`,
    info: `Similar to the relationship between Polkadot and its “canary network” Kusama, Heiko Finance is the sister network to Parallel, and the parachain that we hope to launch on the Kusama blockchain. We are building for a decentralized future that empowers the community to increase capital efficiency, security, and accessibility through our leverage staking and auction lending platform.`,
    links: {
      Website: 'https://parallel.fi/',
      Twitter: 'https://twitter.com/ParallelFi',
      Telegram: 'https://t.me/parallelfi_community',
      Medium: 'https://parallelfinance.medium.com/',
      Github: 'https://github.com/parallel-finance/',
      Discord: 'https://t.co/Ev6c7lI9U4',
    },
  },
  {
    id: '2-2086',
    name: 'KILT Spiritnet',
    slug: 'kilt-spiritnet',
    token: 'KILT',
    subtitle: `KILT is a blockchain protocol for issuing self-sovereign verifiable, revocable, anonymous credentials and enabling trust market business models in the Web 3.0.`,
    info: `KILT is an open-source fat blockchain protocol for issuing claim-based verifiable, revocable, and anonymous credentials in the Web 3.0. It allows end users to claim arbitrary attributes about themselves, get them attested by trusted entities, and store the claims as self-sovereign credentials (certificates). As trusted entities can issue credentials in return for money, KILT aims to foster new business models for anyone who owns trust or wants to build up trust. KILT Protocol comes with a simple JavaScript SDK where useful applications can be built without requiring any blockchain development skills.`,
    links: {
      Website: 'https://www.kilt.io/',
      Twitter: 'https://twitter.com/Kiltprotocol',
      Telegram: 'https://t.me/KILTProtocolChat',
      Medium: 'https://kilt-protocol.medium.com/',
      Github: 'https://github.com/KILTprotocol',
      Element: 'https://riot.im/app/#/group/+kilt-community:matrix.org',
      Youtube: 'https://www.youtube.com/channel/UC5ihHD8UyGGx0oLZt78429w',
      Reddit: 'https://www.reddit.com/r/KiltProtocol/',
      Linkedin: 'https://www.linkedin.com/company/kilt-protocol/',
    },
  },
  {
    id: '2-2087',
    name: 'Picasso',
    slug: 'picasso',
    token: 'PICA',
    subtitle: `Picasso is an experimental ecosystem to birth new financial primitives and build applications that communicate natively, in a composed manner.`,
    info: `Composable Finance is pleased to announce the Picasso token (PICA), which will be the native token of the Picasso Network Kusama parachain. PICA token will have a multitude of important use cases on our upcoming Picasso parachain, including key governance decisions.`,
    links: {
      Website: 'https://picasso.composable.finance/',
      Twitter: 'https://twitter.com/ComposableFin',
      Telegram: 'https://t.me/joinchat/uAGCJk_Cjc9iYTky',
      Medium: 'https://composablefi.medium.com',
      Github: 'https://github.com/ComposableFi',
      Discord: 'https://discord.gg/pFZn2GCn65',
      Linkedin: 'https://www.linkedin.com/company/composable-finance/',
    },
  },
  {
    id: '2-2088',
    name: 'Altair',
    slug: 'altair',
    token: 'AIR',
    subtitle:
      'Altair combines the industry-leading infrastructure built by Centrifuge to finance real-world assets (RWA) on Centrifuge Chain, with the newest experimental features — before they go live on Centrifuge Chain.',
    info: `Altair is built using Substrate, and will have nearly the same codebase as Centrifuge Chain (just like Kusama is to Polkadot!). It is an experimental network for users who want to test the bounds of asset financing. From art NFTs to undiscovered assets — Altair enables users to tokenize their most experimental assets and finance them. It is the next step for anyone looking to unlock financing for their assets.\n\nInteroperability is the key to increasing liquidity in DeFi. Altair will bridge across the Kusama, Polkadot, and Ethereum ecosystems to allow assets to access financing wherever it is available. In the future, Altair can connect more and more projects across these ecosystems — using Kusama to allow anyone to access DeFi liquidity. The more connected chains, protocols, and Dapps are — the greater the flow of liquidity will be.`,
    links: {
      Website: 'https://centrifuge.io/altair',
      Twitter: 'https://twitter.com/centrifuge',
      Telegram: 'https://t.me/centrifuge_chat',
      Medium: 'https://medium.com/centrifuge',
      Github: 'https://github.com/centrifuge/',
      Discord: 'https://centrifuge.io/discord',
    },
  },
  // {
  //   id: '2-2089',
  //   name: 'Genshiro',
  //   slug: 'genshiro',
  //   token: 'GENS',
  //   subtitle: 'Genshiro is a canary network of equilibrium that shares the experimental spirit of Kusama.',
  //   info: `Genshiro is EquilibriumDeFi's DeFi one-stop shop on Kusama that can do all things that existing DeFi primitives do, but with less risk and cross-chain.`,
  //   links: {
  //     Website: 'https://genshiro.equilibrium.io/',
  //     Twitter: 'https://twitter.com/GenshiroDeFi',
  //     Telegram: 'https://t.me/genshiro_official',
  //     Medium: 'https://medium.com/equilibrium-eosdt',
  //     Github: 'https://github.com/equilibrium-eosdt',
  //   },
  // },
  {
    id: '2-2090',
    name: 'Basilisk',
    slug: 'basilisk',
    token: 'BSX',
    subtitle:
      'Basilisk is a liquidity bootstrapping protocol designed to operate as a parachain in Kusama, the Substrate canary network from the Polkadot family.',
    info: `Basilisk is a natural stepping stone on our journey of building the liquidity infrastructure of the future. This plan will eventually culminate in the HydraDX Omnipool which is intended to operate as a Polkadot parachain in order to enable frictionless liquidity for any asset on any chain.\n\nTogether, Basilisk and HydraDX create a synergy which caters to the varying needs of cryptoassets throughout their entire life cycle. Bootstrap liquidity in the early stages using Basilisk, then move over to the HydraDX Omnipool to unlock unprecedented liquidity in an ocean of assets.`,
    links: {
      Website: 'https://bsx.fi/',
      Twitter: 'https://twitter.com/bsx_finance',
      Telegram: 'https://t.me/bsx_fi',
      Github: 'https://github.com/galacticcouncil',
      Discord: 'https://discord.gg/S8YZj5aXR6',
    },
  },
  {
    id: '2-2092',
    name: 'Kintsugi BTC',
    slug: 'kintsugi-btc',
    token: 'KINT',
    subtitle: `Kintsugi’s kBTC brings radically open Bitcoin to Kusama to kickstart liquidity for parachains like Karura, Shiden and Moonriver.`,
    info: `Kintsugi is interBTC’s canary network, developed by Interlay — an R&D company focused on blockchain interoperability. Founded by ex-Imperial College CS PhDs — Alexei Zamyatin and Dominik Harz, Interlay’s mission is to make Bitcoin interoperable in a fully trustless and decentralized way.\n\nThe non-profit Kintsugi Lab will be responsible for Kintsugi’s launch and further — support the development and growth of the decentralized network.\n\nInspired by the ancient Japanese tradition of embracing the flawed and imperfect, Kintsugi accepts the nascent DeFi ecosystem on Kusama as chaotic while constantly being perfected by golden streaks of its community.`,
    links: {
      Website: 'https://kintsugi.interlay.io/',
      Twitter: 'https://twitter.com/kintsugi_btc',
      Telegram: 'https://t.me/interlay_community',
      Medium: 'https://medium.com/interlay/',
      Github: 'https://github.com/interlay',
      Discord: 'http://discord.gg/KgCYK3MKS',
    },
  },
  {
    id: '2-2095',
    name: 'Quartz',
    slug: 'quartz',
    token: 'NEER',
    subtitle: `Quartz gives the Kusama community the essential and advanced NFT tools to unleash innovation.`,
    info: `Quartz gives you easy access to test extreme innovation in NFTs and build for the next generation. Built on Substrate, Quartz gives you the most versatile options for discovery and democratization of the NFT ecosystem and marketplaces (with very low barriers for entry).\nAdvanced features like Flexible Economic Models, Scheduled Transactions, Re-fungiblity, and Nested NFTs will all be available via Quartz, allowing users to own UX/UI for your fans and customers.Quartz parachain on Kusama will allow you to build with interoperability between different blockchains, and give developers and engineers the access to the shared security of the entire network.`,
    links: {
      Website: 'https://unique.network/quartz/',
      Twitter: 'https://twitter.com/Unique_NFTchain',
      Telegram: 'https://t.me/Uniquechain',
      Github: 'https://github.com/UniqueNetwork',
    },
  },
  {
    id: '2-2096',
    name: 'Bit.Country Pioneer',
    slug: 'bit-country-pioneer',
    token: 'NEER',
    subtitle: `The Platform for User-created Metaverses & Games with Opportunities to Earn.`,
    info: `The platform allows non-technical users to build their own metaverse. Developers can use our API to develop their games and smart contract dapps. Metaverse.Network is the blockchain network of Bit.Country application framework.`,
    links: {
      Website: 'https://bit.country/',
      Twitter: 'https://twitter.com/BitDotCountry',
      Telegram: 'https://t.me/BitCountryOfficialTG',
      Medium: 'https://bitcountry.medium.com/',
      Github: 'https://github.com/bit-country',
      Discord: 'https://discord.com/invite/PaMAXZZ59N',
    },
  },
]

export type CrowdloanDetails = {
  relayId: number
  paraId: number
  contributeUrl?: string
  rewards: {
    tokens: Array<{ symbol: string; perKSM: string }> | null
    custom: Array<{ title: string; value: string }> | null
    bonus?: {
      short: string
      full: string
      info: string
    }
    info: string | null
  }
}

export const crowdloanDetails: CrowdloanDetails[] = [
  {
    relayId: 0,
    paraId: 2000,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'ACA per DOT',
          value: '>3',
        },
        {
          title: 'lcDOT per DOT',
          value: '1',
        },
        {
          title: 'Referrals',
          value: '5%',
        },
      ],
      bonus: {
        short: 'Up to 5% + 🗝',
        full: 'Earn up to 5% ACA + 🗝',
        info: 'Receive a <strong>bonus of 5% + a Spirit Key 🗝</strong> when you use Talisman',
      },
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2000,
    contributeUrl: 'https://acala.network/karura/join-karura',
    rewards: {
      tokens: [
        {
          symbol: 'KAR',
          perKSM: '12',
        },
      ],
      custom: [],
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2001,
    contributeUrl: 'https://ksm.vtoken.io/?ref=polkadotjs',
    rewards: {
      tokens: [
        {
          symbol: 'Instant BNC',
          perKSM: '2',
        },
        {
          symbol: 'Success BNC',
          perKSM: '20',
        },
      ],
      custom: [],
      info: 'Instant BNS is distributed regardless of win. Success BNC is distributed if bid is won.',
    },
  },
  {
    relayId: 2,
    paraId: 2004,
    contributeUrl: 'https://crowdloan.phala.network/en/',
    rewards: {
      tokens: [
        {
          symbol: 'PHA',
          perKSM: '150',
        },
      ],
      custom: [],
      info: 'If Phala wins the Slot Auction, rewards will be distributed according to the Phala payment schedule. If a slot is not won, you can unbond your KSM immediately after the Auctions end.',
    },
  },
  // {
  //   relayId:2,
  //   paraId: 2006,
  //   contributeUrl: 'https://crab.network/plo#crowdloan',
  //   rewards: {
  //     tokens: [
  //       {
  //         symbol: 'CRING',
  //         perKSM: '25',
  //       },
  //     ],
  //     custom: [],
  //     info: 'If successful, 240,000,000 CRING and 6,000,000 RING rewards will be distributed to users according to the number of KSM they supported. 30% of them will be unlocked, 70% will vest for 48 weeks.',
  //   },
  // },
  {
    relayId: 2,
    paraId: 2007,
    contributeUrl: 'https://crowdloan.plasmnet.io/',
    rewards: {
      tokens: [
        {
          symbol: 'SDN',
          perKSM: '180-340',
        },
      ],
      custom: [
        {
          title: 'Total SDN available',
          value: '3,388,000',
        },
      ],
      info: 'More information: <a href="https://forum.plasmnet.io/t/faq-how-to-estimate-how-many-sdn-you-will-receive-from-crowdloan/1225">crowdloan rewards</a>.',
    },
  },
  {
    relayId: 2,
    paraId: 2008,
    contributeUrl:
      'https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkusama.api.onfinality.io%2Fpublic-ws#/parachains/crowdloan',
    rewards: {
      tokens: [
        {
          symbol: 'AMAS',
          perKSM: '1200',
        },
      ],
      custom: [
        {
          title: 'Auction Total',
          value: '160,000,000 tokens',
        },
      ],
      info: 'More information: <a href="https://aresprotocollab.medium.com/ares-protocol-continues-to-participate-in-the-kusama-parachain-slot-auction-3dcda3d8356f">crowdloan rewards</a>.',
    },
  },
  {
    relayId: 2,
    paraId: 2009,
    contributeUrl: 'https://redkite.polkafoundry.com/#/join-polkasmith/',
    rewards: {
      tokens: [
        {
          symbol: 'Reward',
          perKSM: '350 PKS + 500 RedKite points',
        },
      ],
      custom: [
        {
          title: 'Reward pool',
          value: '10,500,000 PKS',
        },
        {
          title: 'Lock up period (win)',
          value: '48 Weeks',
        },
        {
          title: 'Lock up period (lose)',
          value: '6 Weeks',
        },
      ],
      info: 'After KSM contribution, 100% Red Kite point delivered immediately. After PolkaSmith wins, 35% of PKS delivered immediately and 65% PKS vested over 10 months',
    },
  },
  {
    relayId: 2,
    paraId: 2012,
    contributeUrl: '',
    rewards: {
      tokens: [
        {
          symbol: 'Reward',
          perKSM: '1 CRU + 1000 CSM',
        },
      ],
      custom: null,
      info: '<a href="https://crustnetwork.medium.com/crust-updates-kusama-parachain-slot-auction-rewards-2f6b32c682ec">Medium article</a> with more info on rewards.',
    },
  },
  {
    relayId: 2,
    paraId: 2013,
    contributeUrl: 'https://chainx-org.medium.com/sherpax-crowdloan-tutorial-88086714ff1',
    rewards: {
      tokens: [
        {
          symbol: 'KSX',
          perKSM: '>15',
        },
      ],
      custom: [
        {
          title: '>50 KSM contribution',
          value: '20% Bonus',
        },
        {
          title: '>100 KSM contribution',
          value: '40% Bonus',
        },
        {
          title: '>200 KSM contribution',
          value: '60% Bonus',
        },
        {
          title: '>300 KSM contribution',
          value: '90% Bonus',
        },
        {
          title: '>500 KSM contribution',
          value: '120% Bonus',
        },
      ],
      info: 'KSX has an initial supply of 21 million, increased with 10% additional issuance every year. If you also refer a friend, both of you get a 5% referral bonus reward.',
    },
  },
  {
    relayId: 2,
    paraId: 2015,
    contributeUrl: 'https://crowdloan.integritee.network/',
    rewards: {
      tokens: [
        {
          symbol: 'TEER',
          perKSM: '>6.5',
        },
      ],
      custom: [
        {
          title: '10% of total token allocation',
          value: '1,000,000 TEER',
        },
      ],
      info: '10% of the total Integritee token allocation will be fairly distributed to KSM holders who support us in the Kusama parachain auctions. The quantity of TEER each supporter receives will thereby depend on the amount of KSM they lock-in, relative to the total amount locked-in by all supporters.',
    },
  },
  {
    relayId: 2,
    paraId: 2016,
    contributeUrl: 'https://auction.clover.finance/#/',
    rewards: {
      tokens: [
        {
          symbol: 'Reward',
          perKSM: '150-210 SKU + 1sKSM LP token',
        },
      ],
      custom: null,
      info: 'New Users get up to 20% More bonus SKU. Invite friends to get 5% More bonus SKU.',
    },
  },
  {
    relayId: 2,
    paraId: 2018,
    contributeUrl: 'https://www.subgame.org/#/contribute',
    rewards: {
      tokens: [
        {
          symbol: 'GSGB',
          perKSM: '28',
        },
      ],
      custom: [
        {
          title: 'Maximum',
          value: '34,000,000 GSGB',
        },
      ],
      info: 'Crowdloaned 10 KSM unlocked and returned after Slot Duration finished, otherwise immediatly on unsuccessful slot auction.\n\nGSGB runs on SubGame Gamma. It is a reward token for participating in SubGame Gamma crowd loan activities. It has the same value as the token running on the SubGame mainnet. It can be exchanged 1:1 with SGB through SubGame Bridge',
    },
  },
  {
    relayId: 2,
    paraId: 2019,
    contributeUrl:
      'https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkusama.api.onfinality.io%2Fpublic-ws#/parachains/crowdloan',
    rewards: {
      tokens: [
        {
          symbol: 'KPN',
          perKSM: '80',
        },
      ],
      custom: null,
      info: null,
    },
  },
  // NOTE: Superseded by 2088
  // {
  //   relayId: 2,
  //   paraId: 2021,
  //   contributeUrl: 'https://centrifuge.io/altair/crowdloan',
  //   rewards: {
  //     tokens: [
  //       {
  //         symbol: 'AIR',
  //         perKSM: '400',
  //       },
  //     ],
  //     custom: [
  //       {
  //         title: 'First 250 participants',
  //         value: '10% Bonus',
  //       },
  //     ],
  //   },
  // },
  {
    relayId: 2,
    paraId: 2023,
    contributeUrl: 'https://moonbeam.foundation/moonriver-crowdloan/',
    rewards: {
      tokens: [
        {
          symbol: 'MOVR',
          perKSM: '14.5677',
        },
      ],
      custom: [
        {
          title: 'Reward Pool',
          value: '3,000,000 MOVR',
        },
        {
          title: 'Initial Distribution',
          value: '900,000 MOVR',
        },
        {
          title: 'Vested Distribution',
          value: '2,100,000 MOVR',
        },
        {
          title: 'Vesting Period',
          value: '48 Weeks',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2024,
    contributeUrl: 'https://genshiro.equilibrium.io/en/plo',
    rewards: {
      tokens: [
        {
          symbol: 'GENS',
          perKSM: '>2000',
        },
      ],
      custom: [
        {
          title: '>50 KSM contribution',
          value: '20% Bonus',
        },
        {
          title: 'Contribute before September 10',
          value: '25% Bonus',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2077,
    contributeUrl: 'https://robonomics.network/kusama-slot',
    rewards: {
      tokens: [
        {
          symbol: 'XRT',
          perKSM: '>3.5',
        },
      ],
      custom: [
        {
          title: 'First 35,000 KSM',
          value: '5 XRT',
        },
        {
          title: 'Total Collection Limit',
          value: '135,000 KSM',
        },
        {
          title: 'Distribution (1 Month Post Launch)',
          value: '50%',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2080,
    contributeUrl: 'https://loomx.io/',
    rewards: {
      tokens: [
        {
          symbol: 'LOOM',
          perKSM: '100',
        },
      ],
      custom: null,
      info: null,
    },
  },
  // NOTE: Superseded by 2090
  // {
  //   relayId: 2,
  //   paraId: 2082,
  //   contributeUrl: 'https://loan.bsx.fi/',
  //   rewards: {
  //     tokens: [
  //       {
  //         symbol: 'BSX',
  //         perKSM: '75,000',
  //       },
  //     ],
  //     custom: null,
  //     info: null,
  //   },
  // },
  {
    relayId: 2,
    paraId: 2084,
    contributeUrl: 'https://crowdloan.calamari.manta.network/',
    rewards: {
      tokens: [
        {
          symbol: 'KMA',
          perKSM: '10,000',
        },
      ],
      custom: [
        {
          title: 'First 500 participants',
          value: '10% Bonus',
        },
        {
          title: 'Participants 501-1,000',
          value: '5% Bonus',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2085,
    contributeUrl: 'https://docs.parallel.fi/parallel-heiko-crowdloan/how-to-contribute',
    rewards: {
      tokens: [
        {
          symbol: 'HKO',
          perKSM: '>200',
        },
      ],
      custom: [
        {
          title: 'Vesting Period',
          value: '1 year',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2086,
    contributeUrl: 'https://medium.com/kilt-protocol/kilts-crowdloan-how-to-participate-d0333cc952ef',
    rewards: {
      tokens: [
        {
          symbol: 'KILT',
          perKSM: '>25',
        },
      ],
      custom: null,
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2087,
    contributeUrl: 'https://composablefi.medium.com/how-to-participate-in-the-picasso-crowdloan-c17272f6aa0e',
    rewards: {
      tokens: [
        {
          symbol: 'PICA',
          perKSM: '20,000',
        },
      ],
      custom: null,
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2088,
    contributeUrl: 'https://centrifuge.io/altair/crowdloan',
    rewards: {
      tokens: [
        {
          symbol: 'AIR',
          perKSM: '400',
        },
      ],
      custom: [
        {
          title: 'First 250 participants',
          value: '10% Bonus',
        },
      ],
      info: null,
    },
  },
  // NOTE: Superseded by 2024
  // {
  //   relayId: 2,
  //   paraId: 2089,
  //   contributeUrl: 'https://genshiro.equilibrium.io/en/plo',
  //   rewards: {
  //     tokens: [
  //       {
  //         symbol: 'GENS',
  //         perKSM: '>2000',
  //       },
  //     ],
  //     custom: [
  //       {
  //         title: '>50 KSM contribution',
  //         value: '20% Bonus',
  //       },
  //       {
  //         title: 'Contribute before September 10',
  //         value: '25% Bonus',
  //       },
  //     ],
  //     info: null,
  //   },
  // },
  {
    relayId: 2,
    paraId: 2090,
    contributeUrl: 'https://loan.bsx.fi/',
    rewards: {
      tokens: [
        {
          symbol: 'Reward',
          perKSM: '>67,500 BSK + % HDX',
        },
      ],
      custom: null,
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2092,
    contributeUrl: 'https://kintsugi.interlay.io/',
    rewards: {
      tokens: [
        {
          symbol: 'KINT',
          perKSM: '>3.75',
        },
      ],
      custom: null,
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2095,
    contributeUrl: 'https://unique.network/quartz/crowdloan/',
    rewards: {
      tokens: [
        {
          symbol: 'QTZ',
          perKSM: '>237',
        },
      ],
      custom: null,
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2096,
    contributeUrl: 'https://ksmcrowdloan.bit.country/crowdloan',
    rewards: {
      tokens: [
        {
          symbol: 'NEER',
          perKSM: '>68',
        },
      ],
      custom: [
        {
          title: 'First 1000 contributors',
          value: '10% Bonus',
        },
        {
          title: 'Referrals',
          value: '2.5% Bonus',
        },
      ],
      info: null,
    },
  },
]
