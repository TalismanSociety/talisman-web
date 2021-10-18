import bannerImage from '@assets/empty-bags.png'
import { Button } from '@components'
import { Banner } from '@components/Banner'
import { H1 } from '@components/H1'
import { NavLink } from 'react-router-dom'

export const ComingSoonBanner = () => {
  return (
    <Banner backgroundImage={bannerImage}>
      <div>
        <H1>Coming soon</H1>
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
