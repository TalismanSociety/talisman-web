import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Item from './Item'
import { useTransactions } from './store'
import { Button, Panel } from '@components'
import { Account } from '@archetypes'
import { useURLParams } from '@libs/txhistory'

type ITransactionListProps = {
  addresses: string[]
  className?: string
}

const TransactionList = ({ addresses = [], className }: ITransactionListProps) => {
  const { t } = useTranslation()

  const urlAddress = useURLParams(['address'])[0]

  const {
      changeAddress,
      address,
      loadMore,
      hasMore,
      transactions,
      status
  } = useTransactions(addresses[0])

  return (
    <section className={`transaction-list ${className}`}>
        <header>
          <Account.Picker 
            additionalAccounts={[{name: urlAddress, address: urlAddress}]} 
            onChange={({address}: any) => changeAddress(address)}
          />
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
    margin-bottom: 1em;

    .account-picker{
      //width: 500px
    }
  }

  >footer{
    padding-top: 1rem;
    // border-top: 1px solid red;
    margin-top: 1em
  }
`


export default StyledTransactionList