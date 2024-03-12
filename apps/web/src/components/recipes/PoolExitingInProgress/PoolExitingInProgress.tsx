import { useTheme } from '@emotion/react'
import { Info } from '@talismn/web-icons'
import { Text, useSurfaceColor } from '@talismn/ui'

const PoolExitingInProgress = () => {
  const theme = useTheme()
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        padding: '3.2rem',
        borderRadius: '1.6rem',
        backgroundColor: useSurfaceColor(),
      }}
    >
      <Text.Body
        alpha="high"
        css={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25em',
          color: theme.color.primary,
          fontWeight: 'bold',
          marginBottom: '2.4rem',
        }}
      >
        <Info size="1em" css={{ verticalAlign: 'middle' }} /> You are currently unstaking
      </Text.Body>
      <Text.Body>
        Please select a different account to continue staking.
        <br />
        <br />
        Once your funds are unstaked, you can restake with this account.
      </Text.Body>
    </div>
  )
}

export default PoolExitingInProgress
