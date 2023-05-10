import { type Chain } from '@domains/chains'
import RpcError from '@polkadot/rpc-provider/coder/error'
import { ISubmittableResult } from '@polkadot/types/types'
import { ExternalLink } from '@talismn/icons'
import { Text, toast } from '@talismn/ui'

export const toastExtrinsic = (extrinsics: [string, string][], promise: Promise<ISubmittableResult>, chain?: Chain) => {
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

  toast.promise(
    promise,
    {
      loading: (
        <>
          <Text.Body as="div" alpha="high">
            Your transaction is pending...
          </Text.Body>
          <Text.Body as="div">Your transaction has been confirmed</Text.Body>
        </>
      ),
      success: data => (
        <>
          {message}
          {chain !== undefined && (
            <Text.Body as="div">
              View details on{' '}
              <Text.Body
                as="a"
                alpha="high"
                href={chain.subscanUrl + 'extrinsic/' + data?.txHash?.toString()}
                target="_blank"
              >
                Subscan
              </Text.Body>
            </Text.Body>
          )}
        </>
      ),
      error: error => (
        <>
          <Text.Body as="div" alpha="high">
            Your transaction failed
          </Text.Body>
          {/* Can't do instanceof RpcError for some reason */}
          {('data' in error || 'message' in error) && (
            <Text.Body as="div">{(error as RpcError)?.data ?? (error as Error)?.message}</Text.Body>
          )}
          {chain !== undefined && error?.txHash !== undefined && (
            <Text.Body as="div">
              View details on{' '}
              <Text.Body
                as="a"
                alpha="high"
                href={chain.subscanUrl + 'extrinsic/' + error?.txHash?.toString()}
                target="_blank"
              >
                Subscan <ExternalLink size="1.2rem" />
              </Text.Body>
            </Text.Body>
          )}
        </>
      ),
    },
    {
      success: { duration: 6000 },
      error: { duration: 6000 },
    }
  )
}
