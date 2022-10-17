import { ExternalLink } from '@components/atoms/Icon'
import Text from '@components/atoms/Text'
import { Chain } from '@domains/chains/recoils'
import { ISubmittableResult } from '@polkadot/types/types'
import toast from 'react-hot-toast'
import { Loadable } from 'recoil'

export const toastExtrinsic = (
  module: string,
  section: string,
  promise: Promise<ISubmittableResult>,
  chainLoadable: Loadable<Chain>
) =>
  toast.promise(
    Promise.allSettled([promise, chainLoadable.toPromise()]).then(([data, chain]) => {
      if (data.status === 'fulfilled') {
        return chain.status === 'fulfilled' ? ([data.value, chain.value] as const) : ([data.value] as const)
      } else {
        // eslint-disable-next-line no-throw-literal
        throw chain.status === 'fulfilled' ? ([data.reason, chain.value] as const) : ([data.reason] as const)
      }
    }),
    {
      loading: (
        <>
          <Text.Body as="div" alpha="high">
            Your transaction is pending...
          </Text.Body>
          <Text.Body as="div">Your staking transaction has been confirmed</Text.Body>
        </>
      ),
      success: ([data, chain]) => (
        <>
          <Text.Body as="div" alpha="high">
            Your transaction was successful
          </Text.Body>
          <Text.Body as="div">
            Your{' '}
            <code>
              {module}:{section}
            </code>{' '}
            transaction has was successful.
          </Text.Body>
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
      error: ([error, chain]) => (
        <>
          <Text.Body as="div" alpha="high">
            Your transaction failed
          </Text.Body>
          <Text.Body as="div">
            Your{' '}
            <code>
              {module}:{section}
            </code>{' '}
            transaction has failed.
          </Text.Body>
          {chain !== undefined && (
            <Text.Body as="div">
              View details on{' '}
              <Text.Body
                as="a"
                alpha="high"
                href={chain.subscanUrl + 'extrinsic/' + error?.txHash?.toString()}
                target="_blank"
              >
                Subscan <ExternalLink width="1.2rem" height="1.2rem" />
              </Text.Body>
            </Text.Body>
          )}
        </>
      ),
    }
  )
