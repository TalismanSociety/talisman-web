import { css } from '@emotion/css'
import { Eye, Settings, Users } from '@talismn/icons'
import { device } from '@util/breakpoints'

import Assets, { TokenAugmented } from './Assets'
import Footer from './Footer'
import Header from './Header'
import Sidebar from './Sidebar'
import Transactions from './Transactions'

const tokensAugmented: TokenAugmented[] = [
  {
    details: {
      id: 'para',
      coingeckoId: 'para',
      logo: 'https://i.imgur.com/bDMbwM7.png',
      type: 'custom',
      symbol: 'PARA',
      decimals: 18,
      chain: {
        id: 'statemint',
      },
    },
    balance: {
      free: 325206,
      locked: 0,
    },
    price: 2.15,
  },
  {
    details: {
      id: 'polkadot',
      coingeckoId: 'polkadot',
      logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/polkadot.svg',
      type: 'native',
      symbol: 'DOT',
      decimals: 10,
      chain: {
        id: 'polkadot',
      },
    },
    balance: {
      free: 420,
      locked: 0,
    },
    price: 6.128,
  },
  {
    details: {
      id: 'kusama',
      coingeckoId: 'kusama',
      logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/kusama.svg',
      type: 'native',
      symbol: 'KSM',
      decimals: 12,
      chain: {
        id: 'kusama',
      },
    },
    balance: {
      free: 42.69,
      locked: 0,
    },
    price: 400.21,
  },
  {
    details: {
      id: 'ausd',
      coingeckoId: 'ausd',
      logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/tokens/ausd.svg',
      type: 'stablecoin',
      symbol: 'aUSD',
      decimals: 18,
      chain: {
        id: 'acala',
      },
    },
    balance: {
      free: 125000,
      locked: 0,
    },
    price: 1.0,
  },
  {
    details: {
      id: 'acala',
      coingeckoId: 'ausd',
      logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/acala.svg',
      type: 'stablecoin',
      symbol: 'ACA',
      decimals: 18,
      chain: {
        id: 'acala',
      },
    },
    balance: {
      free: 13.88799,
      locked: 42069,
    },
    price: 0.08,
  },
]

const Overview = () => {
  const augmentedTokens: TokenAugmented[] = tokensAugmented
  return (
    <div
      className={css`
        display: grid;
        grid-template-columns: 70px 1fr;
        grid-template-rows: 87px auto auto 84px;
        height: 100%;
        width: 100%;
        gap: 16px;
        padding: 28px 28px 0 28px;
        grid-template-areas:
          'header header'
          'sidebar assets'
          'sidebar transactions'
          'footer footer';
        @media ${device.md} {
          grid-template-columns: 177px 45fr 55fr;
          grid-template-rows: 100px auto 84px;
          grid-template-areas:
            'header header header'
            'sidebar assets transactions'
            'footer footer footer';
        }
        @media ${device.lg} {
          margin: auto;
          max-width: 1600px;
          grid-template-columns: 248px 38fr 62fr;
          grid-template-rows: 100px auto 84px;
          grid-template-areas:
            'header header header'
            'sidebar assets transactions'
            'footer footer footer';
        }
      `}
    >
      <Header />
      <Sidebar
        selected="Overview"
        options={[
          {
            name: 'Overview',
            icon: <Eye />,
            onClick: () => {
              console.log('click')
            },
          },
          {
            name: 'Address book',
            icon: <Users />,
            onClick: () => {
              console.log('click')
            },
          },
          {
            name: 'Settings',
            icon: <Settings />,
            onClick: () => {
              console.log('click')
            },
          },
        ]}
      />
      <Assets augmentedTokens={augmentedTokens} />
      <Transactions />
      <Footer />
    </div>
  )
}

export default Overview
