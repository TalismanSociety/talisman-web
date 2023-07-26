enum BROWSER {
  CHROME = 'CHROME',
  FIREFOX = 'FIREFOX',
  OPERA = 'OPERA',
  EDGE = 'EDGE',
  SAFARI = 'SAFARI',
  NO_BROWSER_DETECTED = 'NO_BROWSER_DETECTED',
}

const detectBrowser = () => {
  const userAgent = navigator.userAgent

  if (userAgent.match(/chrome|chromium|crios/i)) {
    return BROWSER.CHROME
  }

  if (userAgent.match(/firefox|fxios/i)) {
    return BROWSER.FIREFOX
  }

  if (userAgent.match(/safari/i)) {
    return BROWSER.SAFARI
  }

  if (userAgent.match(/opr\//i)) {
    return BROWSER.OPERA
  }

  if (userAgent.match(/edg/i)) {
    return BROWSER.EDGE
  }

  return BROWSER.NO_BROWSER_DETECTED
}

export { BROWSER }

export default detectBrowser
