import 'winbox/dist/css/themes/modern.min.css'
import 'winbox/dist/css/winbox.min.css'

import { enableTestnetsState } from '@domains/chains'
import { toastExtrinsic, useWagmiContractWrite } from '@domains/common'
import { useTheme } from '@emotion/react'
import RpcError from '@polkadot/rpc-provider/coder/error'
import { usePostHog } from 'posthog-js/react'
import { useCallback, useEffect, useState } from 'react'
import { useSessionStorage } from 'react-use'
import WinBox, { type WinBoxPropType } from 'react-winbox'
import { useRecoilState } from 'recoil'
import { sepolia } from 'wagmi'
import { debugErrorBoundaryState } from '../ErrorBoundary'
import { counterAbi } from './counterAbi'

const InsufficientFeeToast = () => {
  return (
    <button
      onClick={() =>
        toastExtrinsic(
          [],
          Promise.reject(new RpcError('Inability to pay some fees (e.g. account balance too low)', 1010))
        )
      }
    >
      Insufficient balance
    </button>
  )
}

const SignEvmTransaction = () => {
  const { writeAsync } = useWagmiContractWrite({
    chainId: sepolia.id,
    address: '0x87F762e318e8a54215b2e2FDcE28C136e176e14C',
    abi: counterAbi,
    functionName: 'increment',
    etherscanUrl: sepolia.blockExplorers.etherscan.url,
  })

  return (
    <button
      onClick={() => {
        void writeAsync()
      }}
    >
      Sign EVM transaction
    </button>
  )
}

const Analytics = () => {
  const [debug, setDebug] = useState(false)

  const postHog = usePostHog()

  useEffect(() => {
    postHog.debug(debug)
  }, [debug, postHog])

  return (
    <label>
      <input type="checkbox" checked={debug} onChange={() => setDebug(x => !x)} /> Debug PostHog
    </label>
  )
}

const DevMenu = () => {
  const theme = useTheme()

  const [x, setX] = useSessionStorage<WinBoxPropType['x']>('dev-menu-x', 'center')
  const [y, setY] = useSessionStorage<WinBoxPropType['y']>('dev-menu-y', 'center')

  const [hidden, setHidden] = useSessionStorage('dev-menu-hidden', false)

  const [enableTestnets, setEnableTestnets] = useRecoilState(enableTestnetsState)
  const [debugErrorBoundary, setDebugErrorBoundary] = useRecoilState(debugErrorBoundaryState)

  return (
    <WinBox
      title="Development"
      noFull
      noMax
      x={x}
      y={y}
      onMove={useCallback(
        (x: number, y: number) => {
          setX(x)
          setY(y)
        },
        [setX, setY]
      )}
      hide={hidden}
      onHide={useCallback(() => setHidden(true), [setHidden])}
      onClose={useCallback(() => sessionStorage.setItem('development', JSON.stringify(false)), [])}
      className="modern"
      css={{ 'colorScheme': 'dark', '.wb-body': { padding: '1.6rem', backgroundColor: theme.color.surface } }}
    >
      <form
        css={{ 'label': { display: 'block' }, 'label + label': { marginTop: '1.6rem' } }}
        onSubmit={event => event.preventDefault()}
      >
        <label>
          <input type="checkbox" checked={enableTestnets} onChange={() => setEnableTestnets(x => !x)} /> Enable testnets
        </label>
        <label>
          <input type="checkbox" checked={debugErrorBoundary} onChange={() => setDebugErrorBoundary(x => !x)} /> Debug
          error boundary (right click to trigger error)
        </label>
        <Analytics />
        <hr />
        <legend>
          Toasts
          <div>
            <InsufficientFeeToast />
          </div>
        </legend>
        <hr />
        <legend>
          EVM
          <div>
            <SignEvmTransaction />
          </div>
        </legend>
        <hr />
      </form>
    </WinBox>
  )
}

export default DevMenu
