import { ReactComponent as TalismanWordLogo } from '@assets/talisman-red-black.svg'
import styled from 'styled-components'

const ConnectTalismanWallet = styled(({ className = '' }) => {
  return <div className={className}>Talisman wallet here...</div>
})`
  background: var(--color-activeBackground);
  padding: 2rem;
  border-radius: 1rem;
`

interface ConnectWalletItemProps {
  className?: string
  name: string
  src: string
}

const ConnectWalletItem = styled(({ className = '', src, name }: ConnectWalletItemProps) => {
  return (
    <div className={className}>
      <span>{name}</span>
      <img height={24} width={24} src={src} alt={name} />
    </div>
  )
})`
  background: var(--color-activeBackground);
  padding: 1.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const NoWallet = () => {
  return <div>I don’t have a wallet</div>
}

const ConnectWalletSelection = styled(({ className = '' }) => {
  return (
    <div className={className}>
      <h2>Connect a wallet</h2>
      <section>
        <ConnectTalismanWallet />
        <ConnectWalletItem name="Polkadot{js}" src={`https://polkadot.js.org/docs/img/logo.svg`} />
        <ConnectWalletItem name="Wallet Connect" src={`https://walletconnect.org/walletconnect-logo.svg`} />
      </section>
      <NoWallet />
    </div>
  )
})`
  background: var(--color-controlBackground);
  padding: 4rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  // flex: 0 1 20%;
  margin: 0 auto;

  > * + * {
    margin-top: 3rem;
  }

  > section > * + * {
    margin-top: 1rem;
  }
`

const TalismanLogo = styled(TalismanWordLogo)`
  height: 3rem;
  width: auto;
`

const Spaced = styled.div`
  flex: 1 0 40%;
  * + * {
    margin-top: 4rem;
  }
`

const Welcome = styled(({ className }) => {
  return (
    <section className={className}>
      <Spaced>
        <TalismanLogo />
        <h1>Talisman allows you to explore and invest in crowdloans.</h1>
        <p>Explore Polkadot {`&`} Kusama with the Talisman wallet and asset dashboard.</p>
      </Spaced>
      <ConnectWalletSelection />
    </section>
  )
})`
  width: 100%;
  padding: 0 6vw;
  margin: 6rem auto;
  display: flex;
  align-items: center;
  gap: 2rem;
  color: var(--color-text);

  justify-content: space-between;
  flex-wrap: wrap;
`

export default Welcome
