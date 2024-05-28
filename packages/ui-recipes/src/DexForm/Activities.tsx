import { DexFormInfoNotice, type DexFormInfoNoticeProps } from './components'
import { CircularProgressIndicator, Skeleton, Surface, Text, useTheme } from '@talismn/ui'
import { ArrowRight, Check, ExternalLink, XCircle } from '@talismn/web-icons'
import type { PropsWithChildren, ReactNode } from 'react'
import React from 'react'

export type ActivityLineItemProps = {
  state: 'pending' | 'complete' | 'failed'
  srcAmount: ReactNode
  destAmount: ReactNode
  srcAssetIconSrc: string
  destAssetIconSrc: string
  date: Date
  externalLink: string
}

const ActivityLineItem = Object.assign(
  (props: ActivityLineItemProps) => {
    const theme = useTheme()
    return (
      // eslint-disable-next-line react/jsx-no-target-blank
      <a href={props.externalLink} target="_blank" css={{ display: 'contents', cursor: 'pointer' }}>
        <Surface
          css={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            borderRadius: '0.8rem',
            padding: '0.8rem',
            ':not(:hover)': {
              backgroundColor: 'transparent',
              '>:last-child': {
                visibility: 'hidden',
              },
            },
          }}
        >
          <div>
            <img src={props.srcAssetIconSrc} css={{ width: '2.4rem', height: '2.4rem' }} />
            <img
              src={props.destAssetIconSrc}
              css={{ width: '2.4rem', height: '2.4rem', marginInlineStart: '-1.2rem' }}
            />
          </div>
          <div>
            <Text.Body as="div" alpha="high">
              <span>{props.srcAmount}</span>{' '}
              <Text>
                <ArrowRight size="1em" css={{ verticalAlign: '-0.12em' }} />
              </Text>{' '}
              <span>{props.destAmount}</span>
            </Text.Body>
            <Text.Body as="div" css={{ marginTop: '0.4rem' }}>
              {(() => {
                switch (props.state) {
                  case 'pending':
                    return <CircularProgressIndicator size="0.8rem" />
                  case 'complete':
                    return <Check size="0.8rem" css={{ color: '#38d448' }} />
                  case 'failed':
                    return <XCircle size="0.8rem" css={{ color: '#d22424' }} />
                }
              })()}{' '}
              <span css={{ marginLeft: '0.4rem' }}>
                {props.date.toLocaleDateString(undefined, { day: 'numeric', month: 'numeric', year: '2-digit' })}
              </span>
            </Text.Body>
          </div>
          <ExternalLink size="1.6rem" css={{ color: theme.color.primary, marginInlineStart: 'auto' }} />
        </Surface>
      </a>
    )
  },
  {
    Skeleton: () => <Skeleton.Surface css={{ height: '5.4rem' }} />,
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
        <div css={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>{props.children}</div>
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
