import { ReactComponent as TalismanWordLogo } from '@assets/talisman-red-black.svg'
import { Pill } from '@components'
import styled from 'styled-components'

interface ConnectWalletItemProps {
  className?: string
  name: string
  src: string
  featured?: boolean
}

const Badge = styled(({ className, children }) => {
  return (
    <Pill className={className} small primary>
      {children}
    </Pill>
  )
})`
  position: absolute;
  top: -20px;
  right: -20px;
`

const FeaturedConnectWalletItem = styled(({ className = '', src, name }: ConnectWalletItemProps) => {
  return (
    <div className={className}>
      <img height={48} width={48} src={src} alt={name} />
      <span>{name}</span>
      <Badge>Coming soon</Badge>
    </div>
  )
})`
  position: relative;
  flex-direction: column;
  > * + * {
    margin-top: 0.5rem;
  }
`

const ConnectWalletItem = styled((props: ConnectWalletItemProps) => {
  const { className = '', src, name, featured = false } = props
  if (featured) {
    return <FeaturedConnectWalletItem {...props} />
  }
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

const NoWallet = styled(({ className = '' }) => {
  return (
    <a
      className={className}
      href="https://www.youtube.com/watch?v=mT7rUlQh660"
      target="_blank"
      rel="noreferrer noopener"
    >
      I don’t have a wallet
    </a>
  )
})`
  text-decoration: underline;
`

const ConnectWalletSelection = styled(({ className = '' }) => {
  return (
    <div className={className}>
      <h2>Connect a wallet</h2>
      <section>
        <ConnectWalletItem
          featured
          name="Talisman Wallet"
          src={`https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F5e69f0e4-3154-4d1a-ad08-2656d4fa823e%2FDiscord.png?table=block&id=c9f585cb-7605-4983-90fe-286f075e4c4d&spaceId=b391c246-9a9f-48cc-ac17-8026efedda08&width=250&userId=e12dff2a-90cc-4a63-bc1f-99a697210093&cache=v2`}
        />
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
  margin: 0 auto;
  min-width: 33%;

  > * + * {
    margin-top: 3rem;
  }

  > section {
    width: 100%;
  }

  > section > * + * {
    margin-top: 1rem;
  }
`

const TalismanLogo = styled(TalismanWordLogo)`
  height: 3rem;
  width: auto;
`

const Welcome = styled(({ className }) => {
  return (
    <section className={className}>
      <div className="description">
        <TalismanLogo />
        <h1>Talisman allows you to explore and invest in crowdloans.</h1>
        <p>Explore Polkadot {`&`} Kusama with the Talisman wallet and asset dashboard.</p>
      </div>
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

  .description {
    flex: 1 0 40%;
    * + * {
      margin-top: 4rem;
    }
  }
`

export default Welcome
