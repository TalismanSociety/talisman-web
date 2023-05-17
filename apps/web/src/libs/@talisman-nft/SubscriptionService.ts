import md5 from 'md5'
import { v4 as uuidv4 } from 'uuid'

type CallBackType<T> = (params: T) => void

class SubscriptionService<CbResultType> {
  // a store of callbacks triggered when this instance updates
  private callbackStore: Record<string, CallBackType<CbResultType>> = {}

  // keep a state hash in order to minimise callbacks
  private stateHash: string = ''

  // fire all subscriptions
  public fire(data: CbResultType) {
    // eslint-disable-next-line prefer-const
    let timeoutId: any
    // ensure sure the state has changed before firing
    const newStateHash = md5(JSON.stringify(data))
    if (newStateHash === this.stateHash) return
    this.stateHash = newStateHash

    // Debouncing
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      Object.values(this.callbackStore).forEach(cb => cb(data))
    }, 250)
  }

  // subscribing to updates
  // return unsub callback to delete subscription
  public subscribe(cb: CallBackType<CbResultType>) {
    const uuid = uuidv4()
    this.callbackStore[uuid] = cb
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.callbackStore[uuid]
    }
  }
}

export default SubscriptionService
