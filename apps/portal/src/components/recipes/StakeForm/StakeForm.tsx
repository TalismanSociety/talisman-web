import {
  Button,
  DescriptionList,
  Hr,
  Surface,
  SurfaceChip,
  Text,
  TextInput,
  TonalChip,
  Tooltip,
  useSurfaceColor,
  type ButtonProps,
  type ChipProps,
} from '@talismn/ui'
import { ChevronRight, Clock, Info, Settings } from '@talismn/web-icons'
import { isNilOrWhitespace } from '@util/nil'
import { LayoutGroup, motion } from 'framer-motion'
import { createContext, useContext, useId, useState, type ReactNode } from 'react'
import type { PoolClaimPermission } from '../PoolClaimPermissionForm'
import { StakeStatusIndicator, type StakeStatus } from '../StakeStatusIndicator'
import StakeFormSkeleton from './StakeForm.skeleton'

const AssetSelectorContext = createContext<ReactNode>(null)

type AmountInputProps = {
  amount: string
  onChangeAmount: (amount: string) => unknown
  onRequestMaxAmount: () => unknown
  fiatAmount: ReactNode
  availableToStake: ReactNode
  error?: string
}

const AmountInput = (props: AmountInputProps) => (
  <TextInput
    type="number"
    inputMode="decimal"
    width="10rem"
    placeholder="0.00"
    value={props.amount}
    onChange={event => props.onChangeAmount(event.target.value)}
    trailingIcon={useContext(AssetSelectorContext)}
    leadingLabel="Available to stake"
    trailingLabel={props.availableToStake}
    leadingSupportingText={
      isNilOrWhitespace(props.error) ? props.fiatAmount : <TextInput.ErrorLabel>{props.error}</TextInput.ErrorLabel>
    }
    trailingSupportingText={<SurfaceChip onClick={props.onRequestMaxAmount}>Max</SurfaceChip>}
    css={{ fontSize: '3rem' }}
  />
)

type PoolInfoProps = {
  name: ReactNode
  status: StakeStatus
  totalStaked: ReactNode
  memberCount: ReactNode
  onRequestPoolChange: () => unknown
  noPoolsAvailable?: boolean
  chain: ReactNode
}

const PoolInfo = (props: PoolInfoProps) => {
  const [expanded, setExpanded] = useState(false)
  const surfaceColor = useSurfaceColor()
  return (
    <motion.div
      animate={String(expanded)}
      initial="false"
      variants={{ true: { backgroundColor: surfaceColor }, false: { backgroundColor: 'transparent' } }}
      whileHover={{ backgroundColor: surfaceColor }}
      css={{ padding: '0.8rem', borderRadius: '0.8rem' }}
    >
      <div
        role="button"
        aria-label="Show pool detail"
        onClick={props.noPoolsAvailable ? undefined : () => setExpanded(x => !x)}
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: props.noPoolsAvailable ? undefined : 'pointer',
        }}
      >
        <div css={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <StakeStatusIndicator status={props.status} />
          <Text.Body css={{ fontSize: '1.4rem' }} alpha={expanded ? 'high' : 'medium'}>
            {props.noPoolsAvailable ? 'No pools available' : props.name}
          </Text.Body>
        </div>
        {props.noPoolsAvailable ? (
          <Info size="1.4rem" />
        ) : (
          <motion.div animate={String(expanded)} variants={{ true: { transform: 'rotate(90deg)' }, false: {} }}>
            <ChevronRight />
          </motion.div>
        )}
      </div>
      <motion.div
        variants={{ true: { opacity: 1, height: 'auto' }, false: { opacity: 0, height: 0 } }}
        css={{ overflow: 'hidden' }}
      >
        <dl
          css={{
            '> div': {
              display: 'flex',
            },
            dd: {
              marginLeft: '1.6rem',
            },
          }}
        >
          <div>
            <Text.Body as="dt">Total Staked</Text.Body>
            <Text.Body as="dd" alpha="high">
              {props.totalStaked}
            </Text.Body>
          </div>
          <div>
            <Text.Body as="dt">Members</Text.Body>
            <Text.Body as="dd" alpha="high">
              {props.memberCount}
            </Text.Body>
          </div>
        </dl>
        <Text.Body as="p" role="button">
          {props.chain !== 'polkadot'
            ? `We recommend joining the Talisman Pool, which curates a selection of high quality validators.`
            : `Talisman automatically finds you the best available nomination pool.`}
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
    </motion.div>
  )
}

type ClaimPermissionProps = {
  permission: PoolClaimPermission
  onChangeRequest: () => unknown
}

const ClaimPermission = (props: ClaimPermissionProps) => (
  <Surface
    css={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: '0.8rem',
      padding: '0.8rem 1.6rem',
    }}
  >
    <Text.Body as="div">
      Claim permission:{' '}
      <TonalChip size="sm" contentColor={props.permission === undefined ? '#F48F45' : '#38D448'}>
        {(() => {
          switch (props.permission) {
            case undefined:
              return 'None'
            case 'compound':
              return 'Compound'
            case 'withdraw':
              return 'Withdraw'
            case 'all':
              return 'All'
          }
        })()}
      </TonalChip>
    </Text.Body>
    <SurfaceChip
      contentAlpha="high"
      size="lg"
      leadingContent={<Settings />}
      css={{ padding: '0.6rem 0.8rem' }}
      onClick={props.onChangeRequest}
    >
      Manage
    </SurfaceChip>
  </Surface>
)

type EstimatedYieldProps = {
  amount: ReactNode
  fiatAmount: ReactNode
}

const EstimatedYield = (props: EstimatedYieldProps) => (
  <DescriptionList css={{ marginTop: '1.6rem', marginBottom: '1.6rem' }}>
    <DescriptionList.Description>
      <DescriptionList.Term>Estimated earnings</DescriptionList.Term>
      <DescriptionList.Details css={{ wordBreak: 'break-all' }}>
        <Text.Body alpha="high">{props.amount}</Text.Body>
        <Text.Body>{props.fiatAmount}</Text.Body>
      </DescriptionList.Details>
    </DescriptionList.Description>
  </DescriptionList>
)

type ExistingPoolProps = {
  name: ReactNode
  status: StakeStatus
  amount: ReactNode
  fiatAmount: ReactNode
  rewards: ReactNode
  rewardsFiatAmount: ReactNode
  claimChip: ReactNode
  unlocks?: Array<{ amount: ReactNode; eta: ReactNode }>
  unlocking?: ReactNode
  unlockingFiatAmount?: ReactNode
  withdrawable?: ReactNode
  withdrawableFiatAmount?: ReactNode
  withdrawChip: ReactNode
  claimPermission: ReactNode
  addButton: ReactNode
  unstakeButton: ReactNode
  readonly?: boolean
}

const ExistingPool = Object.assign(
  (props: ExistingPoolProps) => (
    <div>
      <DescriptionList>
        <DescriptionList.Description css={{ alignItems: 'center' }}>
          <DescriptionList.Term>Asset</DescriptionList.Term>
          <DescriptionList.Details>{useContext(AssetSelectorContext)}</DescriptionList.Details>
        </DescriptionList.Description>
        <DescriptionList.Description>
          <DescriptionList.Term>Pool</DescriptionList.Term>
          <DescriptionList.Details>
            <div css={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <StakeStatusIndicator status={props.status} />
              <Text.Body css={{ fontSize: '1.4rem' }}>{props.name}</Text.Body>
            </div>
          </DescriptionList.Details>
        </DescriptionList.Description>
        <DescriptionList.Description>
          <DescriptionList.Term>Staking</DescriptionList.Term>
          <DescriptionList.Details>
            <Text.Body as="div" alpha="high">
              {props.amount}
            </Text.Body>
            <Text.Body as="div">{props.fiatAmount}</Text.Body>
          </DescriptionList.Details>
        </DescriptionList.Description>
        <DescriptionList.Description>
          <DescriptionList.Term>Rewards</DescriptionList.Term>
          <DescriptionList.Details>
            <Text.Body as="div" alpha="high" css={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
              {props.claimChip}
              {props.rewards}
            </Text.Body>
            <Text.Body as="div">{props.rewardsFiatAmount}</Text.Body>
          </DescriptionList.Details>
        </DescriptionList.Description>
        {props.unlocking && (
          <DescriptionList.Description>
            <DescriptionList.Term>Unstaking</DescriptionList.Term>
            <DescriptionList.Details>
              <Tooltip
                placement="bottom"
                content={
                  <div>
                    {props.unlocks?.map((x, index, array) => (
                      <>
                        <Text.Body as="div" alpha="high">
                          {x.amount}
                        </Text.Body>
                        <Text.Body as="div">{x.eta}</Text.Body>
                        {index < array.length - 1 && <Hr />}
                      </>
                    ))}
                  </div>
                }
              >
                <div css={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                  <Clock size="1em" />
                  <Text.Body as="div" alpha="high">
                    {props.unlocking}
                  </Text.Body>
                </div>
              </Tooltip>
              <Text.Body as="div">{props.unlockingFiatAmount}</Text.Body>
            </DescriptionList.Details>
          </DescriptionList.Description>
        )}
        {props.withdrawable && (
          <DescriptionList.Description>
            <DescriptionList.Term>Withdrawable</DescriptionList.Term>
            <DescriptionList.Details>
              <Text.Body as="div" alpha="high" css={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                {props.withdrawChip} {props.withdrawable}
              </Text.Body>
              <Text.Body as="div">{props.withdrawableFiatAmount}</Text.Body>
            </DescriptionList.Details>
          </DescriptionList.Description>
        )}
      </DescriptionList>
      {props.claimPermission && <div css={{ marginBottom: '1.6rem' }}>{props.claimPermission}</div>}
      {!props.readonly && (
        <div css={{ display: 'flex', gap: '0.8rem' }}>
          {props.addButton}
          {props.unstakeButton}
        </div>
      )}
    </div>
  ),
  {
    ClaimChip: (props: ChipProps) => <TonalChip {...props}>Claim</TonalChip>,
    WithdrawChip: (props: ChipProps) => <SurfaceChip {...props}>Withdraw</SurfaceChip>,
    AddButton: (props: ButtonProps) => (
      <Button variant="outlined" {...props} css={{ flex: 1 }}>
        Add
      </Button>
    ),
    UnstakeButton: (props: ButtonProps) => (
      <Button variant="outlined" {...props} css={{ flex: 1 }}>
        Unstake
      </Button>
    ),
  }
)

export type StakeFormProps = {
  assetSelector: ReactNode
  accountSelector: ReactNode
  amountInput: ReactNode
  poolInfo: ReactNode
  estimatedYield: ReactNode
  claimPermission: ReactNode
  stakeButton: ReactNode
  existingPool: ReactNode
}

const StakeForm = Object.assign(
  (props: StakeFormProps) => {
    const id = useId()

    return (
      <LayoutGroup id={id}>
        <AssetSelectorContext.Provider value={<motion.div layoutId="asset-selector">{props.assetSelector}</motion.div>}>
          <Surface
            css={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.6rem',
              borderRadius: '1.6rem',
              padding: '1.6rem',
            }}
          >
            {props.accountSelector}
            {props.existingPool ? (
              props.existingPool
            ) : (
              <>
                {props.amountInput}
                {props.poolInfo}
                {props.estimatedYield}
                {props.claimPermission}
                {props.stakeButton}
              </>
            )}
          </Surface>
        </AssetSelectorContext.Provider>
      </LayoutGroup>
    )
  },
  {
    AmountInput,
    PoolInfo,
    EstimatedYield,
    StakeButton: (props: ButtonProps) => (
      <Button {...props} css={{ width: '100%' }}>
        Stake
      </Button>
    ),
    ExistingPool,
    ClaimPermission,
    Skeleton: StakeFormSkeleton,
  }
)

export default StakeForm
