import { useRecoilValueLoadable } from 'recoil'
import { AmountFlexibleInput } from '@components/AmountFlexibleInput'
import { selectedMultisigChainTokensState } from '@domains/multisig'
import { StandardVote } from '@domains/referenda'
import ConvictionsDropdown from '../ConvictionsDropdown'
import { useEffect, useState } from 'react'

type StandardVoteProps = Omit<StandardVote, 'vote'>

type Props = {
  onChange: (v: StandardVoteProps) => void
} & StandardVoteProps

const VoteStandard = ({ lockAmount, conviction, onChange }: Props) => {
  const tokens = useRecoilValueLoadable(selectedMultisigChainTokensState)
  const [amount, setAmount] = useState(lockAmount)

  // required to prevent an infinite rerender caused by an effect inside AmountFlexibleInput
  useEffect(() => {
    if (lockAmount !== amount)
      onChange({
        lockAmount: amount,
        conviction,
      })
  }, [amount, conviction, lockAmount, onChange])

  return (
    <>
      <AmountFlexibleInput
        // the tokens list should only contain the chain's native token
        tokens={tokens.contents ? [tokens.contents[0]] : []}
        selectedToken={tokens.contents?.[0]}
        amount={amount}
        setAmount={setAmount}
      />
      <ConvictionsDropdown conviction={conviction} onChange={conviction => onChange({ lockAmount, conviction })} />
    </>
  )
}

export default VoteStandard
