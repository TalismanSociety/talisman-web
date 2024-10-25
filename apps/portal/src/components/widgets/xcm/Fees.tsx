import { DescriptionList } from '@talismn/ui'
import { type ReactNode } from 'react'

export type FeesProps = {
  originFee: ReactNode
  destinationFee: ReactNode
}

export const Fees = (props: FeesProps) => (
  <DescriptionList emphasis="details">
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
