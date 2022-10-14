import Button from '@components/atoms/Button'
import { ChevronRight } from '@components/atoms/Icon'
import Text from '@components/atoms/Text'
import Select from '@components/molecules/Select'
import TextInput, { LabelButton } from '@components/molecules/TextInput'
import { useTheme } from '@emotion/react'
import Identicon from '@polkadot/react-identicon'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useState } from 'react'

import { PoolStatusIndicator } from '../PoolStatusIndicator'

export type StakingInputProps = {
  accounts: Array<{ name: string; address: string; balance: string }>
  amount: string
  fiatAmount: string
  onChangeAmount: (value: string) => unknown
  onRequestMaxAmount: () => unknown
  availableToStake: string
  poolName: string
  poolTotalStaked: string
  poolMemberCount: string
  onConfirm: () => unknown
}

const StakingInput = (props: StakingInputProps) => {
  const theme = useTheme()
  const [poolInfoExpanded, setPoolInfoExpanded] = useState(false)

  return (
    <form
      onSubmit={event => event.preventDefault()}
      css={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.color.surface,
        borderRadius: '1.6rem',
        padding: '3.2rem',
        maxWidth: '40rem',
        gap: '1.6rem',
      }}
    >
      <Select width="100%">
        {props.accounts.map(account => (
          <Select.Item
            leadingIcon={<Identicon value={account.address} size={40} theme="polkadot" />}
            headlineText={account.name}
            supportingText={account.balance}
          />
        ))}
      </Select>
      <TextInput
        placeholder="0 DOT"
        leadingLabel="Available to stake"
        trailingLabel={props.availableToStake}
        leadingSupportingText={props.fiatAmount}
        trailingIcon={<LabelButton onClick={props.onRequestMaxAmount}>MAX</LabelButton>}
        value={props.amount}
        onChange={event => props.onChangeAmount(event.target.value)}
      />
      <div css={{ padding: '0.8rem', borderRadius: '0.8rem', backgroundColor: theme.color.foreground }}>
        <div
          onClick={useCallback(() => setPoolInfoExpanded(x => !x), [])}
          css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <div css={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <PoolStatusIndicator status="success" />
            <Text
              css={{ fontSize: '1.4rem', fontWeight: poolInfoExpanded ? 'bold' : undefined }}
              alpha={poolInfoExpanded ? 'high' : 'medium'}
            >
              {props.poolName}
            </Text>
          </div>
          <motion.div animate={String(poolInfoExpanded)} variants={{ true: { transform: 'rotate(90deg)' }, false: {} }}>
            <ChevronRight />
          </motion.div>
        </div>
        <AnimatePresence>
          {poolInfoExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              css={{ overflow: 'hidden' }}
            >
              <dl
                css={{
                  '> div': {
                    display: 'flex',
                  },
                  'dd': {
                    marginLeft: '1.6rem',
                  },
                }}
              >
                <div>
                  <Text.Body as="dt">Total Staked</Text.Body>
                  <Text.Body as="dd" alpha="high">
                    {props.poolTotalStaked}
                  </Text.Body>
                </div>
                <div>
                  <Text.Body as="dt">Members</Text.Body>
                  <Text.Body as="dd" alpha="high">
                    {props.poolMemberCount}
                  </Text.Body>
                </div>
              </dl>
              <Text.Body as="p">
                Talisman automatically finds the best available nomination pool for you based on xxxx
              </Text.Body>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Button onClick={props.onConfirm} css={{ width: '100%' }}>
        Stake
      </Button>
    </form>
  )
}

export default StakingInput
