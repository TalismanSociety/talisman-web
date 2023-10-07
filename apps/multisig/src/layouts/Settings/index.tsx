import { useTheme } from '@emotion/react'
import { ChevronLeft } from '@talismn/icons'
import { Button, IconButton } from '@talismn/ui'
import { Route, Routes, useNavigate } from 'react-router-dom'

import SettingsList from './SettingsList'
import ManageSignerConfiguration from './SignerConfiguration'
import { Layout } from '../Layout'

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

const Settings = () => (
  <Layout selected="Settings">
    <div css={{ gridArea: 'settings' }}>
      <Routes>
        <Route path="/" element={<SettingsList />} />
        <Route path="/signer-configuration" element={<ManageSignerConfiguration />} />
      </Routes>
    </div>
  </Layout>
)

export default Settings
