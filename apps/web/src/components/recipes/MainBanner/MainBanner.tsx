import { Text } from '@talismn/ui'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import gradient from './gradient.png'
import { ReactComponent as BaseStubStakingInput } from './staking-input.svg'

const StubStakingInput = motion(BaseStubStakingInput)
const MotionLink = motion(Link)
const MainBanner = () => (
  <MotionLink
    to="/staking"
    css={{
      display: 'flex',
      borderRadius: '1.6rem',
      background: `url(${gradient})`,
      backgroundSize: 'cover',
      backgroundPosition: 'right center',
      overflow: 'hidden',
      cursor: 'pointer',
    }}
    whileHover={{ scale: 1.005 }}
  >
    <header css={{ flex: 1, padding: '3.3rem' }}>
      <Text.H2 css={{ marginBottom: '1.4rem' }}>Stake in seconds</Text.H2>
      <Text.Body>Stake your DOT in one click and start earning rewards</Text.Body>
    </header>
    <div css={{ flex: 1, display: 'flex', gap: '1.6rem', height: 0 }}>
      <StubStakingInput initial={{ y: '100%' }} animate={{ y: '8%' }} transition={{ delay: 0.25 }} />
      <StubStakingInput initial={{ y: '-100%' }} animate={{ y: '-50%' }} transition={{ delay: 0.5 }} />
    </div>
  </MotionLink>
)

export default MainBanner
