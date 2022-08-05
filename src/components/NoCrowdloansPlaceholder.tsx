import { Crowdloan } from '@archetypes'
import crowdloanRowSkeleton from '@assets/crowdloan-row-skeleton.png'
import { Button } from '@components'
import { Placeholder } from '@components/Placeholder'
import { TALISMAN_SPIRIT_KEYS_RMRK } from '@util/links'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const NoCrowdloansPlaceholder = styled(({ text, subtext }) => (
  <Placeholder placeholderImage={crowdloanRowSkeleton}>
    <div className="description">
      {text}
      <br />
      {subtext}
    </div>
    {/* <div className="cta">
      <a href={TALISMAN_SPIRIT_KEYS_RMRK} target="_blank" rel="noopener noreferrer">
        <Button className="outlined">{t('noNfts.primaryCta')}</Button>
      </a>
    </div> */}
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
