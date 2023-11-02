import { ProxyDefinition } from '@domains/multisig'
import { CircularProgressIndicator } from '@talismn/ui'
import { Fragment } from 'react'
import { secondsToDuration } from '@util/misc'

type Props = {
  proxies?: ProxyDefinition[]
}

const Pill: React.FC<{ value: string | number; suffix?: string }> = ({ value, suffix }) => {
  return (
    <div
      css={({ color }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        backgroundColor: color.surface,
        borderRadius: 8,
        padding: '8px 12px',
        p: { color: color.offWhite },
      })}
    >
      <p>{value}</p>
      {suffix !== undefined && <p css={{ fontSize: 14 }}>{suffix}</p>}
    </div>
  )
}

export const ProxiesSettings: React.FC<Props> = ({ proxies }) => (
  <div css={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <p css={({ color }) => ({ color: color.offWhite, fontSize: 14, marginTop: 2 })}>Proxy Relationships</p>
    <div
      css={({ color }) => ({
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        p: { color: color.lightGrey, fontSize: 14, marginTop: 2 },
      })}
    >
      <p>Proxy Type</p>
      <p>Time Delay</p>
    </div>
    {proxies === undefined ? (
      <CircularProgressIndicator size={16} />
    ) : proxies.length === 0 ? (
      <p css={({ color }) => ({ color: color.offWhite })}>No proxy relationship found.</p>
    ) : (
      <div css={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', alignItems: 'flex-start' }}>
        {proxies.map(({ proxyType, delay, duration }, i) => (
          <Fragment key={i}>
            <Pill value={proxyType} />
            <div css={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Pill value={delay} suffix="Blocks" />
              <p css={({ color }) => ({ color: color.lightGrey })}>≈{secondsToDuration(duration)}</p>
            </div>
          </Fragment>
        ))}
      </div>
    )}
  </div>
)
