import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import { Copy, PlusCircle, TalismanHand } from '@talismn/icons'
import { IconButton, Identicon, Select } from '@talismn/ui'
import { useNavigate } from 'react-router-dom'
import truncateMiddle from 'truncate-middle'
import { Multisig } from '../domains/multisig'
import { copyToClipboard } from '../domains/common'

type Props = {
  multisigs: Multisig[]
  selectedMultisig: Multisig
  onChange: (multisig: Multisig) => void
}
export const MultisigSelect: React.FC<Props> = ({ multisigs, onChange, selectedMultisig }) => {
  const theme = useTheme()
  const navigate = useNavigate()

  return (
    <Select
      placeholderPointerEvents={true}
      afterOptionsNode={
        <div
          css={{
            'display': 'flex',
            'alignItems': 'center',
            'fontWeight': 'bold',
            'padding': '15px 12.5px',
            'gap': 8,
            'backgroundColor': theme.color.surface,
            ':hover': {
              filter: 'brightness(1.2)',
            },
            'cursor': 'pointer',
          }}
          onClick={() => navigate('/create')}
        >
          <IconButton size={'40px'} contentColor={theme.color.primary}>
            <PlusCircle size="40px" />
          </IconButton>
          New Vault
        </div>
      }
      beforeOptionsNode={
        <div
          css={{
            fontWeight: 'bold',
            color: 'var(--color-dim)',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <TalismanHand size={16} />
          Connected Vaults
        </div>
      }
      placeholder={
        <div
          className={css`
            width: max-content;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
          `}
        >
          <Identicon size={40} value={selectedMultisig.proxyAddress.toSs58(selectedMultisig.chain)} />
          <div
            className={css`
              color: var(--color-offWhite) !important;
              pointer-events: none;
              user-select: none;
            `}
          >
            <div css={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <p>{truncateMiddle(selectedMultisig.name, 24, 0, '...')}</p>
              <img
                css={{ marginBottom: '2px' }}
                height={16}
                src={selectedMultisig.chain.logo}
                alt={selectedMultisig.chain.chainName}
              />
            </div>
          </div>
          <Copy
            className={css`
              height: 18px;
              transition: 100ms ease-in-out;
              :hover {
                color: #d4d4d4;
              }
            `}
            onClick={e => {
              copyToClipboard(
                selectedMultisig.proxyAddress.toSs58(selectedMultisig.chain),
                'Proxy address copied to clipboard'
              )
              e.stopPropagation()
            }}
          />
        </div>
      }
      value={selectedMultisig.proxyAddress.toPubKey()}
      onChange={value => {
        const newMultisig = multisigs.find(m => m.proxyAddress.toPubKey() === value)
        if (newMultisig) onChange(newMultisig)
      }}
    >
      {multisigs.reduce((accumulator, multisig) => {
        if (selectedMultisig.proxyAddress.isEqual(multisig.proxyAddress)) return accumulator

        return accumulator.concat(
          <Select.Item
            key={multisig.proxyAddress.toPubKey()}
            leadingIcon={<Identicon size={40} value={multisig.proxyAddress.toSs58(selectedMultisig.chain)} />}
            value={multisig.proxyAddress.toPubKey()}
            headlineText={
              <div
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 14,
                  color: 'var(--color-foreground)',
                  width: '100%',
                }}
              >
                <p css={({ color }) => ({ color: color.offWhite })}>{truncateMiddle(multisig.name, 12, 0, '...')}</p>
                <img css={{ marginBottom: 4 }} height={16} src={multisig.chain.logo} alt={multisig.chain.chainName} />
              </div>
            }
            supportingText={
              <p css={{ fontSize: 12, color: 'var(--color-foreground)', marginTop: '3px' }}>
                {truncateMiddle(multisig.proxyAddress.toSs58(multisig.chain), 4, 6, '...')}
              </p>
            }
          />
        )
      }, [] as any)}
    </Select>
  )
}
