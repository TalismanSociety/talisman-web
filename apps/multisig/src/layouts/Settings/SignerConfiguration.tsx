import AddressInput from '@components/AddressInput'
import { Member } from '@components/Member'
import Slider from '@components/Slider'
import { selectedMultisigState } from '@domains/multisig'
import { css } from '@emotion/css'
import { Button } from '@talismn/ui'
import { useEffect, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'

import { BackButton } from '.'

const ManageSignerConfiguration = () => {
  const multisig = useRecoilValue(selectedMultisigState)
  const [newMembers, setNewMembers] = useState(multisig.signers)
  const [newThreshold, setNewThreshold] = useState(multisig.threshold)

  useEffect(() => {
    setNewMembers(multisig.signers)
    setNewThreshold(multisig.threshold)
  }, [multisig])

  const membersDiffExists = useMemo(() => {
    return (
      multisig.signers.length !== newMembers.length ||
      multisig.signers.some((value, index) => value !== newMembers[index])
    )
  }, [multisig.signers, newMembers])
  const thresholdDiffExists = newThreshold !== multisig.threshold
  const diffExists = membersDiffExists || thresholdDiffExists

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
              <span>Members of</span>&nbsp;<span css={{ color: 'var(--color-primary)' }}>{multisig.name}</span>
            </div>
            <div css={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '40px' }}>
              {newMembers.map(m => (
                <Member
                  chain={multisig.chain}
                  key={m}
                  m={{ address: m }}
                  onDelete={
                    newMembers.length > 2
                      ? () => {
                          setNewMembers(newMembers.filter(nm => nm !== m))
                        }
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
          <AddressInput
            css={{ marginTop: '24px' }}
            onNewAddress={(a: string) => {
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
            setNewMembers(multisig.signers)
            setNewThreshold(multisig.threshold)
          }}
        >
          Reset
        </Button>
        <Button css={{ maxWidth: '180px' }} disabled={!diffExists}>
          Apply Changes
        </Button>
      </div>
    </div>
  )
}

export default ManageSignerConfiguration
