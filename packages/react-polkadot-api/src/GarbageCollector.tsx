import { useCallback, useContext, useEffect } from 'react'
import { releaseNode, useGetRecoilValueInfo_UNSTABLE, useRecoilCallback, useStoreRef } from 'recoil'
import { RecoilStateContext } from './Context.js'

export const garbageCollectionKey = Symbol('garbageCollectionKey')

type RECOIL_GARBAGE_COLLECTOR_UNSTABLE_Props = {
  shouldCheckForGarbageCollection: (key: string) => boolean
  interval: number
}

/**
 * TODO: remove after `retainedBy` support is implemented on recoil
 */
export const RECOIL_GARBAGE_COLLECTOR_UNSTABLE = (props: RECOIL_GARBAGE_COLLECTOR_UNSTABLE_Props) => {
  const storeRef = useStoreRef()
  const getRecoilValueInfo = useGetRecoilValueInfo_UNSTABLE()

  const releaseUnusedNodes = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        if (storeRef.current === null) {
          return
        }

        const releaseSnapshot = snapshot.retain()
        const state = storeRef.current.getState()

        for (const node of snapshot.getNodes_UNSTABLE()) {
          if (!state.knownAtoms.has(node.key) && !state.knownSelectors.has(node.key)) {
            continue
          }

          if (props.shouldCheckForGarbageCollection(node.key)) {
            const firstNodeSubscriber = snapshot.getInfo_UNSTABLE(node).subscribers.nodes[Symbol.iterator]().next()

            // Can't use `snapshot.getInfo_UNSTABLE` here
            // https://github.com/facebookexperimental/Recoil/issues/1684
            const firstComponentSubscriber = getRecoilValueInfo(node).subscribers.components[Symbol.iterator]().next()

            const hasNoSubscriber =
              firstNodeSubscriber.done &&
              firstNodeSubscriber.value === undefined &&
              firstComponentSubscriber.done &&
              firstComponentSubscriber.value === undefined

            if (hasNoSubscriber) {
              releaseNode(storeRef.current, state.currentTree, node.key)
            }
          }
        }

        releaseSnapshot()
      },
    [getRecoilValueInfo, props, storeRef]
  )

  useEffect(() => {
    const interval = setInterval(releaseUnusedNodes, props.interval)

    return () => clearInterval(interval)
  }, [props.interval, releaseUnusedNodes])

  return null
}

/**
 * TODO: remove after `retainedBy` support is implemented on recoil
 */
export const POLKADOT_API_STATE_GARBAGE_COLLECTOR_UNSTABLE = () => {
  const states = useContext(RecoilStateContext)
  return (
    <RECOIL_GARBAGE_COLLECTOR_UNSTABLE
      interval={5_000}
      shouldCheckForGarbageCollection={useCallback(
        node =>
          node.startsWith(states.queryState[garbageCollectionKey]) ||
          node.startsWith(states.deriveState[garbageCollectionKey]) ||
          node.startsWith(states.queryMultiState[garbageCollectionKey]),
        []
      )}
    />
  )
}
