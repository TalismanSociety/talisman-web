import StakeableAsset from '@components/recipes/StakableAsset'
import StakeProviderDialog from '@components/recipes/StakeProvidersDialog/StakeProviderDialog'
import Stakes from '@components/widgets/staking/substrate/Stakes'
import { selectedBalancesState } from '@domains/balances'
import { stakeableAssets } from '@domains/staking'
import { SegmentedButton, Surface } from '@talismn/ui'
import BigNumber from 'bignumber.js'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

const StakeableAssetItem = ({
  asset,
  onClick,
}: {
  asset: (typeof stakeableAssets)[number]
  onClick: () => unknown
}) => {
  const balances = useRecoilValue(selectedBalancesState)

  const stakePercentage = useMemo(() => {
    const token = balances.find(x => x.token?.symbol.toLowerCase() === asset.symbol.toLowerCase())

    if (token.sum.planck.total === 0n) {
      return 0
    }

    return BigNumber((token.sum.planck.locked + token.sum.planck.reserved).toString())
      .dividedBy(token.sum.planck.total.toString())
      .toNumber()
  }, [asset.symbol, balances])

  return (
    <StakeableAsset
      symbol={asset.symbol}
      logo={asset.logo}
      chain={asset.chain}
      apr={asset.apr}
      type={asset.providers.length === 1 ? asset.providers[0].type : 'Multiple'}
      provider={asset.chain}
      stakePercentage={stakePercentage}
      stakeButton={<StakeableAsset.StakeButton onClick={onClick} />}
    />
  )
}

const StakeableAssets = () => {
  const navigate = useNavigate()

  const [selectedStakeableAssetIndex, setSelectedStakeableAssetIndex] = useState<number>()
  const selectedStakableAsset = useMemo(
    () => (selectedStakeableAssetIndex === undefined ? undefined : stakeableAssets[selectedStakeableAssetIndex]),
    [selectedStakeableAssetIndex]
  )

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.6rem',
      }}
    >
      {stakeableAssets.map((asset, index) => (
        <StakeableAssetItem key={index} asset={asset} onClick={() => setSelectedStakeableAssetIndex(index)} />
      ))}
      {selectedStakableAsset && (
        <StakeProviderDialog
          title={`${selectedStakableAsset.symbol} staking`}
          onRequestDismiss={() => setSelectedStakeableAssetIndex(undefined)}
        >
          {selectedStakableAsset.providers.map((provider, index) => (
            <StakeProviderDialog.Option
              key={index}
              name={provider.type}
              description={provider.description}
              onSelect={() => {
                setSelectedStakeableAssetIndex(undefined)
                navigate(provider.url)
              }}
            />
          ))}
        </StakeProviderDialog>
      )}
    </div>
  )
}

const Staking = () => {
  const sections = ['stakeable-assets', 'positions'] as const
  const [selectedSection, setSelectedSection] = useState<(typeof sections)[number]>('stakeable-assets')
  return (
    <Surface css={{ borderRadius: '1.6rem', padding: '1.6rem' }}>
      <SegmentedButton value={selectedSection} onChange={setSelectedSection} css={{ marginBottom: '2.4rem' }}>
        <SegmentedButton.ButtonSegment value="stakeable-assets">Stake</SegmentedButton.ButtonSegment>
        <SegmentedButton.ButtonSegment value="positions">My positions</SegmentedButton.ButtonSegment>
      </SegmentedButton>
      {selectedSection === 'positions' ? <Stakes hideHeader /> : <StakeableAssets />}
    </Surface>
  )
}

export default Staking
