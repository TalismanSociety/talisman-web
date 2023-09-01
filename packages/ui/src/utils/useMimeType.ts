import mime from 'mime'
import type mimeDb from 'mime-db/db.json'
import { useEffect, useState } from 'react'

type MimeType = keyof typeof mimeDb

type TypeDetail = MimeType extends `${infer Type}/${infer SubType}` ? [Type, SubType] : never

export type MimeTypeType = TypeDetail[0]

export type MimeTypeSubType = TypeDetail[1]

// Quick temporary solution for now
// a UI library should probably not have caching logic
const storageKey = (url: string) => `@talismn/ui/mime/${url}`

export const useMimeType = (src: string | readonly string[] | undefined, fetchMime = false) => {
  const referenceSrc = typeof src === 'string' ? src : src?.at(0)
  const contentTypeFromSrc = mime.getType(referenceSrc ?? '') as MimeType | null

  const [mimeType, setMimeType] = useState<MimeType | undefined>(
    contentTypeFromSrc === null
      ? (sessionStorage.getItem(storageKey(referenceSrc ?? '')) as MimeType) ?? undefined
      : contentTypeFromSrc
  )

  useEffect(() => {
    if (!fetchMime || mimeType !== undefined) {
      return
    }

    const srcs = typeof src === 'string' ? [src] : src

    if (srcs === undefined) {
      return
    }

    void (async () => {
      for (const url of srcs) {
        try {
          const response = await fetch(url, { method: 'HEAD' })

          if (!response.ok) {
            continue
          }

          const contentType = response.headers.get('Content-Type') as MimeType | null

          setMimeType(contentType ?? undefined)

          if (referenceSrc !== undefined && contentType !== null) {
            sessionStorage.setItem(storageKey(referenceSrc), contentType)
          }
          break
        } catch {}
      }
    })()
  }, [fetchMime, mimeType, referenceSrc, src])

  type TypeDetail = MimeType extends `${infer Type}/${infer SubType}` ? [Type, SubType] : never
  const [type, subType]: TypeDetail | [undefined, undefined] = (mimeType?.split('/') ?? [undefined, undefined]) as [
    any,
    any
  ]

  return [type, subType] as const
}

export default useMimeType
