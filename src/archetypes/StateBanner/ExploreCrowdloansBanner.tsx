import bannerImage from '@assets/build-the-paraverse.png'
import { Button } from '@components'
import { Banner } from '@components/Banner'
import { H1 } from '@components/H1'
import { NavLink } from 'react-router-dom'

export const ExploreCrowdloansBanner = () => {
  return (
    <Banner backgroundImage={bannerImage}>
      <div>
        <H1>Build the Paraverse</H1>
        <p>
          Crowdloans help projects and teams raise funds to participate in Parachain auctions on Polkadot and Kusama.
        </p>
      </div>
      <div>
        <NavLink to="/crowdloans">
          <Button primary>Explore Crowdloans</Button>
        </NavLink>
      </div>
    </Banner>
  )
}
