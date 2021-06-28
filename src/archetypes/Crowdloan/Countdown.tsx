import { Countdown as Cd } from '@components'
import { useCrowdloan, useGuardianValue } from '@libs/talisman'

const Countdown =
  ({
    id,
    showSeconds,
    className
  }) => {
    const { end } = useCrowdloan(id)
    const blockNumber = useGuardianValue('metadata.blockNumber')
    const blockPeriod = useGuardianValue('metadata.blockPeriod')

    return <Cd 
      showSeconds={showSeconds}
      seconds={(end - blockNumber) * blockPeriod}
    />
  }

export default Countdown