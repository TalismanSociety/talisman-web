import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

void i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: ['en', 'cn', 'fr', 'ru', 'es', 'th', 'ptbr', 'de', 'vie', 'tr', 'jp', 'ko', 'it'],
    // debug: import.meta.env.NODE_ENV !== 'production',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
      useSuspense: true,
    },
  })

export default i18n
