import { css } from '@emotion/css'
import { Copy, PlusCircle } from '@talismn/icons'
import { Select } from '@talismn/ui'
import truncateMiddle from 'truncate-middle'
import { Multisig } from '@domains/multisig'
import { copyToClipboard } from '@domains/common'
import { Link } from 'react-router-dom'

type Props = {
  multisigs: Multisig[]
  selectedMultisig: Multisig
  onChange: (multisig: Multisig) => void
}

const VaultDetails: React.FC<{ multisig: Multisig; disableCopy?: boolean; selected?: boolean }> = ({
  multisig,
  disableCopy,
  selected,
}) => (
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
          opacity: selected ? 1 : 0.4,
        })}
      />
      <img
        css={{ top: -2, right: -2, position: 'absolute', height: 14 }}
        src={multisig.chain.logo}
        alt={multisig.chain.chainName}
      />
      <p
        css={({ color }) => ({
          color: color.primary,
          fontWeight: 700,
          fontSize: 12,
          marginTop: 4,
          opacity: selected ? 1 : 0.6,
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
        <p css={{ fontSize: 12, marginTop: 2 }}>{multisig.proxyAddress.toShortSs58(multisig.chain)}</p>
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

const AddVaultButton: React.FC = () => (
  <Link to="/add-vault">
    <div
      css={({ color }) => ({
        'border': 'none',
        'display': 'flex',
        'alignItems': 'center',
        'gap': 8,
        'padding': '8px 16px',
        'marginBottom': 8,
        'backgroundColor': color.surface,
        ':hover': { filter: 'brightness(1.2)' },
        'cursor': 'pointer',
        'width': '100%',
        'svg': { color: color.primary },
      })}
    >
      <PlusCircle size={32} />
      <p css={{ marginTop: 4, fontSize: 16, textAlign: 'left' }}>Add Vault</p>
    </div>
  </Link>
)

export const MultisigSelect: React.FC<Props> = ({ multisigs, onChange, selectedMultisig }) => {
  const handleChange = (value: string) => {
    const newMultisig = multisigs.find(m => m.id === value)
    if (newMultisig) onChange(newMultisig)
  }
  return (
    <Select
      afterOptionsNode={<AddVaultButton />}
      css={{ button: { gap: 12 } }}
      onChange={handleChange}
      placeholder={<VaultDetails multisig={selectedMultisig} selected />}
      placeholderPointerEvents
      value={selectedMultisig.id}
    >
      {multisigs.reduce((accumulator, multisig) => {
        if (selectedMultisig.id === multisig.id) return accumulator

        return accumulator.concat(
          <Select.Option
            key={multisig.id}
            value={multisig.id}
            leadingIcon={<VaultDetails multisig={multisig} />}
            headlineText={null}
          />
        )
      }, [] as any)}
    </Select>
  )
}
