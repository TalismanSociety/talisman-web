import { motion } from 'framer-motion'
import { createContext, type PropsWithChildren } from 'react'
import { Clickable, Text, type ClickableProps } from '../../atoms'

const SegmentedButtonContext = createContext<{
  value: string | number | undefined
  onChange: (value: string | number) => unknown
}>({ value: undefined, onChange: () => {} })

type ButtonSegmentProps = Omit<ClickableProps, 'value'> & {
  value: string | number
}

const ButtonSegment = (props: ButtonSegmentProps) => (
  <SegmentedButtonContext.Consumer>
    {({ value: selectedValue, onChange }) => (
      <Text.Body
        as={Clickable}
        {...props}
        color={selectedValue === props.value ? theme => theme.color.onPrimary : undefined}
        css={{ position: 'relative', padding: '1rem 1.2rem' }}
        onClick={() => onChange(props.value)}
      >
        {selectedValue === props.value && (
          <motion.div
            layoutId="highlight"
            css={theme => ({
              position: 'absolute',
              inset: 0,
              borderRadius: '1.2rem',
              backgroundColor: theme.color.primary,
            })}
          />
        )}
        <div css={{ position: 'relative' }}>{props.children}</div>
      </Text.Body>
    )}
  </SegmentedButtonContext.Consumer>
)

export type SegmentedButtonProps<T extends string | number> = PropsWithChildren<{
  className?: string
  value: T | undefined
  onChange: (value: T) => unknown
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
      <section
        className={props.className}
        css={theme => ({ borderRadius: '1.4rem', padding: '0.4rem', backgroundColor: theme.color.surface })}
      >
        {props.children}
      </section>
    </SegmentedButtonContext.Provider>
  ),
  { ButtonSegment }
)

export default SegmentedButton
