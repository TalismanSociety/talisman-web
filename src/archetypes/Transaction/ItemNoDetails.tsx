import Button from '@components/atoms/Button'
import * as Icon from '@components/atoms/Icon'
import { css } from '@emotion/react'
import { useTranslation } from 'react-i18next'

export const ItemNoDetails = () => {
  const { t } = useTranslation()

  return (
    <div
      className="details"
      css={css`
        gap: 1em;
      `}
    >
      <Icon.AlertCircle
        css={css`
          display: block;
          font-size: 3.2rem;
          width: 1em;
          height: 1em;
        `}
      />
      <div
        css={css`
          font-size: var(--font-size-xsmall);
          white-space: pre-wrap;
        `}
      >
        {t(`We don't recognise this\ntransaction type yet...`)}
      </div>
      <Button
        variant="outlined"
        as="a"
        href="https://m9m0weaebgi.typeform.com/to/VaSfObvx"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('Report error')}
      </Button>
    </div>
  )
}
