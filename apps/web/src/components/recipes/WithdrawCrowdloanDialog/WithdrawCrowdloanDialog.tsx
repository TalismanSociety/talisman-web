import { TalismanHandLoader } from '@components/TalismanHandLoader'
import { AlertDialog, Button, Text, type AlertDialogProps } from '@talismn/ui'
import { useTranslation } from 'react-i18next'

export type WithdrawCrowdloanDialogProps = Pick<AlertDialogProps, 'open' | 'onRequestDismiss'> & {
  onRequestWithdraw: () => unknown
  loading: boolean
  submitting: boolean
  relayChainName?: string
  tokenSymbol?: string
  amount?: string
  error?: string
}

export const WithdrawCrowdloanDialog = ({
  onRequestWithdraw,
  loading,
  submitting,
  relayChainName,
  tokenSymbol,
  amount,
  ...props
}: WithdrawCrowdloanDialogProps) => {
  const { t } = useTranslation()

  return (
    <AlertDialog
      {...props}
      title={t('Withdraw Crowdloan')}
      confirmButton={
        <Button onClick={onRequestWithdraw} disabled={loading || submitting || props.error !== undefined}>
          {t('Withdraw')}
        </Button>
      }
      content={
        loading || submitting ? (
          <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <TalismanHandLoader />
            {loading && <div>{t('Connecting to {{relayChainName}}', { relayChainName })}</div>}
            {submitting && (
              <div>
                {t('Submitting withdrawal of {{amount}} {{tokenSymbol}} to {{relayChainName}}', {
                  amount,
                  tokenSymbol,
                  relayChainName,
                })}
              </div>
            )}
          </div>
        ) : (
          <div>
            <Text.Body as="p" css={{ marginBottom: '2.4rem', whiteSpace: 'pre-wrap' }}>
              {t(
                'Your {{amount}} {{tokenSymbol}} from the crowdloan is now available.\nWould you like to withdraw it?',
                { amount, tokenSymbol }
              )}
            </Text.Body>
            {props.error !== undefined && (
              <Text.BodySmall color={theme => theme.color.error}>{props.error}</Text.BodySmall>
            )}
          </div>
        )
      }
    />
  )
}
