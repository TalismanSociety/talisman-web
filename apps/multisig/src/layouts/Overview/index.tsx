import { css } from '@emotion/css'
import { Eye, Settings, Users } from '@talismn/icons'
import { device } from '@util/breakpoints'

import Assets from './Assets'
import Footer from './Footer'
import Header from './Header'
import Sidebar from './Sidebar'
import Transactions from './Transactions'

const Overview = () => (
  <div
    className={css`
      display: grid;
      grid-template-columns: 70px 1fr;
      grid-template-rows: 87px auto auto 84px;
      height: 100%;
      width: 100%;
      gap: 16px;
      padding: 28px 28px 0 28px;
      grid-template-areas:
        'header header'
        'sidebar assets'
        'sidebar transactions'
        'footer footer';
      @media ${device.md} {
        grid-template-columns: 177px 45fr 55fr;
        grid-template-rows: 100px auto 84px;
        grid-template-areas:
          'header header header'
          'sidebar assets transactions'
          'footer footer footer';
      }
      @media ${device.lg} {
        margin: auto;
        max-width: 1600px;
        grid-template-columns: 248px 38fr 62fr;
        grid-template-rows: 100px auto 84px;
        grid-template-areas:
          'header header header'
          'sidebar assets transactions'
          'footer footer footer';
      }
    `}
  >
    <Header />
    <Sidebar
      selected="Overview"
      options={[
        {
          name: 'Overview',
          icon: <Eye />,
          onClick: () => {
            console.log('click')
          },
        },
        {
          name: 'Address book',
          icon: <Users />,
          onClick: () => {
            console.log('click')
          },
        },
        {
          name: 'Settings',
          icon: <Settings />,
          onClick: () => {
            console.log('click')
          },
        },
      ]}
    />
    <Assets />
    <Transactions />
    <Footer />
  </div>
)

export default Overview
