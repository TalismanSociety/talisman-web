import AddressInput from '@components/AddressInput'
import MemberRow from '@components/MemberRow'
import { Chain } from '@domains/chains'
import { AugmentedAccount } from '@domains/multisig'
import { css } from '@emotion/css'
import { Button, TextInput } from '@talismn/ui'
import { Address } from '@util/addresses'
import { device } from '@util/breakpoints'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

const AddMembers = (props: {
  onBack: () => void
  onNext: () => void
  setExternalAccounts: React.Dispatch<React.SetStateAction<Address[]>>
  augmentedAccounts: AugmentedAccount[]
  externalAccounts: Address[]
  chain: Chain
}) => {
  const [newAddress, setNewAddress] = useState('')
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
              key={account.address.toPubKey()}
              chain={props.chain}
              truncate={true}
              member={account}
              onDelete={() => {
                props.setExternalAccounts(props.externalAccounts.filter(a => !a.isEqual(account.address)))
              }}
            />
          )
        })}
      </div>
      <AddressInput
        additionalValidation={(str: string) => {
          const a = Address.fromSs58(str)
          if (a === false) return false
          if (props.augmentedAccounts.some(_a => _a.address.isEqual(a))) {
            toast.error('Duplicate address')
            return false
          }
          return true
        }}
        onNewAddress={(a: Address) => {
          props.setExternalAccounts([...props.externalAccounts, a])
        }}
        className={css`
          margin-top: 48px;
          width: 490px;
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
      </AddressInput>
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