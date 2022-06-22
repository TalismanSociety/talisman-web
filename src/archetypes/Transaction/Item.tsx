
import styled from 'styled-components'
import { Info, PanelSection } from '@components'
import Logo  from './Logo'
import { ReactComponent as ArrowRight } from '@icons/arrow-right.svg'
import { ReactComponent as ExternalLink } from '@icons/external-link.svg'
import { externalURLDefined, useTypeCategory } from './store'
import { toDate } from 'date-fns-tz'
import { formatDistanceToNow } from 'date-fns'
import { Chain } from '@archetypes'

export type TProps = {
  id: string
  blockNumber: string
  indexInBlock: string
  method: string
  section: string
  chainId: string
  createdAt: string
  signer: string
  address: string
  direction: string
  className: string
}

const TransactionItem = styled(({ id, blockNumber, indexInBlock, method, section, chainId, createdAt, signer, address, direction, className } : TProps) => {

  const { typeCategory } = useTypeCategory(`${section}.${method}`)

  return (
    <PanelSection className={`transaction-item ${className}`}>
      <Info 
        title={typeCategory} 
        subtitle={formatDistanceToNow(toDate(createdAt, { timeZone : 'UTC'}), { addSuffix: true, includeSeconds: true })}
        graphic={<Logo type={direction} className='category-logo'/>}
      />

      {/* Create new component and flip children based on type */}
      <div className='tofrom' data-direction={direction}>
        <Info 
          title="You" 
          subtitle={direction.toLowerCase()} 
          graphic={<Chain.LogoById id={chainId}/>} 
          className='signer'
        />

        <ArrowRight />
        
        <Info 
          title={section} 
          subtitle={method}
          graphic={<Chain.LogoById id={chainId}/>} 
          className='reciever'
        />
      </div>

      {/* <Info title="Fee" subtitle="-" /> */}

      <div className='external-link'>
        <a href={externalURLDefined(chainId, blockNumber, indexInBlock)} target='_blank' rel='noreferrer'>
          <ExternalLink />
        </a>
      </div>
      
    </PanelSection>
  )
  
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;

  >*{
    justify-content: flex-start;
    align-items: center;
  }

  > *:nth-child(1){ width: 30%; }
  > *:nth-child(2){ width 50%; }
  > *:nth-child(3){ width 20%; }

  >.tofrom{
    display: flex;
    justify-content: center; 
    flex-direction: row;

    > *:first-child{ width: 40%; justify-content: flex-end; }
    > *:nth-child(2){ width: 20%; justify-content: center; }
    > *:last-child{ width: 40%; justify-content: flex-start; }

    &[data-direction='INBOUND']{ 
      flex-direction: row-reverse;
      > *:first-child{ justify-content: flex-start; }
      > *:last-child{ justify-content: flex-end; }
    }

    .title,
    .subtitle{
      width: 12rem;
      overflow: hidden;
    }

    >.signer{
      .title{
        font-weight: var(--font-weight-xbold)
      }
    }
  }

  .category-logo,
  .graphic .chain-logo{
    font-size: 3.2rem;
    width: 1em;
    height: 1em;
  }

  .info{
    font-size: var(--font-size-normal);
    .title,
    .subtitle{
      font-weight: var(--font-weight-regular)
    }
  }

  .title, .subtitle {
    text-transform: capitalize;
  }

  .external-link {
    display: flex;
    justify-content: flex-end;
    text-align: center;
    padding-right: 1em;
  }
`

// Need to do a little CSS magic with ::after to get the border radius set accordingly.

export default TransactionItem