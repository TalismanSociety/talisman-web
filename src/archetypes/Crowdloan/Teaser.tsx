import { Link } from "react-router-dom";
import styled from 'styled-components'
import { Pill } from '@components'
import { useCrowdloan } from '@libs/talisman'
import Crowdloan from './'

const Teaser = styled(
  ({
    id,
    className
  }) => {
    const { name, slug } = useCrowdloan(id)

    return <Link
     to={`/crowdloan/${slug}`}
     className={`crowdloan-teaser ${className}`}
      >
      <Crowdloan.Image 
        thumb 
        id={id}
      />
      <div 
        className="content"
        >
        <Crowdloan.Image
          className="icon"
          icon 
          id={id}
        />
        <h1>{name}</h1>
        <div className="chart"></div>
      </div>
      <Pill
        small
        >
        <Crowdloan.Countdown
          id={id}
        />
      </Pill>
    </Link>
  })
  `
    display: block;
    background: rgba(${({ theme }) => theme.foreground}, 0.02);
    border-radius: 2.4rem;
    overflow: hidden;
    border-radius: 1rem;
    box-shadow: 0 0 1.2rem rgba(${({ theme }) => theme.foreground}, 0.1);
    position: relative;

    >.image{
      width: 100%;
      height: 0;
      padding-top: 50%;
    }

    >.content{
      padding: 0 1em 1em 1em;

      .icon{
        width: 6.4rem;
        height: 6.4rem;
        padding-top: 0;
        margin-top: -3.2rem;
       
      }

      h1{
        margin: 0;
        font-size: var(--font-size-large);
        font-weight: 600;
         margin-top: 1rem;
      }

      .chart{
        display: block;
        height: 2rem;
        margin-top: 2rem;
        background: rgba(0,0,0,0.1);
        border-radius: 1rem;
        position: relative;
        overflow: hidden;

        &:after{
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 2rem;
          width: 75%;
          background: rgba(0,0,0,0.1);
        }
      }
    }

    >.pill{
      position: absolute;
      top: 1rem;
      right: 1rem;
      color: white;
      background: white;
      color: black;
    }
  `

export default Teaser