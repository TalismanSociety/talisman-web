import { Field } from '@components'
import styled from '@emotion/styled'
import { trackGoal } from '@libs/fathom'
import { useTranslation } from 'react-i18next'

export const LanguageSelector = styled(({ className }: { className?: string }) => {
  const { i18n, ready } = useTranslation('languages', { useSuspense: false })
  const changeLanguage = (language: string) => {
    i18n?.changeLanguage(language)
    trackGoal('DZMVTSLI', 1) // locale_switch
  }

  if (!ready) {
    return null
  }
  return (
    <Field.Select
      className={className}
      suffix={true}
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
