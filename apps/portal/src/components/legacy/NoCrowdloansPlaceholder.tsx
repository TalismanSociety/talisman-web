import styled from '@emotion/styled'
import React from 'react'

import crowdloanRowSkeleton from '@/assets/crowdloan-row-skeleton.png'
import { Placeholder } from '@/components/legacy/Placeholder'

const NoCrowdloansPlaceholder = styled(({ text, subtext }: { text: string; subtext: string }) => (
  <Placeholder placeholderImage={crowdloanRowSkeleton}>
    <div className="description">
      {text}
      <br />
      {subtext}
    </div>
  </Placeholder>
))`
  display: block;
  padding: 2rem;
  text-align: center;
  width: 100%;
`

type NoCrowdloansProps = {
  require: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any
  text: string
  subtext: string
}

export const NoCrowdloans = ({ require, children, ...props }: NoCrowdloansProps) => {
  return (require === undefined && !React.Children.count(children)) || !require ? (
    <NoCrowdloansPlaceholder {...props} />
  ) : (
    children
  )
}
