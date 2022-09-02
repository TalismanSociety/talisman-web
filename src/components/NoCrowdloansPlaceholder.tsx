import crowdloanRowSkeleton from '@assets/crowdloan-row-skeleton.png'
import { Placeholder } from '@components/Placeholder'
import React from 'react'
import styled from 'styled-components'

const NoCrowdloansPlaceholder = styled(({ text, subtext }) => (
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
  children: any
  text: string
  subtext: string
}

const NoCrowdloans = ({ require, children, ...props }: NoCrowdloansProps) => {
  return (require === undefined && !React.Children.count(children)) || require === false ? (
    <NoCrowdloansPlaceholder {...props} />
  ) : (
    children
  )
}

export default NoCrowdloans
