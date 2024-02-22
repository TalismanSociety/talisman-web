import type RpcError from '@polkadot/rpc-provider/coder/error'
import { type ISubmittableResult } from '@polkadot/types/types'
import { Text, ToastMessage, toast } from '@talismn/ui'
import { ExternalLink } from '@talismn/web-icons'

export const toastExtrinsic = (
  extrinsics: Array<[string, string]>,
  promise: Promise<ISubmittableResult>,
  subscanUrl?: string
) => {
  void toast.promise(
    promise,
    {
      loading: 'Your transaction is pending...',
      success: data => (
        <ToastMessage
          headlineContent="Your transaction was successful"
          supportingContent={
            <div>
              {extrinsics.length === 1 && (
                <div>
                  Your{' '}
                  <code>
                    {extrinsics[0]?.[0]}:{extrinsics[0]?.[1]}
                  </code>{' '}
                  transaction was successful.
                </div>
              )}
              {subscanUrl !== undefined && (
                <Text.Body as="div">
                  View details on{' '}
                  <Text.Body
                    as="a"
                    alpha="high"
                    href={subscanUrl + 'extrinsic/' + data?.txHash?.toString()}
                    target="_blank"
                  >
                    Subscan
                  </Text.Body>
                </Text.Body>
              )}
            </div>
          }
        />
      ),
      error: error => {
        const rawErrorMsg = (error as RpcError)?.data ?? (error as Error | undefined)?.message
        const errorMsg = rawErrorMsg?.startsWith('Inability to pay some fees') ? (
          <Text.Body>
            Unable to pay some fees (e.g. low account balance
            <br />
            or approaching polkadot existential deposit limit, read{' '}
            <Text.Noop.A href="https://docs.talisman.xyz/talisman/help-and-support/troubleshooting/ed" target="_blank">
              more
            </Text.Noop.A>
            )
          </Text.Body>
        ) : (
          rawErrorMsg
        )

        return (
          <>
            <Text.Body as="div" alpha="high">
              Your transaction failed
            </Text.Body>
            {/* Can't do instanceof RpcError for some reason */}
            {('data' in error || 'message' in error) && <Text.Body as="div">{errorMsg}</Text.Body>}
            {subscanUrl && error?.txHash !== undefined && (
              <Text.Body as="div">
                View details on{' '}
                <Text.Body
                  as="a"
                  alpha="high"
                  href={subscanUrl + 'extrinsic/' + ((error?.txHash?.toString() as string | undefined) ?? '')}
                  target="_blank"
                >
                  Subscan <ExternalLink size="1.2rem" />
                </Text.Body>
              </Text.Body>
            )}
          </>
        )
      },
    },
    {
      success: { duration: 6000 },
      error: { duration: 6000 },
    }
  )
}
