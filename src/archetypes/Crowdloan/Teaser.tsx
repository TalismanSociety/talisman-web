import { Link } from "react-router-dom";
import styled from 'styled-components'
import { Pill } from '@components'
import { useCrowdloanById } from '@libs/talisman'
import Crowdloan from './'

const Teaser = styled(
  ({
    id,
    className
  }) => {
    const { 
      name, 
      slug
    } = useCrowdloanById(id)

    return <Link
      to={`/${slug}`}
      className={`crowdloan-teaser ${className}`}
      >
      <Crowdloan.Asset  
        id={id}
        type='card'
      />
      <div 
        className="content"
        >
        <Crowdloan.Asset
          id={id}
          type='logo'
        />
        <h1>{name}</h1>
        <Crowdloan.Raised
          id={id}
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
    height: 35.9rem;

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
      position: absolute;
      bottom: 1.5rem;
      left: 1.6rem;
      width: calc(100% - 3.2rem);
    }
  `

export default Teaser