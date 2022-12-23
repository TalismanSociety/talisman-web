import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import resources from '../../assets/locales.json'

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: ['en', 'cn', 'fr', 'ru', 'es', 'th', 'ptbr', 'de', 'vie', 'tr', 'jp', 'ko', 'it'],
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
})

export default i18n
