import type { PropsWithChildren, ReactNode } from 'react'
import { useTheme } from '@emotion/react'
import { Surface, useSurfaceColorAtElevation } from '@talismn/ui/atoms/Surface'
import { Text } from '@talismn/ui/atoms/Text'
import { DescriptionList } from '@talismn/ui/molecules/DescriptionList'
import { ListItem } from '@talismn/ui/molecules/ListItem'
import { SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR, SideSheet } from '@talismn/ui/molecules/SideSheet'
import { CheckCircle, Copy, ExternalLink, XCircle } from '@talismn/web-icons'
import { formatDistanceToNow } from 'date-fns'
import { useMemo } from 'react'
// @ts-expect-error
import { ObjectView } from 'react-object-view'

import type { Account } from '@/domains/accounts/recoils'
import { AccountIcon } from '@/components/molecules/AccountIcon'
import { copyAddressToClipboard, copyExtrinsicHashToClipboard } from '@/domains/common/utils/clipboard'
import { truncateAddress } from '@/util/truncateAddress'

export type ExtrinsicDetailsSideSheetProps = {
  onRequestDismiss: () => unknown
  id: string
  chain: string
  subscanUrl?: string
  blockHeight: string | number
  hash: string
  module: string
  call: string
  signer?: Account
  date: Date
  success: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  arguments: any
  transfers?: Array<{ debit: Account; credit: Account; amount: ReactNode }>
  rewards?: Array<{ debit: Account; amount: ReactNode }>
}

const Table = (props: PropsWithChildren) => (
  <table
    css={{
      width: '100%',
      borderCollapse: 'collapse',
      'tbody > tr:not(:last-child)': { borderBottom: `1px solid ${useSurfaceColorAtElevation(x => x + 1)}` },
      '*:is(th,td)': { textAlign: 'start', padding: '0.8rem' },
      '*:is(th,td):last-child': { textAlign: 'end' },
    }}
    {...props}
  />
)

const AccountItem = (props: { account: Account }) => (
  <ListItem
    css={{ padding: 0, cursor: 'pointer' }}
    leadingContent={<AccountIcon account={props.account} size="3.2rem" />}
    headlineContent={props.account.name ?? truncateAddress(props.account.address)}
    supportingContent={props.account.name !== undefined && truncateAddress(props.account.address)}
    onClick={() => {
      void copyAddressToClipboard(props.account.address)
    }}
  />
)

export const ExtrinsicDetailsSideSheet = (props: ExtrinsicDetailsSideSheetProps) => {
  const theme = useTheme()
  return (
    <SideSheet title="Extrinsic details" onRequestDismiss={props.onRequestDismiss}>
      <DescriptionList emphasis="details" css={{ marginTop: '1.6rem', marginBottom: '1.6rem' }}>
        <DescriptionList.Description>
          <DescriptionList.Term>Chain</DescriptionList.Term>
          <DescriptionList.Details>{props.chain}</DescriptionList.Details>
        </DescriptionList.Description>
        <DescriptionList.Description>
          <DescriptionList.Term>Extrinsic ID</DescriptionList.Term>
          <DescriptionList.Details>
            {props.subscanUrl ? (
              <span>
                <ExternalLink size="1em" />{' '}
                <Text.Noop.A href={props.subscanUrl} target="_blank">
                  {props.id}
                </Text.Noop.A>
              </span>
            ) : (
              props.id
            )}
          </DescriptionList.Details>
        </DescriptionList.Description>
        <DescriptionList.Description>
          <DescriptionList.Term>Block</DescriptionList.Term>
          <DescriptionList.Details>{props.blockHeight}</DescriptionList.Details>
        </DescriptionList.Description>
        <DescriptionList.Description>
          <DescriptionList.Term>Extrinsic hash</DescriptionList.Term>
          <DescriptionList.Details
            css={{ cursor: 'pointer' }}
            onClick={() => {
              void copyExtrinsicHashToClipboard(props.hash)
            }}
          >
            <span>
              <Copy size="1em" /> <span css={{ textDecoration: 'underline' }}>{truncateAddress(props.hash, 6, 6)}</span>
            </span>
          </DescriptionList.Details>
        </DescriptionList.Description>
        <DescriptionList.Description>
          <DescriptionList.Term>Module</DescriptionList.Term>
          <DescriptionList.Details>{props.module}</DescriptionList.Details>
        </DescriptionList.Description>
        <DescriptionList.Description>
          <DescriptionList.Term>Call</DescriptionList.Term>
          <DescriptionList.Details>{props.call}</DescriptionList.Details>
        </DescriptionList.Description>
        {props.signer && (
          <DescriptionList.Description>
            <DescriptionList.Term>Signer</DescriptionList.Term>
            <DescriptionList.Details
              css={{ cursor: 'pointer' }}
              onClick={() => {
                if (props.signer !== undefined) {
                  void copyAddressToClipboard(props.signer.address)
                }
              }}
            >
              <span>
                <Copy size="1em" />{' '}
                <span css={{ textDecoration: 'underline' }}>{truncateAddress(props.signer.address)}</span>
              </span>
            </DescriptionList.Details>
          </DescriptionList.Description>
        )}
        <DescriptionList.Description>
          <DescriptionList.Term>Time</DescriptionList.Term>
          <DescriptionList.Details>
            {useMemo(() => formatDistanceToNow(props.date, { addSuffix: true }), [props.date])}
          </DescriptionList.Details>
        </DescriptionList.Description>
        <DescriptionList.Description>
          <DescriptionList.Term>Result</DescriptionList.Term>
          <DescriptionList.Details>
            {props.success ? (
              <CheckCircle size="1em" css={{ color: '#38D448' }} />
            ) : (
              <XCircle size="1em" css={{ color: theme.color.error }} />
            )}
          </DescriptionList.Details>
        </DescriptionList.Description>
      </DescriptionList>
      {props.transfers && props.transfers.length > 0 && (
        <section css={{ marginTop: '4.8rem' }}>
          <header>
            <Text.H4 alpha="high" css={{ marginBottom: '1.6rem' }}>
              Transfers
            </Text.H4>
          </header>
          <Table>
            <thead>
              <tr>
                <Text.BodySmall as="th">From</Text.BodySmall>
                <Text.BodySmall as="th">To</Text.BodySmall>
                <Text.BodySmall as="th">Amount</Text.BodySmall>
              </tr>
            </thead>
            <tbody>
              {props.transfers.map(({ debit, credit, amount }, index) => (
                <tr key={index}>
                  <Text.Body as="td" alpha="high">
                    <AccountItem account={credit} />
                  </Text.Body>
                  <Text.Body as="td" alpha="high">
                    <AccountItem account={debit} />
                  </Text.Body>
                  <Text.Body as="td" alpha="high">
                    {amount}
                  </Text.Body>
                </tr>
              ))}
            </tbody>
          </Table>
        </section>
      )}
      {props.rewards && props.rewards?.length > 0 && (
        <section css={{ marginTop: '4.8rem' }}>
          <header>
            <Text.H4 alpha="high" css={{ marginBottom: '1.6rem' }}>
              Rewards
            </Text.H4>
          </header>
          <Table>
            <thead>
              <tr>
                <Text.BodySmall as="th">For</Text.BodySmall>
                <Text.BodySmall as="th">Amount</Text.BodySmall>
              </tr>
            </thead>
            <tbody>
              {props.rewards.map(({ debit, amount }, index) => (
                <tr key={index}>
                  <Text.Body as="td" alpha="high">
                    <AccountItem account={debit} />
                  </Text.Body>
                  <Text.Body as="td" alpha="high">
                    {amount}
                  </Text.Body>
                </tr>
              ))}
            </tbody>
          </Table>
        </section>
      )}
      <Surface
        css={{
          marginTop: '4.8rem',
          borderRadius: '1.6rem',
          padding: '1.6rem',
          [SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { width: '50rem' },
        }}
      >
        <Text.Body as="header" alpha="high" css={{ marginBottom: '1.6rem' }}>
          Parameters
        </Text.Body>
        <Surface
          css={{
            borderRadius: '0.8rem',
            padding: '1rem',
            overflow: 'auto',
            maxHeight: '35vh',
          }}
        >
          <ObjectView data={props.arguments} palette={{ base00: 'transparent' }} options={{ expandLevel: 10 }} />
        </Surface>
      </Surface>
    </SideSheet>
  )
}
