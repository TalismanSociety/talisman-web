import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Item from './Item'
import { useTransactions } from './store'
import { Button, Panel, PanelSection, MaterialLoader } from '@components'
import { ReactComponent as ArrowDown } from '@icons/arrow-right.svg'
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

        <Panel>
          {status === 'INITIALISED' || (status === 'PROCESSING' && !transactions?.length) 
            ? <PanelSection className="centered-state"> <MaterialLoader/> <div>Searching the paraverse</div> </PanelSection>
            : !transactions?.length 
              ? <PanelSection className="centered-state"> 🥺 No Transactions - try another account </PanelSection>
              : <Panel className={'transaction-item-container'}>{transactions.map((tx: any) => <Item key={tx.id} {...tx} address={address} />)}</Panel>
          }
        </Panel>

        <footer>
          {hasMore && status !== 'INITIALISED' &&
            <Button 
              onClick={loadMore} 
              //disabled={!hasMore}
              >
                {status === 'PROCESSING' 
                  ? <>Finding &nbsp; <MaterialLoader/></>
                  : <>Older <ArrowDown className="arrow-down"/></>
                }
            </Button>}
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
    // border-top: 1px solid red;
    margin-top: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .arrow-down {
    transform: rotate(90deg);
  }

  .centered-state {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
     >*{
      margin: 0 0.3em;
     }
  }
  
`


export default StyledTransactionList