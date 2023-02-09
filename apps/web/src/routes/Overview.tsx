import OwnPools from '@archetypes/NominationPools/OwnPools'
import useAssets, { useAssetsFiltered } from '@archetypes/Portfolio/Assets'
import { Crowdloans } from '@archetypes/Wallet'
import Button from '@components/atoms/Button'
import DisplayValue from '@components/atoms/DisplayValue/DisplayValue'
// import { ArrowRight } from '@components/atoms/Icon'
import Text from '@components/atoms/Text'
import { Search } from '@components/Field'
import HiddenDetails from '@components/molecules/HiddenDetails'
import Asset, { AssetsList, AssetsListLocked } from '@components/recipes/Asset'
import { NFTCard } from '@components/recipes/NFTCard'
import { keyframes } from '@emotion/react'
import { filteredNftDataState } from '@libs/@talisman-nft/provider'
import { NFTShort } from '@libs/@talisman-nft/types'
import { DAPP_NAME, useExtension } from '@libs/talisman'
import { useIsAnyWalletInstalled } from '@libs/talisman/useIsAnyWalletInstalled'
import { WalletSelect } from '@talismn/connect-components'
import getDownloadLink from '@util/getDownloadLink'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }   
`

const WalletConnectionOverview = () => {
  const isAnyWalletInstalled = useIsAnyWalletInstalled()
  const downloadLink = getDownloadLink()
  const { status: extensionStatus } = useExtension()

  if (extensionStatus === 'UNAVAILABLE') {
    return (
      <section
        css={{
          position: 'fixed',
          top: '0',
          right: '0',
          height: '100%',
          width: '100%',
          background:
            'linear-gradient(135deg, rgba(26,26,26,0.5) 0%, rgba(15,15,15,1) 30%, rgba(15,15,15,1) 65%, rgba(15,15,15,0.8) 68%, rgba(26,26,26,0.5) 100%)',
          zIndex: 10,
          animation: `${fadeIn} 0.3s ease-in-out`,
        }}
      >
        <section
          css={{
            display: 'flex',
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            gap: '3rem',
          }}
        >
          {isAnyWalletInstalled ? (
            <>
              <Text.H1 css={{ margin: 0 }}>
                Welcome to the
                <br />
                Talisman Portal
              </Text.H1>
              <Text.H4 css={{ color: '#A5A5A5' }}>Please connect your wallet to view your Portfolio</Text.H4>
              <WalletSelect onlyShowInstalled dappName={DAPP_NAME} triggerComponent={<Button>Connect Wallet</Button>} />
            </>
          ) : (
            <>
              <Text.H1 css={{ margin: 0 }}>
                You need a wallet to
                <br />
                view your portfolio
              </Text.H1>
              <Text.H4 css={{ color: '#A5A5A5' }}>
                To see your portfolio, you need to have a<br />
                browser wallet installed first
              </Text.H4>
              <a href={downloadLink} target="_blank" rel="noopener noreferrer">
                <Button>Install Wallet</Button>
              </a>
            </>
          )}
        </section>
      </section>
    )
  }

  return null
}

const Overview = () => {
  const [search, setSearch] = useState('')
  const { fiatTotal } = useAssets()
  const { tokens, balances, isLoading } = useAssetsFiltered({ size: 8, search })

  const { items, isFetching } = useRecoilValue(filteredNftDataState)

  const nfts = useMemo(() => {
    if (!isFetching && items.length === 0) {
      return Array.from({ length: 4 }).map((_, index) => <NFTCard key={index} isBlank />)
    }
    // if still fetching and the items lenght is less than 4, return the loading cards but only display the remainder of items minus 4

    if (!isFetching && items.length !== 0) {
      return items.slice(0, 4).map((nft: NFTShort) => <NFTCard key={nft.id} nft={nft} />)
    }

    // return Array of size 4 with loading cards
    return Array.from({ length: 2 }).map((_, index) => <NFTCard key={index} loading />)

    // return <></>
  }, [isFetching, items])

  return (
    <>
      <WalletConnectionOverview />
      <div
        css={{
          // grid 1x2
          'gridTemplateColumns': '1fr',
          'display': 'grid',
          'gap': '1em',
          // mobile
          '@media (min-width: 1024px)': {
            gridTemplateColumns: '2.15fr 1fr',
            gap: '2rem 3.2rem',
            marginBottom: '2rem',
          },
        }}
      >
        {/* Assets */}
        <section
          css={{
            'display': 'flex',
            'flexDirection': 'column',
            'gap': '1.8rem',

            // last table
            '> table:last-of-type': {
              'display': 'table',

              '@media (min-width: 1024px)': {
                display: 'none',
                height: '620px',
              },
            },
          }}
        >
          <div
            css={{
              'display': 'flex',
              'flexDirection': 'column',
              'justifyContent': 'space-between',
              'alignItems': 'center',
              '@media (min-width: 1024px)': {
                flexDirection: 'row',
              },
            }}
          >
            {/* Make this into a component */}
            <Text.H3 css={{ margin: 0 }}>
              Assets{' '}
              <span
                css={{
                  color: '#A5A5A5',
                  fontFamily: 'Surt',
                  marginLeft: '1rem',
                }}
              >
                <DisplayValue amount={fiatTotal} />
              </span>
            </Text.H3>
            <Search
              placeholder="Search"
              css={{
                'marginTop': '2rem',
                'width': '100%',
                '@media (min-width: 1024px)': {
                  margin: 0,
                  width: '35%',
                },
              }}
              value={search}
              onChange={setSearch}
            />
          </div>
          <AssetsList isLoading={isLoading}>
            {tokens?.map((token, i) => (
              <Asset key={token?.tokenDetails?.id} token={token} balances={balances} />
            ))}
          </AssetsList>
          <AssetsListLocked isLoading={isLoading}>
            {/* tokens but filtered by locked */}
            {tokens
              ?.filter(token => token.locked)
              ?.map((token, i) => (
                <Asset key={token?.tokenDetails?.id} token={token} balances={balances} lockedAsset />
              ))}
          </AssetsListLocked>
        </section>
        {/* NFTs */}
        <section
          css={{
            'display': 'none',
            // mobile
            '@media (min-width: 1024px)': {
              display: 'flex',
              flexDirection: 'column',
              gap: '4.45rem',
            },
          }}
        >
          {/* 2x2 grid of NFTCards */}
          <div
            css={{
              display: 'flex',
              height: '41px',
              alignItems: 'center',
            }}
          >
            <Text.H3 css={{ margin: 0 }}>NFTs</Text.H3>
          </div>
          <HiddenDetails overlay={<Text.H3>No NFTs Found</Text.H3>} hidden={!isFetching && items.length === 0}>
            <div
              css={{
                'display': 'grid',
                'gridTemplateColumns': '1fr',
                'gap': '2rem',
                // mobile
                '@media (min-width: 1024px)': {
                  gridTemplateColumns: '1fr 1fr',
                },
              }}
            >
              {nfts}
            </div>
          </HiddenDetails>
        </section>
        {tokens.length >= 8 && !isLoading ? (
          <Button variant="secondary" css={{ width: 'fit-content' }} as={Link} to="assets">
            View all assets
          </Button>
        ) : (
          <div />
        )}
        {items.length > 4 ? (
          <Button
            as={Link}
            variant="secondary"
            css={{
              'width': 'fit-content',
              'display': 'none',

              // mobile
              '@media (min-width: 1024px)': {
                display: 'block',
              },
            }}
            to="nfts"
          >
            View all NFTs
          </Button>
        ) : (
          <div />
        )}
      </div>
      <Crowdloans />
      <OwnPools />
    </>
  )
}

export default Overview
