export function trackPageview(params?: { url: string; referrer: string }) {
  getFathom().trackPageveiw(params)
}

export function trackGoal(code: string, cents: number) {
  getFathom().trackGoal(code, cents)
}

export function trackEvent(name: string, payload: object) {
  getFathom().trackEvent(name, payload)
}

export function blockTrackingForMe() {
  getFathom().blockTrackingForMe()
}

export function enableTrackingForMe() {
  getFathom().enableTrackingForMe()
}

function getFathom(): any {
  if (typeof (window as any).fathom === 'undefined') {
    console.error('Unable to track action via fathom: window.fathom is undefined')
    return {
      trackPageview: () => {},
      trackGoal: () => {},
      trackEvent: () => {},
      blockTrackingForMe: () => {},
      enableTrackingForMe: () => {},
    }
  }
  return (window as any).fathom
}
