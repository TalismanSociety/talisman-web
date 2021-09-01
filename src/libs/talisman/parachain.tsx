import { find } from 'lodash'
import { FC, useContext as _useContext, createContext, useMemo } from 'react'

import { useQuery } from './'
import { parachainDetails } from './util/_config'
import type { ParachainDetails } from './util/_config'

const assetPath = require.context('./assets', true)

//
// Constants
//

const AllParachains = `
  query Parachains {
    parachains {
      nodes {
        paraId
      }
    }
  }
`

//
// Hooks (exported)
//

export const useParachains = () => useContext()

export const useParachainById = (id: number) => useFindParachain('id', id)
export const useParachainBySlug = (slug: string) => useFindParachain('slug', slug)

export const useParachainAssets = (id: string) =>
  useMemo(() => {
    if (!id) return {}

    let banner = ''
    let card = ''
    let logo = ''

    try {
      banner = assetPath(`./${id}/banner.png`)?.default
    } catch (e) {}

    try {
      card = assetPath(`./${id}/card.png`)?.default
    } catch (e) {}

    try {
      logo = assetPath(`./${id}/logo.svg`)?.default
    } catch (e) {}

    return { banner, card, logo }
  }, [id])

//
// Hooks (internal)
//

export const useFindParachain = (key: string, value: any) => {
  const { parachains, status, message } = useParachains()

  const parachain = useMemo(() => find(parachains, { [key]: value }) || {}, [parachains, key, value])

  return {
    parachain,
    status,
    message,
  }
}

//
// Context
//

type ContextProps = {
  parachains: ParachainDetails[]
  called: boolean
  loading: boolean
  status: any
  message: any
}

const Context = createContext<ContextProps | null>(null)

function useContext() {
  const context = _useContext(Context)
  if (!context) throw new Error('The parachain provider is required in order to use this hook')

  return context
}

//
// Provider
//

export const Provider: FC = ({ children }) => {
  const { data, called, loading, status, message } = useQuery(AllParachains)

  const parachains = useMemo<ParachainDetails[]>(
    () =>
      (data || [])
        .filter(({ paraId: id }: { paraId?: number }) => id && find(parachainDetails, { id }))
        .map(({ paraId: id, ...parachain }: { paraId: number }) => ({ ...find(parachainDetails, { id }) })),
    [data]
  )

  return (
    <Context.Provider
      value={{
        parachains,
        called,
        loading,
        status,
        message,
      }}
    >
      {children}
    </Context.Provider>
  )
}
