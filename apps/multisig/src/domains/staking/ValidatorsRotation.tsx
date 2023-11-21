import { Button, Identicon } from '@talismn/ui'
import { Address, shortenAddress } from '../../util/addresses'
import { BondedPool } from './NomPoolsWatcher'
import { Nomination } from './useNominations'
import { ChevronLeft, Trash2, X } from '@talismn/icons'
import { useSelectedMultisig } from '../multisig'
import { useMemo, useState } from 'react'

const NominationCard: React.FC<Nomination & { onClick: () => void; disabled?: boolean; icon?: React.ReactNode }> = ({
  address,
  name,
  subName,
  onClick,
  disabled,
  icon,
}) => (
  <div
    key={address}
    css={({ color }) => ({
      alignItems: 'center',
      backgroundColor: color.surface,
      borderRadius: 12,
      display: 'flex',
      gap: 8,
      padding: 8,
      svg: { minWidth: 24, width: 24 },
      overflow: 'hidden',
      width: '100%',
      ...(disabled
        ? {
            'cursor': 'not-allowed',
            'svg:last-child': {
              opacity: 0.4,
            },
          }
        : {
            'cursor': 'pointer',
            ':hover': {
              'svg:last-child': {
                color: color.offWhite,
              },
            },
          }),
    })}
    onClick={() => {
      if (!disabled) onClick()
    }}
  >
    <Identicon size={24} value={address} />
    <div css={{ overflow: 'hidden', width: '100%' }}>
      <p
        css={({ color }) => ({
          color: color.offWhite,
          fontSize: 14,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: 1,
        })}
      >
        {name ?? shortenAddress(address)}
        {!!subName && subName.length > 0 && (
          <span css={({ color }) => ({ color: color.lightGrey, fontSize: 12 })}> / {subName}</span>
        )}
      </p>
    </div>
    {icon !== undefined && <div css={{ marginLeft: 'auto' }}>{icon}</div>}
  </div>
)

export const ValidatorsRotation: React.FC<{
  address: Address
  nominations: Nomination[]
  pool?: BondedPool
  onBack: () => void
}> = ({ address, nominations, onBack, pool }) => {
  const [multisig] = useSelectedMultisig()
  const [deleted, setDeleted] = useState<Record<string, boolean>>({})

  const deletedNominations = useMemo(() => {
    const deletedAddresses = Object.entries(deleted).filter(([, d]) => d)
    return deletedAddresses.map(([address]) => nominations.find(n => n.address === address)!)
  }, [deleted, nominations])

  const nothingChanged = deletedNominations.length === 0

  const handleReset = () => {
    setDeleted({})
  }

  return (
    <>
      <div css={{ width: '100%' }}>
        <Button css={{ height: 32, width: 78, padding: 8 }} variant="secondary" onClick={onBack}>
          <div css={{ display: 'flex', gap: '4px' }}>
            <ChevronLeft size={16} />
            <span css={({ color }) => ({ fontSize: 16, color: color.lightGrey })}>Back</span>
          </div>
        </Button>
        <h1 css={{ fontSize: 24, margin: 0, marginTop: 16 }}>Nomination</h1>
      </div>

      <div css={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
        <div css={{ width: '100%' }}>
          <h4 css={({ color }) => ({ color: color.offWhite, fontSize: 20, margin: 0 })}>Nominating from Pool</h4>
          <p css={{ fontSize: 14, marginTop: 8 }}>You are nominating from a pool your Vault controls</p>
        </div>
        <div
          css={({ color }) => ({
            backgroundColor: color.surface,
            padding: 16,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: '100%',
          })}
        >
          <Identicon size={32} value={address.toSs58(multisig.chain)} />
          {pool ? (
            <div>
              <p css={({ color }) => ({ color: color.offWhite })}>Pool #{pool.id}</p>
              <p css={{ fontSize: 14 }}>{pool.metadata ?? address.toShortSs58(multisig.chain)}</p>
            </div>
          ) : (
            <p>{address.toShortSs58(multisig.chain)}</p>
          )}
        </div>
      </div>

      <div css={{ display: 'flex', flexDirection: 'column' }}>
        <div css={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div css={{ width: '100%' }}>
            <h4 css={({ color }) => ({ color: color.offWhite, fontSize: 20, margin: 0 })}>Current Nominations</h4>
            <p css={{ fontSize: 14, marginTop: 8 }}>Your current nominations, add or remove validators below.</p>
          </div>
          <div
            css={({ color }) => ({
              backgroundColor: color.primaryContainer,
              borderRadius: 6,
              color: color.primary,
              fontSize: 14,
              padding: '6px 8px 4px',
              whiteSpace: 'nowrap',
            })}
          >
            {nominations.length - deletedNominations.length} Validators Selected
          </div>
        </div>

        <div css={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 24 }}>
          {nominations.map(nomination => (
            <NominationCard
              key={nomination.address}
              {...nomination}
              disabled={deleted[nomination.address]}
              onClick={() => setDeleted({ ...deleted, [nomination.address]: true })}
              icon={<Trash2 size={16} />}
            />
          ))}
        </div>
      </div>

      <div>
        <h4 css={({ color }) => ({ color: color.offWhite, fontSize: 20, margin: 0 })}>Changes</h4>
        <div css={{ display: 'flex', gap: 32, marginTop: 16 }}>
          <div css={{ width: '100%' }}>
            <p css={({ color }) => ({ color: color.offWhite })}>Added Validators</p>
          </div>
          <div css={{ width: '100%' }}>
            <p css={({ color }) => ({ color: color.offWhite })}>Removed Validators</p>
            <div
              css={({ color }) => ({
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                marginTop: 8,
                div: { backgroundColor: color.foreground },
              })}
            >
              {deletedNominations.length === 0 ? (
                <p css={{ marginTop: 8 }}>No validator removed.</p>
              ) : (
                deletedNominations.map(nomination => (
                  <NominationCard
                    key={nomination.address}
                    {...nomination}
                    onClick={() => setDeleted({ ...deleted, [nomination.address]: false })}
                    icon={<X size={16} />}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div css={{ display: 'flex', gap: 24 }}>
        <Button disabled={nothingChanged} variant="outlined" onClick={handleReset}>
          Reset
        </Button>
        <Button disabled={nothingChanged}>Review</Button>
      </div>
    </>
  )
}
