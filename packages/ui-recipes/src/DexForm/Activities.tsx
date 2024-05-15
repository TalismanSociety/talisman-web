import { DexFormInfoNotice, type DexFormInfoNoticeProps } from './components'
import { CircularProgressIndicator, IconButton, Skeleton, SurfaceIcon, Text, TonalIcon, useTheme } from '@talismn/ui'
import { Check, ExternalLink, XCircle } from '@talismn/web-icons'
import type { PropsWithChildren, ReactNode } from 'react'
import React from 'react'

export type ActivityLineItemProps = {
  state: 'pending' | 'complete' | 'failed'
  srcAmount: ReactNode
  destAmount: ReactNode
  date: Date
  externalLink: string
}

const ActivityLineItem = Object.assign(
  (props: ActivityLineItemProps) => {
    const theme = useTheme()
    return (
      <div css={{ containerType: 'inline-size', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <div css={{ flex: '0 2rem' }}>
          {(() => {
            switch (props.state) {
              case 'pending':
                return (
                  <SurfaceIcon size="1.6rem">
                    <CircularProgressIndicator />
                  </SurfaceIcon>
                )
              case 'complete':
                return (
                  <TonalIcon size="1.6rem" contentColor="#38d448">
                    <Check />
                  </TonalIcon>
                )
              case 'failed':
                return (
                  <TonalIcon size="1.6rem" contentColor="#d22424">
                    <XCircle />
                  </TonalIcon>
                )
            }
          })()}
        </div>
        <Text.Body as="div" alpha="high" css={{ flex: 3 }}>
          <span>{props.srcAmount}</span> <span>➡️</span> <span>{props.destAmount}</span>
        </Text.Body>
        <Text.Body as="div" alpha="high" css={{ flex: 1 }}>
          {props.date.toLocaleDateString(undefined, { day: 'numeric', month: 'numeric', year: '2-digit' })}
        </Text.Body>
        <div css={{ flex: '0 2rem' }}>
          <IconButton as="a" href={props.externalLink} target="_blank" size="2rem" contentColor={theme.color.primary}>
            <ExternalLink />
          </IconButton>
        </div>
      </div>
    )
  },
  {
    Skeleton: () => <Skeleton.Surface css={{ height: '2rem' }} />,
  }
)

export type ActivityListProps = PropsWithChildren<{ title?: ReactNode; placeholder: ReactNode }>

export const ActivityList = Object.assign(
  (props: ActivityListProps) =>
    props.children === undefined || props.children === null || React.Children.count(props.children) === 0 ? (
      props.placeholder
    ) : (
      <div>
        {props.title && (
          <Text.Body as="header" css={{ textAlign: 'center', marginBottom: '1.6rem' }}>
            {props.title}
          </Text.Body>
        )}
        <div css={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div css={{ containerType: 'inline-size', display: 'flex', gap: '0.8rem' }}>
            <div css={{ width: '1.6rem' }} />
            <Text.BodySmall alpha="disabled" css={{ flex: 3 }}>
              Amount
            </Text.BodySmall>
            <Text.BodySmall alpha="disabled" css={{ flex: 1 }}>
              Date
            </Text.BodySmall>
            <Text.BodySmall alpha="disabled" css={{ width: '2rem', textAlign: 'center' }}>
              TX
            </Text.BodySmall>
          </div>
          {props.children}
        </div>
      </div>
    ),
  {
    Item: ActivityLineItem,
    Placeholder: (props: Omit<DexFormInfoNoticeProps, 'illustration'>) => (
      <DexFormInfoNotice
        illustration={
          <svg xmlns="http://www.w3.org/2000/svg" width="97" height="96" viewBox="0 0 97 96" fill="none">
            <circle cx="48.5" cy="48" r="48" fill="url(#paint0_linear_3285_21153)" />
            <path
              d="M72.5 48H62.9L55.7 72L41.3 24L34.1 48H24.5"
              stroke="url(#paint1_linear_3285_21153)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient
                id="paint0_linear_3285_21153"
                x1="48.5"
                y1="0"
                x2="48.5"
                y2="96"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#1B1B1B" />
                <stop offset="1" stopColor="#1B1B1B" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_3285_21153"
                x1="32.9143"
                y1="15.8321"
                x2="66.422"
                y2="85.4374"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#A5A5A5" />
                <stop offset="1" stopColor="#A5A5A5" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        }
        {...props}
      />
    ),
  }
)

export default ActivityLineItem
