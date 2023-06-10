import { activeMultisigsState } from '@domains/multisig'
import { css } from '@emotion/css'
import { Eye, Settings } from '@talismn/icons'
import { device } from '@util/breakpoints'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import Assets, { TokenAugmented } from './Assets'
import Footer from './Footer'
import Header from './Header'
import { mockTokensAugmented, mockTransactions } from './mocks'
import NewTransactionModal from './NewTransactionModal'
import Sidebar from './Sidebar'
import Transactions, { Transaction__deprecated } from './Transactions'

const Overview = () => {
  const navigate = useNavigate()

  // Redirect to landing if no connected accounts have multisig
  const activeMultisigs = useRecoilValue(activeMultisigsState)
  useEffect(() => {
    if (activeMultisigs.length === 0) {
      navigate('/')
    }
  }, [activeMultisigs, navigate])

  const transactions: Transaction__deprecated[] = mockTransactions
  const augmentedTokens: TokenAugmented[] = mockTokensAugmented
  return (
    <div
      className={css`
        display: grid;
        grid-template-columns: 70px 1fr;
        grid-template-rows: 84px auto auto 84px;
        height: 100%;
        width: 100%;
        gap: 16px;
        padding: 28px 28px 0 28px;
        grid-template-areas:
          'header header'
          'sidebar transactions'
          'sidebar assets'
          'footer footer';
        @media ${device.md} {
          grid-template-columns: 177px 45fr 55fr;
          grid-template-rows: 84px auto 84px;
          grid-template-areas:
            'header header header'
            'sidebar assets transactions'
            'footer footer footer';
        }
        @media ${device.lg} {
          margin: auto;
          max-width: 1600px;
          grid-template-columns: 248px 38fr 62fr;
          grid-template-rows: 84px auto 84px;
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
          },
          {
            name: 'Settings',
            icon: <Settings />,
            onClick: () => {
              navigate('/settings')
            },
          },
        ]}
      />
      <Assets augmentedTokens={augmentedTokens} />
      <Transactions transactions={transactions} />
      <Footer />
      <NewTransactionModal />
    </div>
  )
}

export default Overview
