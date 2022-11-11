import styled from '@emotion/styled'

type WalletProps = {
  id: string
  className?: string
}

// Deprecated or unused?
const Wallet = styled(({ id, className }: WalletProps) => {
  return <div className={`account-wallet ${className}`}>todo</div>
})``

export default Wallet
