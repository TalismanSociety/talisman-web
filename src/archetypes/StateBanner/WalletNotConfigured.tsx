import bannerImage from '@assets/empty-bags.png'
import { Banner } from '@components/Banner'

export const WalletNotConfiguredBanner = () => {
  return (
    <Banner backgroundImage={bannerImage}>
      <div className="description">
        <h1>Wallet configuration needed</h1>
        <p>Add accounts to your wallet via the extension.</p>
      </div>
    </Banner>
  )
}
