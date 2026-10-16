import { bind } from "@react-rxjs/core"
import { BehaviorSubject } from "rxjs"

export type Consent = { analytics: boolean; errors: boolean }

export type ConsentKind = keyof Consent

const STORAGE_KEY = "analytics-consent"

const isConsent = (value: unknown): value is Consent =>
	typeof value === "object" &&
	value !== null &&
	typeof (value as Consent).analytics === "boolean" &&
	typeof (value as Consent).errors === "boolean"

const parseConsent = (stored: string | null): Consent | null => {
	if (stored === null) return null
	try {
		const parsed: unknown = JSON.parse(stored)
		return isConsent(parsed) ? { analytics: parsed.analytics, errors: parsed.errors } : null
	} catch {
		return null
	}
}

const storedConsent = () =>
	typeof localStorage === "undefined" ? null : parseConsent(localStorage.getItem(STORAGE_KEY))

const consentState$ = new BehaviorSubject(storedConsent())

const isConsentChange = ({ storageArea, key }: StorageEvent) =>
	storageArea === localStorage && (key === STORAGE_KEY || key === null)

if (typeof window !== "undefined")
	window.addEventListener("storage", (event) => {
		if (isConsentChange(event)) consentState$.next(storedConsent())
	})

export const [useConsent, consent$] = bind(consentState$)

export const currentConsent = () => consentState$.getValue()

export const isGranted = (consent: Consent | null, kind: ConsentKind) => consent?.[kind] === true

export const decisionHolds = (decision: Consent | null) => currentConsent() === decision

export const setConsent = (consent: Consent) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(consent))
	consentState$.next(consent)
}

export const acceptAll = () => setConsent({ analytics: true, errors: true })

export const rejectAll = () => setConsent({ analytics: false, errors: false })
