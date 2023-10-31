import { AccountDetails } from '@components/AddressInput/AccountDetails'
import { useSelectedMultisig } from '@domains/multisig'
import { useProxies } from '@domains/proxy/useProxies'
import { Eye, EyeOff } from '@talismn/icons'
import { Button, CircularProgressIndicator } from '@talismn/ui'
import { useState } from 'react'
import { useKnownAddresses } from '../../hooks/useKnownAddresses'
import { ChainPill } from '../../components/ChainPill'

const secondsToDuration = (ms: number) => {
  const seconds = Math.floor(ms / 1000)
  if (seconds < 60) return `${seconds}secs`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}mins`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}hrs`
  return `${Math.floor(seconds / 86400)}days`
}

export const VaultOverview: React.FC = () => {
  const [selectedMultisig] = useSelectedMultisig()
  const [showMembers, setShowMembers] = useState(false)
  const { contactByAddress } = useKnownAddresses(selectedMultisig.id)
  const { proxies } = useProxies(selectedMultisig.proxyAddress, selectedMultisig.chain, {
    delegateeAddress: selectedMultisig.multisigAddress,
  })

  return (
    <section
      css={{
        backgroundColor: 'var(--color-grey800)',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        padding: 24,
      }}
    >
      <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 css={({ color }) => ({ color: color.offWhite, fontSize: 20, fontWeight: 700 })}>{selectedMultisig.name}</h2>
        <ChainPill chain={selectedMultisig.chain} />
      </div>
      <div css={{ marginTop: 24 }}>
        <p css={({ color }) => ({ color: color.offWhite, fontSize: 14, marginTop: 3 })}>Vault Address</p>
        <AccountDetails
          chain={selectedMultisig.chain}
          address={selectedMultisig.proxyAddress}
          identiconSize={20}
          withAddressTooltip
        />
      </div>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: '5fr 4fr',
          gap: '0px 8px',
          marginTop: 24,
        }}
      >
        <p css={({ color }) => ({ color: color.lightGrey, marginBottom: 4, fontSize: 14 })}>Multisig controls</p>
        <p css={({ color }) => ({ color: color.lightGrey, marginBottom: 4, fontSize: 14 })}>Time Delay</p>
        {proxies ? (
          proxies.map(proxy => (
            <>
              <p css={({ color }) => ({ color: color.offWhite })}>{proxy.proxyType} transactions</p>
              <p css={({ color }) => ({ color: color.offWhite })}>
                {proxy.delay} blocks{' '}
                <span css={({ color }) => ({ color: color.lightGrey })}>≈{secondsToDuration(proxy.duration)}</span>
              </p>
            </>
          ))
        ) : (
          <CircularProgressIndicator size={22.4} />
        )}
      </div>

      <div
        css={{
          display: 'grid',
          gridTemplateColumns: '5fr 4fr',
          gap: '0px 8px',
          p: { whiteSpace: 'nowrap' },
          alignItems: 'center',
          marginTop: 24,
        }}
      >
        <div css={{ fontSize: 14 }}>
          <p css={({ color }) => ({ color: color.lightGrey, marginBottom: 4 })}>Approval Threshold</p>
          <p css={({ color }) => ({ color: color.offWhite })}>
            {selectedMultisig.threshold} of {selectedMultisig.signers.length} members
          </p>
        </div>
        <div
          css={{
            button: { backgroundColor: 'var(--color-backgroundLight)', padding: '8px 12px' },
          }}
        >
          <Button variant="secondary" onClick={() => setShowMembers(!showMembers)}>
            <div css={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {showMembers ? <EyeOff size={16} /> : <Eye size={16} />}
              <p css={{ fontSize: 14, marginTop: 2 }}>{showMembers ? 'Hide' : 'Show'} Members</p>
            </div>
          </Button>
        </div>
      </div>
      <div
        css={{
          overflow: 'hidden',
          height: 'max-content',
          maxHeight: showMembers ? 1000 : 0,
          transition: 'max-height 0.3s',
        }}
      >
        <div
          css={{
            display: 'grid',
            gridTemplateColumns: '5fr 4fr',
            gap: '0px 8px',
            marginTop: 24,
          }}
        >
          <div>
            <p css={({ color }) => ({ color: color.lightGrey, marginBottom: 8 })}>Signers</p>
            <div css={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {selectedMultisig.signers.map(signer => (
                <AccountDetails
                  key={signer.toSs58()}
                  chain={selectedMultisig.chain}
                  address={signer}
                  name={contactByAddress[signer.toSs58()]?.name}
                  identiconSize={20}
                  nameOrAddressOnly
                  withAddressTooltip
                />
              ))}
            </div>
          </div>
          <div>
            <p css={({ color }) => ({ color: color.lightGrey, marginBottom: 8 })}>Multisig Address</p>
            <AccountDetails
              chain={selectedMultisig.chain}
              address={selectedMultisig.multisigAddress}
              identiconSize={20}
              withAddressTooltip
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default VaultOverview
