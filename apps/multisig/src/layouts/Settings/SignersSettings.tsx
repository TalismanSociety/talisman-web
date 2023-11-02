import { Member } from '@components/Member'
import { Multisig } from '@domains/multisig'
import { Address } from '@util/addresses'
import { useKnownAddresses } from '@hooks/useKnownAddresses'
import { AddMemberInput } from '@components/AddMemberInput'
import toast from 'react-hot-toast'

type Props = {
  editable?: boolean
  members: Address[]
  multisig: Multisig
  onChange?: (members: Address[]) => void
}

export const SignersSettings: React.FC<Props> = ({ editable, members, multisig, onChange }) => {
  const { addresses: knownAddresses, contactByAddress } = useKnownAddresses(multisig.id)

  const handleRemove = (address: Address) => {
    const newMembers = members.filter(m => !m.isEqual(address))
    onChange?.(newMembers)
  }

  const handleAdd = (address: Address) => {
    if (members.some(m => m.isEqual(address))) return
    onChange?.([...members, address])
  }

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <p css={({ color }) => ({ color: color.offWhite, fontSize: 14, marginTop: 2 })}>Members</p>
      {members.map(m => {
        const addressString = m.toSs58()
        const contact = contactByAddress[addressString]
        return (
          <Member
            chain={multisig.chain}
            key={addressString}
            m={{
              address: m,
              nickname: contact?.name,
              you: contact?.extensionName !== undefined,
            }}
            onDelete={editable && members.length > 2 ? () => handleRemove(m) : undefined}
          />
        )
      })}
      {editable && (
        <AddMemberInput
          compactInput
          onNewAddress={handleAdd}
          validateAddress={address => {
            const conflict = members.some(a => a.isEqual(address))
            if (conflict) toast.error('Duplicate address')
            return !conflict
          }}
          addresses={knownAddresses}
        />
      )}
    </div>
  )
}
