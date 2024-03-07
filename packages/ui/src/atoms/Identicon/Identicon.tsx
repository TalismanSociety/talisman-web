import { HSL, HSV, display as asCssColor, to as toColorSpace } from 'colorjs.io/fn'
import md5 from 'md5'
import { useId, useMemo, type CSSProperties } from 'react'
import { encodeAnyAddress } from '../../utils/encodeAnyAddress'

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

type OverlayProps = {
  type: 'ethereum' | 'substrate' | undefined
}

const Overlay = ({ type }: OverlayProps) => {
  switch (type) {
    case 'ethereum':
      return (
        <g opacity="0.75" transform="scale(0.7) translate(14 14)">
          <path d="M12.8101 32.76L32.0001 44.62L51.1901 32.76L32.0001 -0.0699997L12.8101 32.76Z" fill="white" />
          <path d="M12.8101 36.48L32.0001 48.43L51.1901 36.48L32.0001 63.93L12.8101 36.48Z" fill="white" />
        </g>
      )
    case 'substrate':
      return (
        <>
          <g clipPath="url(#clip0_1751_2030)" opacity="0.75" transform="scale(2.2) translate(4.5 3.9)">
            <path
              d="M9.99937 4.4612C12.1176 4.4612 13.8347 3.46253 13.8347 2.2306C13.8347 0.998674 12.1176 0 9.99937 0C7.88119 0 6.16406 0.998674 6.16406 2.2306C6.16406 3.46253 7.88119 4.4612 9.99937 4.4612Z"
              fill="white"
            />
            <path
              d="M9.99937 21.2683C12.1176 21.2683 13.8347 20.2697 13.8347 19.0377C13.8347 17.8058 12.1176 16.8071 9.99937 16.8071C7.88119 16.8071 6.16406 17.8058 6.16406 19.0377C6.16406 20.2697 7.88119 21.2683 9.99937 21.2683Z"
              fill="white"
            />
            <path
              d="M4.65427 7.54892C5.71336 5.71457 5.70649 3.72787 4.63892 3.11149C3.57135 2.49511 1.84735 3.48246 0.788259 5.31681C-0.270832 7.15115 -0.263958 9.13786 0.803612 9.75424C1.87118 10.3706 3.59518 9.38326 4.65427 7.54892Z"
              fill="white"
            />
            <path
              d="M19.2083 15.9515C20.2674 14.1171 20.2611 12.1307 19.1943 11.5148C18.1274 10.8988 16.404 11.8865 15.3449 13.7209C14.2858 15.5552 14.2921 17.5416 15.3589 18.1575C16.4258 18.7735 18.1492 17.7858 19.2083 15.9515Z"
              fill="white"
            />
            <path
              d="M4.6399 18.1571C5.70747 17.5407 5.71434 15.554 4.65525 13.7196C3.59616 11.8853 1.87216 10.8979 0.804589 11.5143C-0.262981 12.1307 -0.269855 14.1174 0.789235 15.9517C1.84833 17.7861 3.57233 18.7734 4.6399 18.1571Z"
              fill="white"
            />
            <path
              d="M19.1952 9.75475C20.2621 9.13878 20.2684 7.15241 19.2093 5.31807C18.1502 3.48372 16.4268 2.49603 15.3599 3.11199C14.2931 3.72796 14.2868 5.71433 15.3459 7.54867C16.405 9.38302 18.1284 10.3707 19.1952 9.75475Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_1751_2030">
              <rect width="20" height="21.2699" fill="white" />
            </clipPath>
          </defs>
        </>
      )
    default:
      return null
  }
}

export type IdenticonProps = {
  value: string
  size?: number | string
  className?: string
  style?: CSSProperties
  theme?: string
}

const Identicon = ({ value: seed, size = '2.4rem', className, style }: IdenticonProps) => {
  const id = useId()

  const { bgColor1, bgColor2, transform, glowColor, cx, cy, type } = useMemo(() => {
    const { address, type } = encodeAnyAddress(seed)

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
      type,
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
        <Overlay type={type} />
      </g>
    </svg>
  )
}

export default Identicon
