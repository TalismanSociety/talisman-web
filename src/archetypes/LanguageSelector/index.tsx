import { Field } from '@components'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { trackGoal } from '@libs/fathom'

export const LanguageSelector = styled(({ className }) => {
  const { i18n, ready } = useTranslation('languages', { useSuspense: false })
  const changeLanguage = (language: string) => {
    i18n?.changeLanguage(language)
    trackGoal('DZMVTSLI', 1); // locale_switch
  }

  if (!ready) {
    return null
  }
  return (
    <Field.Select
      className={className}
      suffix={false}
      options={i18n.languages.map(language => {
        return {
          key: language,
          value: language.toUpperCase(),
        }
      })}
      onChange={changeLanguage}
    />
  )
})`
  background: transparent;
  color: var(--color-foreground);
  border-radius: 1rem;
  border: solid 1px var(--color-dim);
  font-size: small;
`
