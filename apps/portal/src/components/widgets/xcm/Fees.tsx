import { DescriptionList } from '@talismn/ui/molecules/DescriptionList'
import { type ReactNode } from 'react'

export type FeesProps = {
  totalBalance: ReactNode
  originFee: ReactNode
  destinationFee: ReactNode
}

export const Fees = (props: FeesProps) => (
  <DescriptionList emphasis="details">
    <DescriptionList.Description>
      <DescriptionList.Term>Total balance</DescriptionList.Term>
      <DescriptionList.Details>{props.totalBalance}</DescriptionList.Details>
    </DescriptionList.Description>
    <DescriptionList.Description>
      <DescriptionList.Term>Origin fee</DescriptionList.Term>
      <DescriptionList.Details>{props.originFee}</DescriptionList.Details>
    </DescriptionList.Description>
    <DescriptionList.Description>
      <DescriptionList.Term>Destination fee</DescriptionList.Term>
      <DescriptionList.Details>{props.destinationFee}</DescriptionList.Details>
    </DescriptionList.Description>
  </DescriptionList>
)
