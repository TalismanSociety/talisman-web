import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Item from './Item'
import { useTransactions } from './store'
import { Button, Field, Panel } from '@components'
import { Account, Wallet } from '@archetypes'
import { useEffect } from 'react'

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

  // const result = transactions.reduce((acc, curr) => {
  //   if (acc.some(e => e[0].createdAt.slice(0, 9) === curr.createdAt.slice(0, 9))) acc.filter(e => e[0].createdAt.slice(0, 9) === curr.createdAt.slice(0, 9))[0].push(curr)
  //   else acc.push([curr])
    
  //   return acc
  // }, [])

  console.log(transactions)

  useEffect(() => {
    changeAddress(address)
  }, [address])

  return (
    <section className={`transaction-list ${className}`}>
        <header>
          <Account.Button />
        </header>

          { transactions.length > 0 ? (
            <Panel>{
              transactions.map((tx: any) => 
                <Item key={tx.id} {...tx} address={address} />
              )}
            </Panel>
          ) : 
            <div>No Transactions</div>
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