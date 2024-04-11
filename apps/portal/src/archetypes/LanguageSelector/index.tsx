import { Field } from '@components'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'

export const LanguageSelector = styled(({ className }: { className?: string }) => {
  const { i18n, ready } = useTranslation('languages', { useSuspense: false })
  const changeLanguage = (language: string) => {
    void i18n?.changeLanguage(language)
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
  font-size: small;
  padding: 0rem 1rem;
`
