import { Link } from "react-router-dom";
import styled from 'styled-components'
import { Pill } from '@components'
import { useCrowdloanByParachainId } from '@libs/talisman'
import { Parachain } from '@archetypes'
import Crowdloan from './'

const Teaser = styled(
  ({
    id,
    className
  }) => {
    const { 
      parachain
    } = useCrowdloanByParachainId(id)

    return <Link
      to={`crowdloans/${parachain?.slug}`}
      className={`crowdloan-teaser ${className}`}
      >
      <Parachain.Asset  
        id={id}
        type='card'
      />
      <div 
        className="content"
        >
        <Parachain.Asset
          id={id}
          type='logo'
        />
        <h1>{parachain?.name}</h1>
        <Crowdloan.Raised
          id={id}
          title='Raised'
        />
      </div>
     
      <Pill
        className='countdown'
        >
        <Crowdloan.Countdown
          id={id}
          showSeconds={false}
        />
      </Pill>
     
    </Link>
  })
  `
    display: block;
    background: rgba(${({ theme }) => theme.foreground}, 0.02);
    overflow: hidden;
    border-radius: 2.4rem;
    box-shadow: 0 0 1.2rem rgba(${({ theme }) => theme.foreground}, 0.1);
    position: relative;
    //height: 35.9rem;

    >.crowdloan-card{
      width: 100%;
      height: 0;
      padding-top: 58.4%;
    }

    >.content{
      padding: 0 1.6rem 1rem 1.6rem;

      .crowdloan-logo{
        width: 6.4rem;
        height: 6.4rem;
        padding-top: 0;
        margin-top: -3.2rem;
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
      }

      h1{
        margin: 0;
        font-size: var(--font-size-large);
        font-weight: 600;
        margin-top: 1.2rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    >.countdown{
      position: absolute;
      top: 1.6rem;
      right: 1.6rem;
      color: white;
      background: white;
      color: black;
    }

    .crowdloan-raised{
      font-size: 0.9em;
      margin-top: calc(1.5rem + 1.5vw);
    }
  `

export default Teaser