import { useSingleAsset } from '@archetypes/Portfolio/Assets'
import { AssetBreakdownList } from '@components/recipes/AssetBreakdown/AssetBreakdownList'
import AnimatedFiatNumber from '@components/widgets/AnimatedFiatNumber'
import RedactableBalance from '@components/widgets/RedactableBalance'
import { keyframes } from '@emotion/react'
import { ChevronLeft } from '@talismn/icons'
import { Button, HiddenDetails, InfoCard, Text, Tooltip } from '@talismn/ui'
import { startCase } from 'lodash'
import { useNavigate, useParams } from 'react-router-dom'

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
        <Button variant="secondary" leadingIcon={<ChevronLeft />} onClick={() => navigate(-1)}>
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
                'display': 'grid',
                'gridTemplateColumns': '1fr 1fr',
                'gap': '2rem',
                'width': '100%',

                '> :first-child': {
                  gridColumn: '1 / 3',
                },

                '@media (min-width: 768px)': {
                  'display': 'flex',
                  'flexDirection': 'row',
                  'gap': '2rem',
                  'width': '100%',
                  '> article': {
                    minWidth: '20rem',
                  },
                },
              }}
            >
              <InfoCard
                headlineText="Token"
                text={
                  <div
                    css={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '0.25em',
                      alignItems: 'center',
                    }}
                  >
                    <Tooltip content={startCase(token.tokenDetails.chain?.id ?? token.tokenDetails.coingeckoId)}>
                      <img
                        src={token.tokenDetails.logo}
                        css={{
                          width: '1em',
                          height: '1em',
                        }}
                        alt={token.tokenDetails.chain?.id ?? (token.tokenDetails.coingeckoId ?? '') + ' logo'}
                      />
                    </Tooltip>
                    <Text.Body alpha="high">{token.tokenDetails.tokenDisplayName}</Text.Body>
                    <Text.Body>{`(${token.tokenDetails.symbol ?? ''})`}</Text.Body>
                  </div>
                }
                supportingText={token.rate !== undefined && <AnimatedFiatNumber end={token.rate} />}
              />
              <InfoCard
                headlineText={
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
                text={
                  <RedactableBalance>
                    {token.overallTokenAmount ?? ''} {token.tokenDetails.symbol ?? ''}
                  </RedactableBalance>
                }
                supportingText={<AnimatedFiatNumber end={token.overallFiatAmount ?? 0} />}
              />
              <InfoCard
                headlineText={
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
                text={
                  <RedactableBalance>
                    {token.overallLockedAmount ?? ''} {token.tokenDetails.symbol ?? ''}
                  </RedactableBalance>
                }
                supportingText={<AnimatedFiatNumber end={token.overallLockedFiatAmount ?? 0} />}
              />
              <InfoCard
                headlineText={
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
                text={
                  <RedactableBalance>
                    {token.amount ?? ''} {token.tokenDetails.symbol ?? ''}
                  </RedactableBalance>
                }
                supportingText={<AnimatedFiatNumber end={token.fiatAmount ?? 0} />}
              />
            </div>

            {/* Bottom Section, containing details */}

            {/* Table just containing details of all tables */}
            {/* <AssetBreakdownListHeader /> */}
            <AssetBreakdownList token={token} isLoading={isLoading} balances={balances} />

            {/* Then if any, the ORML tokens */}
            {token.nonNativeTokens.map((ormlToken, index) => {
              return (
                <AssetBreakdownList key={index} token={ormlToken} isLoading={isLoading} balances={balances} isOrml />
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
          'display': 'grid',
          'gridTemplateColumns': '1fr 1fr',
          'gap': '2rem',
          'width': '100%',
          'animation': `${slideDown} 0.5s ease-in-out`,

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
            'display': 'flex',
            'flexDirection': 'row',
            'gap': '2rem',
            'width': '100%',
            '> article': {
              minWidth: '20rem',
            },
          },
        }}
      >
        <InfoCard
          headlineText={<div css={{ padding: '0.75rem' }}>Talisman</div>}
          text={'0.000 TSM'}
          supportingText={'$0.00'}
        />
        <InfoCard
          headlineText={<div css={{ padding: '0.75rem' }}>Talisman</div>}
          text={'0.000 TSM'}
          supportingText={'$0.00'}
        />
        <InfoCard
          headlineText={<div css={{ padding: '0.75rem' }}>Talisman</div>}
          text={'0.000 TSM'}
          supportingText={'🍜'}
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
