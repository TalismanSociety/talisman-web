import { Clickable, Surface, Text, type ClickableProps } from '../../atoms'
import { useTheme } from '@emotion/react'
import { IconContext } from '@talismn/web-icons/utils'
import { LayoutGroup, motion } from 'framer-motion'
import { createContext, useId, type PropsWithChildren, type ReactNode } from 'react'

const SegmentedButtonContext = createContext<{
  value: string | number | undefined
  onChange?: (value: string | number) => unknown
}>({ value: undefined, onChange: () => {} })

type ButtonSegmentProps = Omit<ClickableProps, 'value'> & {
  value: string | number
  leadingIcon?: ReactNode
}

const ButtonSegment = ({ value, leadingIcon, children, ...passProps }: ButtonSegmentProps) => {
  const theme = useTheme()
  return (
    <SegmentedButtonContext.Consumer>
      {({ value: selectedValue, onChange }) => (
        <Text.Body
          as={Clickable}
          {...passProps}
          css={[
            {
              position: 'relative',
              padding: '0.7em 0.85em',
            },
            // This is to prevent a bug with Chrome, specifically in the swap/transport component
            selectedValue === value && {
              '*': {
                color: `color-mix(in srgb, ${theme.color.onPrimary}, transparent 30%)`,
              },
            },
            // Should be doing this instead
            // selectedValue === value && {
            //   color: theme.color.onPrimary,
            // },
          ]}
          onClick={() => onChange?.(value)}
        >
          {selectedValue === value && (
            <motion.div
              layoutId="highlight"
              css={{
                position: 'absolute',
                inset: 0,
                borderRadius: theme.shape.full,
                backgroundColor: theme.color.primaryContainer,
              }}
            />
          )}
          <div css={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.25em' }}>
            {leadingIcon && (
              <div css={{ display: 'contents' }}>
                <IconContext.Provider value={{ size: '1.125em' }}>{leadingIcon}</IconContext.Provider>
              </div>
            )}
            {children}
          </div>
        </Text.Body>
      )}
    </SegmentedButtonContext.Consumer>
  )
}

export type SegmentedButtonProps<T extends string | number> = PropsWithChildren<{
  className?: string
  value: T | undefined
  onChange?: (value: T) => unknown
}>

const SegmentedButton = Object.assign(
  <T extends string | number>(props: SegmentedButtonProps<T>) => {
    const theme = useTheme()
    return (
      <SegmentedButtonContext.Provider
        value={{
          value: props.value,
          // @ts-expect-error
          onChange: props.onChange,
        }}
      >
        <LayoutGroup id={useId()}>
          <Surface
            as="section"
            className={props.className}
            css={{ display: 'inline-block', borderRadius: theme.shape.full, padding: '0.4rem' }}
          >
            {props.children}
          </Surface>
        </LayoutGroup>
      </SegmentedButtonContext.Provider>
    )
  },
  { ButtonSegment }
)

export default SegmentedButton
