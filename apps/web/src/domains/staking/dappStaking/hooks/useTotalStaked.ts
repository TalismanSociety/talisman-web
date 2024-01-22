export const useTotalStaked = () => {
  return 0
  // const [accounts, decimal, price] = useRecoilValue(
  //   waitForAll([selectedSubstrateAccountsState, useNativeTokenDecimalState(), useNativeTokenPriceState()])
  // )

  // const ledgers = useRecoilValue(
  //   useQueryState(
  //     'dappStaking',
  //     'ledger.multi',
  //     useMemo(() => accounts.map(x => x.address), [accounts])
  //   )
  // )

  // const total = useMemo(
  //   () =>
  //     ledgers
  //       .map(x =>
  //         x.staked.voting
  //           .unwrap()
  //           .add(x.staked.buildAndEarn.unwrap())
  //           .add(x.stakedFuture.unwrapOrDefault().voting.unwrap())
  //           .add(x.stakedFuture.unwrapOrDefault().buildAndEarn.unwrap())
  //       )
  //       .reduce((prev, curr) => prev.add(curr), new BN(0)),
  //   [ledgers]
  // )

  // return useMemo(() => decimal.fromPlanck(total).toNumber() * price, [decimal, price, total])
}
