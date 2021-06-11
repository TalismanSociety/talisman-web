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
      require={!!end}
      >
      <div
        className="crowdloan-countdown"
        >
        <Cd 
          showSeconds={showSeconds}
          seconds={(end - blockNumber) * blockPeriod}
        />
      </div>
    </Pendor>
  }

export default Countdown