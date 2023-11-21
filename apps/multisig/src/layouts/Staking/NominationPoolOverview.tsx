import { useMemo } from 'react'
import { BondedPool } from '@domains/staking'
import { useNomPoolOf } from '@domains/staking/useNomPool'
import { Button, Identicon, Skeleton } from '@talismn/ui'
import { Chain, useNativeToken } from '@domains/chains'
import { formatUnits } from '@util/numbers'
import { useApi } from '@domains/chains/pjs-api'
import { Nomination, useNominations } from '@domains/staking/useNominations'
import { Address } from '@util/addresses'
import { SettingsInfoRow } from '../Settings/InfoRow'

const Text: React.FC<React.PropsWithChildren<{ loading?: boolean }>> = ({ children, loading }) =>
  loading ? (
    <Skeleton.Surface css={{ height: 22.4, width: 80 }} />
  ) : (
    <p css={({ color }) => ({ color: color.offWhite, fontSize: 16 })}>{children}</p>
  )

const isManager = (role: keyof BondedPool['roles']): boolean => {
  return role === 'root' || role === 'nominator'
}

const NominationPoolOverview: React.FC<{
  address: Address
  chain: Chain
  onEdit: (bondedPool: BondedPool, nominations: Nomination[]) => void
}> = ({ address, chain, onEdit }) => {
  const { api } = useApi(chain.rpcs)
  const { nativeToken } = useNativeToken(chain.nativeToken.id)

  const nomPool = useNomPoolOf(address)
  const { nominations, isReady } = useNominations(chain, nomPool?.pool.stash.toSs58(chain))

  const nomPoolPalletSupported = api ? Boolean(api.query?.nominationPools) : undefined
  const loading = nomPoolPalletSupported === undefined || !nomPool || !nativeToken

  const statementUI = useMemo(() => {
    if (api && !api.query.nominationPools) return <p>Nomination Pool pallet not supported on this network.</p>
    if (!api || nomPool === undefined) return <Skeleton.Surface css={{ height: 22.9, width: 120 }} />
    if (nomPool === null || !isManager(nomPool.role)) return <p>This vault does not control any nomination pool.</p>

    return <p>This vault can nominate on behalf of the Nomination Pool</p>
  }, [api, nomPool])

  return (
    <div css={{ display: 'flex', gap: 32, width: '100%' }}>
      <div css={{ width: '100%', p: { fontSize: 14 } }}>
        <h2 css={({ color }) => ({ color: color.offWhite, fontSize: 20 })}>Nomination Pool</h2>
        {statementUI}
        {!!nomPool && (
          <>
            <div css={{ display: 'flex', alignItems: 'center', gap: 8, margin: '24px 0' }}>
              <Identicon size={32} value={nomPool.pool.stash.toSs58(chain)} />
              <div>
                <p css={({ color }) => ({ color: color.offWhite, fontSize: '16px !important' })}>
                  Pool #{nomPool.pool.id}
                </p>
                <p>{nomPool.pool.metadata ?? nomPool.pool.stash.toShortSs58(chain)}</p>
              </div>
            </div>
            <div>
              {nominations === undefined ? (
                <Skeleton.Surface css={{ height: 20, width: 120 }} />
              ) : nominations.length === 0 ? (
                <p>No validators nominated.</p>
              ) : (
                <p>
                  <span css={({ color }) => ({ color: color.offWhite })}>{nominations.length} validators</span>{' '}
                  nominated.
                </p>
              )}
              {(nomPool.role === 'root' || nomPool.role === 'nominator') && (
                <Button
                  css={{ marginTop: 16, fontSize: 14, padding: '8px 16px' }}
                  disabled={!isReady}
                  loading={!isReady}
                  onClick={() => {
                    if (nominations) onEdit(nomPool.pool, nominations)
                  }}
                >
                  Nominate Validators
                </Button>
              )}
            </div>
          </>
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
