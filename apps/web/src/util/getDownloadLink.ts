import detectBrowser, { BROWSER } from './detectBrowser'
import { TALISMAN_EXTENSION_CHROME_WEB_STORE_URL, TALISMAN_EXTENSION_FIREFOX_ADD_ONS_URL } from './links'

const getDownloadLink = () => {
  const browser = detectBrowser()

  if (browser === BROWSER.FIREFOX) {
    return TALISMAN_EXTENSION_FIREFOX_ADD_ONS_URL
  }

  // FALLBACK
  return TALISMAN_EXTENSION_CHROME_WEB_STORE_URL
}

export default getDownloadLink
