import { AugmentedAccount } from 'domain/multisig'

import AddressInput from '@components/AddressInput'
import Slider from '@components/Slider'
import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import { ChevronLeft, ExternalLink, Trash } from '@talismn/icons'
import { Button, IconButton, Identicon } from '@talismn/ui'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import truncateMiddle from 'truncate-middle'

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

const Member = ({ m, onDelete }: { m: AugmentedAccount; onDelete?: () => void }) => {
  const theme = useTheme()

  return (
    <div
      className={css`
        display: flex;
        align-items: center;
        background: ${m.you ? '0' : 'var(--color-backgroundSecondary)'};
        border: 1px solid var(--color-backgroundSecondary);
        border-radius: 8px;
        padding: 16px;
        gap: 8px;
      `}
    >
      <Identicon value={m.address} size={32} />
      <div css={{ display: 'grid', alignItems: 'center' }}>
        <div css={{ display: 'flex' }}>
          {m.nickname ? (
            <span>{m.nickname}</span>
          ) : (
            <span css={{ color: 'var(--color-offWhite)' }}>{truncateMiddle(m.address, 12, 13, '...')}</span>
          )}
          &nbsp;
          {m.you && <span css={{ color: 'var(--color-offWhite)' }}>(You)</span>}
        </div>
        {m.nickname ? <span css={{ fontSize: '12px' }}>{truncateMiddle(m.address, 4, 5, '...')}</span> : null}
      </div>
      <div css={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: '8px' }}>
        {onDelete && (
          <IconButton size={16} contentColor={`rgb(${theme.foreground})`} onClick={onDelete}>
            <Trash size={16} />
          </IconButton>
        )}
        <a href={`https://subscan.io/address/${m.address}`}>
          <IconButton size={16} contentColor={`rgb(${theme.foreground})`} css={{ cursor: 'pointer' }}>
            <ExternalLink size={16} />
          </IconButton>
        </a>
      </div>
    </div>
  )
}

const ManageSignerConfiguration = () => {
  const theme = useTheme()

  // TODO: Fetch these from recoil or whatever
  const vaultName = 'Paraverse Foundation'
  const currentMembers = mockCurrentMembers
  const currentThreshold = mockThreshold

  const [newMembers, setNewMembers] = useState(mockCurrentMembers)
  const [newThreshold, setNewThreshold] = useState(mockThreshold)
  const navigate = useNavigate()

  const membersDiffExists = useMemo(() => {
    return (
      currentMembers.length !== newMembers.length || currentMembers.some((value, index) => value !== newMembers[index])
    )
  }, [currentMembers, newMembers])
  const thresholdDiffExists = newThreshold !== currentThreshold
  const diffExists = membersDiffExists || thresholdDiffExists

  return (
    <div css={{ margin: '32px' }}>
      <Button
        css={{ height: '32px', width: '78px', marginBottom: '56px', padding: '8px' }}
        variant="secondary"
        onClick={() => {
          navigate('/settings')
        }}
      >
        <div css={{ display: 'flex', gap: '4px' }}>
          <IconButton size={16} contentColor={`rgb(${theme.dim})`}>
            <ChevronLeft size={16} />
          </IconButton>
          <span css={{ fontSize: '16px', color: 'var(--color-dim)' }}>Back</span>
        </div>
      </Button>
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
