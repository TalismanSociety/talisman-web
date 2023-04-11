import { type ButtonHTMLAttributes, type DetailedHTMLProps } from 'react'

export type ClickableProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

/**
 * Simple button component with 0 styling,
 * to wrap other component that want to act as a button
 * with full accessibility support
 */
const Clickable = Object.assign(
  (props: ClickableProps) => (
    <button
      {...props}
      css={{
        textAlign: 'unset',
        outline: 'none',
        margin: 0,
        border: 'none',
        padding: 0,
        background: 'none',
        cursor: 'pointer',
      }}
    />
  ),
  {
    /**
     * Clickable that brighten on hover & reduce opacity on pressed
     */
    WithFeedback: (props: ClickableProps) => (
      <Clickable
        {...props}
        css={{
          ':hover': { filter: 'brightness(1.2)' },
          ':active': { opacity: 0.8 },
        }}
      />
    ),
  }
)

export default Clickable
