import { css } from '@emotion/css'
import { useRecoilValue } from 'recoil'
import { activeMultisigsState } from '../../domains/multisig'
import React, { useState } from 'react'
import { Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import { Layout } from '../Layout'
import { CancleOrNext } from './common/CancelOrNext'
import CreateMultisig from './CreateVault'
import { ImportVault } from './ImportVault'
import { cn } from '@util/tailwindcss'

const Option: React.FC<{ title: string; description: string; selected: boolean; onClick: () => void }> = ({
  title,
  description,
  selected,
  onClick,
}) => (
  <div onClick={onClick} className="flex items-start gap-24 cursor-pointer group">
    <div
      className={cn(
        'p-[4ox] rounded-full transition-colors duration-150',
        selected ? 'bg-primary/20' : 'bg-primary/0 group-hover:bg-gray-500/50'
      )}
      css={({ color }) => ({
        padding: 4,
        backgroundColor: selected ? color.primaryContainer : 'rgba(0,0,0,0)',
        borderRadius: '100%',
        transition: 'background-color 0.1s',
      })}
    >
      <div
        className={cn(
          'w-[12px] h-[12px] rounded-full transition-colors duration-150',
          selected ? 'bg-primary' : 'bg-gray-500 group-hover:bg-primary/50'
        )}
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
  const navigate = useNavigate()

  const isNewAccount = activeMultisigs.length === 0

  const handleAddVault = () => {
    navigate(create ? 'create' : 'import')
  }

  return (
    <Layout hideSideBar>
      <Routes>
        <Route
          path="/"
          element={
            <div
              className={css`
                display: grid;
                background: var(--color-backgroundSecondary);
                height: fit-content;
                border-radius: 24px;
                gap: 48px;
                justify-items: center;
                margin: 50px auto;
                max-width: 863px;
                transition: height 0.3s ease-in-out, margin-top 0.3s ease-in-out, opacity 0.3s ease-in-out;
                width: 100%;
                padding: 80px 16px;
                h1 {
                  margin: 0;
                  font-size: 32px;
                  line-height: 1;
                  text-align: center;
                  color: var(--color-offWhite);
                }
              `}
            >
              <Outlet />
            </div>
          }
        >
          <Route
            index
            element={
              <>
                <h1>Add a Vault{isNewAccount && ' to get started'}</h1>
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
                <CancleOrNext
                  cancel={isNewAccount ? undefined : { onClick: () => navigate('/overview') }}
                  next={{
                    children: 'Add Vault',
                    onClick: handleAddVault,
                  }}
                />
              </>
            }
          />

          <Route path="create" element={<CreateMultisig />} />
          <Route path="import" element={<ImportVault />} />
        </Route>
      </Routes>
    </Layout>
  )
}
