import AddressInput from '@components/AddressInput'
import { Member } from '@components/Member'
import Slider from '@components/Slider'
import { useApproveAsMulti } from '@domains/chains'
import { pjsApiSelector } from '@domains/chains/pjs-api'
import {
  Transaction,
  TransactionApprovals,
  TransactionType,
  selectedMultisigState,
  useNextTransactionSigner,
} from '@domains/multisig'
import { css } from '@emotion/css'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { Button, FullScreenDialog } from '@talismn/ui'
import { Address, toMultisigAddress } from '@util/addresses'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValueLoadable } from 'recoil'

import { FullScreenDialogContents, FullScreenDialogTitle } from '../../layouts/Overview/Transactions/FullScreenSummary'
import { BackButton } from '.'

const ManageSignerConfiguration = () => {
  const [selectedMultisig] = useRecoilState(selectedMultisigState)
  const [newMembers, setNewMembers] = useState(selectedMultisig.signers)
  const [newThreshold, setNewThreshold] = useState(selectedMultisig.threshold)
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(selectedMultisig.chain.rpc))
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | undefined>()
  const navigate = useNavigate()

  const t: Transaction | undefined = useMemo(() => {
    if (extrinsic) {
      const hash = extrinsic.registry.hash(extrinsic.method.toU8a()).toHex()
      return {
        date: new Date(),
        hash,
        description: 'Change Signer Configuration',
        chain: selectedMultisig.chain,
        approvals: selectedMultisig.signers.reduce((acc, key) => {
          acc[key.encode()] = false
          return acc
        }, {} as TransactionApprovals),
        decoded: {
          type: TransactionType.ChangeConfig,
          recipients: [],
          changeConfigDetails: {
            signers: newMembers,
            threshold: newThreshold,
          },
        },
        callData: extrinsic.method.toHex(),
      }
    }
  }, [selectedMultisig, extrinsic, newMembers, newThreshold])
  const signer = useNextTransactionSigner(t?.approvals)
  const hash = extrinsic?.registry.hash(extrinsic.method.toU8a()).toHex()

  const { approveAsMulti, estimatedFee, ready: approveAsMultiReady } = useApproveAsMulti(signer?.address, hash, null)

  useEffect(() => {
    setNewMembers(selectedMultisig.signers)
    setNewThreshold(selectedMultisig.threshold)
  }, [selectedMultisig])

  const membersDiffExists = useMemo(() => {
    return (
      selectedMultisig.signers.length !== newMembers.length ||
      selectedMultisig.signers.some((value, index) => value !== newMembers[index])
    )
  }, [selectedMultisig.signers, newMembers])
  const thresholdDiffExists = newThreshold !== selectedMultisig.threshold
  const diffExists = membersDiffExists || thresholdDiffExists
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)

  return (
    <div css={{ margin: '32px' }}>
      <BackButton />
      <div
        css={{
          display: 'flex',
          gap: '64px',
          paddingBottom: '32px',
          flexWrap: 'wrap',
        }}
      >
        <div
          className={css`
            display: grid;
            flex: 1;
          `}
        >
          <div css={{ display: 'grid', gap: '16px' }}>
            <h2 css={{ color: 'var(--color-offWhite)' }}>Vault Members</h2>
            <div css={{ display: 'flex' }}>
              <span>Members of</span>&nbsp;<span css={{ color: 'var(--color-primary)' }}>{selectedMultisig.name}</span>
            </div>
            <div css={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '40px' }}>
              {newMembers.map(m => (
                <Member
                  chain={selectedMultisig.chain}
                  key={m.encode()}
                  m={{ address: m }}
                  onDelete={
                    newMembers.length > 2
                      ? () => {
                          setNewMembers(newMembers.filter(nm => !nm.isEqual(m)))
                        }
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
          <AddressInput
            css={{ marginTop: '24px' }}
            onNewAddress={(a: Address) => {
              setNewMembers([...newMembers, a])
            }}
          />
        </div>
        <div
          className={css`
            flex: 1;
            min-width: 300px;
          `}
        >
          <div css={{ display: 'grid', gap: '16px' }}>
            <h2 css={{ color: 'var(--color-offWhite)' }}>Vault Threshold</h2>
            <div css={{ display: 'flex', marginBottom: '48px' }}>
              <span>Approvals required to execute a transaction</span>&nbsp;
            </div>
            <Slider
              value={newThreshold}
              min={2}
              max={newMembers.length}
              step={1}
              onChange={t => {
                if (typeof t === 'number' && t > 1) {
                  setNewThreshold(t)
                }
              }}
              leftLabel="Less Secure"
              rightLabel="More Secure"
            />
            <div
              className={css`
                display: flex;
                justify-content: center;
                margin-bottom: 17px;
              `}
            >
              <h2
                className={css`
                  color: var(--color-primary);
                `}
              >
                {newThreshold}&nbsp;
              </h2>
              <h2
                className={css`
                  color: var(--color-dim);
                `}
              >{`/ ${newMembers.length}`}</h2>
            </div>
          </div>
        </div>
      </div>
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          marginTop: '32px',
          gap: '24px',
        }}
      >
        <Button
          disabled={!diffExists}
          variant={'outlined'}
          css={{ maxWidth: '180px' }}
          onClick={() => {
            setExtrinsic(undefined)
            setNewMembers(selectedMultisig.signers)
            setNewThreshold(selectedMultisig.threshold)
          }}
        >
          Reset
        </Button>
        <Button
          css={{ maxWidth: '180px' }}
          disabled={!diffExists || apiLoadable.state !== 'hasValue'}
          onClick={() => {
            if (apiLoadable.state !== 'hasValue') return
            const api = apiLoadable.contents
            if (
              !api.tx.proxy?.addProxy ||
              !api.tx.proxy.removeProxy ||
              !api.tx.proxy.proxy ||
              !api.tx.utility?.batchAll
            ) {
              throw Error('chain doesnt have proxy or utility pallet')
            }
            const newMultisigAddress = toMultisigAddress(newMembers, newThreshold)
            const batchCall = api.tx.utility.batchAll([
              api.tx.proxy.addProxy(newMultisigAddress.bytes, 'Any', 0),
              api.tx.proxy.removeProxy(selectedMultisig.multisigAddress.bytes, 'Any', 0),
            ])
            const proxyCall = api.tx.proxy.proxy(selectedMultisig.proxyAddress.bytes, undefined, batchCall)
            setExtrinsic(proxyCall)
            setConfirmationDialogOpen(true)
          }}
        >
          Apply Changes
        </Button>
      </div>
      <FullScreenDialog
        onRequestDismiss={() => {
          setConfirmationDialogOpen(false)
        }}
        onClose={() => {
          setConfirmationDialogOpen(false)
        }}
        title={<FullScreenDialogTitle t={t} />}
        css={{
          header: {
            margin: '32px 48px',
          },
          height: '100vh',
          background: 'var(--color-grey800)',
          maxWidth: '781px',
          minWidth: '700px',
          width: '100%',
          padding: '0 !important',
        }}
        open={confirmationDialogOpen}
      >
        <FullScreenDialogContents
          t={t}
          fee={approveAsMultiReady ? estimatedFee : undefined}
          canCancel={true}
          cancelButtonTextOverride="Back"
          onApprove={() =>
            new Promise((resolve, reject) => {
              if (!hash || !extrinsic || !t) {
                toast.error("Couldn't get hash or extrinsic or tx")
                return
              }
              approveAsMulti({
                metadata: {
                  description: t.description,
                  callData: extrinsic.method.toHex(),
                  changeConfigDetails: {
                    newMembers,
                    newThreshold,
                  },
                },
                onSuccess: () => {
                  navigate('/overview')
                  toast.success('Approved.', { duration: 5000, position: 'bottom-right' })
                  resolve()
                },
                onFailure: e => {
                  navigate('/overview')
                  toast.error('Transaction failed')
                  console.error(e)
                  reject()
                },
              })
            })
          }
          onCancel={() => {
            setConfirmationDialogOpen(false)
            return Promise.resolve()
          }}
        />
      </FullScreenDialog>
    </div>
  )
}

export default ManageSignerConfiguration
