import type { CSSProperties } from 'react'
import illustrationSrc from '../../../assets/images/talisman-hand-progress-indicator.gif'

export type TalismanHandProgressIndicatorProps = {
  className?: string
  style?: CSSProperties
}

const TalismanHandProgressIndicator = (props: TalismanHandProgressIndicatorProps) => {
  return (
    <img
      className={props.className}
      src={illustrationSrc}
      css={{ width: '12.8rem', height: '12.8rem' }}
      style={props.style}
    />
  )
}

export default TalismanHandProgressIndicator
