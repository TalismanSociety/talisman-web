import type { ReactNode } from 'react'
import { CircularProgressIndicator, Text } from '@talismn/ui'

const defaultTitle = 'Processing transfer'
const defaultText = 'Calculating fees'

export type ProgressIndicatorProps = {
  title?: ReactNode
  text?: ReactNode
}

export function ProgressIndicator({ title, text }: ProgressIndicatorProps) {
  return (
    <article className="flex flex-col items-center gap-4 px-6 py-28">
      <CircularProgressIndicator size="3.2rem" />
      <Text.BodyLarge as="header" alpha="high">
        {title ?? defaultTitle}
      </Text.BodyLarge>
      <Text.Body className="!-mt-4" alpha="disabled">
        {text ?? defaultText}
      </Text.Body>
    </article>
  )
}
