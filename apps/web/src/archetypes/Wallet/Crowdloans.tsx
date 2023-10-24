import { Parachain } from '@archetypes'
import { Countdown, ExtensionStatusGate, PanelSection, Pendor } from '@components'
import AccountIcon from '@components/molecules/AccountIcon'
import SectionHeader from '@components/molecules/SectionHeader'
import AnimatedFiatNumber from '@components/widgets/AnimatedFiatNumber'
import RedactableBalance from '@components/widgets/RedactableBalance'
import { WithdrawCrowdloanWidget } from '@components/widgets/WithdrawCrowdloanWidget'
import { accountsState, selectedSubstrateAccountsState } from '@domains/accounts/recoils'
import { chains } from '@domains/chains'
import { tokenPriceState } from '@domains/chains/recoils'
import { useTotalCrowdloanTotalFiatAmount } from '@domains/crowdloans/hooks'
import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import crowdloanDataState from '@libs/@talisman-crowdloans/provider'
import { useCrowdloanContributions, type CrowdloanContribution, type GqlContribution } from '@libs/crowdloans'
import {
  calculateCrowdloanPortfolioAmounts,
  calculateGqlCrowdloanPortfolioAmounts,
  useTaggedAmountsInPortfolio,
} from '@libs/portfolio'
import { useChainmetaValue, useCrowdloanById, useParachainDetailsById } from '@libs/talisman'
import { useCrowdloanReturns, useCrowdloans } from '@libs/talisman/crowdloan'
import { SupportedRelaychains } from '@libs/talisman/util/_config'
import { Clock, Lock } from '@talismn/icons'
import { Chip, ListItem, Text } from '@talismn/ui'
import { encodeAnyAddress, planckToTokens } from '@talismn/util'
import { formatCommas, truncateAddress } from '@util/helpers'
import { Maybe } from '@util/monads'
import BigNumber from 'bignumber.js'
import { Suspense, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'

const GqlCrowdloanItem = styled(
  ({ contribution, className }: { contribution: GqlContribution; className?: string }) => {
    const { t } = useTranslation()
    const theme = useTheme()

    const accounts = useRecoilValue(accountsState)
    const account = useMemo(
      () => accounts.find(account => encodeAnyAddress(account.address) === encodeAnyAddress(contribution.account.id)),
      [accounts, contribution.account]
    )

    const crowdloans = useRecoilValue(crowdloanDataState)

    const paraId = contribution.crowdloan.paraId
    const relayChain = Object.values(SupportedRelaychains).find(
      chain => chain.genesisHash === contribution.relay.genesisHash
    )
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

    const blockNumber = useChainmetaValue(relayChain?.id ?? NaN, 'blockNumber')
    const blockPeriod = useChainmetaValue(relayChain?.id ?? NaN, 'blockPeriod')

    const lockedSeconds = ((contribution.crowdloan.lastBlock ?? 0) - (blockNumber ?? 0)) * (blockPeriod ?? 6)

    const isLocked = (lockedSeconds ?? 0) > 0
    const isUnlockingSoon = (lockedSeconds ?? 0) <= 60 * 60 * 72 // 72 hours

    const isFundsReturned = contribution.returned

    const navigate = useNavigate()
    const goToStaking = useCallback(() => {
      const relayChainId = chains.find(({ genesisHash }) => genesisHash === relayChain?.genesisHash)?.id
      if (relayChainId && account?.address)
        navigate(`/staking?action=stake&chain=${relayChainId}&account=${account.address}&amount=${contributedTokens}`)
    }, [account?.address, contributedTokens, navigate, relayChain?.genesisHash])

    // hide returned contributions which were unlocked more than 30 days ago
    const oldAndReturned = contribution.returned && lockedSeconds < -60 * 60 * 24 * 30
    if (oldAndReturned) return null

    const actions = isLocked ? null : (
      <>
        {isFundsReturned ? (
          <>
            <Chip
              containerColor={`color-mix(in srgb, ${theme.color.primary}, transparent 88%)`}
              contentColor={theme.color.primary}
              onClick={goToStaking}
            >
              {t('Stake')}
            </Chip>
            <div css={{ flexGrow: '1' }} />
            <div css={{ color: 'rgb(90, 90, 90)' }}>{t('Withdrawn')}</div>
          </>
        ) : (
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
              {({ onToggleOpen }) => (
                <Chip
                  containerColor={`color-mix(in srgb, ${theme.color.primary}, transparent 88%)`}
                  contentColor={theme.color.primary}
                  onClick={onToggleOpen}
                >
                  {t('Withdraw & Stake')}
                </Chip>
              )}
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
        )}
      </>
    )

    return (
      <article className={className} css={{ borderRadius: '0.8rem', overflow: 'hidden' }}>
        <Link to={linkToCrowdloan} className={className}>
          <ListItem
            leadingContent={<Parachain.Asset id={parachainId ?? ''} type="logo" size={4} />}
            headlineText={
              name ?? [relayChain?.name, t('Parachain'), parachainId?.split('-')?.[1]].filter(Boolean).join(' ')
            }
            supportingText={
              <>
                <Text.Body css={{ display: 'flex', alignItems: 'center', gap: '0.25em' }}>
                  {account && <AccountIcon account={account} size="1em" />}
                  <Text.Body css={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <div>{account?.name ?? truncateAddress(encodeAnyAddress(contribution.account.id))}</div>
                  </Text.Body>
                </Text.Body>
              </>
            }
            trailingContent={
              <>
                {isLocked && (
                  <div css={{ display: 'flex', alignItems: 'center', marginRight: '3rem' }}>
                    <div
                      css={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5em',
                        padding: '0.4rem 0.6rem',
                        fontSize: '1.2rem',
                        color: isUnlockingSoon ? 'rgb(244, 143, 69)' : 'rgb(165, 165, 165)',
                        backgroundColor: isUnlockingSoon ? 'rgba(244, 143, 69, 0.2)' : 'rgb(47, 47, 47)',
                        borderRadius: '1.2rem',
                      }}
                    >
                      <Clock css={{ width: '1em', height: '1em' }} />{' '}
                      <Countdown seconds={lockedSeconds ?? 0} showSeconds={(lockedSeconds ?? 0) < 60} />
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
            css={{ backgroundColor: theme.color.surface }}
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
              backgroundColor: theme.color.foreground,
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

const CrowdloanItem = styled(
  ({ contribution, className }: { contribution: CrowdloanContribution; className?: string }) => {
    const { t } = useTranslation()
    const theme = useTheme()

    const accounts = useRecoilValue(accountsState)
    const account = useMemo(
      () => accounts.find(account => encodeAnyAddress(account.address) === encodeAnyAddress(contribution.account)),
      [accounts, contribution.account]
    )

    const id = contribution.parachain.paraId

    const crowdloans = useRecoilValue(crowdloanDataState)
    const returns = useCrowdloanReturns()

    const relayChainId = contribution.parachain.paraId.split('-')[0]
    const paraId = contribution.parachain.paraId.split('-')[1]
    const relayChain = Maybe.of(relayChainId).mapOrUndefined(x => SupportedRelaychains[x])
    const chain = crowdloans.find(x => x.id === id)

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
      () => calculateCrowdloanPortfolioAmounts([contribution], relayTokenDecimals, relayTokenPrice),
      [contribution, relayTokenDecimals, relayTokenPrice]
    )

    useTaggedAmountsInPortfolio(portfolioAmounts)

    const { crowdloan } = useCrowdloanById(contribution.id)
    const parachainId = crowdloan?.parachain?.paraId
    const { parachainDetails } = useParachainDetailsById(parachainId)
    const linkToCrowdloan = parachainDetails?.slug ? `/crowdloans/${parachainDetails?.slug}` : `/crowdloans`

    const isLocked = (crowdloan?.lockedSeconds ?? 0) > 0
    const isUnlockingSoon = (crowdloan?.lockedSeconds ?? 0) <= 60 * 60 * 72 // 72 hours

    // TODO: Get from squid (can be included in contributions squid ezpz)
    const isFundsReturned = returns.some(r => r.crowdloanAccount === crowdloan?.stash)

    const navigate = useNavigate()
    const goToStaking = useCallback(() => {
      const relayChainId = chains.find(({ genesisHash }) => genesisHash === relayChain?.genesisHash)?.id
      if (relayChainId && account?.address)
        navigate(`/staking?action=stake&chain=${relayChainId}&account=${account.address}`)
    }, [account?.address, navigate, relayChain?.genesisHash])

    const actions = isLocked ? null : (
      <>
        {isFundsReturned ? (
          <>
            <Chip
              containerColor={`color-mix(in srgb, ${theme.color.primary}, transparent 88%)`}
              contentColor={theme.color.primary}
              onClick={goToStaking}
            >
              {t('Stake')}
            </Chip>
            <div css={{ flexGrow: '1' }} />
            <div css={{ color: 'rgb(90, 90, 90)' }}>{t('Withdrawn')}</div>
          </>
        ) : (
          <>
            <WithdrawCrowdloanWidget
              stakeAfterWithdrawn
              {...{
                account,
                paraId,
                relayChain,
                goToStaking,
                amount: contributedTokens,
              }}
            >
              {({ onToggleOpen }) => (
                <Chip
                  containerColor={`color-mix(in srgb, ${theme.color.primary}, transparent 88%)`}
                  contentColor={theme.color.primary}
                  onClick={onToggleOpen}
                >
                  {t('Withdraw & Stake')}
                </Chip>
              )}
            </WithdrawCrowdloanWidget>
            <WithdrawCrowdloanWidget
              {...{
                account,
                paraId,
                relayChain,
                amount: contributedTokens,
              }}
            >
              {({ onToggleOpen }) => <Chip onClick={onToggleOpen}>{t('Withdraw')}</Chip>}
            </WithdrawCrowdloanWidget>
          </>
        )}
      </>
    )

    return (
      <article className={className} css={{ borderRadius: '0.8rem', overflow: 'hidden' }}>
        <Link to={linkToCrowdloan} className={className}>
          <ListItem
            leadingContent={<Parachain.Asset id={parachainId ?? ''} type="logo" size={4} />}
            headlineText={
              name ?? [relayChain?.name, t('Parachain'), parachainId?.split('-')?.[1]].filter(Boolean).join(' ')
            }
            supportingText={
              <>
                <Text.Body css={{ display: 'flex', alignItems: 'center', gap: '0.25em' }}>
                  {account && <AccountIcon account={account} size="1em" />}
                  <Text.Body css={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {account?.name ?? truncateAddress(encodeAnyAddress(contribution.account))}
                  </Text.Body>
                </Text.Body>
              </>
            }
            trailingContent={
              <>
                {isLocked && (
                  <div css={{ display: 'flex', alignItems: 'center', marginRight: '3rem' }}>
                    <div
                      css={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5em',
                        padding: '0.4rem 0.6rem',
                        fontSize: '1.2rem',
                        color: isUnlockingSoon ? 'rgb(244, 143, 69)' : 'rgb(165, 165, 165)',
                        backgroundColor: isUnlockingSoon ? 'rgba(244, 143, 69, 0.2)' : 'rgb(47, 47, 47)',
                        borderRadius: '1.2rem',
                      }}
                    >
                      <Clock css={{ width: '1em', height: '1em' }} />{' '}
                      <Countdown
                        seconds={crowdloan?.lockedSeconds ?? 0}
                        showSeconds={(crowdloan?.lockedSeconds ?? 0) < 60}
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
            css={{ backgroundColor: theme.color.surface }}
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
              backgroundColor: theme.color.foreground,
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

const ExtensionUnavailable = styled((props: any) => {
  const { t } = useTranslation()
  return (
    <PanelSection comingSoon {...props}>
      <p>{t('extensionUnavailable.subtitle')}</p>
      <p>{t('extensionUnavailable.text')}</p>
    </PanelSection>
  )
})`
  text-align: center;

  > *:not(:last-child) {
    margin-bottom: 2rem;
  }
  > *:last-child {
    margin-bottom: 0;
  }

  > h2 {
    color: var(--color-text);
    font-weight: 600;
    font-size: 1.8rem;
  }
  p {
    color: #999;
    font-size: 1.6rem;
  }
`

const SuspendableCrowdloans = ({ className }: { className?: string }) => {
  const { t } = useTranslation()
  const accounts = useRecoilValue(selectedSubstrateAccountsState)
  // TODO: Get from squid (on-chain contributions are deleted once they've been refunded)
  const {
    contributions: onChainContributions,
    gqlContributions,
    hydrated: contributionsHydrated,
  } = useCrowdloanContributions({
    accounts: useMemo(() => accounts.map(x => x.address), [accounts]),
  })
  const crowdloansUsd = useTotalCrowdloanTotalFiatAmount()

  const { crowdloans } = useCrowdloans()
  const sortedOnChainContributions = useMemo<CrowdloanContribution[]>(() => {
    const crowdloanByParaId = new Map(crowdloans.map(crowdloan => [crowdloan.parachain.paraId, crowdloan]))
    return onChainContributions.slice().sort((a, b) => {
      return (
        (crowdloanByParaId.get(a.parachain.paraId)?.lockedSeconds ?? Number.MAX_SAFE_INTEGER) -
        (crowdloanByParaId.get(b.parachain.paraId)?.lockedSeconds ?? Number.MAX_SAFE_INTEGER)
      )
    })
  }, [crowdloans, onChainContributions])

  const sortedGqlContributions = useMemo(() => {
    return gqlContributions.slice().sort((a, b) => {
      if ((a.crowdloan.lastBlock ?? Number.MAX_SAFE_INTEGER) !== (b.crowdloan.lastBlock ?? Number.MAX_SAFE_INTEGER))
        return (a.crowdloan.lastBlock ?? Number.MAX_SAFE_INTEGER) - (b.crowdloan.lastBlock ?? Number.MAX_SAFE_INTEGER)

      if (a.crowdloan.fundIndex !== b.crowdloan.fundIndex) return a.crowdloan.fundIndex - b.crowdloan.fundIndex

      let aAccountIndex = accounts.findIndex(
        account => encodeAnyAddress(account.address) === encodeAnyAddress(a.account.id)
      )
      if (aAccountIndex === -1) aAccountIndex = Number.MAX_SAFE_INTEGER
      let bAccountIndex = accounts.findIndex(
        account => encodeAnyAddress(account.address) === encodeAnyAddress(b.account.id)
      )
      if (bAccountIndex === -1) bAccountIndex = Number.MAX_SAFE_INTEGER
      if (aAccountIndex !== bAccountIndex) return aAccountIndex - bAccountIndex

      return a.timestamp - b.timestamp
    })
  }, [accounts, gqlContributions])

  const mergedContributions = useMemo(() => {
    const crowdloanByParaId = new Map(crowdloans.map(crowdloan => [crowdloan.parachain.paraId, crowdloan]))

    return [
      ...sortedGqlContributions.map(c => ({ type: 'gql-contribution' as const, contribution: c })),
      ...sortedOnChainContributions
        // only include kusama onchain contributions, polkadot we fetch from a squid
        .filter(c => c.parachain.paraId.startsWith('2-'))
        .map(c => ({ type: 'onchain-contribution' as const, contribution: c })),
    ].sort((a, b) => {
      if (a.type === b.type) return 0

      const aEnd = (() => {
        if (a.type === 'gql-contribution') return a.contribution.crowdloan.lastBlock ?? Number.MAX_SAFE_INTEGER
        return crowdloanByParaId.get(a.contribution.parachain.paraId)?.fundLeaseEndBlock ?? Number.MAX_SAFE_INTEGER
      })()
      const bEnd = (() => {
        if (b.type === 'gql-contribution') return b.contribution.crowdloan.lastBlock ?? Number.MAX_SAFE_INTEGER
        return crowdloanByParaId.get(b.contribution.parachain.paraId)?.fundLeaseEndBlock ?? Number.MAX_SAFE_INTEGER
      })()

      return aEnd - bEnd
    })
  }, [crowdloans, sortedGqlContributions, sortedOnChainContributions])

  // Temporary disable crowdloan skeleton
  if (!contributionsHydrated || mergedContributions.length === 0) {
    return null
  }

  return (
    <section className={className ?? ''} css={{ marginBottom: '2rem' }}>
      <SectionHeader headlineText={t('Crowdloans')} supportingText={<AnimatedFiatNumber end={crowdloansUsd} />} />
      {!contributionsHydrated ? (
        <PanelSection comingSoon>
          <div>{t('Summoning Crowdloan Contributions...')}</div>
          <Pendor />
        </PanelSection>
      ) : mergedContributions.length < 1 ? (
        <PanelSection comingSoon>{t('You have not contributed to any recent Crowdloans')}</PanelSection>
      ) : (
        <ExtensionStatusGate unavailable={<ExtensionUnavailable />}>
          <div css={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
            {mergedContributions.map(({ type, contribution }) =>
              type === 'gql-contribution' ? (
                <GqlCrowdloanItem key={`${contribution.id}`} contribution={contribution} />
              ) : (
                <CrowdloanItem key={`${contribution.id}${contribution.account}`} contribution={contribution} />
              )
            )}
          </div>
        </ExtensionStatusGate>
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
