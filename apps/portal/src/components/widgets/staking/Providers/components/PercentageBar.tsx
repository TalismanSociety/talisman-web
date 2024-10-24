import { LinearProgressIndicator, Text, CircularProgressIndicator } from '@talismn/ui'

type PercentageBarProps = { loading?: false; percentage: number }

const PercentageBar = (props: PercentageBarProps) => (
  <>
    <Text.BodySmall as="div" alpha="high" css={{ textAlign: 'end', marginBottom: '0.6rem' }}>
      {props.loading ? (
        <CircularProgressIndicator size="1em" />
      ) : (
        props.percentage.toLocaleString(undefined, { style: 'percent' })
      )}
    </Text.BodySmall>
    <LinearProgressIndicator value={props.loading ? 0 : props.percentage} least={0.25} optimum={0.5} />
  </>
)

export default PercentageBar
