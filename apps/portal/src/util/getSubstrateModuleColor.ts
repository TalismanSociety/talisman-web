export const getSubstrateModuleColor = (module: string) => {
  switch (module) {
    case 'Balances':
      return '#FF9458'
    case 'Staking':
    case 'NominationPools':
      return '#FFBF12'
    case 'Utility':
      return '#FD8FFF'
    default:
      return '#A5A5A5'
  }
}
