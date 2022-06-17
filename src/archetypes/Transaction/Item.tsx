
import styled from 'styled-components'
import { TTransaction } from './types'
import { ChainLogo, Info, Panel, PanelSection } from '@components'
import Logo  from './Logo'
import { truncateString } from '@util/helpers'
import { useChain } from '@talismn/api-react-hooks'
import { ReactComponent as ArrowRight } from '@icons/arrow-right.svg'
import { ReactComponent as ExternalLink } from '@icons/external-link.svg'
import moment from 'moment';
import { useTypeCategory } from './store'
// import { PanelSection } from '@components'

export type TProps = {
  id: string
  method: string
  section: string
  chainId: string
  createdAt: string
  signer: string
  address: string
  direction: string
  className: string
}

const TransactionItem = styled(({ id, method, section, chainId, createdAt, signer, address, direction, className } : TProps) => {

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

  const transactionDate = new Date(createdAt)

  const { typeCategory } = useTypeCategory(`${section}.${method}`)
  
  return (
    <PanelSection  className={className}>
      <Info 
        title={typeCategory} 
        subtitle={moment(transactionDate).fromNow()}
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


      <Info title="Fee" subtitle="0.01 KSM / $0.0111" />

      <a href="https://kusama.subscan.io/extrinsic/" target='_blank' rel='noreferrer' className='external-link'>
        <ExternalLink />
      </a>
      
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

  > *:last-child {
    text-align: right;
  }


  > *:nth-child(1){ width: 20% }
  > *:nth-child(2){ width: 60% }
  > *:nth-child(3){ width: 15% }
  > *:nth-child(4){ width: 5% }


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
    justify-content: center;
    text-align: center;
  }

`

// Need to do a little CSS magic with ::after to get the border radius set accordingly.

export default TransactionItem