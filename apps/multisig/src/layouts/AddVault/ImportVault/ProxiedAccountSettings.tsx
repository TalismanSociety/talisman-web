import { css } from '@emotion/css'
import { Chain } from '@domains/chains'
import { Address } from '@util/addresses'
import AddressInput from '@components/AddressInput'
import { CancleOrNext } from '../common/CancelOrNext'

type Props = {
  address?: Address
  chain: Chain
  onBack: () => void
  onChange: (address?: Address) => void
  onNext: () => void
}

export const ProxiedAccountSettings: React.FC<Props> = ({ address, chain, onBack, onChange, onNext }) => {
  return (
    <form
      className={css`
        display: grid;
        justify-items: center;
        align-content: center;
        gap: 48px;
        width: 100%;
        max-width: 540px;
      `}
      onSubmit={onNext}
    >
      <div>
        <h1>Enter Proxied Address</h1>
        <p css={{ textAlign: 'center', marginTop: 8 }}>Enter the Proxied Account Address to import.</p>
      </div>

      <AddressInput chain={chain} defaultAddress={address} onChange={address => onChange(address)} />

      <CancleOrNext
        block
        cancel={{
          onClick: onBack,
          children: <h3>Back</h3>,
          type: 'button',
        }}
        next={{
          disabled: !address,
          onClick: onNext,
          type: 'submit',
        }}
      />
    </form>
  )
}
