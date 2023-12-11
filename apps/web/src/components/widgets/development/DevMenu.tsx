import 'winbox/dist/css/themes/modern.min.css'
import 'winbox/dist/css/winbox.min.css'

import { enableTestnetsState } from '@domains/chains'
import RpcError from '@polkadot/rpc-provider/coder/error'
import { useTheme } from '@emotion/react'
import { useCallback } from 'react'
import { useSessionStorage } from 'react-use'
import WinBox, { type WinBoxPropType } from 'react-winbox'
import { useRecoilState } from 'recoil'
import { debugErrorBoundaryState } from '../ErrorBoundary'
import { toastExtrinsic } from '@domains/common'

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
        <hr />
        <legend>
          Toasts
          <div>
            <InsufficientFeeToast />
          </div>
        </legend>
      </form>
    </WinBox>
  )
}

export default DevMenu
