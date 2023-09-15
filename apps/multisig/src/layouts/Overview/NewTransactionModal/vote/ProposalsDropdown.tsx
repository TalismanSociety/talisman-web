import { Chain } from '@domains/chains'
import { useReferenda } from '@domains/referenda'
import { Select } from '@talismn/ui'
import { css } from '@emotion/css'

type Props = {
  chain: Chain
  referendumId?: number
  onChange: (referendumId: number) => void
}

export const ProposalsDropdown: React.FC<Props> = ({ chain, referendumId, onChange }) => {
  const { referendums } = useReferenda(chain)
  const ongoingReferendums = referendums?.filter(referendum => referendum.isOngoing)

  return (
    <Select
      className={css`
        button {
          height: 56px;
        }
      `}
      placeholder="Select proposal to vote on"
      value={referendumId}
      onChange={onChange}
    >
      {ongoingReferendums?.map(referendum => (
        <Select.Option headlineText={`Proposal #${referendum.index}`} value={referendum.index} key={referendum.index} />
      ))}
    </Select>
  )
}
