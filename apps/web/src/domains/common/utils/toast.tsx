import type RpcError from '@polkadot/rpc-provider/coder/error'
import { type ISubmittableResult } from '@polkadot/types/types'
import { ExternalLink } from '@talismn/icons'
import { Text, toast } from '@talismn/ui'

export const toastExtrinsic = (
  extrinsics: Array<[string, string]>,
  promise: Promise<ISubmittableResult>,
  subscanUrl?: string
) => {
  const message = (() => {
    if (extrinsics.length === 1) {
      return (
        <>
          <Text.Body as="div" alpha="high">
            Your transaction was successful
          </Text.Body>
          <Text.Body as="div">
            Your{' '}
            <code>
              {extrinsics[0]?.[0]}:{extrinsics[0]?.[1]}
            </code>{' '}
            transaction was successful.
          </Text.Body>
        </>
      )
    } else {
      return (
        <Text.Body as="div" alpha="high">
          Your transaction was successful
        </Text.Body>
      )
    }
  })()

  void toast.promise(
    promise,
    {
      loading: (
        <Text.Body as="div" alpha="high">
          Your transaction is pending...
        </Text.Body>
      ),
      success: data => (
        <>
          {message}
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
        </>
      ),
      error: error => {
        const rawErrorMsg = (error as RpcError)?.data ?? (error as Error | undefined)?.message
        const errorMsg = rawErrorMsg?.startsWith('Inability to pay some fees') ? (
          <Text.Body>
            Unable to pay some fees (e.g. low account balance
            <br />
            or approaching polkadot existential deposit limit, read{' '}
            <Text.Noop.A
              href="https://docs.talisman.xyz/talisman/navigating-the-paraverse/substrate-features/existential-deposit"
              target="_blank"
            >
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
