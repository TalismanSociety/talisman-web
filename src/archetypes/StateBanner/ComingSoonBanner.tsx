import bannerImage from '@assets/empty-bags.png'
import { Button } from '@components'
import { Banner } from '@components/Banner'
import { NavLink } from 'react-router-dom'

export const ComingSoonBanner = () => {
  return (
    <Banner backgroundImage={bannerImage}>
      <div>
        <h1>Coming soon</h1>
        <p>In the meantime, you can check out Crowdloans.</p>
      </div>
      <div>
        <NavLink to="/crowdloans">
          <Button primary>Explore Crowdloans</Button>
        </NavLink>
      </div>
    </Banner>
  )
}
