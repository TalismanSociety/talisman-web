import styled from '@emotion/styled'
import { useParachainAssets } from '@libs/talisman'

type ImageProps = {
  id: string
  className?: string
  type: string
}

const fallbackMap = {
  card: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/promo/generic-card.png',
  logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/tokens/unknown.svg',
}

const Image = styled(({ id, type, className }: ImageProps) => {
  const assets = useParachainAssets(id)

  return (
    <div
      className={`crowdloan-asset crowdloan-${type} ${className}`}
      data-type={type}
      css={{
        backgroundImage: `url(${assets[type]}), url(${fallbackMap[type as keyof typeof fallbackMap]})`,
        backgroundSize: 'cover',
      }}
    />
  )
})`
  &[data-type='logo'] {
    font-size: ${({ size = 8 }: { size?: number }) => `${size}rem`};
    width: 1em;
    height: 1em;
    border-radius: 50%;
    display: block;
  }
`

export default Image
