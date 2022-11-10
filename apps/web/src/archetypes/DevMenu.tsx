import { supportedChainIds } from '@domains/chains/consts'
import { chainIdState, chainRpcState, chainState } from '@domains/chains/recoils'
import { useTheme } from '@emotion/react'
import { Suspense, useEffect, useState } from 'react'
import WinBox from 'react-winbox'
import { useRecoilState, useRecoilValue } from 'recoil'

const BaseDevMenu = () => {
  const theme = useTheme()
  const [chainId, setChainId] = useRecoilState(chainIdState)
  const [rpc, setRpc] = useRecoilState(chainRpcState)

  const rpcs = useRecoilValue(chainState).rpcs.flatMap(rpc => rpc.url)

  return (
    <WinBox
      title="Development"
      noFull
      noMax
      css={{ 'colorScheme': 'dark', '.wb-body': { padding: '1.6rem', backgroundColor: theme.color.surface } }}
    >
      <Suspense>
        <form css={{ 'label': { display: 'block' }, 'label + label': { marginTop: '1.6rem' } }}>
          <fieldset>
            <legend>Chain</legend>
            <label>
              <div>ID</div>
              <select value={chainId} onChange={event => setChainId(event.target.value)}>
                {supportedChainIds.map(id => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <div>Rpc</div>
              <select value={rpc} onChange={event => setRpc(event.target.value)}>
                {rpcs.map(rpc => (
                  <option key={rpc} value={rpc}>
                    {rpc}
                  </option>
                ))}
              </select>
            </label>
          </fieldset>
        </form>
      </Suspense>
    </WinBox>
  )
}

const DevMenu = () => {
  const [showDevMenu, setShowDevMenu] = useState(false)

  useEffect(() => {
    const search = new URLSearchParams(window.location.search)

    if (search.get('development') !== null) {
      sessionStorage.setItem('development', JSON.stringify(true))
    }

    if (JSON.parse(sessionStorage.getItem('development') ?? JSON.stringify(false))) {
      setShowDevMenu(true)
    }
  }, [])

  if (!showDevMenu) {
    return null
  }

  return <BaseDevMenu />
}

export default DevMenu
