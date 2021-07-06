import { Countdown as Cd, Pendor } from '@components'
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

    return <Pendor
      className="crowdloan-countdown"
      require={!!end}
      >
      <Cd 
        showSeconds={showSeconds}
        seconds={(end - blockNumber) * blockPeriod}
      />
    </Pendor>
  }

export default Countdown