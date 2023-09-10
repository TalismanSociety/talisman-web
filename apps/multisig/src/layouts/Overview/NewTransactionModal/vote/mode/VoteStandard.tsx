import { AmountFlexibleInput } from '@components/AmountFlexibleInput'
import { BaseToken } from '@domains/chains'
import { StandardVoteParams, VoteDetails } from '@domains/referenda'
import ConvictionsDropdown from '../ConvictionsDropdown'
import { useState } from 'react'
import { parseUnits } from '@util/numbers'
import BN from 'bn.js'

type Props = {
  token?: BaseToken
  onChange: (v: VoteDetails['details']) => void
  params: StandardVoteParams
}

const VoteStandard = ({ params, onChange, token }: Props) => {
  const [amount, setAmount] = useState('')

  const handleAmountChange = (amount: string) => {
    if (!token) return

    setAmount(amount)
    let balance = new BN(0)
    try {
      balance = parseUnits(amount, token.decimals)
    } catch (e) {
      // if failed to parse, input is likely '' or invalid number, hence we default to BN(0)
      balance = new BN(0)
    }
    if (balance.eq(params.balance)) return
    onChange({
      Standard: {
        balance,
        vote: params.vote,
      },
    })
  }

  const handleConvictionChange = (conviction: number) => {
    onChange({
      Standard: {
        balance: params.balance,
        vote: {
          conviction,
          aye: params.vote.aye,
        },
      },
    })
  }

  return (
    <>
      <AmountFlexibleInput
        // the tokens list should only contain the chain's native token
        tokens={token ? [token] : []}
        selectedToken={token}
        amount={amount}
        leadingLabel="Amount to vote"
        setAmount={handleAmountChange}
      />
      <ConvictionsDropdown conviction={params.vote.conviction} onChange={handleConvictionChange} />
    </>
  )
}

export default VoteStandard
