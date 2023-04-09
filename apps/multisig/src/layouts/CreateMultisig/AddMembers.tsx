import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import { ExternalLink, Plus, Trash } from '@talismn/icons'
import { Button, IconButton, Identicon, TextInput } from '@talismn/ui'
import { device } from '@util/breakpoints'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import truncateMiddle from 'truncate-middle'

import toSs52Address from '../../util/toSs52Address'
import { AugmentedAccount, Step } from '.'

const MemberRow = (props: { member: AugmentedAccount; onDelete: () => void }) => {
  const theme = useTheme()
  return (
    <div
      className={css`
        display: grid;
        grid-template-columns: 24px 1fr 16px 16px;
        gap: 8px;
        justify-items: flex-start;
        align-items: flex-start;
      `}
    >
      <Identicon
        className={css`
          width: 24px;
          height: auto;
        `}
        value={props.member.address}
      />
      {props.member.you ? (
        <>
          <span
            className={css`
              display: flex;
            `}
          >
            <p>{props.member.nickname}</p>
            &nbsp;
            <p
              className={css`
                color: var(--color-offWhite);
              `}
            >
              (You)
            </p>
          </span>
          <div></div>
        </>
      ) : (
        <>
          <p>{truncateMiddle(props.member.address, 22, 22, '...')}</p>
          <IconButton
            onClick={props.onDelete}
            className={css`
              cursor: pointer;
            `}
            as="button"
            size="16px"
            contentColor={`rgb(${theme.foreground})`}
          >
            <Trash />
          </IconButton>
        </>
      )}
      <a href={`https://subscan.io/account/${props.member.address}`} target="_blank" rel="noreferrer">
        <IconButton
          className={css`
            cursor: pointer;
          `}
          as="button"
          size="16px"
          contentColor={`rgb(${theme.foreground})`}
        >
          <ExternalLink />
        </IconButton>
      </a>
    </div>
  )
}

const AddMembers = (props: {
  setStep: React.Dispatch<React.SetStateAction<Step>>
  setExternalAccounts: React.Dispatch<React.SetStateAction<string[]>>
  augmentedAccounts: AugmentedAccount[]
  externalAccounts: string[]
}) => {
  const [newAddress, setNewAddress] = useState('')
  const theme = useTheme()

  return (
    <div
      className={css`
        display: grid;
        justify-items: center;
        align-self: flex-start;
        padding: 48px;
      `}
    >
      <h1>Add members</h1>
      <p
        className={css`
          text-align: center;
          margin-top: 16px;
          font-size: 16px;
        `}
      >
        Select the addresses that you would like to act as members of this vault.
      </p>
      <div
        className={css`
          display: flex;
          width: 100%;
          flex-direction: column;
          gap: 16px;
          margin-top: 48px;
        `}
      >
        {props.augmentedAccounts.map(account => {
          return (
            <MemberRow
              key={account.address}
              member={account}
              onDelete={() => {
                props.setExternalAccounts(props.externalAccounts.filter(a => a !== account.address))
              }}
            />
          )
        })}
      </div>
      <div
        className={css`
          margin-top: 48px;
          width: 490px;
          height: 56px;
          color: var(--color-offWhite);
          @media ${device.lg} {
            width: 623px;
          }
        `}
      >
        <TextInput
          className={css`
            font-size: 18px !important;
          `}
          placeholder="e.g. 13DgtSygjb8UeF41B5H25khiczEw2sHXeuWUgzVWrFjfwcUH"
          value={newAddress}
          onChange={event => setNewAddress(event.target.value)}
        />
      </div>
      <Button
        onClick={() => {
          const validAddress = toSs52Address(newAddress)
          if (!validAddress) {
            toast.error('Invalid address')
          } else if (props.augmentedAccounts.map(a => toSs52Address(a.address)).includes(newAddress)) {
            toast.error('Duplicate address')
          } else {
            if (validAddress !== newAddress) {
              toast.success('Added address as SS58')
            }
            props.setExternalAccounts([...props.externalAccounts, validAddress])
            setNewAddress('')
          }
        }}
        className={css`
          background: var(--color-backgroundLight) !important;
          color: var(--color-offWhite) !important;
          border-radius: 24px !important;
          margin-top: 24px;
          width: 176px;
          height: 40px;
          padding: 0 !important;
        `}
      >
        <div
          className={css`
            display: flex;
            gap: 8px;
            height: 40px;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          `}
        >
          <IconButton as="button" size="24px" contentColor={`rgb(${theme.primary})`}>
            <Plus />
          </IconButton>
          <span>Add member</span>
        </div>
      </Button>
      <div
        className={css`
          display: flex;
          gap: 16px;
        `}
      >
        <Button
          onClick={() => {
            props.setStep('nameVault')
          }}
          className={css`
            margin-top: 48px;
            width: 240px;
            height: 56px;
            @media ${device.lg} {
              width: 303px;
            }
          `}
          children={<h3>Back</h3>}
          variant="outlined"
        />
        <Button
          disabled={props.augmentedAccounts.length < 3}
          onClick={() => {
            props.setStep('confirmation')
          }}
          className={css`
            margin-top: 48px;
            width: 240px;
            height: 56px;
            @media ${device.lg} {
              width: 303px;
            }
          `}
          children={<h3>Next</h3>}
        />
      </div>
    </div>
  )
}

export default AddMembers
