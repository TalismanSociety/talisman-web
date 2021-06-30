import { Countdown as Cd } from '@components'
import { useCrowdloanById, useGuardianValue } from '@libs/talisman'

const Countdown =
  ({
    id,
    showSeconds,
    className
  }) => {
    const { end } = useCrowdloanById(id)
    const blockNumber = useGuardianValue('metadata.blockNumber')
    const blockPeriod = useGuardianValue('metadata.blockPeriod')

    if(!end) return null

    return <span className="countdown">
      <Cd 
        showSeconds={showSeconds}
        seconds={(end - blockNumber) * blockPeriod}
      />
    </span>
  }

export default Countdown