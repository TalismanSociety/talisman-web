import 'winbox/dist/css/themes/modern.min.css'
import 'winbox/dist/css/winbox.min.css'

import { useTheme } from '@emotion/react'
import { useCallback } from 'react'
import { useSessionStorage } from 'react-use'
import WinBox, { type WinBoxPropType } from 'react-winbox'
import { useRecoilState } from 'recoil'
import { enableTestnetsState } from '@domains/chains'
import { includeDisabledRoutesState } from '@domains/bridge'
import { debugErrorBoundaryState } from '../ErrorBoundary'

const DevMenu = () => {
  const theme = useTheme()

  const [x, setX] = useSessionStorage<WinBoxPropType['x']>('dev-menu-x', 'center')
  const [y, setY] = useSessionStorage<WinBoxPropType['y']>('dev-menu-y', 'center')

  const [hidden, setHidden] = useSessionStorage('dev-menu-hidden', false)

  const [enableTestnets, setEnableTestnets] = useRecoilState(enableTestnetsState)
  const [includeDisabledRoute, setIncludeDisabledRoute] = useRecoilState(includeDisabledRoutesState)
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
      <form css={{ 'label': { display: 'block' }, 'label + label': { marginTop: '1.6rem' } }}>
        <label>
          <input type="checkbox" checked={enableTestnets} onChange={() => setEnableTestnets(x => !x)} /> Enable testnets
        </label>
        <label>
          <input type="checkbox" checked={includeDisabledRoute} onChange={() => setIncludeDisabledRoute(x => !x)} />{' '}
          Enable all XCM routes
        </label>
        <label>
          <input type="checkbox" checked={debugErrorBoundary} onChange={() => setDebugErrorBoundary(x => !x)} /> Debug
          error boundary (right click to trigger error)
        </label>
      </form>
    </WinBox>
  )
}

export default DevMenu
