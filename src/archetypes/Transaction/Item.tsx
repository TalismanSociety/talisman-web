
import styled from 'styled-components'
import { ChainLogo, Info, PanelSection, Image } from '@components'
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
          graphic={
            <Image
              src={`https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/${chainId}/logo.svg`}
              alt={`${chainId} logo`}
              data-type={'logo'}
            />
          } 
          className='signer'
        />

        <ArrowRight />
        
        <Info 
          title={section} 
          subtitle={method}
          graphic={
            <Image
              src={`https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/${chainId}/logo.svg`}
              alt={`${chainId} logo`}
              data-type={'logo'}
            />
          }
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

    .graphic{
      .image{
        font-size: var(--font-size-xxlarge);
        width: 1em;
        height: 1em;
        border-radius: 50%;
        display: block;
      }
    }

    .title,
    .subtitle{
      width: 12rem;
      overflow: hidden;
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