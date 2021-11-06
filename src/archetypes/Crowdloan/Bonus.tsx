import { Stat, Popup } from '@components'
import { useCrowdloanById } from '@libs/talisman'
import styled from 'styled-components'
import { ReactComponent as IconHelp } from '@icons/help-circle.svg'


const Bonus = styled(({ id, short, full, info, prefix, className }) => {
  const { crowdloan } = useCrowdloanById(id)
  const bonus = crowdloan?.details?.rewards?.bonus
  const type = !!short ? 'short' : !!full ? 'full' : !!info ? 'info' : null

  if(!bonus || !type) return null

  return (
    <span className={`crowdloan-bonus ${className} type-${type}`}>
      {!!prefix && <span className="prefix">{prefix}</span>}
      {type === 'short' && bonus?.short}
      {type === 'full' && 
        <>
          <span>{bonus?.full}</span>
          <Popup text={bonus?.info}>
            <IconHelp className='icon-help'/>
          </Popup>
        </>
      }
      {type === 'info' && bonus?.info}
    </span>
  )
})`
  
  font-size: 1em;
  display: block;
  
  >*{
    display: inline-block;
  }

  &.type-full{
    >*{
      line-height: 1em;
      vertical-align: center;
      display: inline-block;
    }

    .popup{
      margin-left: 0.4em;

      .icon-help{
        color: var(--color-primary)
      }
    }
  }
`

export default Bonus
