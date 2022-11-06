import { Account } from '@archetypes'
import { DAPP_NAME, useExtension } from '@libs/talisman'
import { useTalismanInstalled } from '@libs/talisman/useIsTalismanInstalled'
import { WalletSelect } from '@talismn/connect-components'
import getDownloadLink from '@util/getDownloadLink'
import { useTranslation } from 'react-i18next'

import Button from './atoms/Button'

export const WalletNavConnector = () => {
  const { t } = useTranslation('nav')

  const isTalismanInstalled = useTalismanInstalled()
  const downloadLink = getDownloadLink()
  const { status: extensionStatus } = useExtension()

  if (extensionStatus === 'UNAVAILABLE')
    return isTalismanInstalled ? (
      <WalletSelect dappName={DAPP_NAME} triggerComponent={<Button>{t('Connect')}</Button>} />
    ) : (
      <a href={downloadLink} target="_blank" rel="noopener noreferrer">
        <Button>{t('Install')}</Button>
      </a>
    )

  return <Account.Button allAccounts />
}
