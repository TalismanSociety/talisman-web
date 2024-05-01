import { CircularProgressIndicator, IconButton, Skeleton, Text, TonalChip, useTheme } from '@talismn/ui'
import { CheckCircle, ExternalLink, XCircle } from '@talismn/web-icons'
import type { PropsWithChildren, ReactNode } from 'react'
import { DexFormInfoNotice, type DexFormInfoNoticeProps } from './components'
import React from 'react'

export type ActivityLineItemProps = {
  state: 'pending' | 'complete' | 'failed'
  amount: ReactNode
  date: Date
  externalLink: string
}

const ActivityLineItem = Object.assign(
  (props: ActivityLineItemProps) => {
    const theme = useTheme()
    return (
      <div css={{ containerType: 'inline-size', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <div css={{ flex: '0 9rem', display: 'none', '@container(min-width: 36rem)': { display: 'revert' } }}>
          {(() => {
            switch (props.state) {
              case 'pending':
                return (
                  <TonalChip contentColor="#f48f45" leadingContent={<CircularProgressIndicator />}>
                    Pending
                  </TonalChip>
                )
              case 'complete':
                return <TonalChip contentColor="#38d448">Complete</TonalChip>
              case 'failed':
                return <TonalChip contentColor="#d22424">Failed</TonalChip>
            }
          })()}
        </div>
        <div css={{ flex: '0 2rem', '@container(min-width: 36rem)': { display: 'none' } }}>
          {(() => {
            switch (props.state) {
              case 'pending':
                return <CircularProgressIndicator size="1em" />
              case 'complete':
                return <CheckCircle size="1em" css={{ color: '#38d448' }} />
              case 'failed':
                return <XCircle size="1em" css={{ color: '#d22424' }} />
            }
          })()}
        </div>
        <Text.Body as="div" alpha="high" css={{ flex: 2 }}>
          {props.amount}
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
            <Text.BodySmall
              css={{ flex: '0 9rem', display: 'none', '@container(min-width: 36rem)': { display: 'revert' } }}
            >
              Status
            </Text.BodySmall>
            <div css={{ flex: '0 2rem', '@container(min-width: 36rem)': { display: 'none' } }} />
            <Text.BodySmall css={{ flex: 2 }}>Amount</Text.BodySmall>
            <Text.BodySmall css={{ flex: 1 }}>Date</Text.BodySmall>
            <Text.BodySmall css={{ flex: '0 2rem', textAlign: 'center' }}>TX</Text.BodySmall>
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
