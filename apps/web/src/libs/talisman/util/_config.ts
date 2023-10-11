import { chains } from '@domains/chains'

export const statusOptions = {
  INITIALIZED: 'INITIALIZED',
  PROCESSING: 'PROCESSING',
  READY: 'READY',
  ERROR: 'ERROR',
}

export type Relaychain = {
  id: number
  name: string
  rpc: string
  genesisHash: string
  subscanUrl: string
  tokenDecimals: number
  tokenSymbol: string
  coingeckoId: string
  blockPeriod: number
}

// https://wiki.polkadot.network/docs/build-ss58-registry
export const SupportedRelaychains: Record<number | string, Relaychain> = {
  0: {
    id: 0,
    name: 'Polkadot',
    rpc:
      chains.find(chain => chain.genesisHash === '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3')
        ?.rpc ?? '',
    genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
    subscanUrl: 'https://polkadot.subscan.io',
    tokenDecimals: 10,
    tokenSymbol: 'DOT',
    coingeckoId: 'polkadot',
    blockPeriod: 6,
  },
  2: {
    id: 2,
    name: 'Kusama',
    rpc:
      chains.find(chain => chain.genesisHash === '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe')
        ?.rpc ?? '',
    genesisHash: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe',
    subscanUrl: 'https://kusama.subscan.io',
    tokenDecimals: 12,
    tokenSymbol: 'KSM',
    coingeckoId: 'kusama',
    blockPeriod: 6,
  },
}

export type ParachainDetails = {
  id: string
  name: string
  slug: string
  token: string
  subtitle: string
  info: string
  links: Record<string, string>
  tags?: string[]
}

export const parachainDetails: ParachainDetails[] = [
  {
    id: '0-2000',
    name: 'Acala',
    slug: 'acala',
    token: 'ACA',
    subtitle: 'Acala is the DeFi and Liquidity Hub of Polkadot',
    info: 'Acala is an Ethereum-compatible smart contract platform optimized for DeFi and scaling DApps to Polkadot. The blockchain has built-in DeFi protocols for application developers to leverage, including a decentralized stablecoin (Acala Dollar - aUSD), a trustless staking derivatives (liquid DOT - LDOT), and a decentralized exchange.',
    links: {
      Website: 'https://acala.network',
      Twitter: 'https://twitter.com/AcalaNetwork',
      Telegram: 'https://t.me/acalaofficial',
      Discord: 'https://discord.com/invite/6QHVY4X',
      Github: 'https://github.com/AcalaNetwork',
    },
  },
  {
    id: '0-2002',
    name: 'Clover',
    slug: 'clover',
    token: 'CLV',
    subtitle: 'A foundational layer for cross-chain compatibility.',
    info: 'Clover describes itself as a blockchain operating system. It contains a storage layer, smart contract layer, Defi protocol layer, and eApp layer that work in unison to accomplish the goal of blockchain interoperability.',
    links: {
      Website: 'https://clover.finance/',
      Twitter: 'https://twitter.com/clover_finance/',
      Telegram: 'https://t.me/clover_en/',
      Medium: 'https://projectclover.medium.com/',
      Github: 'https://github.com/clover-network',
      Discord: 'https://discord.com/invite/7EFqBwZ3aw',
    },
  },
  {
    id: '0-2003',
    name: 'Darwinia',
    slug: 'darwinia-polkadot',
    token: 'RING',
    subtitle: 'Darwinia Network is a decentralized cross-chain bridge network building on Substrate.',
    info: 'Darwinia Network provides an entrance to the Polkadot ecology for projects that have been deployed on public blockchains such as Ethereum and BSC.',
    links: {
      Website: 'https://darwinia.network/',
      Twitter: 'https://twitter.com/DarwiniaNetwork/',
      Telegram: 'http://t.me/DarwiniaNetwork',
      Medium: 'https://darwinianetwork.medium.com/',
      Github: 'https://github.com/darwinia-network',
    },
  },
  {
    id: '0-2004',
    name: 'Moonbeam',
    slug: 'moonbeam',
    token: 'GLMR',
    subtitle: 'An Ethereum-compatible smart contract parachain on Polkadot.',
    info: 'Moonbeam is a full Ethereum-like environment and works with industry-standard Ethereum tools, DApps, and protocols.',
    links: {
      Website: 'https://moonbeam.network/networks/moonbeam/',
      Twitter: 'https://twitter.com/moonbeamnetwork',
      Telegram: 'https://t.me/Moonbeam_Official',
      Medium: 'https://medium.com/moonbeam-network',
      Github: 'https://github.com/PureStake/moonbeam',
      Discord: 'https://discord.gg/PfpUATX',
    },
  },
  {
    id: '0-2006',
    name: 'Astar',
    slug: 'astar',
    token: 'ASTR',
    subtitle:
      'Astar is the Polkadot-native dApp hub supporting Ethereum, WebAssembly, dApp Staking, and Layer2 solutions.',
    info: 'Astar Network (previously known as Plasm) is a dApp hub on Polkadot that supports Ethereum, WebAssembly, and layer 2 solutions like ZK Rollups. Astar aims to be a multi-chain smart contract platform that will support multiple blockchains and virtual machines.',
    links: {
      Website: 'https://astar.network/',
      Twitter: 'https://twitter.com/AstarNetwork',
      Telegram: 'https://t.me/PlasmOfficial',
      Medium: 'https://medium.com/astar-network',
      Github: 'https://github.com/PlasmNetwork/Plasm',
      Discord: 'https://discord.gg/Z3nC9U4',
    },
  },
  {
    id: '0-2007',
    name: 'Kapex',
    slug: 'kapex',
    token: 'KAPEX',
    subtitle: 'Building the 1st decentralised p2p accounting protocol anywhere.',
    info: "Totem is building the world's first peer-to-peer accounting consensus protocol. It’s not just a first in the blockchain space – it’s a first in the accounting world too.",
    links: {
      Website: 'https://totemaccounting.com/',
      Twitter: 'https://twitter.com/Totem_live_',
      Telegram: 'https://t.me/totemchat',
      Medium: 'https://medium.com/totemlive',
      Gitlab: 'https://gitlab.com/totem-tech',
      Discord: 'https://discord.com/invite/kmuZucW',
    },
  },
  {
    id: '0-2008',
    name: 'Crust',
    slug: 'crust',
    token: 'CRU',
    subtitle: 'Crust implements the incentive layer protocol for decentralized storage.',
    info: "It is adaptable to multiple storage layer protocols such as IPFS, and provides support for the application layer. Crust’s architecture also has the capability of supporting a decentralized computing layer and building a decentralized cloud ecosystem. Crust's decentralized storage layer provides a distributed file system. At the same time, Crust encapsulates some standard interfaces such as Amazon S3-like. Any application scenarios involving data storage, such as cloud services, edge computing, and decentralized applications, are the scenarios that Crust can adapt. Worth mentioning is that in edge computing scenarios, compared to centralized cloud storage, Crust's decentralized storage is closer to the edge, which can achieve relatively low cost and high performance.",
    links: {
      Website: 'https://crust.network/',
      Twitter: 'https://twitter.com/crustnetwork',
      Telegram: 'https://t.me/CrustNetwork',
      Medium: 'https://crustnetwork.medium.com/',
      Github: 'https://github.com/crustio/crust',
      Discord: 'https://discord.gg/Jbw2PAUSCR',
    },
  },
  {
    id: '0-2011',
    name: 'Equilibrium',
    slug: 'equilibrium-polkadot',
    token: 'EQ',
    subtitle:
      'The functionality of all key DeFi apps on one platform, with advanced bailout mechanism for system security.',
    info: 'Users can: Lend - All main crypto assets, EQ tokens Borrow - All main crypto assets, decentralized stablecoins, synthetics Trade - All main crypto assets, decentralized stablecoins, synthetics, EQ tokens Stake - PoS & DPoS crypto assets, EQ tokens Solves cross-chain interoperability, unlocking $311 Bln of total remaining DeFi market potential.',
    links: {
      Website: 'https://equilibrium.io/',
      Twitter: 'https://twitter.com/EquilibriumDeFi',
      Telegram: 'https://t.me/equilibrium_eosdt_official',
      Medium: 'https://medium.com/equilibrium-eosdt',
      Github: 'https://github.com/equilibrium-eosdt/equilibrium-substrate-chain',
    },
  },
  {
    id: '0-2012',
    name: 'Parallel',
    slug: 'parallel',
    token: 'PARA',
    subtitle:
      'Parallel Finance is a decentralized money market protocol that offers lending, staking, and borrowing in the Polkadot ecosystem.',
    info: "Parallel's mission is to innovate and bring DeFi to the next level. We are creating the most secure and easy-to-use decentralized platform to empower everyone access to financial services.",
    links: {
      Website: 'https://parallel.fi/',
      Twitter: 'https://twitter.com/ParallelFi',
      Telegram: 'https://t.me/parallelfi_community',
      Medium: 'https://parallelfinance.medium.com/',
      Github: 'https://github.com/parallel-finance',
      Discord: 'https://discord.gg/buKKx4dySW',
    },
  },
  {
    id: '0-2013',
    name: 'Litentry',
    slug: 'litentry',
    token: 'LIT',
    subtitle:
      'Litentry is a Decentralized Identity Aggregation protocol across multiple networks, it features a DID indexing mechanism and a Substrate-based credit computation network.',
    info: 'The protocol provides a decentralized, interoperable identity aggregation service that mitigates the difficulty of resolving agnostic DID mechanisms. Litentry provides a secure vehicle through which users manage their identities and dApps obtain the real-time credit/reputation of an identity owner across different blockchains.',
    links: {
      Website: 'https://www.litentry.com/',
      Twitter: 'https://twitter.com/litentry',
      Telegram: 'https://t.me/litentry',
      Medium: 'https://litentry.medium.com/',
      Github: 'https://github.com/litentry/',
      Linkedin: 'https://www.linkedin.com/company/litentry/about',
    },
  },
  {
    id: '0-2015',
    name: 'Manta',
    slug: 'manta',
    token: 'MANTA',
    subtitle: 'The Privacy Preservation Layer on Polkadot.',
    info: 'Manta Network is a private layer built for the entire Polkadot ecosystem. Built on the Substrate framework, Manta Network is natively compatible with other projects and parachain assets including wrapped major cryptoassets.',
    links: {
      Website: 'https://manta.network/',
      Twitter: 'https://twitter.com/mantanetwork',
      Telegram: 'https://t.me/mantanetworkofficial',
      Medium: 'https://medium.com/@mantanetwork',
      Github: 'https://github.com/Manta-Network',
    },
  },
  {
    id: '0-2017',
    name: 'SubGame Network',
    slug: 'subgame-polkadot',
    token: 'SGB',
    subtitle: 'SubGame is a public chain development team based on the Polkadot Parachain.',
    info: 'It hopes to build a public chain with cross-chain interoperability. In addition to creating game applications, it can also build various types of application scenarios to create a common cross-chain industry. The blockchain infrastructure provides unlimited possibilities for distributed mobile applications.',
    links: {
      Website: 'https://www.subgame.org/',
      Twitter: 'https://twitter.com/SubGame_Network',
      Telegram: 'https://t.me/subgame_network',
      Medium: 'https://medium.com/@subgame_network',
      Github: 'https://github.com/SubGame-Network',
    },
  },
  {
    id: '0-2019',
    name: 'Composable Finance',
    slug: 'composable-finance',
    token: 'LAYR',
    subtitle:
      'Composable’s parachain is going to be able to run multiple bytecodes together in the same place, in order to run smart contracts together in a manner that allows them to communicate and collaborate.',
    info: 'As a result, protocols using different smart contract languages (i.e. those on different chains, especially) will be able to unite via our parachain, facilitating cross-chain asset swaps and other functionalities.',
    links: {
      Website: 'https://www.composable.finance/',
      Twitter: 'https://twitter.com/ComposableFin',
      Telegram: 'https://t.me/ComposableFinanceAnnouncements',
      Medium: 'https://composablefi.medium.com/',
      Github: 'https://github.com/ComposableFi/',
    },
  },
  {
    id: '0-2021',
    name: 'Efinity',
    slug: 'efinity-polkadot',
    token: 'EFI',
    subtitle: 'Enjin is developing Efinity, a next-generation blockchain for digital assets, built on Polkadot.',
    info: 'Businesses and developers seriously need a platform that can deliver a modern, mainstream and developer-friendly NFT experience. Since the release of Ethereum, there have been attempts to build infrastructure and tokenization around this general-purpose computing blockchain, but there’s an ever-growing thirst for a better solution.\n\nCreators are forced to work with crippling fees, inflexible smart contracts and disjointed interoperability. Adoption of today’s NFTs is still limited to die-hard crypto enthusiasts.\n\nThe blockchains that non-fungible tokens live on give actual users no incentives (other than the prices rising), because miners are given the full share of generated tokens. Prices rise, infrastructure companies create silos and paywalls, and it becomes difficult to make real progress in this industry - unless we can unify the community and think a bit differently.\n\nEfinity is built to solve these problems.',
    links: {
      Website: 'https://enjin.io/products/efinity',
      Twitter: 'https://twitter.com/efinityio',
      Blog: 'https://enjin.io/blog-tags/efinity',
      GitHub: 'https://github.com/enjin',
    },
  },
  {
    id: '0-2026',
    name: 'Nodle',
    slug: 'nodle-polkadot',
    token: 'NODL',
    subtitle: "Nodle's mission is to connect the next trillion things to the Internet.",
    info: "Nodle leverages Bluetooth Low Energy (BLE) via millions of smartphones and routers to allow enterprises and smart cities to connect IoT devices to the Internet at a low-cost while maintaining privacy and security. Nodle's decentralized wireless network is currently comprised of 5M daily active smartphones with 30 million IoT devices discovered daily in over 100 countries, moving approximately 100 GB of data.",
    links: {
      Website: 'https://nodle.com/',
      Twitter: 'https://twitter.com/NodleNetwork',
      Medium: 'https://medium.com/nodle-io',
      GitHub: 'https://github.com/NodleCode/chain',
      Reddit: 'https://www.reddit.com/r/Nodle/',
      Discord: 'https://discord.gg/N5nTUt8RWJ',
      Telegram: 'https://t.me/nodlecommunity',
    },
  },
  {
    id: '0-2027',
    name: 'Coinversation',
    slug: 'coinversation',
    token: 'CTO',
    subtitle:
      'Coinversation Protocol is a synthetic asset issuance protocol and decentralised contract trading exchange based on the Polkadot contract chain.',
    info: 'It uses the token CTO issued by Coinversation Protocol and Polkadot(DOT) as collateral, and synthesizes any cryptocurrencies or stocks, bonds, gold and any other off-chain assets through smart contracts and oracles.',
    links: {
      Website: 'https://www.coinversation.io/',
      Twitter: 'https://twitter.com/Coinversation_',
      Medium: 'https://coinversationofficial.medium.com/',
      GitHub: 'https://github.com/Coinversation/coinpro',
      Telegram: 'https://t.me/coinversationofficial',
    },
  },
  {
    id: '0-2028',
    name: 'Ares Protocol',
    slug: 'ares-odyssey',
    token: 'ARES',
    subtitle: 'Ares is an on-chain verifying oracle protocol powered by Polkadot.',
    info: "It provides reliable off-chain data efficiently and in a trustless manner. Ares is built on Substrate and constructed as a parachain to link to Polkadot's ecology and share its security consensus. It is a scalable oracle network that provides decentralized data services to the Polkadot ecosystem and its parachains.",
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
    id: '0-2031',
    name: 'Centrifuge',
    slug: 'centrifuge-polkadot',
    token: 'CFG',
    subtitle: 'Centrifuge Chain is the gateway for real-world assets to the Blockchain Multiverse.',
    info: 'We built Centrifuge Chain on Parity Substrate with an initial bridge to Ethereum. This allows us to move faster and use a consistent approach for certain features. We envision a larger ecosystem of many, connected blockchains- where Dapps on Ethereum could use data from other chains, value could move freely, and Centrifuge Chain can enable off-chain assets to access financing through DeFi.',
    links: {
      Website: 'https://centrifuge.io/',
      Twitter: 'https://twitter.com/centrifuge',
      Telegram: 'https://t.me/centrifuge_chat',
      Medium: 'https://medium.com/centrifuge',
      Github: 'https://github.com/centrifuge/centrifuge-chain/',
      Discord: 'https://centrifuge.io/discord',
    },
  },
  {
    id: '0-2032',
    name: 'Interlay',
    slug: 'interlay',
    token: 'INTR',
    subtitle:
      'Interlay is a decentralized network dedicated to connecting crypto-currencies like Bitcoin with DeFi platforms like Polkadot and Ethereum.',
    info: 'The Interlay network is hosted as a Polkadot parachain and will be connected to Cosmos, Ethereum, and other major DeFi networks. Read more about Interlay’s vision of blockchain interoperability. interBTC, Interlay’s flagship product, is Bitcoin on any blockchain. A 1:1 Bitcoin-backed asset, fully collateralized, interoperable, and censorship-resistant.',
    links: {
      Website: 'https://interlay.io/',
      Twitter: 'https://twitter.com/interlayHQ',
      Telegram: 'https://t.me/interlay_community',
      Medium: 'https://medium.com/interlay',
      Github: 'https://github.com/interlay/interbtc',
      Discord: 'https://discord.com/invite/interlay',
    },
  },
  {
    id: '0-2034',
    name: 'HydraDX',
    slug: 'hydra',
    token: 'HDX',
    subtitle: 'Cross-chain liquidity protocol built on Substrate',
    info: 'HydraDX is the creator of the Omnipool. Driven by the ambition to put an end to liquidity fragmentation, we have challenged the misconception that AMMs should be limited to pairs of assets. The Omnipool allows users to submerge any cryptoasset in an ocean of liquidity. One trading pool - many assets. Empowering native liquidity for the Polkadot ecosystem, and beyond.',
    links: {
      Website: 'https://hydradx.io/',
      Twitter: 'https://twitter.com/hydra_dx',
      Medium: 'https://hydradx.substack.com/archive',
      Github: 'https://github.com/galacticcouncil?tab=repositories',
      Discord: 'https://discord.com/invite/xtVnQgq',
    },
  },
  {
    id: '0-2035',
    name: 'Phala Network',
    slug: 'phala',
    token: 'PHA',
    subtitle: 'Phala Network as a confidentiality layer for Web3.0 developers',
    info: 'Phala is a Polkadot parachain, and developers can invoke and interact with confidential contracts on other Polkadot parachains.',
    links: {
      Website: 'https://phala.network',
      Twitter: 'https://twitter.com/PhalaNetwork',
      Telegram: 'https://t.me/phalanetwork',
      Medium: 'https://medium.com/phala-network',
      Github: 'https://github.com/Phala-Network',
      Discord: 'https://discord.gg/phala',
    },
  },
  {
    id: '0-2037',
    name: 'Unique Network',
    slug: 'unique-network',
    token: 'UNQ',
    subtitle: 'The NFT chain built for Polkadot and Kusama.',
    info: 'Unique Network is a scalable blockchain for programmable NFTs with advanced features. Built with Substrate as a parachain on Polkadot Network, Unique unlocks unlimited potential for next-generation NFTs.',
    links: {
      Website: 'https://unique.network/',
      Twitter: 'https://twitter.com/Unique_NFTchain',
      Telegram: 'https://t.me/Uniquechain',
      Medium: 'https://medium.com/unique-network',
      Github: 'https://github.com/UniqueNetwork',
      Discord: 'https://discord.gg/jHVdZhsakC',
    },
  },
  {
    id: '0-2038',
    name: 'Geminis',
    slug: 'geminis-network',
    token: 'GEM',
    subtitle: 'Geminis Network is the first parachain supported by the advanced ParaState tech stack.',
    info: 'Geminis takes Ethereum chain support to the next level through WasmEdge. Develop and execute high-speed smart contracts with built-in Ethereum compatibility (EVM & EWASM) and interoperability in Solidity, Vyper, and next-level programming languages like Rust, C ++, and Golang.',
    links: {
      Website: 'https://geminis.network/',
      Twitter: 'https://twitter.com/_ParaState',
      Telegram: 'https://t.me/ParaState',
      Discord: 'https://geminis.network/',
      Facebook: 'https://www.facebook.com/ParaState.io/',
    },
  },
  {
    id: '0-2040',
    name: 'Polkadex',
    slug: 'polkadex-polkadot',
    token: 'PDEX',
    subtitle: 'The trading engine for Web3 and DeFi',
    info: 'Polkadex is a fully decentralized peer-to-peer orderbook-based cryptocurrency exchange for the DeFi ecosystem built on Substrate.',
    links: {
      Website: 'https://www.polkadex.trade/',
      Twitter: 'https://twitter.com/polkadex',
      Telegram: 'https://t.me/Polkadex',
      Medium: 'https://polkadex.medium.com/',
      Github: 'https://github.com/Polkadex-Substrate/Polkadex',
      Discord: 'https://discord.com/invite/qubycwPtSd',
    },
  },
  {
    id: '0-2030',
    name: 'Bifrost',
    slug: 'bifrost-polkadot',
    token: 'BNC',
    subtitle: 'Cross chain liquidity for staking.',
    info: 'Cross chain liquidity for staking. Based on polkadot, kusama, substrate, and web3 infrastructure',
    links: {
      Website: 'https://bifrost.finance/',
      Twitter: 'https://twitter.com/bifrost_finance',
      Telegram: 'https://t.me/bifrost_finance',
      Discord: 'https://discord.com/invite/XjnjdKBNXj',
    },
  },
  {
    id: '0-2043',
    name: 'OriginTrail Parachain',
    slug: 'origintrail',
    token: 'OTP',
    subtitle: 'Bringing real world assets to Polkadot.',
    info: 'By harnessing the power of the OriginTrail Decentralized Knowledge Graph, OriginTrail Parachain extends discoverability, verifiability and greater value for interconnected Web3 assets to Polkadot.',
    links: {
      Website: 'https://parachain.origintrail.io/',
      Twitter: 'https://twitter.com/origin_trail',
      Telegram: 'https://t.me/origintrail',
    },
  },
  {
    id: '0-2039',
    name: 'Integritee Shell',
    slug: 'integritee-polkadot',
    token: 'TEER',
    subtitle: 'Unchain the value of sensitive data. At scale.',
    info: 'Integritee is the most scalable public blockchain solution for securely processing sensitive business or personal data. Harness the speed and confidentiality of trusted execution environments, combined with the trust of a decentralized network, with Integritee.',
    links: { Website: 'https://integritee.network/', Twitter: 'https://twitter.com/integri_t_e_e' },
  },
  {
    id: '0-2052',
    name: 'Kylin',
    slug: 'kylin',
    token: 'KYL',
    subtitle: 'Building a Cross-chain Platfor. Powering the DeData Economy',
    info: 'Kylin Network is the native Polkadot Data Blockchain to accelerate the world’s transition to DeData within a Web3.0 context by Building a Cross-chain Platform Powering the Data Economy. It is the Data Infrastructure for DeFi and Web 3.0 Powered by Polkadot.',
    links: {
      Website: 'https://kylin.network/',
      Twitter: 'https://twitter.com/Kylin_Network',
      Telegram: 'https://t.me/KylinOfficial',
      Github: 'https://github.com/Kylin-Network',
    },
  },
  {
    id: '0-2051',
    name: 'Ajuna Network',
    slug: 'ajuna-network',
    token: 'AJUN',
    subtitle:
      'Ajuna Network is the fastest way for developers and game studios to create high-quality, decentralized games.',
    info: 'Ajuna Network is a decentralized gaming platform that delivers real value to gamers, without compromising on gameplay. It empowers you to truly own your in-game assets, protect and control their functionality, and have a voice in the future of the games you love.',
    links: {
      Website: 'https://ajuna.io/',
      Twitter: 'https://twitter.com/AjunaNetwork',
      Medium: 'https://medium.com/@AjunaNetwork',
      Github: 'https://github.com/ajuna-network/',
    },
  },
  {
    id: '0-2053',
    name: 'OmniBTC',
    slug: 'omnibtc',
    token: 'TEER',
    subtitle: 'Make Finance Omnichainable.',
    info: 'OmniBTC is an omnichain financial platform for web3,including omnichain swap and BTC omnichain lending',
    links: {
      Website: 'https://www.omnibtc.finance/',
      Twitter: 'https://twitter.com/OmniBTC',
      Medium: 'https://medium.com/@omnibtc',
      Github: 'https://github.com/OmniBTC',
    },
  },
  {
    id: '0-2090',
    name: 'Oak Network',
    slug: 'oak-network',
    token: 'TEER',
    subtitle: 'Secure and Trustless Automation Payments and finance infrastructure for the Web 3.0',
    info: 'The Web 3.0 hub for DeFi and payment automation.',
    links: {
      Website: 'https://oak.tech/',
      Twitter: 'https://twitter.com/oak_network',
      Medium: 'https://medium.com/oak-blockchain',
      Github: 'https://github.com/OAK-Foundation/OAK-blockchain',
    },
  },
  {
    id: '0-2093',
    name: 'Hashed Network',
    slug: 'hashed-network',
    token: 'HASH',
    subtitle: 'Digitally-native business on Polkadot',
    info: 'Hashed Network enables the full business lifecycle for digitally-native organizations and web3-curious businesses seeking benefits of decentralized digital economies.',
    links: {
      Website: 'https://hashed.network/',
      Twitter: 'https://twitter.com/HashedNetwork',
      Medium: 'https://medium.com/hashednetwork',
      Github: 'https://github.com/hashed-io',
    },
  },
  {
    id: '0-2094',
    name: 'Pendulum',
    slug: 'pendulum',
    token: 'PEN',
    subtitle: 'FX Blockchain Infrastructure',
    info: `Pendulum’s interoperable blockchain brings together high-quality fiat tokens in a single, powerful DeFi network. Building the missing link between fiat and DeFi through a forex-optimized smart contract DeFi network allowing traditional finance services to seamlessly integrate with DeFi applications such as specialized forex AMMs, lending protocols, and yield farming and offering composable fiat solutions with 1000x performance.
‍
Building Pendulum on Polkadot’s Substrate framework maximizes multi-chain interoperability and increased security. Pendulum will operate as a key piece of Web3 infrastructure to finally unlock DeFi use cases for fiat currencies.

Our mission is to create an open financial future that overcomes borders and fosters economic inclusion.`,
    links: {
      Website: 'https://pendulumchain.org/',
      Discord: 'https://discord.gg/wJ2fQh776B',
      Telegram: 'https://t.me/pendulum_community',
      Twitter: 'https://twitter.com/pendulum_chain',
      Github: 'https://github.com/pendulum-chain',
      Medium: 'https://pendulum-chain.medium.com/',
      Reddit: 'https://www.reddit.com/r/Pendulum_Chain/',
      LinkedIn: 'https://www.linkedin.com/company/pendulum-chain/',
    },
  },
  {
    id: '0-2097',
    name: 'Bittensor',
    slug: 'bittensor',
    token: 'TAO',
    subtitle: 'Incentivising Intelligence',
    info: `Bittensor is an open-source protocol that powers a decentralized, blockchain-based machine learning network. 
    
    Machine learning models train collaboratively and are rewarded in TAO according to the informational value they offer the collective. 
    
    TAO also grants external access, allowing users to extract information from the network while tuning its activities to their needs.`,
    links: {
      Website: 'https://bittensor.com/',
      Discord: 'https://discord.com/invite/3rUr6EcvbB',
      Telegram: 'https://t.me/bittensor',
      Twitter: 'https://twitter.com/bittensor_',
      Github: 'https://github.com/opentensor/BitTensor',
      Medium: 'https://bittensor.medium.com/',
      Reddit: 'https://www.reddit.com/r/bittensor_',
      LinkedIn: 'https://www.linkedin.com/company/bittensor',
    },
  },
  {
    id: '0-3340',
    name: 'InvArch',
    slug: 'invArch',
    token: 'VARCH',
    subtitle: 'Home of the DAO Economy',
    info: `InvArch is a highly optimized network for launching decentralized communities, borderless businesses, & unstoppable organizations on Polkadot & beyond!`,
    links: {
      Website: 'https://invarch.network/',
      Discord: 'https://discord.com/invite/InvArch',
      Twitter: 'https://twitter.com/invarchnetwork',
      Telegram: 'https://t.me/InvArch',
      Github: 'https://github.com/InvArch',
      Medium: 'https://invarch.medium.com/',
    },
  },
  {
    id: '2-2000',
    name: 'Karura',
    slug: 'karura',
    token: 'KAR',
    subtitle: 'Karura is the all-in-one DeFi hub of Kusama.',
    info: 'Founded by the Acala Foundation, Karura is a scalable, EVM-compatible network optimized for DeFi. The platform offers a suite of financial applications including: a trustless staking derivative (liquid KSM), a multi-collateralized stablecoin backed by cross-chain assets (kUSD), and an AMM DEX – all with micro gas fees that can be paid in any token.\n\nAcala and Karura will operate in parallel and serve the users of the Polkadot and Kusama communities. Once Kusama is bridged to Polkadot, Karura and Acala will also be fully interoperable.',
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
    slug: 'bifrost-polkadot',
    token: 'BNC',
    subtitle:
      'As a DeFi project in the Polkadot ecosystem, Bifrost launches vToken which allows users to exchange PoS tokens to vTokens and obtain liquidity and Staking rewards through Bifrost protocol at any time.',
    info: 'Participants staking KSMs with the Bifrost parachain slot will receive rewards in the native token BNC. There will be no new tokens released as rewards for the Kusama parachain.\n\nThe vesting schedules provided in Bifrost’s whitepaper are split into quarters. There is no indicated vesting period for Kusama parachain auction participants, however Bifrost has indicated a vesting period for rewards in the Polkadot parachain auctions. Details of Kusama auction reward vesting are to be determined.',
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
    slug: 'khala',
    token: 'PHA',
    subtitle: 'Khala Network is the Phala pre-mainnet on Kusama, as published on the roadmap last year.',
    info: 'Phala will implement its mainnet on Polkadot, as the parachain to serve enterprise-scale blockchains and DeFi service.\n\nKhala will implement its mainnet on Kusama, as the parachain to serve creative and growth blockchains and DeFi service.',
    links: {
      Website: 'https://crowdloan.phala.network/en/',
      Twitter: 'https://twitter.com/PhalaNetwork',
      Telegram: 'https://t.me/phalanetwork',
      Medium: 'https://medium.com/phala-network',
      Github: 'https://github.com/Phala-Network',
      Discord: 'https://discord.gg/myBmQu5',
    },
  },
  {
    id: '2-2258',
    name: 'Shiden',
    slug: 'shiden-kusama',
    token: 'SDN',
    subtitle: 'Smart Contract Platform Natively Supporting Ethereum Virtual Machine and WebAssembly',
    info: 'Shiden Network is a multi-chain decentralized application layer on Kusama Network.',
    links: {
      Website: 'https://shiden.astar.network/',
      Twitter: 'https://twitter.com/ShidenNetwork',
      Telegram: 'https://t.me/PlasmOfficial',
      Medium: 'https://medium.com/astar-network',
      Github: 'https://github.com/AstarNetwork/Astar',
      Discord: 'https://discord.com/invite/Z3nC9U4',
    },
  },
  {
    id: '2-2120',
    name: 'Shiden',
    slug: 'shiden-kusama',
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
    id: '2-2007',
    name: 'Shiden Network',
    slug: 'shiden-network',
    token: 'SDN',
    subtitle: 'Smart Contract Platform Natively Supporting Ethereum Virtual Machine and WebAssembly',
    info: 'Shiden Network is a multi-chain decentralized application layer on Kusama Network.',
    links: {
      Website: 'https://shiden.astar.network/',
      Twitter: 'https://twitter.com/ShidenNetwork',
      Telegram: 'https://t.me/PlasmOfficial',
      Medium: 'https://medium.com/astar-network',
      Github: 'https://github.com/AstarNetwork/Astar',
      Discord: 'https://discord.com/invite/Z3nC9U4',
    },
  },
  {
    id: '2-2008',
    name: 'Mars',
    slug: 'mars',
    token: 'MARS',
    subtitle: 'Ares is an on-chain verifying oracle protocol powered by Polkadot.',
    info: " It provides reliable off-chain data efficiently and in a trustless manner. Ares is built on Substrate and constructed as a parachain to link to Polkadot's ecology and share its security consensus. It is a scalable oracle network that provides decentralized data services to the Polkadot ecosystem and its parachains.",
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
    slug: 'polkasmith',
    token: 'PKS',
    subtitle:
      'Implemented on Kusama Network, PolkaSmith is a canary chain of PolkaFoundry, a one-stop production hub creating borderless and frictionless DeFi & NFT applications.',
    info: 'PolkaSmith will be a reliable platform for early-stage startups to unleash their creativity, experiment with bold new ideas, and hack the growth.\n\nPKS is the native token of PolkaSmith. There is no pegging or mapping between PKS and PKF (PolkaFoundry’s native token).',
    links: {
      Website: 'https://polkasmith.polkafoundry.com/',
      Twitter: 'https://twitter.com/PolkaFoundry',
      Telegram: 'https://t.me/polkafoundry',
      Medium: 'https://medium.com/@polkafoundry',
    },
  },
  {
    id: '2-2011',
    name: 'Sora Kusama',
    slug: 'sora-ksm',
    token: 'XOR',
    subtitle: 'The SORA Network provides tools for decentralized applications that use digital assets.',
    info: ' The SORA Network excels at providing tools for decentralized applications that use digital assets, such as atomic token swaps, bridging tokens to other chains, and creating programmatic rules involving digital assets.',
    links: {
      Website: 'https://sora.org/',
      Twitter: 'https://twitter.com/sora_xor',
      Telegram: 'https://t.me/sora_xor',
      Medium: 'https://sora-xor.medium.com/',
      Github: 'https://github.com/sora-xor',
    },
  },
  {
    id: '2-2012',
    name: 'Crust Shadow',
    slug: 'crust',
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
    slug: 'integritee-polkadot',
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
    info: 'Building on the success of the Rococo testnet, the stage for Kusama has been set as the first “mainnet” to utilize the power of Substrate. Kusama is regarded as a layer zero protocol and as the CanaryNet of Polkadot. The Clover Finance team envisions Sakura to live on as the innovative sister network of Clover, with both Clover and Sakura continuing to serve their communities simultaneously. The unique on-chain governance parameters of Kusama enables DeFi applications built on top of the Sakura network to have higher performance and scalability right away. This will lower the barrier to entry for the development community to deploy their dApps on Sakura without having to meet the stricter guidelines of Polkadot.\n\nSakura will utilize all of the core underlying technology stack that Clover has created and is continuously innovating. The Clover extension wallet will natively support Sakura dApps on EVM, polkadot.js based injections, and a native-built SKU<->ETH and SKU<->BSC bridge. The trustless cross-chain bridge for Ethereum and Bitcoin will be utilized on both Sakura and Clover. Sakura will ultimately aim to be a parachain Operating System with a storage layer, smart contract layer, DeFi protocol layer and eApp layer built on top of Kusama.',
    links: {
      Website: 'https://auction.clover.finance/#/',
      Twitter: 'https://twitter.com/clover_finance/',
      Telegram: 'https://t.me/clover_en/',
      Medium: 'https://projectclover.medium.com/',
    },
  },
  {
    id: '2-2018',
    name: 'SubGame Gamma',
    slug: 'subgame-polkadot',
    token: 'GSGB',
    subtitle: 'SubGame is a public chain development team based on the Polkadot Parachain.',
    info: 'It hopes to build a public chain with cross-chain interoperability. In addition to creating game applications, it can also build various types of application scenarios to create a common cross-chain industry. The blockchain infrastructure provides unlimited possibilities for distributed mobile applications.',
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
    info: 'The Kpron Network’s token: KPN, is the APN on Kusama.\n\nKPN was issued on Kpron Network as a portion of the tokens allocated by Apron Network and can be swapped with APN at a 1:1 rate (1KPN=1APN). There is no change on Apron’s tokenomics, and the total amount of APN remains the same.',
    links: {
      Website: 'http://apron.network/',
      Twitter: 'https://twitter.com/apronofficial1',
      Telegram: 'https://t.me/apronnetwork',
      Medium: 'https://apron-network.medium.com/',
      Github: 'https://github.com/Apron-Network/',
      Discord: 'https://discord.gg/Bu6HzJP2YY',
    },
  },
  {
    id: '2-2023',
    name: 'Moonriver',
    slug: 'moonriver',
    token: 'MOVR',
    subtitle: 'A Community-Led Sister Parachain on Kusama',
    info: 'Like Moonbeam, Moonriver is a complete Ethereum-like environment and works with industry-standard Ethereum tools, DApps, and protocols. Moonriver is a companion network to Moonbeam and provides a permanently incentivized canary network. New code ships to Moonriver first, where it can be tested and verified under real economic conditions. Once proven, the same code ships to Moonbeam on Polkadot. The Moonriver network is currently launching to Kusama. Track the launch status here: https://moonbeam.network/networks/moonriver/launch/',
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
    slug: 'genshiro-kusama',
    token: 'GENS',
    subtitle: 'Genshiro is a canary network of equilibrium that shares the experimental spirit of Kusama.',
    info: "Genshiro is EquilibriumDeFi's DeFi one-stop shop on Kusama that can do all things that existing DeFi primitives do, but with less risk and cross-chain.",
    links: {
      Website: 'https://genshiro.equilibrium.io/',
      Twitter: 'https://twitter.com/GenshiroDeFi',
      Telegram: 'https://t.me/genshiro_official',
      Medium: 'https://medium.com/equilibrium-eosdt',
      Github: 'https://github.com/equilibrium-eosdt',
    },
  },
  {
    id: '2-2048',
    name: 'Robonomics',
    slug: 'robonomics-kusama',
    token: 'XRT',
    subtitle:
      'Robonomics is a project with a long history that started in 2015, after the launch of the Ethereum network.',
    info: 'During the project’s development, the team published more than 10 academic articles and created more than 15 R&D projects which included control of drones, industrial manipulators, sensor networks, and even a Boston Dynamics’ robot dog over Ethereum and Polkadot networks.\n\nRobonomics is a project that integrates new technologies into the real economy. However, to fuel this, a reasonable ‘gas’ price is required. Kusama makes the costs of communication between IoT devices and humans affordable.',
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
    info: 'To that end we’ve already built integrations with Ethereum, TRON, and Binance Smart Chain.\n\nWe are going to be giving out 100 LOOM tokens for each KSM token contributed to our Crowdloan. If we win a parachain auction, we will start distributing the rewards ASAP, there will be no vesting or lockup periods for these rewards.',
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
    subtitle:
      "Calamari, Manta Network's canary-net, is the plug-and-play privacy-preservation parachain built to service the Kusama DeFi world.",
    info: 'It combines Kusama and zkSNARKs to bring on-chain privacy to transactions and swaps.',
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
    slug: 'parallel',
    token: 'HKO',
    subtitle:
      'Parallel Finance is a decentralized money market protocol that offers lending, staking, and borrowing in the Polkadot ecosystem.',
    info: 'Similar to the relationship between Polkadot and its “canary network” Kusama, Heiko Finance is the sister network to Parallel, and the parachain that we hope to launch on the Kusama blockchain. We are building for a decentralized future that empowers the community to increase capital efficiency, security, and accessibility through our leverage staking and auction lending platform.',
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
    subtitle:
      'KILT is a blockchain protocol for issuing self-sovereign verifiable, revocable, anonymous credentials and enabling trust market business models in the Web 3.0.',
    info: 'KILT is an open-source fat blockchain protocol for issuing claim-based verifiable, revocable, and anonymous credentials in the Web 3.0. It allows end users to claim arbitrary attributes about themselves, get them attested by trusted entities, and store the claims as self-sovereign credentials (certificates). As trusted entities can issue credentials in return for money, KILT aims to foster new business models for anyone who owns trust or wants to build up trust. KILT Protocol comes with a simple JavaScript SDK where useful applications can be built without requiring any blockchain development skills.',
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
    subtitle:
      'Picasso is an experimental ecosystem to birth new financial primitives and build applications that communicate natively, in a composed manner.',
    info: 'Composable Finance is pleased to announce the Picasso token (PICA), which will be the native token of the Picasso Network Kusama parachain. PICA token will have a multitude of important use cases on our upcoming Picasso parachain, including key governance decisions.',
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
    info: 'Altair is built using Substrate, and will have nearly the same codebase as Centrifuge Chain (just like Kusama is to Polkadot!). It is an experimental network for users who want to test the bounds of asset financing. From art NFTs to undiscovered assets — Altair enables users to tokenize their most experimental assets and finance them. It is the next step for anyone looking to unlock financing for their assets.\n\nInteroperability is the key to increasing liquidity in DeFi. Altair will bridge across the Kusama, Polkadot, and Ethereum ecosystems to allow assets to access financing wherever it is available. In the future, Altair can connect more and more projects across these ecosystems — using Kusama to allow anyone to access DeFi liquidity. The more connected chains, protocols, and Dapps are — the greater the flow of liquidity will be.',
    links: {
      Website: 'https://centrifuge.io/altair',
      Twitter: 'https://twitter.com/centrifuge',
      Telegram: 'https://t.me/centrifuge_chat',
      Medium: 'https://medium.com/centrifuge',
      Github: 'https://github.com/centrifuge/',
      Discord: 'https://centrifuge.io/discord',
    },
  },
  {
    id: '2-2090',
    name: 'Basilisk',
    slug: 'basilisk',
    token: 'BSX',
    subtitle:
      'Basilisk is a liquidity bootstrapping protocol designed to operate as a parachain in Kusama, the Substrate canary network from the Polkadot family.',
    info: 'Basilisk is a natural stepping stone on our journey of building the liquidity infrastructure of the future. This plan will eventually culminate in the HydraDX Omnipool which is intended to operate as a Polkadot parachain in order to enable frictionless liquidity for any asset on any chain.\n\nTogether, Basilisk and HydraDX create a synergy which caters to the varying needs of cryptoassets throughout their entire life cycle. Bootstrap liquidity in the early stages using Basilisk, then move over to the HydraDX Omnipool to unlock unprecedented liquidity in an ocean of assets.',
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
    slug: 'kintsugi',
    token: 'KINT',
    subtitle:
      'Kintsugi’s kBTC brings radically open Bitcoin to Kusama to kickstart liquidity for parachains like Karura, Shiden and Moonriver.',
    info: 'Kintsugi is interBTC’s canary network, developed by Interlay — an R&D company focused on blockchain interoperability. Founded by ex-Imperial College CS PhDs — Alexei Zamyatin and Dominik Harz, Interlay’s mission is to make Bitcoin interoperable in a fully trustless and decentralized way.\n\nThe non-profit Kintsugi Lab will be responsible for Kintsugi’s launch and further — support the development and growth of the decentralized network.\n\nInspired by the ancient Japanese tradition of embracing the flawed and imperfect, Kintsugi accepts the nascent DeFi ecosystem on Kusama as chaotic while constantly being perfected by golden streaks of its community.',
    links: {
      Website: 'https://kintsugi.interlay.io/',
      Twitter: 'https://twitter.com/kintsugi_btc',
      Telegram: 'https://t.me/interlay_community',
      Medium: 'https://medium.com/interlay/',
      Github: 'https://github.com/interlay',
      Discord: 'https://discord.gg/KgCYK3MKSf',
    },
  },
  {
    id: '2-2095',
    name: 'Quartz',
    slug: 'quartz',
    token: 'QTZ',
    subtitle: 'Quartz gives the Kusama community the essential and advanced NFT tools to unleash innovation.',
    info: 'Quartz gives you easy access to test extreme innovation in NFTs and build for the next generation. Built on Substrate, Quartz gives you the most versatile options for discovery and democratization of the NFT ecosystem and marketplaces (with very low barriers for entry).\nAdvanced features like Flexible Economic Models, Scheduled Transactions, Re-fungiblity, and Nested NFTs will all be available via Quartz, allowing users to own UX/UI for your fans and customers.Quartz parachain on Kusama will allow you to build with interoperability between different blockchains, and give developers and engineers the access to the shared security of the entire network.',
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
    slug: 'bitcountry-pioneer',
    token: 'NEER',
    subtitle: 'The Platform for User-created Metaverses & Games with Opportunities to Earn.',
    info: 'The platform allows non-technical users to build their own metaverse. Developers can use our API to develop their games and smart contract dapps. Metaverse.Network is the blockchain network of Bit.Country application framework.',
    links: {
      Website: 'https://bit.country/',
      Twitter: 'https://twitter.com/BitDotCountry',
      Telegram: 'https://t.me/BitCountryOfficialTG',
      Medium: 'https://bitcountry.medium.com/',
      Github: 'https://github.com/bit-country',
      Discord: 'https://discord.com/invite/PaMAXZZ59N',
    },
  },
  {
    id: '2-2100',
    name: 'Subsocial',
    slug: 'subsocial',
    token: 'SUB',
    subtitle: 'Subsocial - Decentralized social network on Polkadot & IPFS',
    info: 'Subsocial is a Polkadot ecosystem project supported by Web3 Foundation. Subsocial follows SoFi (social finance) principles to bring DeFi features to social networking.',
    links: {
      Website: 'https://subsocial.network',
      Twitter: 'https://twitter.com/SubsocialChain',
      Telegram: 'https://t.me/Subsocial',
      Discord: 'https://discord.com/invite/w2Rqy2M',
      Github: 'https://github.com/dappforce',
    },
  },
  {
    id: '2-2101',
    name: 'Zeitgeist',
    slug: 'zeitgeist',
    token: 'ZTG',
    subtitle: 'Zeitgeist is an evolving blockchain for prediction markets and futarchy.',
    info: 'Zeitgeist is a decentralized network for prediction markets. Zeitgeist is an evolving network that will change and adapt over time. It does this through a sophisticated on-chain governance process.',
    links: {
      Website: 'https://zeitgeist.pm/',
      Twitter: 'https://twitter.com/ZeitgeistPM',
      Telegram: 'https://t.me/zeitgeist_official',
      Discord: 'https://discord.gg/xv8HuA4s8v',
      Github: 'https://github.com/ZeitgeistPM',
      Medium: 'https://blog.zeitgeist.pm/#subscribe',
    },
  },
  {
    id: '2-2102',
    name: 'Pichiu',
    slug: 'pichiu',
    token: 'PCHU',
    subtitle: 'Pichiu aims to build a cross-chain platform powering the data economy on Kusama.',
    info: 'It will be the data infrastructure for the future DeFi and Web 3.0 powered by Kusama. Pichiu will provide valid, reliable, secure, cost-effective, and easily-coordinated data sources and data analytics.',
    links: {
      Website: 'https://kylin.network/',
      Twitter: 'https://twitter.com/Kylin_Network',
      Telegram: 'https://t.me/KylinOfficial',
      Discord: 'https://discord.com/invite/PwYCssr',
      Github: 'https://github.com/Kylin-Network/kylin-collator',
      Medium: 'https://kylinnetwork.medium.com/',
    },
  },
  {
    id: '2-2105',
    name: 'Darwinia Crab',
    slug: 'crab-kusama',
    token: 'CRAB',
    subtitle:
      'Crab is the canary network of Darwinia, and is the first blockchain in the Kusama ecosystem to natively support cross-chain as well as smart contract and NFT.',
    info: 'Crab Network intends to participate in the Kusama Parachain Slot Auctions.\n\nThe Crab network is a network with long-term value. Some RINGs are allocated to Crab Network as backing assets to make it serve as a canary network having real economic incentives and massive gaming theory testing, not just working a testnet.\n\nThe economic model parameters of the Crab network are the same as those of the Darwinia Mainnet, and use the same staking and inflation models.',
    links: {
      Website: 'https://crab.network/',
      Twitter: 'https://twitter.com/DarwiniaNetwork',
      Telegram: 'https://t.me/DarwiniaNetwork',
      Medium: 'https://darwinianetwork.medium.com/',
      Github: 'https://github.com/darwinia-network/darwinia/tree/master/runtime/crab',
    },
  },
  {
    id: '2-2106',
    name: 'Litmus',
    slug: 'litmus',
    token: 'LIT',
    subtitle: 'A Web3 identity hub on Kusama.',
    info: 'Litmus is the aptly named canary network for Litentry, a decentralised identity aggregation protocol for DotSama. The protocol provides a decentralized, interoperable identity aggregation service that mitigates the difficulty of resolving agnostic DID mechanisms. Litentry provides a secure vehicle through which users manage their identities and dApps obtain the real-time credit/reputation of an identity owner across different blockchains.',
    links: {
      Website: 'https://kusama-crowdloan.litentry.com/',
      Twitter: 'https://twitter.com/litentry',
      Telegram: 'https://t.me/litentry',
      Medium: 'https://litentry.medium.com//',
      Github: 'https://github.com/litentry',
      Discord: 'https://discord.gg/M7T4y4skVD',
    },
  },
  {
    id: '2-2107',
    name: 'Kico',
    slug: 'kico',
    token: 'KICO',
    subtitle: 'KICO is the canary network for DICO.',
    info: 'The DICO chain creates a decentralized and governable ICO platform for the Polkadot environment. We provide a decentralized platform, which heavily supports its projects.',
    links: {
      Website: 'https://dico.io/',
      Twitter: 'https://twitter.com/DICO03279704',
      Telegram: 'https://t.me/dicochain',
      Medium: 'https://medium.com/@DearICO/',
      Github: 'https://github.com/DICO-TEAM',
      Discord: 'https://discord.com/invite/V2MASPX3Ra',
    },
  },
  {
    id: '2-2110',
    name: 'Mangata X',
    slug: 'mangata-x',
    token: 'MGX',
    subtitle: 'Mangata X is a community-owned exchange for experienced traders & experimental tokens.',
    info: 'Mangata X will build bridges to Ethereum and other networks, as well as open channels to Parachains to host tokens from the newest experimental Parachains and Protocols in the Kusama and Ethereum space.',
    links: {
      Website: 'https://x.mangata.finance/',
      Twitter: 'https://twitter.com/MangataFinance',
      Telegram: 'https://t.me/mgtfi',
      Medium: 'https://blog.mangata.finance/',
      Github: 'https://github.com/mangata-finance',
      Discord: 'https://discord.com/invite/X4VTaejebf',
    },
  },
  {
    id: '2-2114',
    name: 'Turing Network',
    slug: 'turing',
    token: 'TUR',
    subtitle: 'Turing Network is the Kusama parachain of Oak Network, the Web 3.0 Hub for DeFi and Payment Automation.',
    info: "OAK (On-chain Autonomous Kernel) Network is an automation layer-2 blockchain for Defi and recurring payments. Our mission is to build a Stripe for Web 3.0 across protocols. The blockchain is built on Parity Substrate with an event-driven execution model. Different from Ethereum’s transaction-based model, where a transaction requires private key signing, OAK allows transactions to be triggered by event signals such as time, price, and smart contract state changes.\n\nOAK Network aims to be the No.1 utility Layer-2 across protocols, offering on-chain automation not possible today, such as limit & stop-loss orders on Automated-Market-Making DEX and recurring payments. With OAK's on-chain finality and network security, it can empower any blockchain with its autonomous functionality, unleashing endless product potentials.",
    links: {
      Website: 'https://oak.tech/',
      Twitter: 'https://twitter.com/oak_network',
      Telegram: 'https://t.me/OAK_Announcements',
      Medium: 'https://medium.com/oak-blockchain',
      Github: 'https://github.com/OAK-Foundation',
      Discord: 'https://discord.gg/7W9UDvsbwh',
    },
  },
  {
    id: '2-2115',
    name: 'Dora Factory',
    slug: 'dora-factory',
    token: 'DORA',
    subtitle: 'The DAO infrastructure of the Kusama ecosystem.',
    info: 'The DAO-as-a-Service infrastructure for future organizations and communities.',
    links: {
      Website: 'https://dorafactory.org/kusama/',
      Twitter: 'https://twitter.com/DoraFactory',
      Telegram: 'https://t.me/dorafactory',
      Medium: 'https://dorafactory.medium.com/',
    },
  },
  {
    id: '2-2113',
    name: 'Kabocha',
    slug: 'kabocha',
    token: 'KAB',
    subtitle:
      'Kabocha is a holistic self-evolving grass-roots parachain project, funding and incubating teams to build new public infrastructure.',
    info: 'It is an experiment in crafting new realities through direct participation, collaborative creation and shared values.\n    Its ownership and governance is fair, transparent and decentralised at launch thanks to its genesis in the Edgeware community. \n    The project introduces a Network Public template and novel Store of Values currency and is built with the Substrate framework.',
    links: { Website: 'https://www.kabocha.network/', Twitter: 'https://twitter.com/kabochanetwork' },
  },
  {
    id: '2-2116',
    name: 'Tanganika Network (DHX)',
    slug: 'tanganika',
    token: 'DHX',
    subtitle:
      'DataHighway is a DAO that incentivizes the community to run a sophisticated IoT parachain based on Polkadot using the DHX token.',
    info: "DataHighway's community members will ultimately be incentivized to operate a sophisticated IoT parachain based on Polkadot, where they may stake, govern, \n    mine and otherwise participate using the new DHX token and its associated Decentralized Autonomous Organization (DAO), and Inter-Chain Data Market.",
    links: {
      Website: 'https://www.datahighway.com/',
      Twitter: 'https://twitter.com/DataHighway_DHX',
      Discord: 'https://discord.com/invite/UuZN2tE',
    },
  },
  {
    id: '2-2118',
    name: 'Listen Network',
    slug: 'listen-network',
    token: 'LT',
    subtitle:
      'Listen is a voice social software based on decentralized data storage technology and blockchain technology.',
    info: 'Listen as a voice of social software, it is different with other communication tools, and podcasting software is also different, social support acquaintances, including voice, images, text and video, such as social practices, and social group in a stranger, using a similar round table in the form of BBS, group manager invited several guests, they have speaking right, and join hands to Listen and speak to the rest of the room, at the same time also can use the LT token to buy the speaking time, almost purchases will accumulate in the room below. Listen creates a unique experience that is different from a Feed stream. In a community of strangers, celebrities engage in voice discussions and audience interactions around topics.',
    links: {
      Website: 'https://listen.io/',
      Twitter: 'https://twitter.com/Listen_io',
      Telegram: 'https://t.me/listengroup',
    },
  },
  {
    id: '2-2119',
    name: 'Bajun Network',
    slug: 'bajun',
    token: 'BAJU',
    subtitle:
      'Ajuna is ready to unlock the next level of blockchain gaming. We have the power to enable responsive, immersive, graphically-rich web3 games built with industry-leading development tools.',
    info: 'To get there, we need a Kusama Parachain, and WE NEED YOUR SUPPORT. We’ve launched a Crowdloan campaign to reward everyone who backs Ajuna in the upcoming Kusama Parachain auctions with BAJU — our primary token on Kusama — and other exclusive perks.',
    links: {
      Website: 'https://ajuna.io/',
      Twitter: 'https://twitter.com/AjunaNetwork',
      Telegram: 'https://t.me/ajunanetwork',
      Discord: 'https://discord.com/invite/cE72GYcFgY',
    },
  },
  {
    id: '2-2124',
    name: 'Amplitude',
    slug: 'amplitude',
    token: 'AMPE',
    subtitle: 'Amplitude is going to launch as a canary network of its sister blockchain, Pendulum.',
    info: 'It will act as a testing ground for applications and network parameters for Pendulum. Unlike a traditional testnet, users can interact on the Amplitude chain with real financial consequences. We’re expecting lots of novel concepts to be trialled on Amplitude, giving rise to many exciting opportunities for anyone using the chain.',
    links: {
      Website: 'https://pendulumchain.org/amplitude',
      Twitter: 'https://twitter.com/pendulum_chain',
      Telegram: 'https://t.me/pendulum_community',
      Discord: 'https://discord.gg/wJ2fQh776B',
    },
  },
  {
    id: '2-2125',
    name: 'Tinker',
    slug: 'tinker',
    token: 'TNKR',
    subtitle: 'The IP Asset & Accelerated Development Hub Of Kusama',
    info: 'The Tinkernet Parachain is the canary network of the InvArch Network, designed as the IP Asset & accelerated development staging grounds for the Kusama ecosystem.',
    links: {
      Website: 'https://invarch.network/tinkernet',
      Twitter: 'https://twitter.com/invarchnetwork',
      Telegram: 'https://t.me/InvArch',
      Discord: 'https://discord.com/invite/invarch',
    },
  },
  {
    id: '2-2123',
    name: 'GM Parachain',
    slug: 'gm',
    token: '$FREN',
    subtitle: "$GM OR DIE, UNTIL IT'S TIME TO $GN",
    info: "Burn $FREN to mint and send $GM, but mind the clock on the GMdapp, $GM can only be minted in the morning, $GN can only be minted at night. If you try to mint during the day, you'll burn your $FREN for nothing!",
    links: {
      Website: 'https://www.gmordie.com/',
      Twitter: 'https://twitter.com/GmOrDie_',
      Discord: 'https://discord.com/invite/JFzD2b5P2B',
    },
  },
  {
    id: '2-2241',
    name: 'Krest',
    slug: 'krest',
    token: 'KREST',
    subtitle: "krest is peaq’s canary network - the world's first and only Economy of Things simulation network.",
    info: 'krest is your home for socio-economic, technical, community, and governance innovation and experimentation within the peaq ecosystem. Launch dApps and tools for the Economy of Things and assess their impact in a live environment on a public blockchain network, without running the risk of causing real-world harm.',
    links: {
      Website: 'https://krest.peaq.network/?ref=parachains-info',
      Twitter: 'https://twitter.com/peaqnetwork',
      Discord: 'https://discord.gg/XhJwuFKAAD',
      Github: 'https://github.com/peaqnetwork/peaq-network-node',
    },
  },
  {
    id: '2-2256',
    name: 'Mangata X',
    slug: 'mangata',
    token: '$MGX',
    subtitle: 'Trade crypto without gas, front-running & MEV.',
    info: 'Mangata offers traders and liquidity providers the best platform to access unique tokens and earn rewards. Mangata will offer access to the widest array of Polkadot tokens, better prices for traders by mitigating MEV, and the ability to trade without gas.',
    links: {
      Website: 'https://www.mangata.finance/',
      Twitter: 'https://twitter.com/MangataFinance',
      Discord: 'https://discord.com/invite/X4VTaejebf',
      Github: 'https://github.com/mangata-finance',
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
          value: '> 3',
        },
        {
          title: 'lcDOT per DOT',
          value: '1',
        },
        // this information isn't actionable, so I've clobbered it for now.
        // {
        //   title: 'Referals',
        //   value: '5%',
        // },
      ],
      bonus: {
        short: '5% bonus',
        full: 'Earn 5% ACA',
        info: 'Receive <strong>5% additional ACA</strong> when you contribute via Talisman.',
      },
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2002,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'CLV per DOT',
          value: 'TBD',
        },
        {
          title: 'Crowdloan Allocation',
          value: '200,000,000 CLV',
        },
        {
          title: 'Immediate Release',
          value: '28% of rewarded CLV',
        },
        {
          title: 'Vesting Remainder',
          value: '72%, over 23 months',
        },
      ],
      bonus: {
        short: '',
        full: '',
        info: '',
      },
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2003,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'RING per DOT',
          value: 'TBD',
        },
        {
          title: 'Crowdloan Allocation',
          value: '200,000,000 RING',
        },
        {
          title: 'Total Supply',
          value: '10,000,000,000 RING',
        },
        {
          title: 'Immediate Release',
          value: '10% of rewarded RING',
        },
        {
          title: 'Vesting Remainder',
          value: '90%, vesting linearly',
        },
      ],
      bonus: {
        short: '',
        full: '',
        info: '',
      },
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2004,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'GLMR per DOT',
          value: '> 1',
        },
      ],
      bonus: {
        short: '',
        full: '',
        info: '',
      },
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2006,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'ASTR per DOT',
          value: '> 30',
        },
        {
          title: 'Crowdloan Allocation',
          value: '1,050,000,000 ASTR',
        },
        {
          title: 'Bonus Pool',
          value: '350,000,000 ASTR',
        },
      ],
      bonus: {
        short: '',
        full: '',
        info: '',
      },
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2007,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'KAPEX per DOT',
          value: '> 0.1',
        },
      ],
      bonus: {
        short: '',
        full: '',
        info: '',
      },
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2008,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'CRU per DOT',
          value: '0.2+',
        },
        {
          title: 'Crowdloan Allocation',
          value: '1,000,000 CRU',
        },
      ],
      bonus: {
        short: '',
        full: '',
        info: '',
      },
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2011,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'EQ per DOT',
          value: '200+',
        },
      ],
      bonus: {
        short: '',
        full: '',
        info: '',
      },
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2012,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'PARA per DOT',
          value: '> 50',
        },
        {
          title: 'Crowdloan Allocation',
          value: '1,500,000,000 PARA',
        },
      ],
      bonus: {
        short: '',
        full: '',
        info: '',
      },
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2013,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'LIT per DOT',
          value: '> 2.5',
        },
        {
          title: 'Crowdloan Allocation',
          value: '20,000,000 LIT',
        },
        {
          title: 'Early bonus',
          value: '10% before auction start',
        },
        {
          title: 'Early bonus',
          value: '5% within 7 days of auction start',
        },
      ],
      bonus: {
        short: '',
        full: '',
        info: '',
      },
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2015,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'MANTA per DOT',
          value: '4',
        },
        {
          title: 'Total Supply',
          value: '1,000,000,000 MANTA',
        },
        {
          title: 'Crowdloan Allocation',
          value: '120,000,004 MANTA',
        },
      ],
      bonus: {
        short: '5% bonus',
        full: 'Earn 5% bonus',
        info: '10% before November 11th 2021, 5% bonus before Feb 1st, 2022 + a Manta NFT',
      },
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2017,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'SGB per DOT',
          value: '13',
        },
      ],
      bonus: {
        short: '',
        full: '',
        info: '',
      },
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2019,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'LAYR per DOT',
          value: '0.48+',
        },
      ],
      bonus: {
        short: '',
        full: '',
        info: '',
      },
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2021,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'EFI per DOT',
          value: '> 4',
        },
        {
          title: 'Total Supply',
          value: '2,000,000,000 EFI',
        },
        {
          title: 'Crowdloan Allocation',
          value: '200,000,000 EFI',
        },
      ],
      bonus: {
        short: '',
        full: '',
        info: '',
      },
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2026,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'NODL per DOT',
          value: '20+',
        },
      ],
      bonus: {
        short: '',
        full: '',
        info: '',
      },
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2027,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'CTO per DOT',
          value: '3.75+',
        },
      ],
      bonus: {
        short: '',
        full: '',
        info: '',
      },
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2028,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'ARES per DOT',
          value: 'TBA',
        },
      ],
      bonus: {
        short: '',
        full: '',
        info: '',
      },
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2031,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'CFG per DOT',
          value: '3.28+',
        },
      ],
      bonus: {
        short: '',
        full: '',
        info: '',
      },
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2032,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'INTR per DOT',
          value: '3.46+',
        },
      ],
      bonus: {
        short: '',
        full: '',
        info: '',
      },
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2034,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'HDX per DOT',
          value: '280 and 125',
        },
      ],
      bonus: {
        short: '',
        full: '',
        info: '',
      },
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2035,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'PHA per DOT',
          value: '24',
        },
        {
          title: 'Khala Crowdloan Contributors',
          value: '5% extra reward',
        },
      ],
      bonus: {
        short: '',
        full: '',
        info: '',
      },
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2037,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'UNQ per DOT',
          value: '>5.28',
        },
        {
          title: 'Vesting Schedule',
          value: '20 months, linear vesting',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2038,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'GEM per DOT',
          value: '>10',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2040,
    rewards: {
      tokens: null,
      custom: [],
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2030,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'BNC per DOT',
          value: '>10',
        },
        {
          title: 'Vesting Schedule',
          value: 'linearly each block (96 weeks)',
        },
        {
          title: 'Early Bird Bonus',
          value: '20% 4/22 10am ~ 4/30 10am (UTC)',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2043,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'OTP per DOT',
          value: '20',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2039,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'Supporter rewards',
          value: '2.5 TEER + bonuses',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2093,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'HASH per DOT',
          value: '480 HASH',
        },
        {
          title: 'Crowdloan Cap',
          value: '125,000 DOT',
        },
        {
          title: 'Crowdloan Allocation',
          value: '60m of 1b HASH (6%)',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2097,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'Rewards',
          value: '0.0 TAO',
        },
        {
          title: 'Token Supply',
          value: '21,000,000 TAO',
        },
      ],
      info: 'This crowdloan is following a "self-funded" approach, meaning any contributors to the crowdloan will not receive any TAO rewards. Therefore, we do not recommend contributing to this crowdloan - NFA/DYOR.',
    },
  },
  {
    relayId: 0,
    paraId: 2051,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'AJUN per DOT',
          value: '10+',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 2090,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'OAK per DOT',
          value: '75.5+',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 0,
    paraId: 3340,
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'VARCH per DOT',
          value: '100 VARCH',
        },
        {
          title: 'Crowdloan Cap',
          value: '150,000 DOT',
        },
        {
          title: 'Reward Pool',
          value: '15m of 1b (1.5%)',
        },
      ],
      info: '20% of VARCH rewards will be available to claim immediately. The remaining 80% of VARCH rewards will vest/unlock linearly (every block) over a 96 week period.',
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
    paraId: 2011,
    contributeUrl: '',
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'Total rewards',
          value: '5000 XOR',
        },
        {
          title: 'Used to buy PSWAP',
          value: '2000 XOR',
        },
        {
          title: 'Used to buy VAL',
          value: '2000 XOR',
        },
        {
          title: 'Converted to XSTUSD',
          value: '500 XOR',
        },
        {
          title: '500 XOR',
          value: 'Distributed proportionally',
        },
      ],
      info: '<a href="https://medium.com/sora-xor/the-sora-network-kusama-parachain-auction-5a6fe3a5f35f">Medium article</a> with more info on rewards.',
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
          perKSM: '> 15',
        },
      ],
      custom: [
        {
          title: '> 50 KSM contribution',
          value: '20% Bonus',
        },
        {
          title: '> 100 KSM contribution',
          value: '40% Bonus',
        },
        {
          title: '> 200 KSM contribution',
          value: '60% Bonus',
        },
        {
          title: '> 300 KSM contribution',
          value: '90% Bonus',
        },
        {
          title: '> 500 KSM contribution',
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
          perKSM: '> 10',
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
          perKSM: '> 2000',
        },
      ],
      custom: [
        {
          title: '> 50 KSM contribution',
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
    paraId: 2048,
    contributeUrl: 'https://robonomics.network/kusama-slot',
    rewards: {
      tokens: [
        {
          symbol: 'XRT',
          perKSM: '> 3.5',
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
          perKSM: '> 200',
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
          perKSM: '> 25',
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
  {
    relayId: 2,
    paraId: 2090,
    contributeUrl: 'https://loan.bsx.fi/',
    rewards: {
      tokens: [
        {
          symbol: 'Reward',
          perKSM: '> 67,500 BSK + % HDX',
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
          perKSM: '> 3.75',
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
          perKSM: '> 237',
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
          perKSM: '> 68',
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
  {
    relayId: 2,
    paraId: 2100,
    contributeUrl: 'https://app.subsocial.network/crowdloan',
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'SUB per KSM',
          value: '> 150 SUB',
        },
        {
          title: 'Crowdloan Cap',
          value: '100,000.420 KSM',
        },
        {
          title: 'Total Supply',
          value: '100,000,000 SUB',
        },
        {
          title: 'Crowdloan Allocation',
          value: '16,500,000 SUB',
        },
        {
          title: 'Initial Unlock',
          value: '20%',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2101,
    contributeUrl: 'https://crowdloan.zeitgeist.pm/',
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'ZTG per KSM',
          value: '>80 ZTG',
        },
        {
          title: 'Genesis ZTG Supply',
          value: '100,000,000 ZTG',
        },
        {
          title: 'Crowdloan Allocation',
          value: '12,500,000 ZTG',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2102,
    contributeUrl: '',
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'PCHU per KSM',
          value: '350+',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2105,
    contributeUrl: 'https://crab.network/plo#crowdloan',
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'CRAB Crowdloan Allocation',
          value: '200,000,000 CRAB',
        },
        {
          title: 'CKTON Crowdloan Allocation',
          value: '8,000 CKTON',
        },
      ],
      info: 'If successful, these allocations will be distributed to users according to the number of KSM they supported. After contributing to the Crab crowdloan, there is no need to wait for tokens to finish vesting or getting listed.',
    },
  },
  {
    relayId: 2,
    paraId: 2106,
    contributeUrl: 'https://kusama-crowdloan.litentry.com/',
    rewards: {
      tokens: [
        {
          symbol: 'LIT',
          perKSM: '30 LIT',
        },
      ],
      custom: null,
      info: 'LIT rewards will be distributed linearly in each block. The distribution starts once the Litmus parachain runs on the Kusama relay chain and balance transfer is enabled. Distribution ends when the parachain slot expires (after 48 weeks).',
    },
  },
  {
    relayId: 2,
    paraId: 2107,
    contributeUrl: '',
    rewards: {
      tokens: [
        {
          symbol: 'KICO',
          perKSM: '20,000 KICO',
        },
      ],
      custom: null,
      info: 'After the launch of the main network, 30% of KICO tokens will be released directly, and the remaining will be released linearly over 48 weeks.',
    },
  },
  {
    relayId: 2,
    paraId: 2110,
    contributeUrl: '',
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'Crowdloan Allocation',
          value: '140,000,000 MGX',
        },
        {
          title: 'Distributed Immediately',
          value: '30,000,000 MGX',
        },
      ],
      info: 'After the launch of the main network, ~21% (30M) of MGX tokens will be released directly, and the remaining will be released linearly over 48 weeks.',
    },
  },
  {
    relayId: 2,
    paraId: 2114,
    contributeUrl: '',
    rewards: {
      tokens: null,
      custom: [
        {
          title: 'Crowdloan Allocation',
          value: '160,000,000 TUR',
        },
        {
          title: 'Total Supply',
          value: '1,000,000,000 TUR',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2115,
    contributeUrl: '',
    rewards: {
      tokens: [
        {
          symbol: 'DORA',
          perKSM: '3 DORA',
        },
      ],
      custom: null,
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2113,
    contributeUrl: '',
    rewards: {
      tokens: [
        {
          symbol: 'KAB',
          perKSM: '> 124 KAB',
        },
      ],
      custom: [
        {
          title: 'Crowdloan Allocation',
          value: '3,100,000 KAB',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2116,
    contributeUrl: '',
    rewards: {
      tokens: [
        {
          symbol: 'DHX',
          perKSM: '> 20 DHX',
        },
      ],
      custom: [
        {
          title: 'Crowdloan Allocation',
          value: '300,000 DHX',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2118,
    contributeUrl: '',
    rewards: {
      tokens: [
        {
          symbol: 'LT',
          perKSM: '5000 LT',
        },
      ],
      custom: [
        {
          title: 'Crowdloan Allocation',
          value: '100,000,000 LT',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2119,
    contributeUrl: '',
    rewards: {
      tokens: [
        {
          symbol: 'BAJU',
          perKSM: '> 110 BAJU (Dynamic)',
        },
      ],
      custom: [
        {
          title: 'First 500 Contributions',
          value: '> 5 KSM + 10% Bonus',
        },
        {
          title: 'First 1000 Contributions',
          value: '> 1 KSM + 5% Bonus',
        },
        {
          title: 'NFT Rewards',
          value: '2 Free AAA mints per 1 KSM',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2124,
    contributeUrl: '',
    rewards: {
      tokens: [
        {
          symbol: 'AMPE',
          perKSM: '> 600 AMPE',
        },
      ],
      custom: [
        {
          title: 'Total Supply',
          value: '200,000,000 AMPE',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2125,
    contributeUrl: '',
    rewards: {
      tokens: [
        {
          symbol: 'TNKR',
          perKSM: '87.75 TNKR',
        },
      ],
      custom: [
        {
          title: 'Crowdloan Allocation',
          value: '1,755,000 TNKR',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2123,
    contributeUrl: '',
    rewards: {
      tokens: [
        {
          symbol: '$FREN',
          perKSM: '> 21,693',
        },
      ],
      custom: [
        {
          title: 'Crowdloan Allocation',
          value: '208,000,000 $FREN',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2241,
    contributeUrl:
      'https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkusama-rpc.polkadot.io&ref=parachains-info#/parachains/crowdloan',
    rewards: {
      tokens: [
        {
          symbol: 'KREST',
          perKSM: '800+',
        },
      ],
      custom: [
        {
          title: 'Crowdloan Cap',
          value: '15,000 KSM',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2256,
    contributeUrl: 'https://crowdloan.mangata.finance/',
    rewards: {
      tokens: [
        {
          symbol: 'MGX',
          perKSM: '> 5,000',
        },
      ],
      custom: [
        {
          title: 'Min. contribution',
          value: '1 KSM',
        },
        {
          title: 'Crowdloan Cap',
          value: '6,000 KSM',
        },
      ],
      info: null,
    },
  },
  {
    relayId: 2,
    paraId: 2258,
    contributeUrl: '',
    rewards: {
      tokens: [],
      custom: [
        {
          title: 'Total Supply',
          value: '70,000,000 SDN',
        },
        {
          title: 'Circulating Supply',
          value: '~59,000,000 SDN',
        },
      ],
      info: 'Shiden is already a Kusama Parachain, and are renewing their slot. Crowdloan rewards details are unknown.',
    },
  },
]
