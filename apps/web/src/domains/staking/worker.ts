import { ApiPromise, WsProvider } from '@polkadot/api'
import { expose } from 'threads/worker'

export type WorkerFunction = typeof getStakersReward

// Needed to extract to a worker since this calculation is very CPU heavy
// and will slow down the UI thread
const getStakersReward = async (endpoints: string | string[], addresses: string[], eras: number[]) => {
  const api = await ApiPromise.create({ provider: new WsProvider(endpoints), initWasm: false })

  const stakerRewards = await api.derive.staking.stakerRewardsMultiEras(
    addresses,
    eras.map(x => api.createType('EraIndex', x))
  )

  await api.disconnect()

  return Object.fromEntries(
    stakerRewards.map((x, index) => [
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      addresses[index]!,
      x
        .map(y => Object.values(y.validators).reduce((previous, current) => previous + current.value.toBigInt(), 0n))
        .reduce((previous, current) => previous + current, 0n),
    ])
  )
}

expose(getStakersReward)
