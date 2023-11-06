import { AugmentedAccount } from '@domains/multisig'
import { Address } from '@util/addresses'
import { CancleOrNext } from '../common/CancelOrNext'
import AddMembers from './AddMembers'
import { Chain } from '@domains/chains'
import { ThresholdSettings } from './ThresholdSettings'

type Props = {
  chain: Chain
  members: AugmentedAccount[]
  threshold: number
  onMembersChange: React.Dispatch<React.SetStateAction<Address[]>>
  onThresholdChange: (threshold: number) => void
  onBack: () => void
  onNext: () => void
}

export const MultisigConfig: React.FC<Props> = ({
  chain,
  onBack,
  onMembersChange,
  onNext,
  onThresholdChange,
  threshold,
  members,
}) => {
  return (
    <div
      css={{
        display: 'grid',
        justifyItems: 'center',
        alignItems: 'center',
        gap: 48,
        maxWidth: 540,
        width: '100%',
      }}
    >
      <h1>Multisig Configuration</h1>

      <AddMembers setAddedAccounts={onMembersChange} augmentedAccounts={members} chain={chain} />

      <ThresholdSettings membersCount={members.length} onChange={onThresholdChange} threshold={threshold} />

      <CancleOrNext
        block
        cancel={{ onClick: onBack, children: 'Back' }}
        next={{
          disabled: members.length <= 1 || threshold <= 1 || threshold > members.length,
          onClick: onNext,
        }}
      />
    </div>
  )
}
