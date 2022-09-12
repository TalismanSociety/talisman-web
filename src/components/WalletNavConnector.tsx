import { Account } from '@archetypes'
import { Button } from '@components'
import { DAPP_NAME, useExtension } from '@libs/talisman'
import { useTalismanInstalled } from '@libs/talisman/useIsTalismanInstalled'
import { WalletSelect } from '@talismn/connect-components'
import { TalismanWallet, PolkadotjsWallet } from '@talismn/connect-wallets'
import getDownloadLink from '@util/getDownloadLink'
import { useTranslation } from 'react-i18next'

export const WalletNavConnector = () => {
  const { t } = useTranslation('nav')

  const isTalismanInstalled = useTalismanInstalled()
  const downloadLink = getDownloadLink()
  const { status: extensionStatus } = useExtension()

  if (extensionStatus === 'UNAVAILABLE')
    return isTalismanInstalled ? (
      <WalletSelect
        dappName={DAPP_NAME}
        walletList={[
          new TalismanWallet(),
          new PolkadotjsWallet()
        ]}
        triggerComponent={
          <Button small primary>
            {t('Connect')}
          </Button>
        }
      />
    ) : (
      <a href={downloadLink} target="_blank" rel="noopener noreferrer">
        <Button primary small>
          {t('Install')}
        </Button>
      </a>
    )

  return <Account.Button allAccounts />
}
