import MemberRow from '@components/MemberRow'
import { Chain } from '@domains/chains'
import { AugmentedAccount } from '@domains/multisig'
import { css } from '@emotion/css'
import { Address } from '@util/addresses'
import { toast } from 'react-hot-toast'
import { selectedAccountState } from '../../../domains/auth/index'
import { useRecoilValue } from 'recoil'
import { AddMemberInput } from '../../../components/AddMemberInput'
import { useKnownAddresses } from '@hooks/useKnownAddresses'

const AddMembers = (props: {
  setAddedAccounts: React.Dispatch<React.SetStateAction<Address[]>>
  augmentedAccounts: AugmentedAccount[]
  chain: Chain
}) => {
  const selectedAccount = useRecoilValue(selectedAccountState)
  const { addresses: knownAddresses } = useKnownAddresses()

  const selectedAugmentedAccount = selectedAccount
    ? props.augmentedAccounts.find(a => a.address.isEqual(selectedAccount.injected.address))
    : undefined

  return (
    <div
      css={{
        display: 'grid',
        justifyItems: 'center',
        alignItems: 'center',
        gap: 24,
        width: '100%',
      }}
    >
      <div css={{ width: '100%' }}>
        <h2 css={({ color }) => ({ fontSize: 20, color: color.offWhite })}>Members</h2>
        <p css={{ marginTop: 4 }}>Select the addresses to act as Members of this Vault.</p>
      </div>
      <div css={{ width: '100%' }}>
        <div
          className={css`
            display: flex;
            width: 100%;
            flex-direction: column;
            gap: 16px;
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
                onDelete={() =>
                  props.setAddedAccounts(addedAccounts => addedAccounts.filter(a => !a.isEqual(account.address)))
                }
              />
            ))}
        </div>
        <AddMemberInput
          validateAddress={address => {
            const conflict = props.augmentedAccounts.some(a => a.address.isEqual(address))
            if (conflict) toast.error('Duplicate address')
            return !conflict
          }}
          onNewAddress={address => props.setAddedAccounts(addedAccounts => [...addedAccounts, address])}
          addresses={knownAddresses}
        />
      </div>
    </div>
  )
}

export default AddMembers
