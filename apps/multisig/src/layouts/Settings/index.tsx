import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import { ChevronLeft, Eye, Settings as SettingsIcon } from '@talismn/icons'
import { Button, IconButton } from '@talismn/ui'
import { device } from '@util/breakpoints'
import { Route, Routes, useNavigate } from 'react-router-dom'

import Footer from '../Overview/Footer'
import Header from '../Overview/Header'
import Sidebar from '../Overview/Sidebar'
import ManageChains from './ManageChains'
import SettingsList from './SettingsList'
import ManageSignerConfiguration from './SignerConfiguration'

export const BackButton = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  return (
    <Button
      css={{ height: '32px', width: '78px', marginBottom: '56px', padding: '8px' }}
      variant="secondary"
      onClick={() => {
        navigate('/settings')
      }}
    >
      <div css={{ display: 'flex', gap: '4px' }}>
        <IconButton as={'div'} size={16} contentColor={`rgb(${theme.dim})`}>
          <ChevronLeft size={16} />
        </IconButton>
        <span css={{ fontSize: '16px', color: 'var(--color-dim)' }}>Back</span>
      </div>
    </Button>
  )
}

const Settings = () => {
  const navigate = useNavigate()
  return (
    <div
      className={css`
        display: grid;
        grid-template-columns: 70px 1fr;
        grid-template-rows: 84px auto auto 84px;
        height: 100%;
        width: 100%;
        gap: 16px;
        padding: 28px 28px 0 28px;
        grid-template-areas:
          'header header'
          'sidebar settings'
          'sidebar settings'
          'footer footer';
        @media ${device.md} {
          grid-template-columns: 177px 45fr 55fr;
          grid-template-rows: 84px auto 84px;
          grid-template-areas:
            'header header header'
            'sidebar settings settings'
            'footer footer footer';
        }
        @media ${device.lg} {
          margin: auto;
          max-width: 1600px;
          grid-template-columns: 248px 38fr 62fr;
          grid-template-rows: 84px auto 84px;
          grid-template-areas:
            'header header header'
            'sidebar settings settings'
            'footer footer footer';
        }
      `}
    >
      <Header />
      <Sidebar
        selected="Settings"
        options={[
          {
            name: 'Overview',
            icon: <Eye />,
            onClick: () => {
              navigate('/overview')
            },
          },
          {
            name: 'Settings',
            icon: <SettingsIcon />,
            onClick: () => {
              navigate('/settings')
            },
          },
        ]}
      />
      <div css={{ gridArea: 'settings' }}>
        <Routes>
          <Route path="/" element={<SettingsList />} />
          <Route path="/manage-networks" element={<ManageChains />} />
          <Route path="/signer-configuration" element={<ManageSignerConfiguration />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default Settings
