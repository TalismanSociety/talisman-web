import { useTheme } from '@emotion/react'
import { ChevronRight } from '@talismn/icons'
import { motion } from 'framer-motion'
import {
  createContext,
  useCallback,
  useState,
  type MouseEventHandler,
  type PropsWithChildren,
  type ReactEventHandler,
  type DetailedHTMLProps,
  type HTMLAttributes,
} from 'react'

import React from 'react'
import { Text } from '../../atoms'

const DetailsContext = createContext({ onClick: (() => {}) as MouseEventHandler<HTMLElement> })

export type DetailsProps = React.DetailedHTMLProps<
  React.DetailsHTMLAttributes<HTMLDetailsElement>,
  HTMLDetailsElement
> & {
  onToggle?: (value: boolean) => unknown
}

const Details = Object.assign(
  (props: DetailsProps) => {
    const theme = useTheme()
    const [_open, setOpen] = useState(false)
    const open = props.open ?? _open

    return (
      <motion.details
        {...(props as any)}
        open={true}
        animate={JSON.stringify(open)}
        initial={JSON.stringify(false)}
        css={{
          borderRadius: '1.6rem',
          backgroundColor: theme.color.surface,
        }}
        onToggle={useCallback<ReactEventHandler<HTMLDetailsElement>>(event => event.preventDefault(), [])}
      >
        <DetailsContext.Provider
          value={{
            onClick: useCallback<MouseEventHandler<HTMLElement>>(
              event => {
                event.preventDefault()
                props.onToggle?.(!open)
                setOpen(!open)
              },
              [open, props]
            ),
          }}
        >
          {React.Children.toArray(props.children).at(0)}
        </DetailsContext.Provider>
        {React.Children.toArray(props.children).at(1)}
      </motion.details>
    )
  },
  {
    Summary: (props: PropsWithChildren<{ className?: string }>) => (
      <DetailsContext.Consumer>
        {({ onClick }) => (
          <summary
            className={props.className}
            onClick={onClick}
            css={{
              'listStyle': 'none',
              'display': 'flex',
              'alignItems': 'center',
              'gap': '1.6rem',
              'padding': '2.2rem 3.2rem',
              'cursor': 'pointer',
              '::-webkit-details-marker': {
                display: 'none',
              },
            }}
          >
            <Text.Body as="span" alpha="high" css={{ flex: 1, marginRight: '2rem' }}>
              {props.children}
            </Text.Body>
            <motion.div variants={{ true: { transform: 'rotate(90deg)' } }}>
              <ChevronRight className="marker" />
            </motion.div>
          </summary>
        )}
      </DetailsContext.Consumer>
    ),
    Content: (props: PropsWithChildren<{ className?: string }>) => (
      <motion.div
        className={props.className}
        variants={{ true: { opacity: 1, height: 'auto' }, false: { opacity: 0, height: 0 } }}
        css={{ overflow: 'hidden' }}
      >
        <Text.Body as="div" css={{ padding: '0 3.2rem 2.2rem 3.2rem' }}>
          {props.children}
        </Text.Body>
      </motion.div>
    ),
  }
)

export const OrderedDetailsList = (props: DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>) => (
  <ul
    {...props}
    css={{
      'counterReset': 'details-list',
      'margin': 0,
      'padding': 0,
      '> * + *': {
        marginTop: '1.6rem',
      },
      'summary': {
        '::before': {
          counterIncrement: 'details-list',
          content: 'counter(details-list)',
        },
      },
    }}
  />
)

export default Details
