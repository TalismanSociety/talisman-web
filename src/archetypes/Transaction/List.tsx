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
            additionalAccounts={urlAddress ? [{name: urlAddress, address: urlAddress}] : []} 
            onChange={({address}: any) => changeAddress(address)}
          />
        </header>

        {['INITIALISED', 'PROCESSING'].includes(status) 
          ? <div>LOADING</div>
          : !transactions?.length 
            ? <div>No Transactions</div>
            : <Panel className={'transaction-item-container'}>{transactions.map((tx: any) => <Item key={tx.id} {...tx} address={address} />)}</Panel>
        }

        <footer>
          {/* TODO: use an existing button component */}
          <Button onClick={loadMore} disabled={!hasMore}>Load More</Button>
        </footer>
    </section> 
  )
}

const StyledTransactionList = styled(TransactionList)`
  >header{
    padding-bottom: 1rem;
    margin-bottom: 1em;

    .account-picker{
      width: 500px
    }
  }

  .transaction-item{
    transition: all 0.2s;
    &:hover{
      background: var(--color-activeBackground)
    }
  }

  >footer{
    padding-top: 1rem;
    margin-top: 1em
  }
`


export default StyledTransactionList