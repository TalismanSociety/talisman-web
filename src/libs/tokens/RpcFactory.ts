import { WsProvider } from '@polkadot/api'
import { ProviderInterfaceCallback } from '@polkadot/rpc-provider/types'

import getChainList from './getChainList'
import { ChainId } from './types'

type SocketUserId = number

/**
 * RpcFactory provides an interface similar to WsProvider, but with three points of difference:
 *
 * 1. RpcFactory methods all accept a `chainId` instead of an array of RPCs. RPCs are then fetched internally from chaindata.
 * 2. RpcFactory creates only one `WsProvider` per chain and ensures that all downstream requests to a chain share the one socket connection.
 * 3. Subscriptions return a callable `unsubscribe` method instead of an id.
 */
//
class RpcFactory {
  #socketConnections: Record<ChainId, WsProvider> = {}
  #socketKeepAliveIntervals: Record<ChainId, ReturnType<typeof setInterval>> = {}
  #socketUsers: Record<ChainId, SocketUserId[]> = {}

  async send<T = any>(
    chainId: ChainId,
    method: string,
    params: unknown[],
    isCacheable?: boolean | undefined
  ): Promise<T> {
    const [socketUserId, ws] = await this.connectChainSocket(chainId)

    try {
      var response = await ws.send(method, params, isCacheable)
    } catch (error) {
      await this.disconnectChainSocket(chainId, socketUserId)
      throw error
    }

    await this.disconnectChainSocket(chainId, socketUserId)

    return response
  }

  async subscribe(
    chainId: ChainId,
    subscribeMethod: string,
    unsubscribeMethod: string,
    responseMethod: string,
    params: unknown[],
    callback: ProviderInterfaceCallback
  ): Promise<() => Promise<void>> {
    // TODO: Fix this function so that caller doesn't have to wait for
    //      socket to connect before they can call unsubscribe()

    const [socketUserId, ws] = await this.connectChainSocket(chainId)

    try {
      var subscriptionId = await ws.subscribe(responseMethod, subscribeMethod, params, callback)
    } catch (error) {
      await this.disconnectChainSocket(chainId, socketUserId)
      throw error
    }

    const unsubscribe = async () => {
      await ws.unsubscribe(responseMethod, unsubscribeMethod, subscriptionId)
      await this.disconnectChainSocket(chainId, socketUserId)
    }

    return unsubscribe
  }

  /**
   * Connect to an RPC via chainId
   *
   * The caller must call disconnectChainSocket with the returned SocketUserId once they are finished with it
   */
  private async connectChainSocket(chainId: ChainId): Promise<[SocketUserId, WsProvider]> {
    const chainList = await getChainList()
    const chain = chainList[chainId]
    if (!chain) throw new Error(`Chain ${chainId} not found in store`)
    const socketUserId = this.addSocketUser(chainId)

    if (this.#socketConnections[chainId]) {
      await this.#socketConnections[chainId].isReady
      return [socketUserId, this.#socketConnections[chainId]]
    }

    const autoConnectMs = 1000
    try {
      const healthyRpcs = (chain.rpcs || []).filter(({ isHealthy }) => isHealthy).map(({ url }) => url)
      if (healthyRpcs.length) this.#socketConnections[chainId] = new WsProvider(healthyRpcs, autoConnectMs)
      else throw new Error(`No healthy RPCs available for chain ${chainId}`)
    } catch (error) {
      throw error
    }

    // set up healthcheck (keeps ws open when idle), don't wait for setup to complete
    ;(async () => {
      if (!this.#socketConnections[chainId])
        // eslint-disable-next-line no-console
        return console.warn('ignoring rpc ws healthcheck initialization: ws is not fined')
      await this.#socketConnections[chainId].isReady

      if (this.#socketKeepAliveIntervals[chainId]) clearInterval(this.#socketKeepAliveIntervals[chainId])

      const intervalMs = 10_000 // 10,000ms = 10s
      this.#socketKeepAliveIntervals[chainId] = setInterval(() => {
        if (!this.#socketConnections[chainId])
          // eslint-disable-next-line no-console
          return console.warn('skipping rpc ws healthcheck: ws is not defined')

        if (!this.#socketConnections[chainId].isConnected)
          // eslint-disable-next-line no-console
          return console.warn('skipping rpc ws healthcheck: ws is not connected')

        this.#socketConnections[chainId]
          .send('system_health', [])
          // eslint-disable-next-line no-console
          .catch(error => console.warn(`Failed keep-alive for socket ${chainId}`, error))
      }, intervalMs)
    })()

    await this.#socketConnections[chainId].isReady
    return [socketUserId, this.#socketConnections[chainId]]
  }

  private async disconnectChainSocket(chainId: ChainId, socketUserId: SocketUserId): Promise<void> {
    this.removeSocketUser(chainId, socketUserId)

    if (this.#socketUsers[chainId].length > 0) return

    if (!this.#socketConnections[chainId])
      // eslint-disable-next-line no-console
      return console.warn(`Failed to disconnect socket: socket ${chainId} not found`)

    try {
      this.#socketConnections[chainId].disconnect()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(`Error occurred disconnecting socket ${chainId}`, error)
    }
    delete this.#socketConnections[chainId]
    clearInterval(this.#socketKeepAliveIntervals[chainId])
    delete this.#socketKeepAliveIntervals[chainId]
  }

  private addSocketUser(chainId: ChainId): SocketUserId {
    if (!Array.isArray(this.#socketUsers[chainId])) this.#socketUsers[chainId] = []
    const socketUserId: SocketUserId = this.getExclusiveRandomId(this.#socketUsers[chainId])
    this.#socketUsers[chainId].push(socketUserId)
    return socketUserId
  }
  private removeSocketUser(chainId: ChainId, socketUserId: SocketUserId) {
    const userIndex = this.#socketUsers[chainId].indexOf(socketUserId)
    if (userIndex === -1)
      throw new Error(
        `Can't remove user ${socketUserId} from socket ${chainId}: user not in list ${this.#socketUsers[chainId].join(
          ', '
        )}`
      )
    this.#socketUsers[chainId].splice(userIndex, 1)
  }

  /** continues to generate a random number until it finds one which is not present in the exclude list */
  private getExclusiveRandomId(exclude: number[] = []): number {
    let id = this.getRandomId()
    while (exclude.includes(id)) {
      id = this.getRandomId()
    }
    return id
  }
  /** generates a random number */
  private getRandomId(): number {
    return Math.trunc(Math.random() * Math.pow(10, 8))
  }
}

export default new RpcFactory()
