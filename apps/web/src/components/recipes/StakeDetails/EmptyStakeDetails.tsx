import { Zap } from '@talismn/icons'
import { Button, Text } from '@talismn/ui'
import type { ReactNode } from 'react'
import illustration from './empty-stake.png'

export type EmptyStakeDetailsProps = {
  minJoinBond: ReactNode
  onClickSimulateRewards: () => unknown
  onClickStake: () => unknown
}

const EmptyStakeDetails = (props: EmptyStakeDetailsProps) => (
  <div css={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
    <img src={illustration} css={{ maxWidth: '24rem', aspectRatio: '1 / 1' }} />
    <Text.BodyLarge alpha="high">No assets staked yet</Text.BodyLarge>
    <Text.Body>Start earning rewards with as little as {props.minJoinBond} with pooled staking</Text.Body>
    <div css={{ display: 'flex', gap: '0.8rem', marginTop: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Button variant="outlined" onClick={props.onClickSimulateRewards}>
        Simulate rewards
      </Button>
      <Button leadingIcon={<Zap />} onClick={props.onClickStake}>
        Start staking
      </Button>
    </div>
  </div>
)

export default EmptyStakeDetails
