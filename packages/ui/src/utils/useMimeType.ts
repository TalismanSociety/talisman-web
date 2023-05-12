import mime from 'mime'
import type mimeDb from 'mime-db/db.json'
import { useEffect, useState } from 'react'

type MimeType = keyof typeof mimeDb

type TypeDetail = MimeType extends `${infer Type}/${infer SubType}` ? [Type, SubType] : never

export type MimeTypeType = TypeDetail[0]

export type MimeTypeSubType = TypeDetail[1]

export const useMimeType = (src: string | readonly string[] | undefined, fetchMime = false) => {
  const referenceSrc = typeof src === 'string' ? src : src?.at(0)
  const contentTypeFromSrc = mime.getType(referenceSrc ?? '') as MimeType | null

  const [mimeType, setMimeType] = useState<MimeType | undefined>(
    contentTypeFromSrc === null ? undefined : contentTypeFromSrc
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

          setMimeType((response.headers.get('Content-Type') as MimeType) ?? undefined)
          break
        } catch {}
      }
    })()
  }, [fetchMime, mimeType, src])

  type TypeDetail = MimeType extends `${infer Type}/${infer SubType}` ? [Type, SubType] : never
  const [type, subType]: TypeDetail | [undefined, undefined] = (mimeType?.split('/') ?? [undefined, undefined]) as [
    any,
    any
  ]

  return [type, subType] as const
}

export default useMimeType
