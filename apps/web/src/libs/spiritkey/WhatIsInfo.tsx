import { useTranslation } from 'react-i18next'

import { Section } from './Section'

export const WhatIsInfo = () => {
  const { t } = useTranslation('spirit-keys')
  return (
    <Section>
      <h2>{t('whatIsInfo.title')}</h2>
      <p>{t('whatIsInfo.description')}</p>
      <ul>
        <li>{t('whatIsInfo.list.0')}</li>
        <li>{t('whatIsInfo.list.1')}</li>
        <li>{t('whatIsInfo.list.2')}</li>
        {/* {(t('whatIsInfo.list', { returnObjects: true }) as [])?.map(item => {
          return <li key={item}>{item}</li>
        })} */}
      </ul>
    </Section>
  )
}
