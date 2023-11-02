import { css } from '@emotion/css'
import { useRecoilValue } from 'recoil'
import { activeMultisigsState } from '../../domains/multisig'
import React, { useState } from 'react'
import { Button } from '@talismn/ui'

const Option: React.FC<{ title: string; description: string; selected: boolean; onClick: () => void }> = ({
  title,
  description,
  selected,
  onClick,
}) => (
  <div
    onClick={onClick}
    css={({ color }) => ({
      'display': 'flex',
      'alignItems': 'flex-start',
      'gap': 24,
      'cursor': 'pointer',
      ':hover': {
        '> div:first-child': {
          div: { backgroundColor: color.primary },
        },
      },
    })}
  >
    <div
      css={({ color }) => ({
        padding: 4,
        backgroundColor: selected ? color.primaryContainer : 'rgba(0,0,0,0)',
        borderRadius: '100%',
        transition: 'background-color 0.1s',
      })}
    >
      <div
        css={({ color }) => ({
          width: 12,
          height: 12,
          backgroundColor: selected ? color.primary : 'var(--color-backgroundLighter)',
          borderRadius: '100%',
          transition: 'background-color 0.1s',
        })}
      />
    </div>
    <div css={{ display: 'grid', gap: 8 }}>
      <h4 css={({ color }) => ({ margin: 0, lineHeight: 1, color: color.offWhite, fontSize: 20 })}>{title}</h4>
      <p>{description}</p>
    </div>
  </div>
)

export const AddVault: React.FC = () => {
  const activeMultisigs = useRecoilValue(activeMultisigsState)
  const [create, setCreate] = useState(true)
  return (
    <div
      className={css`
        display: grid;
        background: var(--color-backgroundSecondary);
        border-radius: 24px;
        gap: 48px;
        justify-items: center;
        margin: 50px auto;
        max-width: 863px;
        transition: height 0.3s ease-in-out, margin-top 0.3s ease-in-out, opacity 0.3s ease-in-out;
        width: 100%;
        padding: 80px 16px;
      `}
    >
      <h1 css={{ fontSize: 32, textAlign: 'center', lineHeight: 1 }}>
        Add a Vault{activeMultisigs.length === 0 && ' to get started'}
      </h1>
      <div css={{ display: 'grid', gap: 36, maxWidth: 700 }}>
        <Option
          selected={create}
          title="Create Vault"
          description="Creates a Vault with a Pure Proxy Account controlled by Multisig"
          onClick={() => setCreate(true)}
        />
        <Option
          selected={!create}
          title="Import Vault"
          description="Import a Vault from an existing Proxy Account and Multisig Configuration, support Multisig control via All Proxy types"
          onClick={() => setCreate(false)}
        />
      </div>
      <div css={{ button: { height: 56 } }}>
        <Button>Add Vault</Button>
      </div>
    </div>
  )
}
