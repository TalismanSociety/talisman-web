import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'
import { LinearProgressIndicator } from '@talismn/ui/atoms/LinearProgressIndicator'
import { Text } from '@talismn/ui/atoms/Text'

type PercentageBarProps = { isLoading?: boolean; percentage?: number }

const PercentageBar = ({ isLoading, percentage = 0 }: PercentageBarProps) => (
  <>
    <Text.BodySmall as="div" alpha="high" className="mb-[0.6rem] flex justify-end">
      {isLoading ? (
        <CircularProgressIndicator size="1em" />
      ) : (
        percentage.toLocaleString(undefined, { style: 'percent' })
      )}
    </Text.BodySmall>
    <LinearProgressIndicator value={percentage} least={0.25} optimum={0.5} />
  </>
)

export default PercentageBar
