import { css } from '@emotion/react'
import { Text } from '@talismn/ui'

type PlaceholderPreviewProps = {
  icon: any
  text: string
}

const PlaceholderPreview = ({ icon, text }: PlaceholderPreviewProps) => {
  return (
    <div
      css={css`
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        > * {
          color: #a5a5a5 !important;
        }

        > svg {
          width: 5em;
          height: 5em;
          margin-bottom: 1em;
        }
      `}
    >
      {icon}
      <Text.H3>{text}</Text.H3>
    </div>
  )
}

export default PlaceholderPreview
