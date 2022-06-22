import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Item from './Item'
import { useTransactions } from './store'
import { Button, Field, Panel } from '@components'
import { Account, Wallet } from '@archetypes'
import { useEffect } from 'react'
import { useURLParams } from '@libs/txhistory'

type IProps = {
  address: string
  className?: string
}

const TransactionList = ({ address, className }: IProps) => {
  const { t } = useTranslation()

  const {
      changeAddress,
      loadMore,
      hasMore,
      transactions,
      status
  } = useTransactions(address)

  useEffect(() => {
    changeAddress(address)
  }, [address, changeAddress])

  return (
    <section className={`transaction-list ${className}`}>
        <header>
          <Account.Button />
        </header>

          {['INITIALISED', 'PROCESSING'].includes(status) 
            ? <div>LOADING</div>
            : !transactions?.length 
              ? <div>No Transactions</div>
              : <Panel>{
                transactions.map((tx: any) => 
                  <Item key={tx.id} {...tx} address={address} />
                )}
              </Panel>
          }

        <footer>
          {/* TODO: use an existing button component */}
          <Button onClick={loadMore} disabled={!hasMore}>Load More</Button>
        </footer>
    </section> 
  )
}


// todo josh: styling
//  - the header, item container, footer etc
//  - the margin between elements 
//
// do not style the indlvidual elements here
// style those in the component itself
const StyledTransactionList = styled(TransactionList)`
  >header{
    padding-bottom: 1rem;
    // border-bottom: 1px solid red;
    margin-bottom: 1em
  }

  // >article{
  //   margin-top: 1rem

  // }

  >footer{
    padding-top: 1rem;
    // border-top: 1px solid red;
    margin-top: 1em
  }
`


export default StyledTransactionList