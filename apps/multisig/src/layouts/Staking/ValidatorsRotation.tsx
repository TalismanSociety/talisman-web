import { Button, Identicon } from '@talismn/ui'
import { Address, shortenAddress } from '@util/addresses'
import { BondedPool } from '@domains/staking/NomPoolsWatcher'
import { Nomination } from '@domains/staking/useNominations'
import { ChevronLeft, Trash2, X } from '@talismn/icons'
import { useSelectedMultisig } from '@domains/multisig'
import { useMemo, useState } from 'react'
import { Combobox } from '@components/ui/combobox'
import { useRecoilValue } from 'recoil'
import { validatorsState } from '@domains/staking/ValidatorsWatcher'
import { useConsts } from '@domains/chains/ConstsWatcher'
import { useToast } from '@components/ui/use-toast'
import { useNominateTransaction } from '../../domains/staking/useNominateTransaction'
import TransactionSummarySideSheet from '../Overview/Transactions/TransactionSummarySideSheet'
import { ValidatorsRotationSummaryDetails } from './ValidatorsRotationSummaryDetails'
import { useNavigate } from 'react-router-dom'

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
      padding: '12px 8px',
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
      </p>
      {!!subName && subName.length > 0 && (
        <p className="text-gray-200 text-[12px] mt-[4px] whitespace-nowrap overflow-hidden text-ellipsis">
          / {subName}
        </p>
      )}
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
  const navigate = useNavigate()
  const [multisig] = useSelectedMultisig()
  const [deleted, setDeleted] = useState<Record<string, boolean>>({})
  const [added, setAdded] = useState<string[]>([])
  const [reviewing, setReviewing] = useState(false)

  const validators = useRecoilValue(validatorsState)
  const { consts } = useConsts(multisig.chain)
  const { toast } = useToast()

  const deletedNominations = useMemo(() => {
    const deletedAddresses = Object.entries(deleted).filter(([, d]) => d)
    return deletedAddresses.map(([address]) => nominations.find(n => n.address === address)!)
  }, [deleted, nominations])

  const addedNominations = useMemo(() => {
    return added.map(address => validators?.validators[address]!).filter(validator => !!validator)
  }, [added, validators?.validators])

  const selectedValidatorsMap = useMemo(() => {
    return Object.fromEntries([
      ...nominations.map(({ address }) => [address, true]),
      ...added.map(address => [address, true]),
    ])
  }, [added, nominations])

  const newNominations = useMemo(() => {
    let newNominationsAddresses = nominations.map(({ address }) => address)

    Object.entries(deleted)
      .filter(([, isDeleted]) => isDeleted)
      .forEach(([toDelete]) => {
        const removeIndex = newNominationsAddresses.findIndex(address => address === toDelete)
        if (removeIndex > -1) newNominationsAddresses.splice(removeIndex, 1)
      })

    return newNominationsAddresses.concat(added)
  }, [added, deleted, nominations])

  const description = `Nominate Validators from Pool #${pool?.id}`
  const { approveAsMulti, transaction, estimatedFee, ready } = useNominateTransaction(
    address,
    description,
    newNominations,
    pool
  )

  const nothingChanged = deletedNominations.length === 0 && added.length === 0

  const selectedValidatorsCount = nominations.length + addedNominations.length - deletedNominations.length

  const handleReset = () => {
    setDeleted({})
    setAdded([])
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
            {selectedValidatorsCount} Validators Selected
          </div>
        </div>

        {nominations.length > 0 ? (
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
        ) : (
          <p className="mt-[24px] text-[14px]">No nominations yet.</p>
        )}
      </div>

      <div>
        <h4 css={({ color }) => ({ color: color.offWhite, fontSize: 20, margin: 0 })}>Changes</h4>
        <div css={{ display: 'flex', gap: 32, marginTop: 16 }}>
          <div css={{ width: '100%' }}>
            <p className="text-offWhite mb-3">Added Validators</p>
            <Combobox
              maxResult={100}
              placeholder="Select validator to add"
              options={Object.entries(validators?.validators ?? {})
                .filter(([address]) => !selectedValidatorsMap[address])
                .map(([address, { name, subName }]) => ({
                  value: address,
                  label: (
                    <div className="flex items-center gap-4 p-3">
                      <Identicon value={address} size={24} />
                      <div>
                        <p className="text-[14px] whitespace-nowrap overflow-hidden text-ellipsis">
                          {name ?? shortenAddress(address)}
                          {subName !== undefined && subName.length > 0 && (
                            <span className="text-gray-200"> / {subName}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  ),
                  keywords: [address, name ?? '', subName ?? '', `${name} / ${subName}`],
                }))}
              searchPlaceholder="Search by address or name..."
              noResultMessage="No validator found."
              onSelect={address => {
                if (added.includes(address) || selectedValidatorsMap[address] || !consts) return

                if (selectedValidatorsCount >= consts.maxNominations) {
                  return toast({
                    title: `Max nominations ${consts.maxNominations} reached`,
                    description: `Try removing some existing validators.`,
                  })
                }
                setAdded([...added, address])
              }}
            />
            <div
              css={({ color }) => ({
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                marginTop: 8,
                div: { backgroundColor: color.foreground },
              })}
            >
              {addedNominations.length === 0 ? (
                <p css={{ marginTop: 8, fontSize: 14 }}>No validator added.</p>
              ) : (
                addedNominations.map(nomination => (
                  <NominationCard
                    key={nomination.address}
                    {...nomination}
                    onClick={() => {
                      setAdded(added.filter(a => a !== nomination.address))
                    }}
                    icon={<X size={16} />}
                  />
                ))
              )}
            </div>
          </div>
          <div css={{ width: '100%' }}>
            <p css={({ color }) => ({ color: color.offWhite })}>Removed Validators</p>
            <div className="flex flex-col gap-[8px] mt-[8px] [&>div]:bg-gray-800">
              {deletedNominations.length === 0 ? (
                <p css={{ marginTop: 8, fontSize: 14 }}>No validator removed.</p>
              ) : (
                deletedNominations.map(nomination => (
                  <NominationCard
                    key={nomination.address}
                    {...nomination}
                    onClick={() => {
                      if (!consts) return
                      if (selectedValidatorsCount >= consts.maxNominations) {
                        return toast({
                          title: `Max nominations ${consts.maxNominations} reached`,
                          description: `Try de-selecting some added validators.`,
                        })
                      }
                      setDeleted({ ...deleted, [nomination.address]: false })
                    }}
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
        <Button disabled={nothingChanged} onClick={() => setReviewing(true)}>
          Review
        </Button>
      </div>
      <TransactionSummarySideSheet
        canCancel
        cancelButtonTextOverride="Back"
        onApprove={() =>
          new Promise(async (resolve, reject) => {
            if (!transaction) return

            approveAsMulti({
              onSuccess: () => {
                toast({
                  title: 'Transaction Successful!',
                  description: 'Your transaction has been sent and is waiting for approvals from multisig.',
                })
                navigate('/overview')
                resolve()
              },
              onFailure: e => {
                setReviewing(false)
                toast({ title: 'Transaction failed', description: 'Please try again.', variant: 'destructive' })
                console.error(e)
                reject()
              },
              metadata: {
                callData: transaction?.calldata,
                description,
              },
            })
          })
        }
        onCancel={async () => setReviewing(false)}
        onClose={() => setReviewing(false)}
        open={reviewing}
        fee={ready ? estimatedFee : undefined}
        t={transaction}
        transactionDetails={
          <ValidatorsRotationSummaryDetails
            chain={multisig.chain}
            currentNominations={nominations.map(({ address }) => address)}
            newNominations={newNominations}
            poolId={pool?.id}
            hash={transaction?.hash}
            callData={transaction?.calldata}
          />
        }
      />
    </>
  )
}
