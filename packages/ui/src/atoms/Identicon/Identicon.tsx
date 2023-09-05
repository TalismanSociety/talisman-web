import { encodeAnyAddress } from '@talismn/util'
import { HSL, HSV, display as asCssColor, to as toColorSpace } from 'colorjs.io/fn'
import md5 from 'md5'
import { useId, useMemo, type CSSProperties } from 'react'

const djb2 = (str: string) => {
  let hash = 5381
  for (let i = 0; i < str.length; i++) hash = (hash << 5) + hash + str.charCodeAt(i)
  return hash
}

const valueFromHash = (hash: string, max: number) => {
  return (max + djb2(hash)) % max
}

const colorFromHash = (hash: string) =>
  toColorSpace({ space: HSV, coords: [valueFromHash(hash, 360), 100, 100] as [number, number, number], alpha: 1 }, HSL)

const rotateText = (text: string, nbChars = 0) => text.slice(nbChars) + text.slice(0, nbChars)

export type IdenticonProps = {
  value: string
  size?: number | string
  className?: string
  style?: CSSProperties
  theme?: string
}

const Identicon = ({ value: seed, size = '2.4rem', className, style }: IdenticonProps) => {
  const id = useId()

  const { bgColor1, bgColor2, transform, glowColor, cx, cy, isEthereum } = useMemo(() => {
    const isEthereum = seed?.startsWith('0x')
    try {
      // seed may be specific to a ss58 prefix, get the base address
      // eslint-disable-next-line no-var
      var address = isEthereum ? seed : encodeAnyAddress(seed)
    } catch (err) {
      address = seed
    }

    // derive 3 hashs from the seed, used to generate the 3 colors
    const hash1 = md5(address)
    const hash2 = rotateText(hash1, 1)
    const hash3 = rotateText(hash1, 2)

    // the 2 darkest ones will be used as gradient BG
    // the lightest one will be used as gradient circle, to mimic a 3D lighting effect
    const colors = [colorFromHash(hash1), colorFromHash(hash2), colorFromHash(hash3)]
      .sort((c1, c2) => (c1.coords[2] ?? 0) - (c2.coords[2] ?? 0))
      .map(x => asCssColor(x))

    // random location in top left corner, avoid being to close from the center
    const dotX = 10 + valueFromHash(hash1, 10)
    const dotY = 10 + valueFromHash(hash2, 10)

    // global rotation
    const rotation = valueFromHash(hash1, 360)

    return {
      bgColor1: colors[0],
      bgColor2: colors[1],
      glowColor: colors[2],
      transform: `rotate(${rotation} 32 32)`,
      cx: dotX,
      cy: dotY,
      isEthereum,
    }
  }, [seed])

  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox={`0 0 64 64`}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`${id}-bg`}>
          <stop offset="20%" stopColor={bgColor1} />
          <stop offset="100%" stopColor={bgColor2} />
        </linearGradient>
        <radialGradient id={`${id}-circle`}>
          <stop offset="10%" stopColor={glowColor} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <g transform={transform}>
          <rect fill={`url(#${id}-bg)`} x={0} y={0} width={64} height={64} />
          <circle fill={`url(#${id}-circle)`} cx={cx} cy={cy} r={45} opacity={0.7} />
        </g>
        {isEthereum && (
          <g opacity="0.75" transform="scale(0.7) translate(14 14)">
            <path d="M12.8101 32.76L32.0001 44.62L51.1901 32.76L32.0001 -0.0699997L12.8101 32.76Z" fill="white" />
            <path d="M12.8101 36.48L32.0001 48.43L51.1901 36.48L32.0001 63.93L12.8101 36.48Z" fill="white" />
          </g>
        )}
      </g>
    </svg>
  )
}

export default Identicon
