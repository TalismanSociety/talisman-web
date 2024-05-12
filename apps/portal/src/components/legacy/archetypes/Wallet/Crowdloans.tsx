import { Parachain } from '..'
import { Countdown, PanelSection, Pendor } from '../..'
import AccountIcon from '../../../molecules/AccountIcon'
import SectionHeader from '../../../molecules/SectionHeader'
import AnimatedFiatNumber from '../../../widgets/AnimatedFiatNumber'
import RedactableBalance from '../../../widgets/RedactableBalance'
import { WithdrawCrowdloanWidget } from '../../../widgets/WithdrawCrowdloanWidget'
import { selectedSubstrateAccountsState, substrateAccountsState } from '../../../../domains/accounts/recoils'
import { chainsState, tokenPriceState } from '../../../../domains/chains/recoils'
import { useTotalCrowdloanTotalFiatAmount } from '../../../../domains/crowdloans/hooks'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import crowdloanDataState from '../../../../libs/@talisman-crowdloans/provider'
import { useCrowdloanContributions, type GqlContribution } from '../../../../libs/crowdloans'
import { calculateGqlCrowdloanPortfolioAmounts, useTaggedAmountsInPortfolio } from '../../../../libs/portfolio'
import { useParachainDetailsById } from '../../../../libs/talisman'
import { supportedRelayChainsState } from '../../../../libs/talisman/util/_config'
import { Chip, ListItem, Skeleton, Text, TonalChip, useSurfaceColor, type SkeletonProps } from '@talismn/ui'
import { encodeAnyAddress, planckToTokens } from '@talismn/util'
import { Clock, Eye, Lock } from '@talismn/web-icons'
import { formatCommas, truncateAddress } from '../../../../util/helpers'
import BigNumber from 'bignumber.js'
import { Suspense, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'

const GqlCrowdloanItem = styled(
  ({ contribution, className }: { contribution: GqlContribution; className?: string }) => {
    const { t } = useTranslation()
    const surfaceColor = useSurfaceColor()

    const accounts = useRecoilValue(substrateAccountsState)
    const account = useMemo(
      () => accounts.find(account => encodeAnyAddress(account.address) === encodeAnyAddress(contribution.account.id)),
      [accounts, contribution.account]
    )

    const crowdloans = useRecoilValue(crowdloanDataState)

    const paraId = contribution.crowdloan.paraId
    const relayChains = useRecoilValue(supportedRelayChainsState)
    const relayChain = relayChains.find(chain => chain.genesisHash === contribution.relay.genesisHash)
    const chain = crowdloans.find(x => x.id === `${relayChain?.id ?? NaN}-${paraId}`)

    const { tokenSymbol: relayNativeToken, coingeckoId, tokenDecimals: relayTokenDecimals } = relayChain ?? {}
    const { name } = chain ?? {}

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const priceLoadable = useRecoilValueLoadable(tokenPriceState({ coingeckoId: coingeckoId! }))

    const relayTokenPrice = priceLoadable.valueMaybe()?.toString()
    const relayPriceLoading = priceLoadable.state === 'loading'

    const relayTokenSymbol = relayNativeToken ?? 'Planck'
    const contributedTokens = planckToTokens(contribution.amount, relayTokenDecimals ?? 0)
    const contributedUsd = new BigNumber(contributedTokens).times(relayTokenPrice ?? 0).toString()

    const portfolioAmounts = useMemo(
      () => calculateGqlCrowdloanPortfolioAmounts([contribution], relayTokenDecimals, relayTokenPrice),
      [contribution, relayTokenDecimals, relayTokenPrice]
    )

    useTaggedAmountsInPortfolio(portfolioAmounts)

    const parachainId = `${relayChain?.id ?? NaN}-${paraId}`
    const { parachainDetails } = useParachainDetailsById(parachainId)
    const linkToCrowdloan = parachainDetails?.slug ? `/crowdloans/${parachainDetails?.slug}` : `/crowdloans`

    const navigate = useNavigate()
    const chains = useRecoilValue(chainsState)
    const goToStaking = useCallback(() => {
      const relayChainId = chains.find(({ genesisHash }) => genesisHash === relayChain?.genesisHash)?.id
      if (relayChainId && account?.address)
        navigate(`/staking?action=stake&chain=${relayChainId}&account=${account.address}&amount=${contributedTokens}`)
    }, [account?.address, chains, contributedTokens, navigate, relayChain?.genesisHash])

    // hide returned contributions which were unlocked more than 30 days ago
    if (contribution.blockNumber === null || contribution.oldAndReturned) return null

    const actions = (() => {
      if (contribution.isLocked) return null
      if (account?.readonly)
        return (
          <>
            <div
              css={css`
                display: flex;
                align-items: center;
                gap: 0.5em;
                color: color-mix(in srgb, #fafafa, transparent 30%);
              `}
            >
              <Eye size="1em" />
              <div>{t('Followed account')}</div>
            </div>
            <div css={{ flexGrow: '1' }} />
            {contribution.isFundsReturned && <div css={{ color: 'rgb(90, 90, 90)' }}>{t('Withdrawn')}</div>}
          </>
        )

      if (contribution.isFundsReturned)
        return (
          <>
            <TonalChip onClick={goToStaking}>{t('Stake')}</TonalChip>
            <div css={{ flexGrow: '1' }} />
            <div css={{ color: 'rgb(90, 90, 90)' }}>{t('Withdrawn')}</div>
          </>
        )

      return (
        <>
          <WithdrawCrowdloanWidget
            stakeAfterWithdrawn
            {...{
              account,
              paraId: paraId.toString(),
              relayChain,
              goToStaking,
              amount: contributedTokens,
            }}
          >
            {({ onToggleOpen }) => <TonalChip onClick={onToggleOpen}>{t('Withdraw & Stake')}</TonalChip>}
          </WithdrawCrowdloanWidget>
          <WithdrawCrowdloanWidget
            {...{
              account,
              paraId: paraId.toString(),
              relayChain,
              amount: contributedTokens,
            }}
          >
            {({ onToggleOpen }) => <Chip onClick={onToggleOpen}>{t('Withdraw')}</Chip>}
          </WithdrawCrowdloanWidget>
        </>
      )
    })()

    return (
      <article className={className} css={{ borderRadius: '0.8rem', overflow: 'hidden' }}>
        <Link to={linkToCrowdloan} className={className}>
          <ListItem
            leadingContent={<Parachain.Asset id={parachainId ?? ''} type="logo" size={4} />}
            headlineContent={
              name ?? [relayChain?.name, t('Parachain'), parachainId?.split('-')?.[1]].filter(Boolean).join(' ')
            }
            supportingContent={
              <>
                <Text.Body css={{ display: 'flex', alignItems: 'center', gap: '0.25em' }}>
                  {account && <AccountIcon account={account} size="1em" />}
                  <Text.Body css={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <div>
                      {account?.name ??
                        truncateAddress(encodeAnyAddress(contribution.account.id, relayChain?.accountPrefix ?? 42))}
                    </div>
                  </Text.Body>
                </Text.Body>
              </>
            }
            trailingContent={
              <>
                {contribution.isLocked && (
                  <div css={{ display: 'flex', alignItems: 'center', marginRight: '3rem' }}>
                    <div
                      css={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5em',
                        padding: '0.4rem 0.6rem',
                        fontSize: '1.2rem',
                        color: contribution.isUnlockingSoon ? 'rgb(244, 143, 69)' : 'rgb(165, 165, 165)',
                        backgroundColor: contribution.isUnlockingSoon ? 'rgba(244, 143, 69, 0.2)' : 'rgb(47, 47, 47)',
                        borderRadius: '1.2rem',
                      }}
                    >
                      <Clock css={{ width: '1em', height: '1em' }} />{' '}
                      <Countdown
                        seconds={contribution.lockedSeconds ?? 0}
                        showSeconds={(contribution.lockedSeconds ?? 0) < 60}
                      />
                    </div>
                  </div>
                )}
                <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Text.BodyLarge as="div" css={{ fontWeight: 'bold' }}>
                    <RedactableBalance>
                      {contributedTokens && formatCommas(Number(contributedTokens))} {relayTokenSymbol}
                    </RedactableBalance>{' '}
                    <Lock size="1em" />
                  </Text.BodyLarge>
                  <Text.BodyLarge as="div">
                    <Pendor prefix={!contributedUsd && '-'} require={!relayPriceLoading}>
                      <RedactableBalance>
                        {contributedUsd && <AnimatedFiatNumber end={Number(contributedUsd)} />}
                      </RedactableBalance>
                    </Pendor>
                  </Text.BodyLarge>
                </div>
              </>
            }
            css={{ backgroundColor: surfaceColor }}
          />
        </Link>
        <div
          css={[
            {
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
              padding: '0.8rem 1.6rem',
              backgroundColor: surfaceColor,
              fontSize: '1.2rem',
            },
            !actions && { display: 'none' },
          ]}
        >
          {actions}
        </div>
      </article>
    )
  }
)``

const GqlCrowdloanItemSkeleton = (props: SkeletonProps) => {
  const surfaceColor = useSurfaceColor()
  return (
    <Skeleton.Surface
      {...props}
      animate={props.animate}
      css={{
        borderRadius: '0.8rem',
        backgroundColor: surfaceColor,
      }}
    >
      <ListItem
        leadingContent={<Skeleton.Foreground css={{ width: '4rem', height: '4rem', borderRadius: '2rem' }} />}
        headlineContent={
          <Text.Body>
            <Skeleton.Foreground css={{ height: '0.75em', marginBottom: '0.25em', width: 80 }} />
          </Text.Body>
        }
        supportingContent={
          <Text.Body>
            <Skeleton.Foreground css={{ height: '0.75em', width: 'min(100%, 24rem)' }} />
          </Text.Body>
        }
        trailingContent={
          <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Text.BodyLarge as="div" css={{ fontWeight: 'bold' }}>
              <Skeleton.Foreground css={{ height: '0.75em', marginBottom: '0.25em', width: 80 }} />
            </Text.BodyLarge>
            <Skeleton.Foreground css={{ height: '0.75em', width: 60 }} />
          </div>
        }
      />
    </Skeleton.Surface>
  )
}

const SuspendableCrowdloans = ({ className }: { className?: string }) => {
  const { t } = useTranslation()
  const accounts = useRecoilValue(selectedSubstrateAccountsState)
  const { sortedGqlContributions, hydrated: contributionsHydrated } = useCrowdloanContributions(
    useMemo(() => accounts.map(x => x.address), [accounts])
  )
  const crowdloansUsd = useTotalCrowdloanTotalFiatAmount()

  return (
    <section className={className ?? ''} css={{ marginBottom: '2rem' }}>
      <SectionHeader headlineContent={t('Crowdloans')} supportingContent={<AnimatedFiatNumber end={crowdloansUsd} />} />
      {!contributionsHydrated ? (
        <GqlCrowdloanItemSkeleton />
      ) : sortedGqlContributions.length < 1 ? (
        <PanelSection comingSoon>{t('You have not contributed to any recent crowdloans')}</PanelSection>
      ) : (
        <div css={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
          {sortedGqlContributions.map(contribution => (
            <GqlCrowdloanItem key={`${contribution.id}`} contribution={contribution} />
          ))}
        </div>
      )}
    </section>
  )
}

export const Crowdloans = ({ className }: { className?: string }) => (
  <Suspense>
    <SuspendableCrowdloans className={className} />
  </Suspense>
)

export default Crowdloans
