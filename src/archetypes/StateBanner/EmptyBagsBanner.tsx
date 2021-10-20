import bannerImage from '@assets/empty-bags.png'
import { Button } from '@components'
import { Banner } from '@components/Banner'
import { NavLink } from 'react-router-dom'

export const EmptyBagsBanner = () => {
  return (
    <Banner backgroundImage={bannerImage}>
      <div className="description">
        <h1>Your bags are empty!</h1>
        <p>Buy DOT and KSM with your credit card or crypto</p>
      </div>
      <div className="cta">
        <NavLink to="/buy">
          <Button primary>Buy DOT / KSM</Button>
        </NavLink>
      </div>
    </Banner>
  )
}
