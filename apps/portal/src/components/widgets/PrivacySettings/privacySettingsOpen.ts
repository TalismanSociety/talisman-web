import { bind } from "@react-rxjs/core"
import { BehaviorSubject } from "rxjs"

const privacySettingsOpen$ = new BehaviorSubject(false)

export const [usePrivacySettingsOpen] = bind(privacySettingsOpen$)

export const openPrivacySettings = () => privacySettingsOpen$.next(true)

export const closePrivacySettings = () => privacySettingsOpen$.next(false)
