import { css } from '@emotion/css'
import { Check, Unknown } from '@talismn/icons'
import { ReactNode } from 'react'

export enum StatusCircleType {
  Success,
  Unknown,
}

interface Colors {
  backgroundColor: string
  iconColor: string
}

function getColorsAndIcon(type: StatusCircleType): [ReactNode, Colors] {
  switch (type) {
    case StatusCircleType.Success:
      return [
        <Check />,
        {
          backgroundColor: '#345132',
          iconColor: '#38d448',
        },
      ]
    case StatusCircleType.Unknown:
      return [
        <Unknown />,
        {
          backgroundColor: '#3f3f3f',
          iconColor: '#a5a5a5',
        },
      ]
  }
}

const StatusCircle = (props: {
  type: StatusCircleType
  iconDimentions: { width: string; height: string }
  circleDiameter: string
}) => {
  const [icon, colors] = getColorsAndIcon(props.type)
  return (
    <div
      className={css`
        height: 100%;
        background: ${colors.backgroundColor};
        display: grid;
        align-items: center;
        justify-content: center;
        height: ${props.circleDiameter};
        width: ${props.circleDiameter};
        border-radius: 100px;
        svg {
          width: ${props.iconDimentions.width};
          height: ${props.iconDimentions.height};
          color: ${colors.iconColor};
        }
      `}
    >
      {icon}
    </div>
  )
}

export default StatusCircle
