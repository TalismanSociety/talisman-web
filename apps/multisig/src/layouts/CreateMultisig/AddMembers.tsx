import MemberRow from '@components/MemberRow'
import { Chain } from '@domains/chains'
import { AugmentedAccount } from '@domains/multisig'
import { css } from '@emotion/css'
import { Button } from '@talismn/ui'
import { Address } from '@util/addresses'
import { toast } from 'react-hot-toast'
import { selectedAccountState } from '../../domains/auth/index'
import { useRecoilValue } from 'recoil'
import { AddMemberInput } from '../../components/AddMemberInput'

const AddMembers = (props: {
  onBack: () => void
  onNext: () => void
  setExcludeExtensionAccounts: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  setExternalAccounts: React.Dispatch<React.SetStateAction<Address[]>>
  augmentedAccounts: AugmentedAccount[]
  externalAccounts: Address[]
  chain: Chain
}) => {
  const selectedAccount = useRecoilValue(selectedAccountState)

  const selectedAugmentedAccount = selectedAccount
    ? props.augmentedAccounts.find(a => a.address.isEqual(selectedAccount.injected.address))
    : undefined

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
          margin-bottom: 24px;
        `}
      >
        {selectedAugmentedAccount && (
          <MemberRow chain={props.chain} truncate={true} member={selectedAugmentedAccount} />
        )}
        {props.augmentedAccounts
          .filter(acc => !selectedAugmentedAccount || !acc.address.isEqual(selectedAugmentedAccount.address))
          .map(account => (
            <MemberRow
              key={account.address.toPubKey()}
              chain={props.chain}
              truncate={true}
              member={account}
              onDelete={() => {
                if (account.you) {
                  const pubKey = account.address.toPubKey()
                  props.setExcludeExtensionAccounts(prev => ({
                    ...prev,
                    [pubKey]: !prev[pubKey],
                  }))
                } else {
                  props.setExternalAccounts(props.externalAccounts.filter(a => !a.isEqual(account.address)))
                }
              }}
            />
          ))}
      </div>
      <AddMemberInput
        validateAddress={address => {
          const conflict = props.augmentedAccounts.some(a => a.address.isEqual(address))
          if (conflict) toast.error('Duplicate address')
          return !conflict
        }}
        onNewAddress={address => props.setExternalAccounts([...props.externalAccounts, address])}
      />
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
        <Button
          disabled={props.augmentedAccounts.filter(a => !a.excluded).length < 2}
          onClick={props.onNext}
          children={<h3>Next</h3>}
        />
      </div>
    </div>
  )
}

export default AddMembers
