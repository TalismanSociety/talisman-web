import { Button, useModal } from '@components'
import { isMobileBrowser } from '@util/helpers'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export default function DesktopRequired() {
  const { openModal } = useModal()

  useEffect(() => {
    if (!isMobileBrowser()) return

    openModal(<DesktopRequiredModal />, { closable: false })
  }, [openModal])

  return null
}

const DesktopRequiredModal = styled(props => {
  const { closeModal } = useModal()
  const { t } = useTranslation()

  return (
    <div {...props}>
      <h2>{t('desktopRequired.title')}</h2>
      <p>{t('desktopRequired.subtitle')}</p>
      <p>{t('desktopRequired.text')}</p>
      <Button primary to="/crowdloans" onClick={closeModal}>
        {t('desktopRequired.primaryCta')}
      </Button>
    </div>
  )
})`
  text-align: center;

  > *:not(:last-child) {
    margin-bottom: 2rem;
  }

  h2 {
    color: var(--color-text);
    font-weight: 600;
    font-size: 1.8rem;
  }
  p {
    color: #999;
    font-size: 1.6rem;
  }
`
