import { DISCORD_JOIN_URL, TALISMAN_TWITTER_URL } from '@util/links'
import { Trans, useTranslation } from 'react-i18next'

import { Section } from './Section'

export const BenefitsInfo = () => {
  const { t } = useTranslation('spirit-keys')
  return (
    <Section>
      <h2>{t('benefitsInfo.title')}</h2>
      <p>{t('benefitsInfo.description')}</p>
      <ul>
        <li>
          <Trans i18nKey="benefitsInfo.list.0" ns="spirit-keys">
            The Talisman
            <a href={DISCORD_JOIN_URL} target="_blank" rel="noopener noreferrer">
              Discord server
            </a>
          </Trans>
        </li>
        <li>{t('benefitsInfo.list.1')}</li>
        <li>
          <Trans i18nKey="benefitsInfo.list.2" ns="spirit-keys">
            Keeping an eye out for giveaways on
            <a href={TALISMAN_TWITTER_URL} target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
          </Trans>
        </li>
        <li>{t('benefitsInfo.list.3')}</li>
      </ul>
    </Section>
  )
}
