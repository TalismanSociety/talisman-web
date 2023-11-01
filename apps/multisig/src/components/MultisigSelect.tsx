import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import { Copy, PlusCircle } from '@talismn/icons'
import { Select } from '@talismn/ui'
import { useNavigate } from 'react-router-dom'
import truncateMiddle from 'truncate-middle'
import { Multisig } from '@domains/multisig'
import { copyToClipboard } from '@domains/common'

type Props = {
  multisigs: Multisig[]
  selectedMultisig: Multisig
  onChange: (multisig: Multisig) => void
}

const VaultDetails: React.FC<{ multisig: Multisig; disableCopy?: boolean }> = ({ multisig, disableCopy }) => (
  <div
    css={{
      width: 'max-content',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      userSelect: 'none',
    }}
  >
    {/** Threshold + chain logo circle */}
    <div
      css={{
        position: 'relative',
        height: 40,
        width: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        css={({ color }) => ({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: color.primaryContainer,
          borderRadius: '50%',
        })}
      />
      <img
        css={{ top: -2, right: -2, position: 'absolute' }}
        height={14}
        src={multisig.chain.logo}
        alt={multisig.chain.chainName}
      />
      <p
        css={({ color }) => ({
          color: color.primary,
          fontWeight: 700,
          fontSize: 12,
          marginTop: 4,
        })}
      >
        {multisig.threshold}/{multisig.signers.length}
      </p>
    </div>

    {/** Name + Address and copy icon */}
    <div css={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
      <p
        css={({ color }) => ({
          color: color.offWhite,
          width: 96,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        })}
      >
        {truncateMiddle(multisig.name, 24, 0, '...')}
      </p>
      <div css={{ display: 'flex', gap: 4 }}>
        <p css={{ fontSize: 12, marginTop: 2 }}>
          {truncateMiddle(multisig.proxyAddress.toSs58(multisig.chain), 4, 4, '...')}
        </p>
        {!disableCopy && (
          <Copy
            className={css`
              height: 14px;
              width: 14px;
              transition: 100ms ease-in-out;
              :hover {
                color: #d4d4d4;
              }
            `}
            onClick={e => {
              copyToClipboard(
                multisig.proxyAddress.toSs58(multisig.chain),
                'Vault address (proxied address) copied to clipboard'
              )
              e.stopPropagation()
            }}
          />
        )}
      </div>
    </div>
  </div>
)

export const MultisigSelect: React.FC<Props> = ({ multisigs, onChange, selectedMultisig }) => {
  const theme = useTheme()
  const navigate = useNavigate()

  return (
    <Select
      css={{
        button: { gap: 12 },
      }}
      placeholderPointerEvents={true}
      afterOptionsNode={
        <div
          css={{
            borderTop: `1px solid ${theme.color.border}`,
            button: {
              'border': 'none',
              'display': 'flex',
              'alignItems': 'center',
              'gap': 8,
              'padding': '8px 12.5px',
              'backgroundColor': theme.color.surface,
              ':hover': {
                filter: 'brightness(1.2)',
                svg: { color: theme.color.primary },
              },
              'cursor': 'pointer',
              'width': '100%',
            },
            padding: '8px 0',
          }}
        >
          <button onClick={() => navigate('/create')}>
            <PlusCircle size={20} />
            <p css={{ marginTop: 2, fontSize: 14, textAlign: 'left' }}>Create Vault</p>
          </button>
          {/* 
          TODO: uncomment this when import flow is implemented.
          <Tooltip
            disabled
            content={
              <p css={{ fontSize: 12 }}>
                Import a Vault from an existing Proxy Account and Multisig Configuration, support Multisig control via
                All Proxy types
              </p>
            }
          >
            <button>
              <Download size={20} />
              <p css={{ marginTop: 2, fontSize: 14 }}>Import Vault</p>
            </button>
          </Tooltip> */}
        </div>
      }
      placeholder={<VaultDetails multisig={selectedMultisig} />}
      value={selectedMultisig.proxyAddress.toPubKey()}
      onChange={value => {
        const newMultisig = multisigs.find(m => m.proxyAddress.toPubKey() === value)
        if (newMultisig) onChange(newMultisig)
      }}
    >
      {multisigs.reduce((accumulator, multisig) => {
        if (selectedMultisig.proxyAddress.isEqual(multisig.proxyAddress)) return accumulator

        return accumulator.concat(
          <Select.Option
            key={multisig.proxyAddress.toPubKey()}
            value={multisig.proxyAddress.toPubKey()}
            leadingIcon={<VaultDetails multisig={multisig} />}
            headlineText={null}
          />
        )
      }, [] as any)}
    </Select>
  )
}
