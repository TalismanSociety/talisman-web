import type { AlertDialogProps } from '@talismn/ui/molecules/AlertDialog'
import type { ChangeEventHandler, ReactElement } from 'react'
import { Hr } from '@talismn/ui/atoms/Hr'
import { useSurfaceColor } from '@talismn/ui/atoms/Surface'
import { Text } from '@talismn/ui/atoms/Text'
import { ALERT_DIALOG_PADDING, AlertDialog } from '@talismn/ui/molecules/AlertDialog'
import { TextInput } from '@talismn/ui/molecules/TextInput'
import React, { useCallback, useState } from 'react'

import { Cryptoticon } from '@/components/recipes/Cryptoticon'

export type TokenSelectorItemProps = {
  logoSrc?: string
  name: string
  networkLogoSrc?: string
  network?: string
  amount?: string
  fiatAmount?: string
  disabled?: boolean
  onClick: () => unknown
}

export const TokenSelectorItem = (props: TokenSelectorItemProps) => (
  <li
    role="button"
    aria-disabled={props.disabled}
    onClick={props.disabled ? undefined : props.onClick}
    css={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.4rem 1.8rem',
      cursor: 'pointer',
      '&[aria-disabled="true"]': { opacity: 0.3, cursor: 'not-allowed' },
      ':hover': { backgroundColor: useSurfaceColor() },
    }}
  >
    <header css={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      <Cryptoticon src={props.logoSrc} size="3.4rem" />
      <div>
        <Text.Body as="div" alpha="high">
          {props.name}
        </Text.Body>
        {props.network && (
          <Text.Body as="div" css={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Cryptoticon src={props.logoSrc} size="1em" />
            {props.network}
          </Text.Body>
        )}
      </div>
    </header>
    <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <Text.Body alpha="high">{props.amount}</Text.Body>
      <Text.Body>{props.fiatAmount}</Text.Body>
    </div>
  </li>
)

export type TokenSelectorDialogProps = Pick<AlertDialogProps, 'open' | 'onRequestDismiss'> & {
  children?: undefined | ReactElement<TokenSelectorItemProps> | Array<ReactElement<TokenSelectorItemProps>>
}

export const TokenSelectorDialog = Object.assign(
  (props: TokenSelectorDialogProps) => {
    const [query, setQuery] = useState('')
    return (
      <AlertDialog {...props} targetWidth="42.2rem" title="Select a token" css={{ paddingBottom: 0 }}>
        <div>
          <TextInput
            placeholder="🔍 Search by token"
            value={query}
            onChange={useCallback<ChangeEventHandler<HTMLInputElement>>(event => setQuery(event.target.value), [])}
          />
          <div css={{ marginLeft: `-${ALERT_DIALOG_PADDING}`, marginRight: `-${ALERT_DIALOG_PADDING}` }}>
            <Hr css={{ marginBottom: 0 }} />
            <ul
              css={{
                margin: 0,
                padding: 0,
                '@media (min-width: 768px)': {
                  maxHeight: '35vh',
                  overflow: 'auto',
                },
              }}
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {React.Children.toArray(props.children).filter((x: any) =>
                x.props.name.toLowerCase().includes(query.toLowerCase())
              )}
            </ul>
          </div>
        </div>
      </AlertDialog>
    )
  },
  {
    Item: TokenSelectorItem,
  }
)
