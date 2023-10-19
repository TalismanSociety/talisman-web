import 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/mode-yaml'
import 'ace-builds/src-noconflict/theme-twilight'
import 'ace-builds/src-noconflict/ext-language_tools'

import AddressPill from '@components/AddressPill'
import { CallDataPasteForm } from '@components/CallDataPasteForm'
import AmountRow from '@components/AmountRow'
import MemberRow from '@components/MemberRow'
import { Rpc, decodeCallData } from '@domains/chains'
import { pjsApiSelector } from '@domains/chains/pjs-api'
import { Balance, Transaction, TransactionType, calcSumOutgoing, txOffchainMetadataState } from '@domains/multisig'
import useCopied from '@hooks/useCopied'
import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import { Check, ChevronRight, Copy, List, Send, Settings, Share2, Unknown, Users } from '@talismn/icons'
import { IconButton } from '@talismn/ui'
import { Address } from '@util/addresses'
import { useMemo, useState } from 'react'
import AceEditor from 'react-ace'
import { Collapse } from 'react-collapse'
import { useRecoilState, useRecoilValueLoadable } from 'recoil'
import truncateMiddle from 'truncate-middle'
import { VoteExpandedDetails, VoteTransactionHeader } from './VoteTransactionDetails'
import { useKnownAddresses } from '@hooks/useKnownAddresses'

const ChangeConfigExpandedDetails = ({ t }: { t: Transaction }) => {
  const { contactByAddress } = useKnownAddresses(t.multisig.id)
  return (
    <div>
      <div css={{ display: 'grid', gap: 12, marginTop: '8px' }}>
        {!t.executedAt && (
          <>
            <p css={{ fontWeight: 'bold' }}>Current Signers</p>
            {t.multisig.signers.map(s => {
              const contact = contactByAddress[s.toSs58()]
              return (
                <MemberRow
                  key={s.toPubKey()}
                  member={{ address: s, nickname: contact?.name, you: contact?.extensionName !== undefined }}
                  chain={t.multisig.chain}
                />
              )
            })}
            <p>Threshold: {t.multisig.threshold}</p>
          </>
        )}
        <p css={{ fontWeight: 'bold', marginTop: '8px' }}>{!t.executedAt ? 'Proposed ' : ''}New Signers</p>
        {t.decoded?.changeConfigDetails?.signers.map(s => {
          const contact = contactByAddress[s.toSs58()]
          return (
            <MemberRow
              key={s.toPubKey()}
              member={{ address: s, nickname: contact?.name, you: contact?.extensionName !== undefined }}
              chain={t.multisig.chain}
            />
          )
        })}
        <p>Threshold: {t.decoded?.changeConfigDetails?.threshold}</p>
      </div>
    </div>
  )
}

const MultiSendExpandedDetails = ({ t }: { t: Transaction }) => {
  const theme = useTheme()
  const recipients = t.decoded?.recipients || []
  const { contactByAddress } = useKnownAddresses(t.multisig.id)

  return (
    <div css={{ paddingBottom: '8px' }}>
      {t.decoded?.recipients.map((r, i) => {
        const { address, balance } = r
        const last = i === recipients.length - 1
        return (
          <div
            key={`${address.toSs58(t.multisig.chain)}-${JSON.stringify(balance.amount)}`}
            css={{
              display: 'grid',
              gap: '16px',
              borderBottom: `${last ? '0px' : '1px'} solid rgb(${theme.backgroundLighter})`,
              padding: `${last ? '8px 0 0 0' : '8px 0'}`,
            }}
          >
            <div css={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                className={css`
                  display: flex;
                  align-items: center;
                  height: 25px;
                  border-radius: 100px;
                  background-color: var(--color-backgroundLighter);
                  padding: 8px 14px;
                  font-size: 14px;
                  gap: 4px;
                  margin-left: 8px;
                `}
              >
                <span css={{ marginTop: '3px' }}>
                  {i + 1} of {recipients.length}
                </span>
              </div>
              <AddressPill name={contactByAddress[address.toSs58()]?.name} address={address} chain={t.multisig.chain} />
              <div css={{ marginLeft: 'auto' }}>
                <AmountRow balance={balance} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function AdvancedExpendedDetails({ callData, rpcs }: { callData: `0x${string}` | undefined; rpcs: Rpc[] }) {
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(rpcs))
  const [error, setError] = useState<Error | undefined>(undefined)

  const { extrinsic, human, lines } = useMemo(() => {
    if (apiLoadable.state === 'hasValue' && callData) {
      const api = apiLoadable.contents
      try {
        const extrinsic = decodeCallData(api, callData)
        const human = JSON.stringify(extrinsic?.method.toHuman(), null, 2)
        const lines = human.split(/\r\n|\r|\n/).length
        return { extrinsic, human, lines }
      } catch (error) {
        if (error instanceof Error) {
          setError(error)
        } else {
          setError(new Error('Unknown error'))
        }
      }
    }
    return { extrinsic: undefined, human: '', lines: 0 }
  }, [callData, apiLoadable])

  if (!callData) return null

  return (
    <div css={{ paddingBottom: '8px' }}>
      <AceEditor
        mode="yaml"
        theme="twilight"
        value={
          extrinsic
            ? human
            : error
            ? `Failed to decode calldata, please open an issue at\nhttps://github.com/TalismanSociety/talisman-web\nwith the following details:\n\nError\n${error}\n\nCalldata\n${callData}`
            : 'Loading...'
        }
        readOnly={true}
        name="yaml"
        setOptions={{ useWorker: false }}
        style={{ width: '100%', border: '1px solid #232323' }}
        minLines={lines + 1}
        maxLines={lines + 1}
      />
    </div>
  )
}

const TransactionDetailsExpandable = ({ t }: { t: Transaction }) => {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(t.decoded?.type !== TransactionType.Transfer)
  const [metadata, setMetadata] = useRecoilState(txOffchainMetadataState)
  const sumOutgoing: Balance[] = useMemo(() => calcSumOutgoing(t), [t])
  const { copied: copiedCallData, copy: copyCallData } = useCopied()
  const { copied: copiedCallHash, copy: copyCallHash } = useCopied()
  const { contactByAddress } = useKnownAddresses(t.multisig.id)

  const recipients = t.decoded?.recipients || []
  return (
    <div
      className={css`
        display: grid;
        align-content: center;
        width: 100%;
        padding: 8px 24px;
        border-radius: 16px;
        background-color: var(--color-backgroundLight);
        min-height: 56px;
      `}
    >
      <div
        className={css`
          display: flex;
          align-items: center;
          color: var(--color-offWhite);
          > svg {
            color: var(--color-primary);
            height: 20px;
            margin-left: 8px;
          }
        `}
      >
        {!t.decoded ? (
          <>
            <p css={{ marginTop: '4px' }}>Unknown Transaction</p>
            <Unknown />
          </>
        ) : t.decoded.type === TransactionType.MultiSend ? (
          <>
            <p css={{ marginTop: '4px' }}>Multi-Send</p>
            <Share2 />
            <div
              className={css`
                display: flex;
                margin-left: auto;
                align-items: center;
                gap: 4px;
                height: 25px;
                background-color: var(--color-backgroundLighter);
                color: var(--color-foreground);
                border-radius: 12px;
                padding: 5px 8px;
                margin-right: 16px;
              `}
            >
              <div
                className={css`
                  display: flex;
                  align-items: center;
                  height: 16px;
                  width: 16px;
                  border-radius: 100px;
                  background-color: var(--color-dim);
                  svg {
                    color: var(--color-primary);
                    height: 8px;
                  }
                `}
              >
                <Users />
              </div>
              <p css={{ fontSize: '14px', marginTop: '4px' }}>
                {recipients.length} Send{recipients.length !== 1 && 's'}
              </p>
            </div>
          </>
        ) : t.decoded.type === TransactionType.Transfer ? (
          <>
            <p css={{ marginTop: '4px' }}>Send</p>
            <Send />
          </>
        ) : t.decoded.type === TransactionType.Advanced ? (
          <>
            <p css={{ marginTop: '4px' }}>Advanced</p>
            <List />
          </>
        ) : t.decoded.type === TransactionType.ChangeConfig ? (
          <>
            <p css={{ marginTop: '4px' }}>Change Signer Configuration</p>
            <Settings css={{ marginRight: 'auto' }} />
          </>
        ) : t.decoded.type === TransactionType.Vote ? (
          <VoteTransactionHeader t={t} />
        ) : null}
        {t.decoded?.type === TransactionType.Transfer ? (
          <div
            className={css`
              color: var(--color-foreground);
              margin-right: 16px;
              margin-left: auto;
            `}
          >
            <AddressPill
              name={contactByAddress[recipients[0]!.address.toSs58()]?.name}
              address={recipients[0]?.address as Address}
              chain={t.multisig.chain}
            />
          </div>
        ) : null}
        {/* Show the token amounts being sent in this transaction */}
        {t.decoded && t.decoded.type !== TransactionType.Advanced && (
          <div css={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
            {sumOutgoing.map(b => {
              return <AmountRow key={b.token.id} balance={b} />
            })}
          </div>
        )}
        {/* Show the collapse btn */}
        {t.decoded ? (
          <div css={{ width: '28px', marginLeft: t.decoded.type === TransactionType.Advanced ? 'auto' : '0' }}>
            <IconButton
              contentColor={`rgb(${theme.offWhite})`}
              onClick={() => {
                setExpanded(!expanded)
              }}
              className={css`
                ${expanded && 'transform: rotate(90deg);'}
              `}
            >
              <ChevronRight />
            </IconButton>
          </div>
        ) : null}
      </div>
      <div
        className={css`
          .ReactCollapse--collapse {
            transition: height 300ms;
          }
        `}
      >
        <Collapse isOpened={expanded || !t.decoded}>
          {t.decoded?.type === TransactionType.MultiSend ? (
            <MultiSendExpandedDetails t={t} />
          ) : t.decoded?.type === TransactionType.ChangeConfig ? (
            <ChangeConfigExpandedDetails t={t} />
          ) : t.decoded?.type === TransactionType.Advanced ? (
            <AdvancedExpendedDetails callData={t.callData} rpcs={t.multisig.chain.rpcs} />
          ) : t.decoded?.type === TransactionType.Vote ? (
            <VoteExpandedDetails t={t} />
          ) : !t.decoded ? (
            <div css={{ margin: '8px 0', display: 'grid', gap: '8px' }}>
              <p css={{ fontSize: '14px' }}>
                Signet was unable to automatically determine the calldata for this transaction. Perhaps it was created
                outside of Signet, or the Signet metadata sharing service is down.
              </p>
              <p css={{ fontSize: '14px' }}>
                Don't worry though, it's not a problem. Ask someone to share the calldata with you and paste it below,
                or approve as-is <b>if and only if</b> you are sure you know what it is doing.
              </p>
              <CallDataPasteForm
                extrinsic={undefined}
                setExtrinsic={e => {
                  if (!e) return
                  const expectedHash = t.hash
                  const extrinsicHash = e.registry.hash(e.method.toU8a()).toHex()
                  if (expectedHash === extrinsicHash) {
                    setMetadata({
                      ...metadata,
                      [expectedHash]: [
                        {
                          callData: e.method.toHex(),
                          description: `Transaction ${truncateMiddle(expectedHash, 6, 4, '...')}`,
                        },
                        new Date(),
                      ],
                    })
                    setExpanded(true)
                  }
                }}
              />
              <p css={{ fontSize: '11px' }}>
                Call Hash <code>{t.hash}</code>
              </p>
            </div>
          ) : null}
          {t.callData && (
            <div
              css={{
                margin: '8px 0',
                display: 'grid',
                gap: '16px',
                borderTop: '1px solid var(--color-backgroundLighter)',
                paddingTop: '16px',
              }}
            >
              <p>Multisig call data</p>
              <div css={{ backgroundColor: 'var(--color-grey800)', padding: '16px', borderRadius: '8px' }}>
                <div css={{ display: 'flex', gap: '18px', alignItems: 'center', justifyContent: 'center' }}>
                  <p css={{ overflowWrap: 'break-word', maxWidth: '450px' }}>{t.callData}</p>
                  <IconButton
                    contentColor={copiedCallData ? `rgb(${theme.primary})` : `rgb(${theme.offWhite})`}
                    css={{ cursor: 'pointer', pointerEvents: copiedCallData ? 'none' : 'auto' }}
                    onClick={() => copyCallData(t.callData as string, 'Call data copied to clipboard.')}
                  >
                    {copiedCallData ? <Check /> : <Copy />}
                  </IconButton>
                </div>
              </div>
              <p>Call hash</p>
              <div css={{ backgroundColor: 'var(--color-grey800)', padding: '16px', borderRadius: '8px' }}>
                <div css={{ display: 'flex', gap: '18px', alignItems: 'center', justifyContent: 'center' }}>
                  <p css={{ overflowWrap: 'break-word', maxWidth: '450px' }}>{t.hash}</p>
                  <IconButton
                    contentColor={copiedCallHash ? `rgb(${theme.primary})` : `rgb(${theme.offWhite})`}
                    css={{ cursor: 'pointer', pointerEvents: copiedCallHash ? 'none' : 'auto' }}
                    onClick={() => copyCallHash(t.hash as string, 'Call hash copied to clipboard.')}
                  >
                    {copiedCallHash ? <Check /> : <Copy />}
                  </IconButton>
                </div>
              </div>
            </div>
          )}
        </Collapse>
      </div>
    </div>
  )
}

export default TransactionDetailsExpandable
