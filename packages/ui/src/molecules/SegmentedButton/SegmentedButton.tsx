import { useTheme } from '@emotion/react'
import { IconContext } from '@talismn/icons/utils'
import { motion } from 'framer-motion'
import { createContext, type PropsWithChildren, type ReactNode } from 'react'
import { Clickable, Surface, Text, type ClickableProps } from '../../atoms'

const SegmentedButtonContext = createContext<{
  value: string | number | undefined
  onChange?: (value: string | number) => unknown
}>({ value: undefined, onChange: () => {} })

type ButtonSegmentProps = Omit<ClickableProps, 'value'> & {
  value: string | number
  leadingIcon?: ReactNode
}

const ButtonSegment = (props: ButtonSegmentProps) => {
  const theme = useTheme()
  return (
    <SegmentedButtonContext.Consumer>
      {({ value: selectedValue, onChange }) => (
        <Text.Body
          as={Clickable}
          {...props}
          color={selectedValue === props.value ? theme.color.onPrimary : undefined}
          css={{
            position: 'relative',
            padding: '1rem 1.2rem',
          }}
          onClick={() => onChange?.(props.value)}
        >
          {selectedValue === props.value && (
            <motion.div
              layoutId="highlight"
              css={{
                position: 'absolute',
                inset: 0,
                borderRadius: '1.2rem',
                backgroundColor: theme.color.primary,
              }}
            />
          )}
          <div css={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.25em' }}>
            {props.leadingIcon && (
              <div css={{ display: 'contents' }}>
                <IconContext.Provider value={{ size: '1.125em' }}>{props.leadingIcon}</IconContext.Provider>
              </div>
            )}
            {props.children}
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
  <T extends string | number>(props: SegmentedButtonProps<T>) => (
    <SegmentedButtonContext.Provider
      value={{
        value: props.value,
        // @ts-expect-error
        onChange: props.onChange,
      }}
    >
      <Surface
        as="section"
        className={props.className}
        css={{ display: 'inline-block', borderRadius: '1.4rem', padding: '0.4rem' }}
      >
        {props.children}
      </Surface>
    </SegmentedButtonContext.Provider>
  ),
  { ButtonSegment }
)

export default SegmentedButton
