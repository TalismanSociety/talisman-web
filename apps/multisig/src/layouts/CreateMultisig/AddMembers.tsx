import MemberRow from '@components/MemberRow'
import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import { Plus } from '@talismn/icons'
import { Button, IconButton, TextInput } from '@talismn/ui'
import { device } from '@util/breakpoints'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

import toSs52Address from '../../util/toSs52Address'
import { AugmentedAccount } from '.'

const AddMembers = (props: {
  onBack: () => void
  onNext: () => void
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
      <div
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
          cursor: pointer;
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
      </div>
      <div
        className={css`
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 48px;
          width: 100%;
          button {
            height: 56px;
          }
        `}
      >
        <Button onClick={props.onBack} children={<h3>Back</h3>} variant="outlined" />
        <Button disabled={props.augmentedAccounts.length < 2} onClick={props.onNext} children={<h3>Next</h3>} />
      </div>
    </div>
  )
}

export default AddMembers
