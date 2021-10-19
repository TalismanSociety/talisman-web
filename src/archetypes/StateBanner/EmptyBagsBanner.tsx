import bannerImage from '@assets/empty-bags.png'
import { Button } from '@components'
import { Banner } from '@components/Banner'
import { H1 } from '@components/H1'
import { NavLink } from 'react-router-dom'

export const EmptyBagsBanner = () => {
  return (
    <Banner backgroundImage={bannerImage}>
      <div className="description">
        <H1>Your bags are empty!</H1>
        <p>Buy DOT and KSM with your credit card or crypto</p>
      </div>
      <div className="cta">
        <NavLink to="/buy">
          <Button primary>Buy</Button>
        </NavLink>
      </div>
    </Banner>
  )
}
