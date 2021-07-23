export const statusOptions = {
  INITIALIZED: 'INITIALIZED',
  PROCESSING: 'PROCESSING',
  READY: 'READY',
  ERROR: 'ERROR'
}

//https://wiki.polkadot.network/docs/build-ss58-registry
export const SupportedParachains = {
  0: {
    id: 0,
    name: 'Polkadot',
    rpc: 'wss://rpc.polkadot.io',
    genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
    subqueryEndpoint: 'https://api.subquery.network/sq/subvis-io/kusama-auction'
  },
  2: {
    id: 2,
    name: 'Kusama',
    rpc: 'wss://kusama-rpc.polkadot.io',
    genesisHash: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe',
    subqueryEndpoint: 'https://api.subquery.network/sq/subvis-io/kusama-auction'
  }
}

export const parachainDetails = {
  2000: {
    id: 2000,
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
      Github: 'https://github.com/AcalaNetwork'
    }
  },
  2001: {
    id: 2001,
    name: 'Bifrost',
    slug: 'bifrost',
    token: 'BNC',
    subtitle: 'As a DeFi project in the Polkadot ecosystem, Bifrost launches vToken which allows users to exchange PoS tokens to vTokens and obtain liquidity and Staking rewards through Bifrost protocol at any time.',
    info: `Participants staking KSMs with the Bifrost parachain slot will receive rewards in the native token BNC. There will be no new tokens released as rewards for the Kusama parachain.\n\nThe vesting schedules provided in Bifrost’s whitepaper are split into quarters. There is no indicated vesting period for Kusama parachain auction participants, however Bifrost has indicated a vesting period for rewards in the Polkadot parachain auctions. Details of Kusama auction reward vesting are to be determined.`,
    links: {
      Website: 'https://ksm.vtoken.io/?ref=polkadotjs',
      Twitter: 'https://twitter.com/bifrost_finance',
      Discord: 'https://discord.gg/XjnjdKBNXj',
      Telegram: 'https://t.me/bifrost_finance',
      Medium: 'https://medium.com/bifrost-finance',
      Github: 'https://github.com/bifrost-finance'
    }
  },
  2004: {
    id: 2004,
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
      Discord: 'https://discord.gg/myBmQu5'
    }
  },
  2006: {
    id: 2006,
    name: 'Darwinia Crab Redirect',
    slug: 'darwinia-crab-redirect',
    token: 'CRING',
    subtitle: 'Crab is the canary network of Darwinia, and is the first blockchain in the Kusama ecosystem to natively support cross-chain as well as smart contract and NFT.',
    info: `Crab Network intends to participate in the Kusama Parachain Slot Auctions.\n\nThe Crab network is a network with long-term value. Some RINGs are allocated to Crab Network as backing assets to make it serve as a canary network having real economic incentives and massive gaming theory testing, not just working a testnet.\n\nThe economic model parameters of the Crab network are the same as those of the Darwinia Mainnet, and use the same staking and inflation models.`,
    links: {
      Website: 'https://crab.network/',
      Twitter: 'https://twitter.com/DarwiniaNetwork',
      Telegram: 'https://t.me/DarwiniaNetwork',
      Medium: 'https://darwinianetwork.medium.com/',
      Github: 'https://github.com/darwinia-network/darwinia/tree/master/runtime/crab'
    }
  },
  2007: {
    id: 2007,
    name: 'Shiden',
    slug: 'shiden',
    token: 'SDN',
    subtitle: 'Shiden Network is a multi-chain decentralized application layer on Kusama Network. ',
    info: 'Kusama Relaychain does not support smart contract functionality by design - Kusama Network needs a smart contract layer. This is where Shiden Network comes in. Shiden supports Ethereum Virtual Machine, WebAssembly, and Layer2 solutions from day one. The platform supports various applications like DeFi, NFTs and more.',
    links: {
      Website: 'https://crowdloan.plasmnet.io/',
      Twitter: 'https://twitter.com/ShidenNetwork',
      Telegram: 'https://t.me/PlasmOfficial',
      Discord: 'https://discord.com/invite/Dnfn5eT'
    }
  },
  2008: {
    id: 2008,
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
      Discord: 'https://discord.gg/EsaFRr7xmc'
    }
  },
  2009: {
    id: 2009,
    name: 'PolkaSmith by PolkaFoundry',
    slug: 'polkasmith-by-polkafoundry',
    token: 'PKS',
    subtitle: 'Implemented on Kusama Network, PolkaSmith is a canary chain of PolkaFoundry, a one-stop production hub creating borderless and frictionless DeFi & NFT applications.',
    info: `PolkaSmith will be a reliable platform for early-stage startups to unleash their creativity, experiment with bold new ideas, and hack the growth.\n\nPKS is the native token of PolkaSmith. There is no pegging or mapping between PKS and PKF (PolkaFoundry’s native token).`,M: '?',
    links: {
      Website: 'https://polkasmith.polkafoundry.com/',
      Twitter: 'https://twitter.com/PolkaFoundry',
      Telegram: 'https://t.me/polkafoundry',
      Medium: 'https://medium.com/@polkafoundry',
    }
  },
  2012: {
    id: 2012,
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
      Discord: 'https://discord.com/invite/Jbw2PAUSCR'
    }
  },
  2016: {
    id: 2016,
    name: 'Sakura',
    slug: 'sakura',
    token: 'SKU',
    subtitle: 'Sakura is a substrate-based parachain candidate specifically built for the cross-chain DeFi ecosystem on Kusama.',
    info: `Building on the success of the Rococo testnet, the stage for Kusama has been set as the first “mainnet” to utilize the power of Substrate. Kusama is regarded as a layer zero protocol and as the CanaryNet of Polkadot. The Clover Finance team envisions Sakura to live on as the innovative sister network of Clover, with both Clover and Sakura continuing to serve their communities simultaneously. The unique on-chain governance parameters of Kusama enables DeFi applications built on top of the Sakura network to have higher performance and scalability right away. This will lower the barrier to entry for the development community to deploy their dApps on Sakura without having to meet the stricter guidelines of Polkadot.\n\nSakura will utilize all of the core underlying technology stack that Clover has created and is continuously innovating. The Clover extension wallet will natively support Sakura dApps on EVM, polkadot.js based injections, and a native-built SKU<->ETH and SKU<->BSC bridge. The trustless cross-chain bridge for Ethereum and Bitcoin will be utilized on both Sakura and Clover. Sakura will ultimately aim to be a parachain Operating System with a storage layer, smart contract layer, DeFi protocol layer and eApp layer built on top of Kusama.`,
    links: {
      Website: 'https://auction.clover.finance/#/',
      Twitter: 'https://twitter.com/clover_finance/',
      Telegram: 'https://t.me/clover_en/',
      Medium: 'https://projectclover.medium.com/',
      //Discord: 'https://discord.com/invite/z2egJBsBWx/'
    }
  },
  2018: {
    id: 2018,
    name: 'SubGame Gamma',
    slug: 'subgame-gamma',
    token: 'GSGB',
    subtitle: 'SubGame is a public chain development team based on the Polkadot Para chain.',
    info: `It hopes to build a public chain with cross-chain interoperability. In addition to creating game applications, it can also build various types of application scenarios to create a common cross-chain industry. The blockchain infrastructure provides unlimited possibilities for distributed mobile applications.`,
    links: {
      Website: 'https://www.subgame.org',
      Twitter: 'https://twitter.com/SubgameBase',
      Telegram: 'https://t.me/subgamenetwork',
    }
  },
  2023: {
    id: 2023,
    name: 'Moonriver',
    slug: 'moonriver',
    token: 'MOVR',
    subtitle: 'Moonriver will initially serve as the experimental “canary net” of Moonbeam, where new code will ship first to be verified under real economic conditions.',
    info: `Over time, the network is expected to evolve and grow to support use cases that may differ from those on Moonbeam.`,
    links: {
      Website: 'https://moonbeam.network/networks/moonriver/',
      Twitter: 'https://twitter.com/moonbeamnetwork',
      Telegram: 'https://t.me/Moonbeam_Official',
      Medium: 'https://medium.com/moonbeam-network',
      Github: 'https://github.com/PureStake/moonbeam',
      Discord: 'https://discord.gg/PfpUATX'
    }
  },
  2024: {
    id: 2024,
    name: 'Genshiro',
    slug: 'genshiro',
    token: 'GENS',
    subtitle: 'Genshiro is a canary network of equilibrium that shares the experimental spirit of Kusama.',
    info: `Genshiro is EquilibriumDeFi's DeFi one-stop shop on Kusama that can do all things that existing DeFi primitives do, but with less risk and cross-chain.`,
    links: {
      Website: 'https://genshiro.equilibrium.io/en',
      Twitter: 'https://twitter.com/GenshiroDeFi',
      Telegram: 'https://t.me/genshiro_official',
      Github: 'https://github.com/equilibrium-eosdt'
    }
  },
  2077: {
    id: 2077,
    name: 'Robonomics',
    slug: 'robonomics',
    token: 'XRT',
    subtitle: 'Robonomics is a project with a long history that started in 2015, after the launch of the Ethereum network.',
    info: `During the project’s development, the team published more than 10 academic articles and created more than 15 R&D projects which included control of drones, industrial manipulators, sensor networks, and even a Boston Dynamics’ robot dog over Ethereum and Polkadot networks.\n\nRobonomics is a project that integrates new technologies into the real economy. However, to fuel this, a reasonable ‘gas’ price is required. Kusama makes the costs of communication between IoT devices and humans affordable.`,
    links: {
      Website: 'https://robonomics.network/',
      Twitter: 'https://twitter.com/AIRA_Robonomics',
      Telegram: 'https://t.me/robonomics',
      Medium: 'https://blog.aira.life/',
      Github: 'https://github.com/airalab'
    }
  },
  2019: {
    id: 2019,
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
      Discord: 'https://discord.gg/Bu6HzJP2YY'
    }
  },
  2021: {
    id: 2021,
    name: 'Altair',
    slug: 'altair',
    token: 'AIR',
    subtitle: 'Altair combines the industry-leading infrastructure built by Centrifuge to finance real-world assets (RWA) on Centrifuge Chain, with the newest experimental features — before they go live on Centrifuge Chain.',
    info: `Altair is built using Substrate, and will have nearly the same codebase as Centrifuge Chain (just like Kusama is to Polkadot!). It is an experimental network for users who want to test the bounds of asset financing. From art NFTs to undiscovered assets — Altair enables users to tokenize their most experimental assets and finance them. It is the next step for anyone looking to unlock financing for their assets.\n\nInteroperability is the key to increasing liquidity in DeFi. Altair will bridge across the Kusama, Polkadot, and Ethereum ecosystems to allow assets to access financing wherever it is available. In the future, Altair can connect more and more projects across these ecosystems — using Kusama to allow anyone to access DeFi liquidity. The more connected chains, protocols, and Dapps are — the greater the flow of liquidity will be.`,
    links: {
      Website: 'https://centrifuge.io/altair/',
      Twitter: 'https://twitter.com/centrifuge',
      Telegram: 'https://t.me/centrifuge_chat',
      Medium: 'https://medium.com/centrifuge',
      Github: 'https://github.com/centrifuge/',
      Discord: 'https://centrifuge.io/discord'
    }
  },
  2082: {
    id: 2082,
    name: 'Basilisk',
    slug: 'basilisk',
    token: 'BSX',
    subtitle: 'Supporting The Long Tail Of Cryptoassets And Experimenting With Financial Applications And Governance.',
    info: `We imagine that Basilisk will attract builders that would like to experiment with exotic DeFi applications, testing their ideas in the real world.\n\nIn time, HydraDX and Basilisk will become interoperable allowing a smooth transition between liquidity pools on which applications are built.`,
    links: {
      Website: 'https://bsx.fi/',
      Twitter: 'https://twitter.com/bsx_finance',
      Telegram: 'https://t.me/bsx_fi',
      Github: 'https://github.com/galacticcouncil',
      Discord: 'https://discord.gg/S8YZj5aXR6'
    }
  }
}

export const crowdloanDetails = [
  {
    paraId: 2000,
    contributeUrl: 'https://acala.network/karura/join-karura',
    rewards: {
      tokens: [
        {
          symbol: 'KAR',
          perKSM: 12,
        }
      ],
      custom: [
      ],
      info: null
    }
  },
  {
    paraId: 2001,
    contributeUrl: 'https://ksm.vtoken.io/?ref=polkadotjs',
    rewards: {
      tokens: [
        {
          symbol: 'Instant BNC',
          perKSM: 2,
          supply: null,
          allocation: null,
        },
        {
          symbol: 'Success BNC',
          perKSM: 20,
        }
      ],
      custom: [
      ],
      info: 'Instant BNS is distributed regardless of win. Success BNC is distributed if bid is won.'
    }
  },
  {
    paraId: 2004,
    contributeUrl: 'https://crowdloan.phala.network/en/',
    rewards: {
      tokens: [
        {
          symbol: 'PHA',
          perKSM: 150,
        }
      ],
      custom: [
      ],
      info: 'If Phala wins the Slot Auction, rewards will be distributed according to the Phala payment schedule. If a slot is not won, you can unbond your KSM immediately after the Auctions end..'
    }
  },
  {
    paraId: 2006,
    contributeUrl: 'https://crab.network/plo#crowdloan',
    rewards: {
      tokens: [
        {
          symbol: 'CRING',
          perKSM: 25,
        }
      ],
      custom: [
      ],
      info: 'If successful, 240,000,000 CRING and 6,000,000 RING rewards will be distributed to users according to the number of KSM they supported. 30% of them will be unlocked, 70% will vest for 48 weeks.'
    }
  },
  {
    paraId: 2007,
    contributeUrl: 'https://crowdloan.plasmnet.io/',
    rewards: {
      tokens: [
        {
          symbol: 'SDN',
          perKSM: '180-340',
        }
      ],
      custom: [
        {
          title: 'Total SDN available',
          value: '3,388,000'
        }
      ],
      info: 'More information: <a href="https://forum.plasmnet.io/t/faq-how-to-estimate-how-many-sdn-you-will-receive-from-crowdloan/1225">crowdloan rewards</a>.'
    }
  },
  {
    paraId: 2008,
    contributeUrl: 'https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkusama.api.onfinality.io%2Fpublic-ws#/parachains/crowdloan',
    rewards: {
      tokens: [
        {
          symbol: 'Reward',
          perKSM: '?',
        }
      ]
    }
  },
  {
    paraId: 2009,
    contributeUrl: 'https://redkite.polkafoundry.com/#/join-polkasmith/',
    rewards: {
      tokens: [
        {
          symbol: 'PKS',
          perKSM: '596',
        }
      ],
      custom: [
        {
          title: 'Reward pool',
          value: '10,500,000 PKS'
        },
        {
          title: 'Lock up period (win)',
          value: '48 Weeks'
        },
        {
          title: 'Lock up period (lose)',
          value: '6 Weeks'
        }
      ],
      info: 'After KSM contribution, 100% Red Kite point delivered immediately. After PolkaSmith wins, 35% of PKS delivered immediately and 65% PKS vested over 10 months'
    }
  },
  {
    paraId: 2012,
    contributeUrl: '',
    rewards: {
      tokens: [
        {
          symbol: 'Reward',
          perKSM: '1.5CRU+300CSM',
        }
      ],
      info: '<a href="https://crustnetwork.medium.com/crust-updates-kusama-parachain-slot-auction-rewards-2f6b32c682ec">Medium article</a> with more info on rewards.'
    }
  },
  {
    paraId: 2016,
    contributeUrl: 'https://auction.clover.finance/#/',
    rewards: {
      tokens: [
        {
          symbol: 'SKU',
          perKSM: '200',
        }
      ],
      info: 'New Users get up to 20% More bonus SKU. Invite friends to get 5% More bonus SKU.'
    }
  },
  {
    paraId: 2018,
    contributeUrl: 'https://www.subgame.org/#/contribute',
    rewards: {
      tokens: [
        {
          symbol: 'GSGB',
          perKSM: '9-1000',
        }
      ],
      custom: [
        {
          title: 'Maximum',
          value: '34,000,000 GSGB'
        }
      ],
      info: 'Crowdloaned 10 KSM unlocked and returned after Slot Duration finished, otherwise immediatly on unsuccessful slot auction.\n\nGSGB runs on SubGame Gamma. It is a reward token for participating in SubGame Gamma crowd loan activities. It has the same value as the token running on the SubGame mainnet. It can be exchanged 1:1 with SGB through SubGame Bridge'
    }
  },
  {
    paraId: 2023,
    contributeUrl: 'https://moonbeam.foundation/moonriver-crowdloan/',
    rewards: {
      tokens: [
        {
          symbol: 'MOVR',
          perKSM: '14.5677',
        }
      ],
      custom: [
        {
          title: 'Reward Pool',
          value: '3,000,000 MOVR'
        },
        {
          title: 'Initial Distribution',
          value: '900,000 MOVR'
        },
        {
          title: 'Vested Distribution',
          value: '2,100,000 MOVR'
        },
        {
          title: 'Vesting Period',
          value: '48 Weeks'
        }
      ]
    }
  },
  {
    paraId: 2024,
    contributeUrl: 'https://genshiro.equilibrium.io/en/plo',
    rewards: {
      tokens: [
        {
          symbol: 'GENS',
          perKSM: '2,000',
        }
      ],
      custom: [
        {
          title: '>50 KSM contribution',
          value: '20% Bonus'
        }
      ],
    }
  },
  {
    paraId: 2077,
    contributeUrl: 'https://robonomics.network/kusama-slot',
    rewards: {
      tokens: [
        {
          symbol: 'XRT',
          perKSM: '3.5',
        }
      ],
      custom: [
        {
          title: 'First 35,000 KSM',
          value: '5 XRT'
        },
        {
          title: 'Total Collection Limit',
          value: '135,000 KSM'
        },
        {
          title: 'Distribution (1 Month Post Launch)',
          value: '50%'
        }
      ]
    }
  },
  {
    paraId: 2019,
    contributeUrl: 'https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkusama.api.onfinality.io%2Fpublic-ws#/parachains/crowdloan',
    rewards: {
      tokens: [
        {
          symbol: 'KPN',
          perKSM: '80',
        }
      ]
    }
  },
  {
    paraId: 2021,
    contributeUrl: 'https://centrifuge.io/altair/crowdloan',
    rewards: {
      tokens: [
        {
          symbol: 'AIR',
          perKSM: '400',
        }
      ],
      custom: [
        {
          title: 'First 250 participants',
          value: '10% Bonus'
        }
      ]
    }
  },
  {
    paraId: 2082,
    contributeUrl: 'https://loan.bsx.fi/',
    rewards: {
      tokens: [
        {
          symbol: 'BSX',
          perKSM: '75,000',
        }
      ]
    }
  }
]