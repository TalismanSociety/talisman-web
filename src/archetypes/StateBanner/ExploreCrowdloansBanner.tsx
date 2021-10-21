import bannerImage from '@assets/build-the-paraverse.png'
import { Button } from '@components'
import { Banner } from '@components/Banner'
import { NavLink } from 'react-router-dom'

export const ExploreCrowdloansBanner = () => {
  return (
    <Banner backgroundImage={bannerImage}>
      <div className="description">
        <h1>Build the Paraverse</h1>
        <p>
          Crowdloans help projects and teams raise funds to participate in Parachain auctions on Polkadot and Kusama.
        </p>
      </div>
      <div className="cta">
        <NavLink to="/crowdloans">
          <Button primary>Explore Crowdloans</Button>
        </NavLink>
      </div>
    </Banner>
  )
}
