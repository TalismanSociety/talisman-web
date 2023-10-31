import { Chain } from '@domains/chains'
import { Address } from '@util/addresses'
import { X } from '@talismn/icons'
import { AccountDetails } from './AccountDetails'

export const SelectedAddress = ({
  address,
  chain,
  name,
  onClear,
}: {
  address: Address
  chain?: Chain
  name?: string
  onClear: () => void
}) => {
  return (
    <div
      css={{
        'position': 'absolute',
        'bottom': 0,
        'left': 0,
        'padding': 8,
        'display': 'flex',
        'alignItems': 'center',
        'justifyContent': 'space-between',
        'width': '100%',
        'cursor': 'pointer',
        ':hover': {
          '.close-icon': {
            opacity: 1,
          },
        },
      }}
      onClick={onClear}
    >
      <div
        css={({ color }) => ({
          padding: '6px 8px',
          borderRadius: 8,
          pointerEvents: 'none',
          backgroundColor: color.surface,
        })}
      >
        <AccountDetails address={address} chain={chain} name={name} disableCopy />
      </div>
      <div className="close-icon" css={{ opacity: 0.6, height: 20, paddingRight: 8 }}>
        <X size={20} />
      </div>
    </div>
  )
}
