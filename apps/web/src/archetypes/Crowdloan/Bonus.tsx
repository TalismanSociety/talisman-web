import { useCrowdloanById } from '@libs/talisman'
import { Maybe } from '@util/monads'
import { type ReactNode, useMemo } from 'react'

export type BonusProps = {
  id: string
  short?: boolean
  full?: boolean
  info?: boolean
  prefix?: ReactNode
}

const Bonus = ({ id, short, full, info, prefix }: BonusProps) => {
  const bonus = useCrowdloanById(id).crowdloan?.details?.bonus
  const type = short ? 'short' : full ? 'full' : info ? 'info' : undefined

  const content = useMemo(() => {
    if (short) return bonus?.short
    if (full) return Maybe.ofFalsy(bonus?.full).mapOrUndefined(x => <span>{x}</span>)
    if (info) return bonus?.info
    return undefined
  }, [bonus, full, info, short])

  if (!content || type === undefined) return null

  return (
    <span
      className={`crowdloan-bonus type-${type}`}
      css={{
        'fontSize': '1em',
        'display': 'flex',
        'alignItems': 'center',
        'backgroundColor': 'var(--color-activeBackground)',
        'padding': '0.5rem 1.25rem',
        'borderRadius': '1.5rem',
        'width': 'max-content',
        'a': {
          textDecoration: 'underline',
        },
        '> *': {
          display: 'inline-block',
        },
        '&.type-full': {
          '> *': {
            lineHeight: '1em',
            verticalAlign: 'center',
            display: 'inline-block',
          },
          '.popup': {
            'marginLeft': '0.4rem',
            '.icon-help': {
              color: 'var(--color-primary)',
            },
          },
        },
      }}
    >
      {prefix !== undefined && <span className="prefix">{prefix}</span>}
      {content}
    </span>
  )
}

export default Bonus
