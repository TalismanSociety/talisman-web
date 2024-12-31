import { keyframes } from '@emotion/react'
import { githubUnknownTokenLogoUrl } from '@talismn/chaindata-provider'
import { Button } from '@talismn/ui/atoms/Button'
import { Text } from '@talismn/ui/atoms/Text'
import { HiddenDetails } from '@talismn/ui/molecules/HiddenDetails'
import { InfoCard } from '@talismn/ui/molecules/InfoCard'
import { ChevronLeft } from '@talismn/web-icons'
import { useNavigate, useParams } from 'react-router-dom'

import { useSingleAsset } from '@/components/legacy/widgets/useAssets'
import { AssetBreakdownList } from '@/components/recipes/AssetBreakdownList'
import { AssetLogoWithChain } from '@/components/recipes/AssetLogoWithChain'
import { AnimatedFiatNumber } from '@/components/widgets/AnimatedFiatNumber'
import { RedactableBalance } from '@/components/widgets/RedactableBalance'

const slideDown = keyframes`
    from {
        opacity: 0;
        transform: translateY(-10%);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`

const AssetItem = () => {
  // Get the assetId from the url
  const navigate = useNavigate()
  const { assetId } = useParams()
  const { token, balances, isLoading } = useSingleAsset({ symbol: assetId })

  return (
    <>
      <div>
        <Button variant="secondary" leadingIcon={<ChevronLeft />} onClick={() => navigate('/portfolio/assets')}>
          Back
        </Button>
      </div>
      {
        // isLoading - Finding Token, most likely a skeleton
        isLoading ? (
          <AssetItemSkeleton />
        ) : // token and !isLoading - Found Token, display token info
        token && !isLoading ? (
          <div
            css={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              width: '100%',
            }}
          >
            {/* Top Section, containing main details */}
            <div
              css={{
                // Display grid but the first item is full width and the second is half width
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '2rem',
                width: '100%',

                '> :first-child': {
                  gridColumn: '1 / 3',
                },

                '@media (min-width: 768px)': {
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '2rem',
                  width: '100%',
                  '> article': {
                    minWidth: '20rem',
                  },
                },
              }}
            >
              <InfoCard
                overlineContent="Token"
                headlineContent={
                  <div
                    css={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '0.25em',
                      alignItems: 'center',
                    }}
                  >
                    <AssetLogoWithChain
                      className="text-[1em] sm:text-[1em]"
                      assetLogoUrl={token.tokenDetails.logo ?? githubUnknownTokenLogoUrl}
                    />
                    <Text.Body>{`${token.tokenDetails.symbol ?? ''}`}</Text.Body>
                  </div>
                }
                supportingContent={token.rate !== undefined && <AnimatedFiatNumber end={token.rate} />}
              />
              <InfoCard
                overlineContent={
                  <div
                    css={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '1rem',
                      alignItems: 'center',
                    }}
                  >
                    <span>Total asset value</span>
                  </div>
                }
                headlineContent={
                  <RedactableBalance>
                    {token.overallTotalAmount ?? ''} {token.tokenDetails.symbol ?? ''}
                  </RedactableBalance>
                }
                supportingContent={<AnimatedFiatNumber end={token.overallTotalFiatAmount ?? 0} />}
              />
              <InfoCard
                overlineContent={
                  <div
                    css={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '1rem',
                      alignItems: 'center',
                    }}
                  >
                    <span>Locked</span>
                  </div>
                }
                headlineContent={
                  <RedactableBalance>
                    {token.overallLockedAmount ?? ''} {token.tokenDetails.symbol ?? ''}
                  </RedactableBalance>
                }
                supportingContent={<AnimatedFiatNumber end={token.overallLockedFiatAmount ?? 0} />}
              />
              <InfoCard
                overlineContent={
                  <div
                    css={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '1rem',
                      alignItems: 'center',
                    }}
                  >
                    <span>Available</span>
                  </div>
                }
                headlineContent={
                  <RedactableBalance>
                    {token.overallTransferableAmount ?? ''} {token.tokenDetails.symbol ?? ''}
                  </RedactableBalance>
                }
                supportingContent={<AnimatedFiatNumber end={token.transferableFiatAmount ?? 0} />}
              />
            </div>

            {/* Bottom Section, containing details */}

            {/* Table just containing details of all tables */}
            {/* <AssetBreakdownListHeader /> */}
            <AssetBreakdownList token={token} isLoading={isLoading} balances={balances} />

            {/* Then if any, the ORML tokens */}
            {token.nonNativeTokens.map((ormlToken, index) => {
              return (
                // @ts-expect-error
                <AssetBreakdownList key={index} token={ormlToken} isLoading={isLoading} balances={balances} />
              )
            })}
          </div>
        ) : (
          // !token and !isLoading - No Token Found, display Empty Token
          <AssetItemSkeleton noToken />
        )
      }
    </>
  )
}

const shimmer = keyframes`
    0% {
        background-position: 100% 0;
    }
    100% {
        background-position: -100% 0;
    }
`

const AssetItemSkeleton = ({ noToken }: { noToken?: boolean }) => {
  return (
    <HiddenDetails overlay={<Text.H2>No Token Found</Text.H2>} hidden={noToken}>
      <div
        css={{
          // Display grid but the first item is full width and the second is half width
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          width: '100%',
          animation: `${slideDown} 0.5s ease-in-out`,

          '> :first-child': {
            gridColumn: '1 / 3',
          },

          '> article': {
            animation: noToken ? '' : `${shimmer} 1s infinite linear`,
            background: noToken ? '' : `linear-gradient(90deg, #1b1b1b 4%, rgb(38, 38, 38) 25%, #1b1b1b 36%)`,
            backgroundSize: '200% 100%',
          },

          '> article > *': {
            color: 'transparent',
          },

          '@media (min-width: 768px)': {
            display: 'flex',
            flexDirection: 'row',
            gap: '2rem',
            width: '100%',
            '> article': {
              minWidth: '20rem',
            },
          },
        }}
      >
        <InfoCard
          overlineContent={<div css={{ padding: '0.75rem' }}>Talisman</div>}
          headlineContent={'0.000 TSM'}
          supportingContent={'$0.00'}
        />
        <InfoCard
          overlineContent={<div css={{ padding: '0.75rem' }}>Talisman</div>}
          headlineContent={'0.000 TSM'}
          supportingContent={'$0.00'}
        />
        <InfoCard
          overlineContent={<div css={{ padding: '0.75rem' }}>Talisman</div>}
          headlineContent={'0.000 TSM'}
          supportingContent={'🍜'}
        />
      </div>
      <div
        css={{
          animation: `${slideDown} 0.5s ease-in-out`,
        }}
      >
        <div
          css={{
            width: '100%',
            height: '15rem',
            borderRadius: '0.5rem',
            animation: noToken ? '' : `${shimmer} 2s infinite linear`,
            background: noToken ? '#1b1b1b' : `linear-gradient(90deg, #1b1b1b 4%, rgb(38, 38, 38) 25%, #1b1b1b 36%)`,
            backgroundSize: '200% 100%',
            marginTop: '6rem',
          }}
        />
        <div
          css={{
            width: '100%',
            height: '15rem',
            borderRadius: '0.5rem',
            animation: noToken ? '' : `${shimmer} 2s infinite linear`,
            background: noToken ? '#1b1b1b' : `linear-gradient(90deg, #1b1b1b 4%, rgb(38, 38, 38) 25%, #1b1b1b 36%)`,
            backgroundSize: '200% 100%',
            marginTop: '2rem',
          }}
        />
      </div>
    </HiddenDetails>
  )
}

export default AssetItem
