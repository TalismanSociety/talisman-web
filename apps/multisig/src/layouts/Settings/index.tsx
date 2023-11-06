import { useTheme } from '@emotion/react'
import { ChevronLeft, ExternalLink } from '@talismn/icons'
import { Button, IconButton } from '@talismn/ui'
import { useNavigate } from 'react-router-dom'

import { Layout } from '../Layout'
import { SettingsInfoRow } from './InfoRow'
import { AccountDetails } from '@components/AddressInput/AccountDetails'
import { useSelectedMultisig } from '@domains/multisig'
import { ChainPill } from '@components/ChainPill'
import { SignersSettings } from './SignersSettings'
import { useEffect, useMemo, useState } from 'react'
import { ThresholdSettings } from './ThresholdSettings'
import { pjsApiSelector } from '@domains/chains/pjs-api'
import { useRecoilValueLoadable } from 'recoil'
import { toMultisigAddress } from '@util/addresses'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { SettingsSideSheet } from './SettingsSideSheet'
import { ProxiesSettings } from './ProxiesSettings'

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
  const [multisig] = useSelectedMultisig()
  const [newMembers, setNewMembers] = useState(multisig.signers)
  const [newThreshold, setNewThreshold] = useState(multisig.threshold)
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(multisig.chain.rpcs))
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | undefined>()

  const newMultisigAddress = toMultisigAddress(newMembers, newThreshold)
  const hasAny = multisig.proxies?.find(p => p.proxyType === 'Any') !== undefined

  const changed = useMemo(() => {
    return !newMultisigAddress.isEqual(multisig.multisigAddress)
  }, [multisig.multisigAddress, newMultisigAddress])

  const handleReset = () => {
    setNewMembers(multisig.signers)
    setNewThreshold(multisig.threshold)
    setExtrinsic(undefined)
  }

  const handleApplyChanges = () => {
    if (apiLoadable.state !== 'hasValue') return
    const api = apiLoadable.contents
    if (!api.tx.proxy?.addProxy || !api.tx.proxy.removeProxy || !api.tx.proxy.proxy || !api.tx.utility?.batchAll) {
      throw Error('chain doesnt have proxy or utility pallet')
    }
    const batchCall = api.tx.utility.batchAll([
      api.tx.proxy.addProxy(newMultisigAddress.bytes, 'Any', 0),
      api.tx.proxy.removeProxy(multisig.multisigAddress.bytes, 'Any', 0),
    ])
    const proxyCall = api.tx.proxy.proxy(multisig.proxyAddress.bytes, null, batchCall)
    setExtrinsic(proxyCall)
  }

  useEffect(() => {
    setNewMembers(multisig.signers)
    setNewThreshold(multisig.threshold)
  }, [multisig])

  return (
    <Layout selected="Settings" requiresMultisig>
      <div css={{ display: 'flex', flex: 1, padding: '32px 8%', flexDirection: 'column', gap: 32 }}>
        <h2 css={({ color }) => ({ color: color.offWhite, marginTop: 4 })}>Vault Settings</h2>
        <div css={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {/** first row: Name */}
          <SettingsInfoRow label="Vault Name">
            <p css={({ color }) => ({ color: color.offWhite, fontSize: 16, fontWeight: 600 })}>{multisig.name}</p>
          </SettingsInfoRow>
          <div />

          {/** second row: Proxied Account | Chain */}
          <SettingsInfoRow
            label="Proxied Account"
            tooltip="This is the account the Multisig controls, typically where funds are stored"
          >
            <AccountDetails address={multisig.proxyAddress} chain={multisig.chain} />
          </SettingsInfoRow>
          <SettingsInfoRow label="Chain">
            <ChainPill chain={multisig.chain} />
          </SettingsInfoRow>

          {/** third row: Multisig Address */}
          <SettingsInfoRow
            label="Multisig Address"
            tooltip="This multisig address is the address that controls the proxied account. It is derived from your vault's members and threshold."
          >
            <AccountDetails address={newMultisigAddress} chain={multisig.chain} />
          </SettingsInfoRow>
          <div />

          {/** forth row: Signers settings | other settings */}
          <SignersSettings members={newMembers} onChange={setNewMembers} multisig={multisig} editable={hasAny} />
          <div css={{ display: 'flex', gap: 24, flexDirection: 'column' }}>
            <ThresholdSettings
              membersCount={newMembers.length}
              threshold={newThreshold}
              onChange={setNewThreshold}
              disabled={!hasAny}
            />
            <ProxiesSettings proxies={multisig.proxies} />
          </div>
        </div>
        {hasAny || !multisig.allProxies ? (
          <div
            css={{
              width: '100%',
              display: 'flex',
              gap: 24,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 32,
              button: { height: 56 },
            }}
          >
            <Button disabled={!changed} variant="secondary" onClick={handleReset}>
              Reset
            </Button>
            <Button
              disabled={!changed || apiLoadable.state !== 'hasValue'}
              loading={changed && apiLoadable.state === 'loading'}
              onClick={handleApplyChanges}
            >
              Apply Changes
            </Button>
          </div>
        ) : (
          <div
            css={({ color }) => ({
              backgroundColor: color.surface,
              color: color.offWhite,
              padding: 16,
              borderRadius: 12,
              span: {
                fontWeight: 800,
              },
              a: { color: color.primary },
            })}
          >
            <p>
              On-chain configurations cannot be changed because <span>{multisig.name}</span> does not have{' '}
              <span>Any proxy type</span> to the proxied account.{' '}
              <a href="https://wiki.polkadot.network/docs/learn-proxies" target="_blank" rel="noreferrer">
                Learn More <ExternalLink size={16} />
              </a>
            </p>
          </div>
        )}
      </div>
      <SettingsSideSheet
        members={newMembers}
        threshold={newThreshold}
        multisig={multisig}
        open={extrinsic !== undefined}
        extrinsic={extrinsic}
        onClose={() => setExtrinsic(undefined)}
      />
    </Layout>
  )
}
export default Settings
