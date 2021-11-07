import { Popup } from '@components'
import { ReactComponent as IconHelp } from '@icons/help-circle.svg'
// import { useCrowdloanById } from '@libs/talisman'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const Bonus = styled(({ id, parachainId, short, full, info, prefix, className }) => {
  // const { crowdloan } = useCrowdloanById(id)
  // const bonus = crowdloan?.details?.rewards?.bonus
  const type = !!short ? 'short' : !!full ? 'full' : !!info ? 'info' : null

  const { t } = useTranslation('crowdloan-details')
  const { rewards } = t(`${parachainId}`, { returnObjects: true })
  const bonus = rewards?.bonus

  if (!bonus || !type) return null

  return (
    <span className={`crowdloan-bonus ${className} type-${type}`}>
      {!!prefix && <span className="prefix">{prefix}</span>}
      {type === 'short' && bonus?.short}
      {type === 'full' && (
        <>
          <span>{bonus?.full}</span>
          <Popup text={bonus?.info}>
            <IconHelp className="icon-help" />
          </Popup>
        </>
      )}
      {type === 'info' && bonus?.info}
    </span>
  )
})`
  font-size: 1em;
  display: block;

  > * {
    display: inline-block;
  }

  &.type-full {
    > * {
      line-height: 1em;
      vertical-align: center;
      display: inline-block;
    }

    .popup {
      margin-left: 0.4em;

      .icon-help {
        color: var(--color-primary);
      }
    }
  }
`

export default Bonus
