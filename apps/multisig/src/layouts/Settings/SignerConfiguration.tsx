import AddressInput from '@components/AddressInput'
import { Member } from '@components/Member'
import Slider from '@components/Slider'
import { AugmentedAccount } from '@domains/multisig'
import { css } from '@emotion/css'
import { Button } from '@talismn/ui'
import { useMemo, useState } from 'react'

import { BackButton } from '.'

const mockCurrentMembers: AugmentedAccount[] = [
  {
    address: '1nmiDTJWNCAUpeaVcRJPbnKAqNhFyVQeFAwbwTR6aSkkhCG',
    you: true,
    nickname: 'My Ledger 1',
  },
  {
    address: '15crUBZ46oZZMeyULKFvCqybQC2HkXJZJcsFhcGN91HqDRuM',
    you: true,
    nickname: 'My Hot Wallet',
  },
  {
    address: '12ud6X3HTfWmV6rYZxiFo6f6QEDc1FF74k91vF76AmCDMT4j',
  },
]

const mockThreshold = 3

const ManageSignerConfiguration = () => {
  // TODO: Fetch these from recoil or whatever
  const vaultName = 'Paraverse Foundation'
  const currentMembers = mockCurrentMembers
  const currentThreshold = mockThreshold

  const [newMembers, setNewMembers] = useState(mockCurrentMembers)
  const [newThreshold, setNewThreshold] = useState(mockThreshold)

  const membersDiffExists = useMemo(() => {
    return (
      currentMembers.length !== newMembers.length || currentMembers.some((value, index) => value !== newMembers[index])
    )
  }, [currentMembers, newMembers])
  const thresholdDiffExists = newThreshold !== currentThreshold
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
              <span>Members of</span>&nbsp;<span css={{ color: 'var(--color-primary)' }}>{vaultName}</span>
            </div>
            <div css={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '40px' }}>
              {newMembers.map(m => (
                <Member
                  key={m.address}
                  m={m}
                  onDelete={
                    newMembers.length > 2
                      ? () => {
                          setNewMembers(newMembers.filter(nm => nm.address !== m.address))
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
              setNewMembers([...newMembers, { address: a }])
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
      {diffExists && (
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
            variant={'outlined'}
            css={{ maxWidth: '180px' }}
            onClick={() => {
              setNewMembers(currentMembers)
              setNewThreshold(currentThreshold)
            }}
          >
            Reset
          </Button>
          <Button css={{ maxWidth: '180px' }}>Apply Changes</Button>
        </div>
      )}
    </div>
  )
}

export default ManageSignerConfiguration
