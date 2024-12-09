import styled from '@emotion/styled'

import { Image } from './'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default styled(({ chain, type, className }: { chain: any; type: string; size?: number; className?: string }) => {
  return (
    <Image
      src={chain?.asset?.logo}
      alt={`${chain?.name as string} ${type}`}
      className={`crowdloan-asset crowdloan-${type} ${className ?? ''}`}
      data-type={type}
    />
  )
})`
  &[data-type='logo'] {
    font-size: ${({ size = 8 }) => `${size}rem`};
    width: 1em;
    height: 1em;
    border-radius: 50%;
    display: block;
  }
`
