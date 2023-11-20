import { useSelectedMultisig } from '../../domains/multisig'
import { SettingsInfoRow } from '../Settings/InfoRow'
import { BondedPool } from '../../domains/staking'
import { useNomPoolOf } from '../../domains/staking/useNomPool'
import { useMemo } from 'react'
import { Identicon, Skeleton } from '@talismn/ui'
import { useNativeToken } from '../../domains/chains'
import { formatUnits } from '../../util/numbers'
import { useApi } from '../../domains/chains/pjs-api'

const Text: React.FC<React.PropsWithChildren<{ loading?: boolean }>> = ({ children, loading }) =>
  loading ? (
    <Skeleton.Surface css={{ height: 22.4, width: 80 }} />
  ) : (
    <p css={({ color }) => ({ color: color.offWhite, fontSize: 16 })}>{children}</p>
  )

const isManager = (role: keyof BondedPool['roles']): boolean => {
  return role === 'root' || role === 'nominator'
}
const NominationPoolOverview: React.FC = () => {
  const [multisig] = useSelectedMultisig()
  const nomPool = useNomPoolOf(multisig.proxyAddress)
  const { nativeToken } = useNativeToken(multisig.chain.nativeToken.id)
  const { api, loading: apiLoading } = useApi(multisig.chain.rpcs)

  const nomPoolPalletSupported = api ? Boolean(api.query?.nominationPools) : undefined

  const statementUI = useMemo(() => {
    if (!api && !apiLoading) return <p>Nomination Pool pallet not supported on this network.</p>
    if (nomPool === undefined) return <Skeleton.Surface css={{ height: 22.9, width: 120 }} />
    if (nomPool === null || !isManager(nomPool.role)) return <p>This vault does not control any nomination pool.</p>

    return <p>This vault can nominate on behalf of the Nomination Pool</p>
  }, [api, apiLoading, nomPool])

  const loading = nomPoolPalletSupported === undefined || !nomPool || !nativeToken

  return (
    <div css={{ display: 'flex', gap: 32, width: '100%' }}>
      <div css={{ width: '100%', p: { fontSize: 14 } }}>
        <h2 css={({ color }) => ({ color: color.offWhite, fontSize: 20 })}>Nomination Pool</h2>
        {statementUI}
        {!!nomPool && (
          <div css={{ display: 'flex', alignItems: 'center', gap: 8, margin: '24px 0' }}>
            <Identicon size={32} value={nomPool.pool.stash.toSs58(multisig.chain)} />
            <div>
              <p css={({ color }) => ({ color: color.offWhite, fontSize: '16px !important' })}>
                Pool #{nomPool.pool.id}
              </p>
              <p>{nomPool.pool.metadata ?? nomPool.pool.stash.toShortSs58(multisig.chain)}</p>
            </div>
          </div>
        )}
      </div>
      {nomPool === null ? null : (
        <div css={{ display: 'flex', gap: 24, flexDirection: 'column', width: '100%' }}>
          <SettingsInfoRow label="Total Bonded Amount">
            <Text loading={loading}>
              {nomPool && nativeToken
                ? `${(+formatUnits(nomPool.pool.points, nativeToken?.decimals)).toFixed(4)} ${nativeToken.symbol}`
                : ''}
            </Text>
          </SettingsInfoRow>
          <SettingsInfoRow label="Members">
            <Text loading={loading}>{nomPool?.pool.memberCounter.toLocaleString()}</Text>
          </SettingsInfoRow>
          <SettingsInfoRow label="State">
            <Text loading={loading}>{nomPool?.pool.state}</Text>
          </SettingsInfoRow>
        </div>
      )}
    </div>
  )
}

export default NominationPoolOverview
