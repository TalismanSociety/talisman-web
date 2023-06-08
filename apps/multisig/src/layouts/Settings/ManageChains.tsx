import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import { Copy, ExternalLink, Plus } from '@talismn/icons'
import { Button, IconButton, Identicon } from '@talismn/ui'

import { Chain as ChainT, supportedChains } from '../../domain/chains'
import { copyToClipboard } from '../../domain/common'
import { BackButton } from '.'

const Chain = ({ address, chain, onDelete }: { address: string; chain: ChainT; onDelete?: () => void }) => {
  const theme = useTheme()

  return (
    <div
      className={css`
        display: flex;
        align-items: center;
        background: var(--color-backgroundSecondary);
        border-radius: 8px;
        padding: 16px;
        gap: 8px;
        max-width: 586px;
      `}
    >
      <Identicon value={address} size={32} />
      <div css={{ display: 'grid', alignItems: 'center' }}>
        <div css={{ display: 'flex', gap: '8px' }}>
          <span css={{ color: 'var(--color-offWhite)' }}>{chain.chainName}</span>
          <img src={chain.logo} alt={'logo'} height={16} />
        </div>
        <span css={{ fontSize: '12px' }}>{address}</span>
      </div>
      <div css={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: '8px', paddingLeft: '16px' }}>
        <IconButton
          size={16}
          contentColor={`rgb(${theme.foreground})`}
          onClick={() => {
            copyToClipboard(address, `${chain.chainName} address copied to clipboard`)
          }}
        >
          <Copy size={16} />
        </IconButton>
        <a href={`https://subscan.io/address/${address}`}>
          <IconButton size={16} contentColor={`rgb(${theme.foreground})`} css={{ cursor: 'pointer' }}>
            <ExternalLink size={16} />
          </IconButton>
        </a>
      </div>
    </div>
  )
}

const ManageChains = () => {
  // TODO: Fetch these from recoil or whatever
  const vaultName = 'Paraverse Foundation'
  const proxyAddresses: [ChainT, string][] = [
    [supportedChains[0] as ChainT, '14ApALYpTuNfHgyCNYkMsuwWtuqPBbE5QRmRswmXS8GwxWUt'],
    [supportedChains[1] as ChainT, 'Hh2GWcmfgGaAWCNhHupJShnFzFU36WXhciesL1pu7G9MVHs'],
  ]
  return (
    <div css={{ margin: '32px', paddingLeft: '32px', width: '586px' }}>
      <BackButton />
      <div
        css={{
          display: 'flex',
          gap: '64px',
          paddingBottom: '32px',
          flexWrap: 'wrap',
        }}
      >
        <div css={{ display: 'grid', gap: '16px' }}>
          <h2 css={{ color: 'var(--color-offWhite)' }}>Vault Addresses</h2>
          <div css={{ display: 'flex' }}>
            <span css={{ color: 'var(--color-primary)' }}>{vaultName}</span>&nbsp;<span>deployed proxies</span>
          </div>
          <div css={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '40px' }}>
            {proxyAddresses.map(([c, a]) => (
              <Chain key={a} address={a} chain={c} />
            ))}
          </div>
        </div>
        <Button
          onClick={() => {
            alert(
              'open up point in the vault creation flow where you specify a network and create the proxy. that code needs to be abstracted.'
            )
          }}
        >
          <div css={{ display: 'flex', alignItems: 'center', height: '100%', gap: '4px' }}>
            <Plus css={{ marginTop: '2px' }} />
            <span css={{ marginTop: '8px' }}>Add Network</span>
          </div>
        </Button>
      </div>
    </div>
  )
}

export default ManageChains
