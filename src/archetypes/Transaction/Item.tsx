
import styled from 'styled-components'
import { ChainLogo, Info, PanelSection } from '@components'
import Logo  from './Logo'
import { useChain } from '@talismn/api-react-hooks'
import { ReactComponent as ArrowRight } from '@icons/arrow-right.svg'
import { ReactComponent as ExternalLink } from '@icons/external-link.svg'
import { externalURLDefined, useTypeCategory } from './store'
import { toDate } from 'date-fns-tz'
import { formatDistanceToNow } from 'date-fns'

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


  // Temporary ========
  let chainNumericalID : string
  switch (chainId) {
    case 'polkadot':
      chainNumericalID = "0"
      break;
    case 'kusama':
      chainNumericalID = "2"
      break;
    default:
      chainNumericalID = "0"
      break;
  }
  
  const chain = useChain(chainNumericalID)

  const { typeCategory } = useTypeCategory(`${section}.${method}`)

  return (
    <PanelSection  className={className}>
      <Info 
        title={typeCategory} 
        subtitle={formatDistanceToNow(toDate(createdAt, { timeZone : 'UTC'}), { addSuffix: true, includeSeconds: true })}
        graphic={<Logo type={direction} />}
      />

      {/* Create new component and flip children absed on type */}
      <div className='tofrom' data-direction={direction}>
        <Info 
          title="You" 
          subtitle={direction.toLowerCase()} 
          graphic={<ChainLogo chain={chain} type="logo" size={4} />} 
          className='signer'
        />

        <ArrowRight />
        
        <Info 
          title={section} 
          subtitle={method}
          graphic={<ChainLogo chain={chain} type="logo" size={4} />}
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
  // > *:nth-child(4){ ; }


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
      // do elipses

    }

    >.signer{
      .title{
        color: var(--color-primary);
      }
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