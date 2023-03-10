import { useTheme } from '@emotion/react'
import { ChevronRight, Info } from '@talismn/icons'
import { Button, Identicon, LabelButton, Select, Text, TextInput } from '@talismn/ui'
import { Maybe } from '@util/monads'
import { AnimatePresence, AnimationProps, motion } from 'framer-motion'
import { ReactNode, useState } from 'react'

import { PoolStatus, PoolStatusIndicator } from '../PoolStatusIndicator'
import StakingInputSkeleton from './StakingInput.skeleton'

type Account = { selected?: boolean; name: string; address: string; balance: string }

export type StakingInputProps = {
  accounts: Account[]
  onSelectAccount: (account: Account) => unknown
  amount: string
  fiatAmount: string
  inputSupportingText?: ReactNode
  onChangeAmount: (value: string) => unknown
  onRequestMaxAmount: () => unknown
  availableToStake: string
  noPoolsAvailable?: boolean
  poolName?: string
  poolStatus?: PoolStatus
  poolTotalStaked?: string
  poolMemberCount?: string
  onRequestPoolChange: () => unknown
  onSubmit: () => unknown
  submitState?: 'disabled' | 'pending'
  alreadyStaking?: boolean
  isError?: boolean
  contentAnimation?: AnimationProps
}

const StakingInput = Object.assign(
  (props: StakingInputProps) => {
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
        }}
      >
        <Select
          width="100%"
          placeholder="Select account"
          value={props.accounts.findIndex(x => x.selected)}
          onChange={value =>
            Maybe.of(value)
              .map(x => props.accounts[Number(x)])
              .map(props.onSelectAccount)
          }
        >
          {props.accounts.map((account, index) => (
            <Select.Item
              key={index}
              value={index}
              leadingIcon={<Identicon value={account.address} size={40} />}
              headlineText={account.name}
              supportingText={account.balance}
            />
          ))}
        </Select>
        <motion.div
          {...(props.contentAnimation !== undefined
            ? props.contentAnimation
            : {
                animate: String(props.alreadyStaking),
                variants: {
                  true: { height: 0 },
                  false: { height: 'unset' },
                },
              })}
          css={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.6rem',
            overflow: 'hidden',
          }}
        >
          {/* dummy spacer for animation work because of flex gap */}
          <div />
          <TextInput
            type="number"
            min={0}
            step="any"
            isError={props.isError}
            placeholder="0 DOT"
            leadingLabel="Available to stake"
            trailingLabel={props.availableToStake}
            leadingSupportingText={props.fiatAmount}
            trailingSupportingText={props.inputSupportingText}
            trailingIcon={<LabelButton onClick={props.onRequestMaxAmount}>MAX</LabelButton>}
            value={props.amount}
            onChange={event => props.onChangeAmount(event.target.value)}
          />
          <div css={{ padding: '0.8rem', borderRadius: '0.8rem', backgroundColor: theme.color.foreground }}>
            <div
              role="button"
              aria-label="Show pool detail"
              onClick={props.noPoolsAvailable ? undefined : () => setPoolInfoExpanded(x => !x)}
              css={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: props.noPoolsAvailable ? undefined : 'pointer',
              }}
            >
              <div css={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <PoolStatusIndicator status={props.poolStatus} />
                <Text.Body css={{ fontSize: '1.4rem' }} alpha={poolInfoExpanded ? 'high' : 'medium'}>
                  {props.noPoolsAvailable ? 'No pools available' : props.poolName}
                </Text.Body>
              </div>
              {props.noPoolsAvailable ? (
                <Info size="1.4rem" />
              ) : (
                <motion.div
                  animate={String(poolInfoExpanded)}
                  variants={{ true: { transform: 'rotate(90deg)' }, false: {} }}
                >
                  <ChevronRight />
                </motion.div>
              )}
            </div>
            <AnimatePresence>
              {poolInfoExpanded && !props.noPoolsAvailable && (
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
                  <Text.Body as="p" role="button">
                    Talisman automatically finds you the best available nomination pool
                  </Text.Body>
                  <Text.Body
                    as="div"
                    role="button"
                    alpha="high"
                    css={{ textDecoration: 'underline', cursor: 'pointer', marginBottom: '0.8rem' }}
                    onClick={props.onRequestPoolChange}
                  >
                    Pick a different pool
                  </Text.Body>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Button
            onClick={props.onSubmit}
            disabled={props.noPoolsAvailable || props.alreadyStaking || props.submitState === 'disabled'}
            loading={props.submitState === 'pending'}
            css={{ width: '100%' }}
          >
            Stake
          </Button>
        </motion.div>
      </form>
    )
  },
  { Skeleton: StakingInputSkeleton }
)

export default StakingInput
