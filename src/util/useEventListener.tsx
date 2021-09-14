import { useEffect } from 'react'

function useEventListener<KD extends keyof DocumentEventMap>(
  eventType: KD,
  listener: (this: Document, evt: DocumentEventMap[KD]) => void,
  element?: Document | null
): void
function useEventListener<KH extends keyof HTMLElementEventMap>(
  eventType: KH,
  listener: (this: HTMLElement, evt: HTMLElementEventMap[KH]) => void,
  element?: HTMLElement | null
): void
function useEventListener<KW extends keyof WindowEventMap>(
  eventType: KW,
  listener: (this: Window, evt: WindowEventMap[KW]) => void,
  element?: Window | null
): void
function useEventListener(
  eventType: string,
  listener: (evt: Event) => void,
  element?: Document | HTMLElement | Window | null
): void

function useEventListener<
  KD extends keyof DocumentEventMap,
  KH extends keyof HTMLElementEventMap,
  KW extends keyof WindowEventMap
>(
  eventType: KD | KH | KW | string,
  listener: (
    this: typeof element,
    evt: DocumentEventMap[KD] | HTMLElementEventMap[KH] | WindowEventMap[KW] | Event
  ) => void,
  element: Document | HTMLElement | Window | null = window
): void {
  useEffect(() => {
    if (!element) return

    element.addEventListener(eventType, listener)
    return () => element.removeEventListener(eventType, listener)
  }, [element, eventType, listener])
}

export default useEventListener
