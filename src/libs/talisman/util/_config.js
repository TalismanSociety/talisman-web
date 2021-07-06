export const statusOptions = {
  INITIALIZED: 'INITIALIZED',
  PROCESSING: 'PROCESSING',
  READY: 'READY',
  ERROR: 'ERROR'
}

export const parachains = [
  {
    id: 2000,
    name: 'Karura',
    slug: 'karura',
    subtitle: 'Karura is the all-in-one DeFi hub of Kusama.',
    info: `Founded by the Acala Foundation, Karura is a scalable, EVM-compatible network optimized for DeFi. The platform offers a suite of financial applications including: a trustless staking derivative (liquid KSM), a multi-collateralized stablecoin backed by cross-chain assets (kUSD), and an AMM DEX – all with micro gas fees that can be paid in any token.\n\nAcala and Karura will operate in parallel and serve the users of the Polkadot and Kusama communities. Once Kusama is bridged to Polkadot, Karura and Acala will also be fully interoperable.`,
    links: {
      Website: 'https://aaa.com_',
      Twitter: 'https://twitter.com/_',
      Discord: 'https://discordapp.com/_'
    },
    token: {
      symbol: 'KAR',
      supply: 80000000,
      allocation: 1800000,
      vesting: 12,
    }
  },
  {
    id: 2001,
    name: 'Bitfrost',
    slug: 'bitfrost',
    subtitle: 'As a DeFi project in the Polkadot ecosystem, Bifrost launches vToken which allows users to exchange PoS tokens to vTokens and obtain liquidity and Staking rewards through Bifrost protocol at any time.',
    info: `Participants staking KSMs with the Bifrost parachain slot will receive rewards in the native token BNC. There will be no new tokens released as rewards for the Kusama parachain.\n\nThe vesting schedules provided in Bifrost’s whitepaper are split into quarters. There is no indicated vesting period for Kusama parachain auction participants, however Bifrost has indicated a vesting period for rewards in the Polkadot parachain auctions. Details of Kusama auction reward vesting are to be determined.`,
    links: {
      Website: 'https://aaa.com_',
      Twitter: 'https://twitter.com/_',
      Discord: 'https://discordapp.com/_'
    },
    token: {
      symbol: 'BNC',
      supply: 80000000,
      allocation: 1800000,
      vesting: 12,
    }
  },
  {
    id: 2004,
    name: 'Khala Network',
    slug: 'khala-network',
    subtitle: 'Khala Network is the Phala pre-mainnet on Kusama, as published on the roadmap last year.',
    info: `Phala will implement its mainnet on Polkadot, as the parachain to serve enterprise-scale blockchains and DeFi service.\n
      Khala will implement its mainnet on Kusama, as the parachain to serve creative and growth blockchains and DeFi service.`,
    links: {
      Website: 'https://aaa.com_',
      Twitter: 'https://twitter.com/_',
      Discord: 'https://discordapp.com/_'
    },
    token: {
      symbol: 'todo',
      supply: 1,
      allocation: 1,
      vesting: 1,
    }
  },
  {
    id: 2006,
    name: 'Darwinia Crab Redirect',
    slug: 'darwinia-crab-redirect',
    subtitle: 'Crab is the canary network of Darwinia, and is the first blockchain in the Kusama ecosystem to natively support cross-chain as well as smart contract and NFT.',
    info: `Crab Network intends to participate in the Kusama Parachain Slot Auctions.\n The Crab network is a network with long-term value. Some RINGs are allocated to Crab Network as backing assets to make it serve as a canary network having real economic incentives and massive gaming theory testing, not just working a testnet.\n The economic model parameters of the Crab network are the same as those of the Darwinia Mainnet, and use the same staking and inflation models.`,
    links: {
      Website: 'https://aaa.com_',
      Twitter: 'https://twitter.com/_',
      Discord: 'https://discordapp.com/_'
    },
    token: {
      symbol: 'todo',
      supply: 1,
      allocation: 1,
      vesting: 1,
    }
  },
  {
    id: 2007,
    name: 'Shiden',
    slug: 'shiden',
    subtitle: 'Shiden Network is a multi-chain decentralized application layer on Kusama Network. ',
    info: 'Kusama Relaychain does not support smart contract functionality by design - Kusama Network needs a smart contract layer. This is where Shiden Network comes in. Shiden supports Ethereum Virtual Machine, WebAssembly, and Layer2 solutions from day one. The platform supports various applications like DeFi, NFTs and more.',
    links: {
      Website: 'https://aaa.com_',
      Twitter: 'https://twitter.com/_',
      Discord: 'https://discordapp.com/_'
    },
    token: {
      symbol: 'todo',
      supply: 1,
      allocation: 1,
      vesting: 1,
    }
  },
  {
    id: 2008,
    name: 'Mars',
    slug: 'mars',
    subtitle: 'Ares is an on-chain verifying oracle protocol powered by Polkadot.',
    info: ` It provides reliable off-chain data efficiently and in a trustless manner. Ares is built on Substrate and constructed as a parachain to link to Polkadot's ecology and share its security consensus. It is a scalable oracle network that provides decentralized data services to the Polkadot ecosystem and its parachains.`,
    links: {
      Website: 'https://aaa.com_',
      Twitter: 'https://twitter.com/_',
      Discord: 'https://discordapp.com/_'
    },
    token: {
      symbol: 'todo',
      supply: 1,
      allocation: 1,
      vesting: 1,
    }
  },
  {
    id: 2009,
    name: 'PolkaSmith by PolkaFoundry',
    slug: 'polkasmith-by-polkafoundry',
    subtitle: 'Implemented on Kusama Network, PolkaSmith is a canary chain of PolkaFoundry, a one-stop production hub creating borderless and frictionless DeFi & NFT applications.',
    info: `PolkaSmith will be a reliable platform for early-stage startups to unleash their creativity, experiment with bold new ideas, and hack the growth.\n
      PKS is the native token of PolkaSmith. There is no pegging or mapping between PKS and PKF (PolkaFoundry’s native token).`,
    links: {
      Website: 'https://aaa.com_',
      Twitter: 'https://twitter.com/_',
      Discord: 'https://discordapp.com/_'
    },
    token: {
      symbol: 'todo',
      supply: 1,
      allocation: 1,
      vesting: 1,
    }
  },
  {
    id: 2012,
    name: 'Crust Shadow',
    slug: 'crust-shadow',
    subtitle: 'CRUST provides a decentralized storage network of Web3.0 ecosystem.',
    info: 'It supports multiple storage layer protocols such as IPFS, and exposes storage interfaces to application layer. Crust’s technical stack is also capable of supporting a decentralized computing layer. It is designed to build a decentralized cloud ecosystem that values data privacy and ownership.',
    links: {
      Website: 'https://aaa.com_',
      Twitter: 'https://twitter.com/_',
      Discord: 'https://discordapp.com/_'
    },
    token: {
      symbol: 'todo',
      supply: 1,
      allocation: 1,
      vesting: 1,
    }
  },
  {
    id: 2016,
    name: 'Sakura',
    slug: 'sakura',
    subtitle: 'Sakura is a substrate-based parachain candidate specifically built for the cross-chain DeFi ecosystem on Kusama.',
    info: `Building on the success of the Rococo testnet, the stage for Kusama has been set as the first “mainnet” to utilize the power of Substrate. Kusama is regarded as a layer zero protocol and as the CanaryNet of Polkadot. The Clover Finance team envisions Sakura to live on as the innovative sister network of Clover, with both Clover and Sakura continuing to serve their communities simultaneously. The unique on-chain governance parameters of Kusama enables DeFi applications built on top of the Sakura network to have higher performance and scalability right away. This will lower the barrier to entry for the development community to deploy their dApps on Sakura without having to meet the stricter guidelines of Polkadot.\n\nSakura will utilize all of the core underlying technology stack that Clover has created and is continuously innovating. The Clover extension wallet will natively support Sakura dApps on EVM, polkadot.js based injections, and a native-built SKU<->ETH and SKU<->BSC bridge. The trustless cross-chain bridge for Ethereum and Bitcoin will be utilized on both Sakura and Clover. Sakura will ultimately aim to be a parachain Operating System with a storage layer, smart contract layer, DeFi protocol layer and eApp layer built on top of Kusama.`,
    links: {
      Website: 'https://aaa.com_',
      Twitter: 'https://twitter.com/_',
      Discord: 'https://discordapp.com/_'
    },
    token: {
      symbol: 'todo',
      supply: 1,
      allocation: 1,
      vesting: 1,
    }
  },
  {
    id: 2018,
    name: 'SubGame Gamma',
    slug: 'subgame-gamma',
    subtitle: 'SubGame is a public chain development team based on the Polkadot Para chain.',
    info: `It hopes to build a public chain with cross-chain interoperability. In addition to creating game applications, it can also build various types of application scenarios to create a common cross-chain industry. The blockchain infrastructure provides unlimited possibilities for distributed mobile applications.`,
    links: {
      Website: 'https://aaa.com_',
      Twitter: 'https://twitter.com/_',
      Discord: 'https://discordapp.com/_'
    },
    token: {
      symbol: 'todo',
      supply: 1,
      allocation: 1,
      vesting: 1,
    }
  },
  {
    id: 2023,
    name: 'Moonriver',
    slug: 'moonriver',
    subtitle: 'Moonriver will initially serve as the experimental “canary net” of Moonbeam, where new code will ship first to be verified under real economic conditions.',
    info: `Over time, the network is expected to evolve and grow to support use cases that may differ from those on Moonbeam.`,
    links: {
      Website: 'https://moonbeam.foundation/moonriver-crowdloan/',
      Twitter: 'https://twitter.com/_',
      Discord: 'https://discordapp.com/_'
    },
    token: {
      symbol: 'todo',
      supply: 1,
      allocation: 1,
      vesting: 1,
    }
  },
  {
    id: 2024,
    name: 'Genshiro',
    slug: 'genshiro',
    subtitle: 'Genshiro is a canary network of equilibrium that shares the experimental spirit of Kusama.',
    info: `Genshiro is EquilibriumDeFi's DeFi one-stop shop on Kusama that can do all things that existing DeFi primitives do, but with less risk and cross-chain.`,
    links: {
      Website: 'https://aaa.com_',
      Twitter: 'https://twitter.com/_',
      Discord: 'https://discordapp.com/_'
    },
    token: {
      symbol: 'todo',
      supply: 1,
      allocation: 1,
      vesting: 1,
    }
  },
  {
    id: 2077,
    name: 'Robonomics',
    slug: 'robonomics',
    subtitle: 'Robonomics is a project with a long history that started in 2015, after the launch of the Ethereum network.',
    info: `During the project’s development, the team published more than 10 academic articles and created more than 15 R&D projects which included control of drones, industrial manipulators, sensor networks, and even a Boston Dynamics’ robot dog over Ethereum and Polkadot networks.\n\nRobonomics is a project that integrates new technologies into the real economy. However, to fuel this, a reasonable ‘gas’ price is required. Kusama makes the costs of communication between IoT devices and humans affordable.`,
    links: {
      Website: 'https://aaa.com_',
      Twitter: 'https://twitter.com/_',
      Discord: 'https://discordapp.com/_'
    },
    token: {
      symbol: 'todo',
      supply: 1,
      allocation: 1,
      vesting: 1,
    }
  },
  {
    id: 2019,
    name: 'Kpron',
    slug: 'kpron',
    subtitle: 'Kpron Network is the testnet that Apron Network deployed on the Kusama Network.',
    info: `The Kpron Network’s token: KPN, is the APN on Kusama.\n\nKPN was issued on Kpron Network as a portion of the tokens allocated by Apron Network and can be swapped with APN at a 1:1 rate (1KPN=1APN). There is no change on Apron’s tokenomics, and the total amount of APN remains the same.`,
    links: {
      Website: 'https://aaa.com_',
      Twitter: 'https://twitter.com/_',
      Discord: 'https://discordapp.com/_'
    },
    token: {
      symbol: 'todo',
      supply: 1,
      allocation: 1,
      vesting: 1,
    }
  },
  {
    id: 2021,
    name: 'Altair',
    slug: 'altair',
    subtitle: 'Altair combines the industry-leading infrastructure built by Centrifuge to finance real-world assets (RWA) on Centrifuge Chain, with the newest experimental features — before they go live on Centrifuge Chain.',
    info: `Altair is built using Substrate, and will have nearly the same codebase as Centrifuge Chain (just like Kusama is to Polkadot!). It is an experimental network for users who want to test the bounds of asset financing. From art NFTs to undiscovered assets — Altair enables users to tokenize their most experimental assets and finance them. It is the next step for anyone looking to unlock financing for their assets.\n\nInteroperability is the key to increasing liquidity in DeFi. Altair will bridge across the Kusama, Polkadot, and Ethereum ecosystems to allow assets to access financing wherever it is available. In the future, Altair can connect more and more projects across these ecosystems — using Kusama to allow anyone to access DeFi liquidity. The more connected chains, protocols, and Dapps are — the greater the flow of liquidity will be.`,
    links: {
      Website: 'https://aaa.com_',
      Twitter: 'https://twitter.com/_',
      Discord: 'https://discordapp.com/_'
    },
    token: {
      symbol: 'todo',
      supply: 1,
      allocation: 1,
      vesting: 1,
    }
  }
]