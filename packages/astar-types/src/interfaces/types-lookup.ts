// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/types/lookup'

import type { Data } from '@polkadot/types'
import type {
  BTreeMap,
  BTreeSet,
  Bytes,
  Compact,
  Enum,
  Null,
  Option,
  Result,
  Set,
  Struct,
  Text,
  U256,
  U8aFixed,
  Vec,
  bool,
  u128,
  u16,
  u32,
  u64,
  u8,
} from '@polkadot/types-codec'
import type { ITuple } from '@polkadot/types-codec/types'
import type { Vote } from '@polkadot/types/interfaces/elections'
import type {
  AccountId32,
  Call,
  H160,
  H256,
  MultiAddress,
  Permill,
  Perquintill,
} from '@polkadot/types/interfaces/runtime'
import type { Event } from '@polkadot/types/interfaces/system'

declare module '@polkadot/types/lookup' {
  /** @name FrameSystemAccountInfo (3) */
  interface FrameSystemAccountInfo extends Struct {
    readonly nonce: u32
    readonly consumers: u32
    readonly providers: u32
    readonly sufficients: u32
    readonly data: PalletBalancesAccountData
  }

  /** @name PalletBalancesAccountData (5) */
  interface PalletBalancesAccountData extends Struct {
    readonly free: u128
    readonly reserved: u128
    readonly frozen: u128
    readonly flags: u128
  }

  /** @name FrameSupportDispatchPerDispatchClassWeight (8) */
  interface FrameSupportDispatchPerDispatchClassWeight extends Struct {
    readonly normal: SpWeightsWeightV2Weight
    readonly operational: SpWeightsWeightV2Weight
    readonly mandatory: SpWeightsWeightV2Weight
  }

  /** @name SpWeightsWeightV2Weight (9) */
  interface SpWeightsWeightV2Weight extends Struct {
    readonly refTime: Compact<u64>
    readonly proofSize: Compact<u64>
  }

  /** @name SpRuntimeDigest (14) */
  interface SpRuntimeDigest extends Struct {
    readonly logs: Vec<SpRuntimeDigestDigestItem>
  }

  /** @name SpRuntimeDigestDigestItem (16) */
  interface SpRuntimeDigestDigestItem extends Enum {
    readonly isOther: boolean
    readonly asOther: Bytes
    readonly isConsensus: boolean
    readonly asConsensus: ITuple<[U8aFixed, Bytes]>
    readonly isSeal: boolean
    readonly asSeal: ITuple<[U8aFixed, Bytes]>
    readonly isPreRuntime: boolean
    readonly asPreRuntime: ITuple<[U8aFixed, Bytes]>
    readonly isRuntimeEnvironmentUpdated: boolean
    readonly type: 'Other' | 'Consensus' | 'Seal' | 'PreRuntime' | 'RuntimeEnvironmentUpdated'
  }

  /** @name FrameSystemEventRecord (19) */
  interface FrameSystemEventRecord extends Struct {
    readonly phase: FrameSystemPhase
    readonly event: Event
    readonly topics: Vec<H256>
  }

  /** @name FrameSystemEvent (21) */
  interface FrameSystemEvent extends Enum {
    readonly isExtrinsicSuccess: boolean
    readonly asExtrinsicSuccess: {
      readonly dispatchInfo: FrameSupportDispatchDispatchInfo
    } & Struct
    readonly isExtrinsicFailed: boolean
    readonly asExtrinsicFailed: {
      readonly dispatchError: SpRuntimeDispatchError
      readonly dispatchInfo: FrameSupportDispatchDispatchInfo
    } & Struct
    readonly isCodeUpdated: boolean
    readonly isNewAccount: boolean
    readonly asNewAccount: {
      readonly account: AccountId32
    } & Struct
    readonly isKilledAccount: boolean
    readonly asKilledAccount: {
      readonly account: AccountId32
    } & Struct
    readonly isRemarked: boolean
    readonly asRemarked: {
      readonly sender: AccountId32
      readonly hash_: H256
    } & Struct
    readonly type: 'ExtrinsicSuccess' | 'ExtrinsicFailed' | 'CodeUpdated' | 'NewAccount' | 'KilledAccount' | 'Remarked'
  }

  /** @name FrameSupportDispatchDispatchInfo (22) */
  interface FrameSupportDispatchDispatchInfo extends Struct {
    readonly weight: SpWeightsWeightV2Weight
    readonly class: FrameSupportDispatchDispatchClass
    readonly paysFee: FrameSupportDispatchPays
  }

  /** @name FrameSupportDispatchDispatchClass (23) */
  interface FrameSupportDispatchDispatchClass extends Enum {
    readonly isNormal: boolean
    readonly isOperational: boolean
    readonly isMandatory: boolean
    readonly type: 'Normal' | 'Operational' | 'Mandatory'
  }

  /** @name FrameSupportDispatchPays (24) */
  interface FrameSupportDispatchPays extends Enum {
    readonly isYes: boolean
    readonly isNo: boolean
    readonly type: 'Yes' | 'No'
  }

  /** @name SpRuntimeDispatchError (25) */
  interface SpRuntimeDispatchError extends Enum {
    readonly isOther: boolean
    readonly isCannotLookup: boolean
    readonly isBadOrigin: boolean
    readonly isModule: boolean
    readonly asModule: SpRuntimeModuleError
    readonly isConsumerRemaining: boolean
    readonly isNoProviders: boolean
    readonly isTooManyConsumers: boolean
    readonly isToken: boolean
    readonly asToken: SpRuntimeTokenError
    readonly isArithmetic: boolean
    readonly asArithmetic: SpArithmeticArithmeticError
    readonly isTransactional: boolean
    readonly asTransactional: SpRuntimeTransactionalError
    readonly isExhausted: boolean
    readonly isCorruption: boolean
    readonly isUnavailable: boolean
    readonly isRootNotAllowed: boolean
    readonly type:
      | 'Other'
      | 'CannotLookup'
      | 'BadOrigin'
      | 'Module'
      | 'ConsumerRemaining'
      | 'NoProviders'
      | 'TooManyConsumers'
      | 'Token'
      | 'Arithmetic'
      | 'Transactional'
      | 'Exhausted'
      | 'Corruption'
      | 'Unavailable'
      | 'RootNotAllowed'
  }

  /** @name SpRuntimeModuleError (26) */
  interface SpRuntimeModuleError extends Struct {
    readonly index: u8
    readonly error: U8aFixed
  }

  /** @name SpRuntimeTokenError (27) */
  interface SpRuntimeTokenError extends Enum {
    readonly isFundsUnavailable: boolean
    readonly isOnlyProvider: boolean
    readonly isBelowMinimum: boolean
    readonly isCannotCreate: boolean
    readonly isUnknownAsset: boolean
    readonly isFrozen: boolean
    readonly isUnsupported: boolean
    readonly isCannotCreateHold: boolean
    readonly isNotExpendable: boolean
    readonly isBlocked: boolean
    readonly type:
      | 'FundsUnavailable'
      | 'OnlyProvider'
      | 'BelowMinimum'
      | 'CannotCreate'
      | 'UnknownAsset'
      | 'Frozen'
      | 'Unsupported'
      | 'CannotCreateHold'
      | 'NotExpendable'
      | 'Blocked'
  }

  /** @name SpArithmeticArithmeticError (28) */
  interface SpArithmeticArithmeticError extends Enum {
    readonly isUnderflow: boolean
    readonly isOverflow: boolean
    readonly isDivisionByZero: boolean
    readonly type: 'Underflow' | 'Overflow' | 'DivisionByZero'
  }

  /** @name SpRuntimeTransactionalError (29) */
  interface SpRuntimeTransactionalError extends Enum {
    readonly isLimitReached: boolean
    readonly isNoLayer: boolean
    readonly type: 'LimitReached' | 'NoLayer'
  }

  /** @name PalletUtilityEvent (30) */
  interface PalletUtilityEvent extends Enum {
    readonly isBatchInterrupted: boolean
    readonly asBatchInterrupted: {
      readonly index: u32
      readonly error: SpRuntimeDispatchError
    } & Struct
    readonly isBatchCompleted: boolean
    readonly isBatchCompletedWithErrors: boolean
    readonly isItemCompleted: boolean
    readonly isItemFailed: boolean
    readonly asItemFailed: {
      readonly error: SpRuntimeDispatchError
    } & Struct
    readonly isDispatchedAs: boolean
    readonly asDispatchedAs: {
      readonly result: Result<Null, SpRuntimeDispatchError>
    } & Struct
    readonly type:
      | 'BatchInterrupted'
      | 'BatchCompleted'
      | 'BatchCompletedWithErrors'
      | 'ItemCompleted'
      | 'ItemFailed'
      | 'DispatchedAs'
  }

  /** @name PalletIdentityEvent (33) */
  interface PalletIdentityEvent extends Enum {
    readonly isIdentitySet: boolean
    readonly asIdentitySet: {
      readonly who: AccountId32
    } & Struct
    readonly isIdentityCleared: boolean
    readonly asIdentityCleared: {
      readonly who: AccountId32
      readonly deposit: u128
    } & Struct
    readonly isIdentityKilled: boolean
    readonly asIdentityKilled: {
      readonly who: AccountId32
      readonly deposit: u128
    } & Struct
    readonly isJudgementRequested: boolean
    readonly asJudgementRequested: {
      readonly who: AccountId32
      readonly registrarIndex: u32
    } & Struct
    readonly isJudgementUnrequested: boolean
    readonly asJudgementUnrequested: {
      readonly who: AccountId32
      readonly registrarIndex: u32
    } & Struct
    readonly isJudgementGiven: boolean
    readonly asJudgementGiven: {
      readonly target: AccountId32
      readonly registrarIndex: u32
    } & Struct
    readonly isRegistrarAdded: boolean
    readonly asRegistrarAdded: {
      readonly registrarIndex: u32
    } & Struct
    readonly isSubIdentityAdded: boolean
    readonly asSubIdentityAdded: {
      readonly sub: AccountId32
      readonly main: AccountId32
      readonly deposit: u128
    } & Struct
    readonly isSubIdentityRemoved: boolean
    readonly asSubIdentityRemoved: {
      readonly sub: AccountId32
      readonly main: AccountId32
      readonly deposit: u128
    } & Struct
    readonly isSubIdentityRevoked: boolean
    readonly asSubIdentityRevoked: {
      readonly sub: AccountId32
      readonly main: AccountId32
      readonly deposit: u128
    } & Struct
    readonly type:
      | 'IdentitySet'
      | 'IdentityCleared'
      | 'IdentityKilled'
      | 'JudgementRequested'
      | 'JudgementUnrequested'
      | 'JudgementGiven'
      | 'RegistrarAdded'
      | 'SubIdentityAdded'
      | 'SubIdentityRemoved'
      | 'SubIdentityRevoked'
  }

  /** @name PalletMultisigEvent (34) */
  interface PalletMultisigEvent extends Enum {
    readonly isNewMultisig: boolean
    readonly asNewMultisig: {
      readonly approving: AccountId32
      readonly multisig: AccountId32
      readonly callHash: U8aFixed
    } & Struct
    readonly isMultisigApproval: boolean
    readonly asMultisigApproval: {
      readonly approving: AccountId32
      readonly timepoint: PalletMultisigTimepoint
      readonly multisig: AccountId32
      readonly callHash: U8aFixed
    } & Struct
    readonly isMultisigExecuted: boolean
    readonly asMultisigExecuted: {
      readonly approving: AccountId32
      readonly timepoint: PalletMultisigTimepoint
      readonly multisig: AccountId32
      readonly callHash: U8aFixed
      readonly result: Result<Null, SpRuntimeDispatchError>
    } & Struct
    readonly isMultisigCancelled: boolean
    readonly asMultisigCancelled: {
      readonly cancelling: AccountId32
      readonly timepoint: PalletMultisigTimepoint
      readonly multisig: AccountId32
      readonly callHash: U8aFixed
    } & Struct
    readonly type: 'NewMultisig' | 'MultisigApproval' | 'MultisigExecuted' | 'MultisigCancelled'
  }

  /** @name PalletMultisigTimepoint (35) */
  interface PalletMultisigTimepoint extends Struct {
    readonly height: u32
    readonly index: u32
  }

  /** @name PalletSchedulerEvent (36) */
  interface PalletSchedulerEvent extends Enum {
    readonly isScheduled: boolean
    readonly asScheduled: {
      readonly when: u32
      readonly index: u32
    } & Struct
    readonly isCanceled: boolean
    readonly asCanceled: {
      readonly when: u32
      readonly index: u32
    } & Struct
    readonly isDispatched: boolean
    readonly asDispatched: {
      readonly task: ITuple<[u32, u32]>
      readonly id: Option<U8aFixed>
      readonly result: Result<Null, SpRuntimeDispatchError>
    } & Struct
    readonly isCallUnavailable: boolean
    readonly asCallUnavailable: {
      readonly task: ITuple<[u32, u32]>
      readonly id: Option<U8aFixed>
    } & Struct
    readonly isPeriodicFailed: boolean
    readonly asPeriodicFailed: {
      readonly task: ITuple<[u32, u32]>
      readonly id: Option<U8aFixed>
    } & Struct
    readonly isPermanentlyOverweight: boolean
    readonly asPermanentlyOverweight: {
      readonly task: ITuple<[u32, u32]>
      readonly id: Option<U8aFixed>
    } & Struct
    readonly type:
      | 'Scheduled'
      | 'Canceled'
      | 'Dispatched'
      | 'CallUnavailable'
      | 'PeriodicFailed'
      | 'PermanentlyOverweight'
  }

  /** @name PalletProxyEvent (39) */
  interface PalletProxyEvent extends Enum {
    readonly isProxyExecuted: boolean
    readonly asProxyExecuted: {
      readonly result: Result<Null, SpRuntimeDispatchError>
    } & Struct
    readonly isPureCreated: boolean
    readonly asPureCreated: {
      readonly pure: AccountId32
      readonly who: AccountId32
      readonly proxyType: ShibuyaRuntimeProxyType
      readonly disambiguationIndex: u16
    } & Struct
    readonly isAnnounced: boolean
    readonly asAnnounced: {
      readonly real: AccountId32
      readonly proxy: AccountId32
      readonly callHash: H256
    } & Struct
    readonly isProxyAdded: boolean
    readonly asProxyAdded: {
      readonly delegator: AccountId32
      readonly delegatee: AccountId32
      readonly proxyType: ShibuyaRuntimeProxyType
      readonly delay: u32
    } & Struct
    readonly isProxyRemoved: boolean
    readonly asProxyRemoved: {
      readonly delegator: AccountId32
      readonly delegatee: AccountId32
      readonly proxyType: ShibuyaRuntimeProxyType
      readonly delay: u32
    } & Struct
    readonly type: 'ProxyExecuted' | 'PureCreated' | 'Announced' | 'ProxyAdded' | 'ProxyRemoved'
  }

  /** @name ShibuyaRuntimeProxyType (40) */
  interface ShibuyaRuntimeProxyType extends Enum {
    readonly isAny: boolean
    readonly isNonTransfer: boolean
    readonly isBalances: boolean
    readonly isAssets: boolean
    readonly isGovernance: boolean
    readonly isIdentityJudgement: boolean
    readonly isCancelProxy: boolean
    readonly isDappStaking: boolean
    readonly isStakerRewardClaim: boolean
    readonly type:
      | 'Any'
      | 'NonTransfer'
      | 'Balances'
      | 'Assets'
      | 'Governance'
      | 'IdentityJudgement'
      | 'CancelProxy'
      | 'DappStaking'
      | 'StakerRewardClaim'
  }

  /** @name CumulusPalletParachainSystemEvent (42) */
  interface CumulusPalletParachainSystemEvent extends Enum {
    readonly isValidationFunctionStored: boolean
    readonly isValidationFunctionApplied: boolean
    readonly asValidationFunctionApplied: {
      readonly relayChainBlockNum: u32
    } & Struct
    readonly isValidationFunctionDiscarded: boolean
    readonly isUpgradeAuthorized: boolean
    readonly asUpgradeAuthorized: {
      readonly codeHash: H256
    } & Struct
    readonly isDownwardMessagesReceived: boolean
    readonly asDownwardMessagesReceived: {
      readonly count: u32
    } & Struct
    readonly isDownwardMessagesProcessed: boolean
    readonly asDownwardMessagesProcessed: {
      readonly weightUsed: SpWeightsWeightV2Weight
      readonly dmqHead: H256
    } & Struct
    readonly isUpwardMessageSent: boolean
    readonly asUpwardMessageSent: {
      readonly messageHash: Option<U8aFixed>
    } & Struct
    readonly type:
      | 'ValidationFunctionStored'
      | 'ValidationFunctionApplied'
      | 'ValidationFunctionDiscarded'
      | 'UpgradeAuthorized'
      | 'DownwardMessagesReceived'
      | 'DownwardMessagesProcessed'
      | 'UpwardMessageSent'
  }

  /** @name PalletTransactionPaymentEvent (43) */
  interface PalletTransactionPaymentEvent extends Enum {
    readonly isTransactionFeePaid: boolean
    readonly asTransactionFeePaid: {
      readonly who: AccountId32
      readonly actualFee: u128
      readonly tip: u128
    } & Struct
    readonly type: 'TransactionFeePaid'
  }

  /** @name PalletBalancesEvent (44) */
  interface PalletBalancesEvent extends Enum {
    readonly isEndowed: boolean
    readonly asEndowed: {
      readonly account: AccountId32
      readonly freeBalance: u128
    } & Struct
    readonly isDustLost: boolean
    readonly asDustLost: {
      readonly account: AccountId32
      readonly amount: u128
    } & Struct
    readonly isTransfer: boolean
    readonly asTransfer: {
      readonly from: AccountId32
      readonly to: AccountId32
      readonly amount: u128
    } & Struct
    readonly isBalanceSet: boolean
    readonly asBalanceSet: {
      readonly who: AccountId32
      readonly free: u128
    } & Struct
    readonly isReserved: boolean
    readonly asReserved: {
      readonly who: AccountId32
      readonly amount: u128
    } & Struct
    readonly isUnreserved: boolean
    readonly asUnreserved: {
      readonly who: AccountId32
      readonly amount: u128
    } & Struct
    readonly isReserveRepatriated: boolean
    readonly asReserveRepatriated: {
      readonly from: AccountId32
      readonly to: AccountId32
      readonly amount: u128
      readonly destinationStatus: FrameSupportTokensMiscBalanceStatus
    } & Struct
    readonly isDeposit: boolean
    readonly asDeposit: {
      readonly who: AccountId32
      readonly amount: u128
    } & Struct
    readonly isWithdraw: boolean
    readonly asWithdraw: {
      readonly who: AccountId32
      readonly amount: u128
    } & Struct
    readonly isSlashed: boolean
    readonly asSlashed: {
      readonly who: AccountId32
      readonly amount: u128
    } & Struct
    readonly isMinted: boolean
    readonly asMinted: {
      readonly who: AccountId32
      readonly amount: u128
    } & Struct
    readonly isBurned: boolean
    readonly asBurned: {
      readonly who: AccountId32
      readonly amount: u128
    } & Struct
    readonly isSuspended: boolean
    readonly asSuspended: {
      readonly who: AccountId32
      readonly amount: u128
    } & Struct
    readonly isRestored: boolean
    readonly asRestored: {
      readonly who: AccountId32
      readonly amount: u128
    } & Struct
    readonly isUpgraded: boolean
    readonly asUpgraded: {
      readonly who: AccountId32
    } & Struct
    readonly isIssued: boolean
    readonly asIssued: {
      readonly amount: u128
    } & Struct
    readonly isRescinded: boolean
    readonly asRescinded: {
      readonly amount: u128
    } & Struct
    readonly isLocked: boolean
    readonly asLocked: {
      readonly who: AccountId32
      readonly amount: u128
    } & Struct
    readonly isUnlocked: boolean
    readonly asUnlocked: {
      readonly who: AccountId32
      readonly amount: u128
    } & Struct
    readonly isFrozen: boolean
    readonly asFrozen: {
      readonly who: AccountId32
      readonly amount: u128
    } & Struct
    readonly isThawed: boolean
    readonly asThawed: {
      readonly who: AccountId32
      readonly amount: u128
    } & Struct
    readonly type:
      | 'Endowed'
      | 'DustLost'
      | 'Transfer'
      | 'BalanceSet'
      | 'Reserved'
      | 'Unreserved'
      | 'ReserveRepatriated'
      | 'Deposit'
      | 'Withdraw'
      | 'Slashed'
      | 'Minted'
      | 'Burned'
      | 'Suspended'
      | 'Restored'
      | 'Upgraded'
      | 'Issued'
      | 'Rescinded'
      | 'Locked'
      | 'Unlocked'
      | 'Frozen'
      | 'Thawed'
  }

  /** @name FrameSupportTokensMiscBalanceStatus (45) */
  interface FrameSupportTokensMiscBalanceStatus extends Enum {
    readonly isFree: boolean
    readonly isReserved: boolean
    readonly type: 'Free' | 'Reserved'
  }

  /** @name PalletVestingEvent (46) */
  interface PalletVestingEvent extends Enum {
    readonly isVestingUpdated: boolean
    readonly asVestingUpdated: {
      readonly account: AccountId32
      readonly unvested: u128
    } & Struct
    readonly isVestingCompleted: boolean
    readonly asVestingCompleted: {
      readonly account: AccountId32
    } & Struct
    readonly type: 'VestingUpdated' | 'VestingCompleted'
  }

  /** @name PalletDappStakingV3Event (47) */
  interface PalletDappStakingV3Event extends Enum {
    readonly isMaintenanceMode: boolean
    readonly asMaintenanceMode: {
      readonly enabled: bool
    } & Struct
    readonly isNewEra: boolean
    readonly asNewEra: {
      readonly era: u32
    } & Struct
    readonly isNewSubperiod: boolean
    readonly asNewSubperiod: {
      readonly subperiod: PalletDappStakingV3Subperiod
      readonly number: u32
    } & Struct
    readonly isDAppRegistered: boolean
    readonly asDAppRegistered: {
      readonly owner: AccountId32
      readonly smartContract: AstarPrimitivesDappStakingSmartContract
      readonly dappId: u16
    } & Struct
    readonly isDAppRewardDestinationUpdated: boolean
    readonly asDAppRewardDestinationUpdated: {
      readonly smartContract: AstarPrimitivesDappStakingSmartContract
      readonly beneficiary: Option<AccountId32>
    } & Struct
    readonly isDAppOwnerChanged: boolean
    readonly asDAppOwnerChanged: {
      readonly smartContract: AstarPrimitivesDappStakingSmartContract
      readonly newOwner: AccountId32
    } & Struct
    readonly isDAppUnregistered: boolean
    readonly asDAppUnregistered: {
      readonly smartContract: AstarPrimitivesDappStakingSmartContract
      readonly era: u32
    } & Struct
    readonly isLocked: boolean
    readonly asLocked: {
      readonly account: AccountId32
      readonly amount: u128
    } & Struct
    readonly isUnlocking: boolean
    readonly asUnlocking: {
      readonly account: AccountId32
      readonly amount: u128
    } & Struct
    readonly isClaimedUnlocked: boolean
    readonly asClaimedUnlocked: {
      readonly account: AccountId32
      readonly amount: u128
    } & Struct
    readonly isRelock: boolean
    readonly asRelock: {
      readonly account: AccountId32
      readonly amount: u128
    } & Struct
    readonly isStake: boolean
    readonly asStake: {
      readonly account: AccountId32
      readonly smartContract: AstarPrimitivesDappStakingSmartContract
      readonly amount: u128
    } & Struct
    readonly isUnstake: boolean
    readonly asUnstake: {
      readonly account: AccountId32
      readonly smartContract: AstarPrimitivesDappStakingSmartContract
      readonly amount: u128
    } & Struct
    readonly isReward: boolean
    readonly asReward: {
      readonly account: AccountId32
      readonly era: u32
      readonly amount: u128
    } & Struct
    readonly isBonusReward: boolean
    readonly asBonusReward: {
      readonly account: AccountId32
      readonly smartContract: AstarPrimitivesDappStakingSmartContract
      readonly period: u32
      readonly amount: u128
    } & Struct
    readonly isDAppReward: boolean
    readonly asDAppReward: {
      readonly beneficiary: AccountId32
      readonly smartContract: AstarPrimitivesDappStakingSmartContract
      readonly tierId: u8
      readonly era: u32
      readonly amount: u128
    } & Struct
    readonly isUnstakeFromUnregistered: boolean
    readonly asUnstakeFromUnregistered: {
      readonly account: AccountId32
      readonly smartContract: AstarPrimitivesDappStakingSmartContract
      readonly amount: u128
    } & Struct
    readonly isExpiredEntriesRemoved: boolean
    readonly asExpiredEntriesRemoved: {
      readonly account: AccountId32
      readonly count: u16
    } & Struct
    readonly isForce: boolean
    readonly asForce: {
      readonly forcingType: PalletDappStakingV3ForcingType
    } & Struct
    readonly type:
      | 'MaintenanceMode'
      | 'NewEra'
      | 'NewSubperiod'
      | 'DAppRegistered'
      | 'DAppRewardDestinationUpdated'
      | 'DAppOwnerChanged'
      | 'DAppUnregistered'
      | 'Locked'
      | 'Unlocking'
      | 'ClaimedUnlocked'
      | 'Relock'
      | 'Stake'
      | 'Unstake'
      | 'Reward'
      | 'BonusReward'
      | 'DAppReward'
      | 'UnstakeFromUnregistered'
      | 'ExpiredEntriesRemoved'
      | 'Force'
  }

  /** @name PalletDappStakingV3Subperiod (49) */
  interface PalletDappStakingV3Subperiod extends Enum {
    readonly isVoting: boolean
    readonly isBuildAndEarn: boolean
    readonly type: 'Voting' | 'BuildAndEarn'
  }

  /** @name AstarPrimitivesDappStakingSmartContract (50) */
  interface AstarPrimitivesDappStakingSmartContract extends Enum {
    readonly isEvm: boolean
    readonly asEvm: H160
    readonly isWasm: boolean
    readonly asWasm: AccountId32
    readonly type: 'Evm' | 'Wasm'
  }

  /** @name PalletDappStakingV3ForcingType (54) */
  interface PalletDappStakingV3ForcingType extends Enum {
    readonly isEra: boolean
    readonly isSubperiod: boolean
    readonly type: 'Era' | 'Subperiod'
  }

  /** @name PalletInflationEvent (55) */
  interface PalletInflationEvent extends Enum {
    readonly isInflationParametersForceChanged: boolean
    readonly isInflationConfigurationForceChanged: boolean
    readonly asInflationConfigurationForceChanged: {
      readonly config: PalletInflationInflationConfiguration
    } & Struct
    readonly isForcedInflationRecalculation: boolean
    readonly asForcedInflationRecalculation: {
      readonly config: PalletInflationInflationConfiguration
    } & Struct
    readonly isNewInflationConfiguration: boolean
    readonly asNewInflationConfiguration: {
      readonly config: PalletInflationInflationConfiguration
    } & Struct
    readonly type:
      | 'InflationParametersForceChanged'
      | 'InflationConfigurationForceChanged'
      | 'ForcedInflationRecalculation'
      | 'NewInflationConfiguration'
  }

  /** @name PalletInflationInflationConfiguration (56) */
  interface PalletInflationInflationConfiguration extends Struct {
    readonly recalculationEra: Compact<u32>
    readonly issuanceSafetyCap: Compact<u128>
    readonly collatorRewardPerBlock: Compact<u128>
    readonly treasuryRewardPerBlock: Compact<u128>
    readonly dappRewardPoolPerEra: Compact<u128>
    readonly baseStakerRewardPoolPerEra: Compact<u128>
    readonly adjustableStakerRewardPoolPerEra: Compact<u128>
    readonly bonusRewardPoolPerPeriod: Compact<u128>
    readonly idealStakingRate: Compact<Perquintill>
  }

  /** @name PalletAssetsEvent (61) */
  interface PalletAssetsEvent extends Enum {
    readonly isCreated: boolean
    readonly asCreated: {
      readonly assetId: u128
      readonly creator: AccountId32
      readonly owner: AccountId32
    } & Struct
    readonly isIssued: boolean
    readonly asIssued: {
      readonly assetId: u128
      readonly owner: AccountId32
      readonly amount: u128
    } & Struct
    readonly isTransferred: boolean
    readonly asTransferred: {
      readonly assetId: u128
      readonly from: AccountId32
      readonly to: AccountId32
      readonly amount: u128
    } & Struct
    readonly isBurned: boolean
    readonly asBurned: {
      readonly assetId: u128
      readonly owner: AccountId32
      readonly balance: u128
    } & Struct
    readonly isTeamChanged: boolean
    readonly asTeamChanged: {
      readonly assetId: u128
      readonly issuer: AccountId32
      readonly admin: AccountId32
      readonly freezer: AccountId32
    } & Struct
    readonly isOwnerChanged: boolean
    readonly asOwnerChanged: {
      readonly assetId: u128
      readonly owner: AccountId32
    } & Struct
    readonly isFrozen: boolean
    readonly asFrozen: {
      readonly assetId: u128
      readonly who: AccountId32
    } & Struct
    readonly isThawed: boolean
    readonly asThawed: {
      readonly assetId: u128
      readonly who: AccountId32
    } & Struct
    readonly isAssetFrozen: boolean
    readonly asAssetFrozen: {
      readonly assetId: u128
    } & Struct
    readonly isAssetThawed: boolean
    readonly asAssetThawed: {
      readonly assetId: u128
    } & Struct
    readonly isAccountsDestroyed: boolean
    readonly asAccountsDestroyed: {
      readonly assetId: u128
      readonly accountsDestroyed: u32
      readonly accountsRemaining: u32
    } & Struct
    readonly isApprovalsDestroyed: boolean
    readonly asApprovalsDestroyed: {
      readonly assetId: u128
      readonly approvalsDestroyed: u32
      readonly approvalsRemaining: u32
    } & Struct
    readonly isDestructionStarted: boolean
    readonly asDestructionStarted: {
      readonly assetId: u128
    } & Struct
    readonly isDestroyed: boolean
    readonly asDestroyed: {
      readonly assetId: u128
    } & Struct
    readonly isForceCreated: boolean
    readonly asForceCreated: {
      readonly assetId: u128
      readonly owner: AccountId32
    } & Struct
    readonly isMetadataSet: boolean
    readonly asMetadataSet: {
      readonly assetId: u128
      readonly name: Bytes
      readonly symbol: Bytes
      readonly decimals: u8
      readonly isFrozen: bool
    } & Struct
    readonly isMetadataCleared: boolean
    readonly asMetadataCleared: {
      readonly assetId: u128
    } & Struct
    readonly isApprovedTransfer: boolean
    readonly asApprovedTransfer: {
      readonly assetId: u128
      readonly source: AccountId32
      readonly delegate: AccountId32
      readonly amount: u128
    } & Struct
    readonly isApprovalCancelled: boolean
    readonly asApprovalCancelled: {
      readonly assetId: u128
      readonly owner: AccountId32
      readonly delegate: AccountId32
    } & Struct
    readonly isTransferredApproved: boolean
    readonly asTransferredApproved: {
      readonly assetId: u128
      readonly owner: AccountId32
      readonly delegate: AccountId32
      readonly destination: AccountId32
      readonly amount: u128
    } & Struct
    readonly isAssetStatusChanged: boolean
    readonly asAssetStatusChanged: {
      readonly assetId: u128
    } & Struct
    readonly isAssetMinBalanceChanged: boolean
    readonly asAssetMinBalanceChanged: {
      readonly assetId: u128
      readonly newMinBalance: u128
    } & Struct
    readonly isTouched: boolean
    readonly asTouched: {
      readonly assetId: u128
      readonly who: AccountId32
      readonly depositor: AccountId32
    } & Struct
    readonly isBlocked: boolean
    readonly asBlocked: {
      readonly assetId: u128
      readonly who: AccountId32
    } & Struct
    readonly type:
      | 'Created'
      | 'Issued'
      | 'Transferred'
      | 'Burned'
      | 'TeamChanged'
      | 'OwnerChanged'
      | 'Frozen'
      | 'Thawed'
      | 'AssetFrozen'
      | 'AssetThawed'
      | 'AccountsDestroyed'
      | 'ApprovalsDestroyed'
      | 'DestructionStarted'
      | 'Destroyed'
      | 'ForceCreated'
      | 'MetadataSet'
      | 'MetadataCleared'
      | 'ApprovedTransfer'
      | 'ApprovalCancelled'
      | 'TransferredApproved'
      | 'AssetStatusChanged'
      | 'AssetMinBalanceChanged'
      | 'Touched'
      | 'Blocked'
  }

  /** @name PalletCollatorSelectionEvent (62) */
  interface PalletCollatorSelectionEvent extends Enum {
    readonly isNewInvulnerables: boolean
    readonly asNewInvulnerables: Vec<AccountId32>
    readonly isNewDesiredCandidates: boolean
    readonly asNewDesiredCandidates: u32
    readonly isNewCandidacyBond: boolean
    readonly asNewCandidacyBond: u128
    readonly isCandidateAdded: boolean
    readonly asCandidateAdded: ITuple<[AccountId32, u128]>
    readonly isCandidateRemoved: boolean
    readonly asCandidateRemoved: AccountId32
    readonly isCandidateSlashed: boolean
    readonly asCandidateSlashed: AccountId32
    readonly type:
      | 'NewInvulnerables'
      | 'NewDesiredCandidates'
      | 'NewCandidacyBond'
      | 'CandidateAdded'
      | 'CandidateRemoved'
      | 'CandidateSlashed'
  }

  /** @name PalletSessionEvent (64) */
  interface PalletSessionEvent extends Enum {
    readonly isNewSession: boolean
    readonly asNewSession: {
      readonly sessionIndex: u32
    } & Struct
    readonly type: 'NewSession'
  }

  /** @name CumulusPalletXcmpQueueEvent (65) */
  interface CumulusPalletXcmpQueueEvent extends Enum {
    readonly isSuccess: boolean
    readonly asSuccess: {
      readonly messageHash: Option<U8aFixed>
      readonly weight: SpWeightsWeightV2Weight
    } & Struct
    readonly isFail: boolean
    readonly asFail: {
      readonly messageHash: Option<U8aFixed>
      readonly error: XcmV3TraitsError
      readonly weight: SpWeightsWeightV2Weight
    } & Struct
    readonly isBadVersion: boolean
    readonly asBadVersion: {
      readonly messageHash: Option<U8aFixed>
    } & Struct
    readonly isBadFormat: boolean
    readonly asBadFormat: {
      readonly messageHash: Option<U8aFixed>
    } & Struct
    readonly isXcmpMessageSent: boolean
    readonly asXcmpMessageSent: {
      readonly messageHash: Option<U8aFixed>
    } & Struct
    readonly isOverweightEnqueued: boolean
    readonly asOverweightEnqueued: {
      readonly sender: u32
      readonly sentAt: u32
      readonly index: u64
      readonly required: SpWeightsWeightV2Weight
    } & Struct
    readonly isOverweightServiced: boolean
    readonly asOverweightServiced: {
      readonly index: u64
      readonly used: SpWeightsWeightV2Weight
    } & Struct
    readonly type:
      | 'Success'
      | 'Fail'
      | 'BadVersion'
      | 'BadFormat'
      | 'XcmpMessageSent'
      | 'OverweightEnqueued'
      | 'OverweightServiced'
  }

  /** @name XcmV3TraitsError (66) */
  interface XcmV3TraitsError extends Enum {
    readonly isOverflow: boolean
    readonly isUnimplemented: boolean
    readonly isUntrustedReserveLocation: boolean
    readonly isUntrustedTeleportLocation: boolean
    readonly isLocationFull: boolean
    readonly isLocationNotInvertible: boolean
    readonly isBadOrigin: boolean
    readonly isInvalidLocation: boolean
    readonly isAssetNotFound: boolean
    readonly isFailedToTransactAsset: boolean
    readonly isNotWithdrawable: boolean
    readonly isLocationCannotHold: boolean
    readonly isExceedsMaxMessageSize: boolean
    readonly isDestinationUnsupported: boolean
    readonly isTransport: boolean
    readonly isUnroutable: boolean
    readonly isUnknownClaim: boolean
    readonly isFailedToDecode: boolean
    readonly isMaxWeightInvalid: boolean
    readonly isNotHoldingFees: boolean
    readonly isTooExpensive: boolean
    readonly isTrap: boolean
    readonly asTrap: u64
    readonly isExpectationFalse: boolean
    readonly isPalletNotFound: boolean
    readonly isNameMismatch: boolean
    readonly isVersionIncompatible: boolean
    readonly isHoldingWouldOverflow: boolean
    readonly isExportError: boolean
    readonly isReanchorFailed: boolean
    readonly isNoDeal: boolean
    readonly isFeesNotMet: boolean
    readonly isLockError: boolean
    readonly isNoPermission: boolean
    readonly isUnanchored: boolean
    readonly isNotDepositable: boolean
    readonly isUnhandledXcmVersion: boolean
    readonly isWeightLimitReached: boolean
    readonly asWeightLimitReached: SpWeightsWeightV2Weight
    readonly isBarrier: boolean
    readonly isWeightNotComputable: boolean
    readonly isExceedsStackLimit: boolean
    readonly type:
      | 'Overflow'
      | 'Unimplemented'
      | 'UntrustedReserveLocation'
      | 'UntrustedTeleportLocation'
      | 'LocationFull'
      | 'LocationNotInvertible'
      | 'BadOrigin'
      | 'InvalidLocation'
      | 'AssetNotFound'
      | 'FailedToTransactAsset'
      | 'NotWithdrawable'
      | 'LocationCannotHold'
      | 'ExceedsMaxMessageSize'
      | 'DestinationUnsupported'
      | 'Transport'
      | 'Unroutable'
      | 'UnknownClaim'
      | 'FailedToDecode'
      | 'MaxWeightInvalid'
      | 'NotHoldingFees'
      | 'TooExpensive'
      | 'Trap'
      | 'ExpectationFalse'
      | 'PalletNotFound'
      | 'NameMismatch'
      | 'VersionIncompatible'
      | 'HoldingWouldOverflow'
      | 'ExportError'
      | 'ReanchorFailed'
      | 'NoDeal'
      | 'FeesNotMet'
      | 'LockError'
      | 'NoPermission'
      | 'Unanchored'
      | 'NotDepositable'
      | 'UnhandledXcmVersion'
      | 'WeightLimitReached'
      | 'Barrier'
      | 'WeightNotComputable'
      | 'ExceedsStackLimit'
  }

  /** @name PalletXcmEvent (68) */
  interface PalletXcmEvent extends Enum {
    readonly isAttempted: boolean
    readonly asAttempted: XcmV3TraitsOutcome
    readonly isSent: boolean
    readonly asSent: ITuple<[XcmV3MultiLocation, XcmV3MultiLocation, XcmV3Xcm]>
    readonly isUnexpectedResponse: boolean
    readonly asUnexpectedResponse: ITuple<[XcmV3MultiLocation, u64]>
    readonly isResponseReady: boolean
    readonly asResponseReady: ITuple<[u64, XcmV3Response]>
    readonly isNotified: boolean
    readonly asNotified: ITuple<[u64, u8, u8]>
    readonly isNotifyOverweight: boolean
    readonly asNotifyOverweight: ITuple<[u64, u8, u8, SpWeightsWeightV2Weight, SpWeightsWeightV2Weight]>
    readonly isNotifyDispatchError: boolean
    readonly asNotifyDispatchError: ITuple<[u64, u8, u8]>
    readonly isNotifyDecodeFailed: boolean
    readonly asNotifyDecodeFailed: ITuple<[u64, u8, u8]>
    readonly isInvalidResponder: boolean
    readonly asInvalidResponder: ITuple<[XcmV3MultiLocation, u64, Option<XcmV3MultiLocation>]>
    readonly isInvalidResponderVersion: boolean
    readonly asInvalidResponderVersion: ITuple<[XcmV3MultiLocation, u64]>
    readonly isResponseTaken: boolean
    readonly asResponseTaken: u64
    readonly isAssetsTrapped: boolean
    readonly asAssetsTrapped: ITuple<[H256, XcmV3MultiLocation, XcmVersionedMultiAssets]>
    readonly isVersionChangeNotified: boolean
    readonly asVersionChangeNotified: ITuple<[XcmV3MultiLocation, u32, XcmV3MultiassetMultiAssets]>
    readonly isSupportedVersionChanged: boolean
    readonly asSupportedVersionChanged: ITuple<[XcmV3MultiLocation, u32]>
    readonly isNotifyTargetSendFail: boolean
    readonly asNotifyTargetSendFail: ITuple<[XcmV3MultiLocation, u64, XcmV3TraitsError]>
    readonly isNotifyTargetMigrationFail: boolean
    readonly asNotifyTargetMigrationFail: ITuple<[XcmVersionedMultiLocation, u64]>
    readonly isInvalidQuerierVersion: boolean
    readonly asInvalidQuerierVersion: ITuple<[XcmV3MultiLocation, u64]>
    readonly isInvalidQuerier: boolean
    readonly asInvalidQuerier: ITuple<[XcmV3MultiLocation, u64, XcmV3MultiLocation, Option<XcmV3MultiLocation>]>
    readonly isVersionNotifyStarted: boolean
    readonly asVersionNotifyStarted: ITuple<[XcmV3MultiLocation, XcmV3MultiassetMultiAssets]>
    readonly isVersionNotifyRequested: boolean
    readonly asVersionNotifyRequested: ITuple<[XcmV3MultiLocation, XcmV3MultiassetMultiAssets]>
    readonly isVersionNotifyUnrequested: boolean
    readonly asVersionNotifyUnrequested: ITuple<[XcmV3MultiLocation, XcmV3MultiassetMultiAssets]>
    readonly isFeesPaid: boolean
    readonly asFeesPaid: ITuple<[XcmV3MultiLocation, XcmV3MultiassetMultiAssets]>
    readonly isAssetsClaimed: boolean
    readonly asAssetsClaimed: ITuple<[H256, XcmV3MultiLocation, XcmVersionedMultiAssets]>
    readonly type:
      | 'Attempted'
      | 'Sent'
      | 'UnexpectedResponse'
      | 'ResponseReady'
      | 'Notified'
      | 'NotifyOverweight'
      | 'NotifyDispatchError'
      | 'NotifyDecodeFailed'
      | 'InvalidResponder'
      | 'InvalidResponderVersion'
      | 'ResponseTaken'
      | 'AssetsTrapped'
      | 'VersionChangeNotified'
      | 'SupportedVersionChanged'
      | 'NotifyTargetSendFail'
      | 'NotifyTargetMigrationFail'
      | 'InvalidQuerierVersion'
      | 'InvalidQuerier'
      | 'VersionNotifyStarted'
      | 'VersionNotifyRequested'
      | 'VersionNotifyUnrequested'
      | 'FeesPaid'
      | 'AssetsClaimed'
  }

  /** @name XcmV3TraitsOutcome (69) */
  interface XcmV3TraitsOutcome extends Enum {
    readonly isComplete: boolean
    readonly asComplete: SpWeightsWeightV2Weight
    readonly isIncomplete: boolean
    readonly asIncomplete: ITuple<[SpWeightsWeightV2Weight, XcmV3TraitsError]>
    readonly isError: boolean
    readonly asError: XcmV3TraitsError
    readonly type: 'Complete' | 'Incomplete' | 'Error'
  }

  /** @name XcmV3MultiLocation (70) */
  interface XcmV3MultiLocation extends Struct {
    readonly parents: u8
    readonly interior: XcmV3Junctions
  }

  /** @name XcmV3Junctions (71) */
  interface XcmV3Junctions extends Enum {
    readonly isHere: boolean
    readonly isX1: boolean
    readonly asX1: XcmV3Junction
    readonly isX2: boolean
    readonly asX2: ITuple<[XcmV3Junction, XcmV3Junction]>
    readonly isX3: boolean
    readonly asX3: ITuple<[XcmV3Junction, XcmV3Junction, XcmV3Junction]>
    readonly isX4: boolean
    readonly asX4: ITuple<[XcmV3Junction, XcmV3Junction, XcmV3Junction, XcmV3Junction]>
    readonly isX5: boolean
    readonly asX5: ITuple<[XcmV3Junction, XcmV3Junction, XcmV3Junction, XcmV3Junction, XcmV3Junction]>
    readonly isX6: boolean
    readonly asX6: ITuple<[XcmV3Junction, XcmV3Junction, XcmV3Junction, XcmV3Junction, XcmV3Junction, XcmV3Junction]>
    readonly isX7: boolean
    readonly asX7: ITuple<
      [XcmV3Junction, XcmV3Junction, XcmV3Junction, XcmV3Junction, XcmV3Junction, XcmV3Junction, XcmV3Junction]
    >
    readonly isX8: boolean
    readonly asX8: ITuple<
      [
        XcmV3Junction,
        XcmV3Junction,
        XcmV3Junction,
        XcmV3Junction,
        XcmV3Junction,
        XcmV3Junction,
        XcmV3Junction,
        XcmV3Junction
      ]
    >
    readonly type: 'Here' | 'X1' | 'X2' | 'X3' | 'X4' | 'X5' | 'X6' | 'X7' | 'X8'
  }

  /** @name XcmV3Junction (72) */
  interface XcmV3Junction extends Enum {
    readonly isParachain: boolean
    readonly asParachain: Compact<u32>
    readonly isAccountId32: boolean
    readonly asAccountId32: {
      readonly network: Option<XcmV3JunctionNetworkId>
      readonly id: U8aFixed
    } & Struct
    readonly isAccountIndex64: boolean
    readonly asAccountIndex64: {
      readonly network: Option<XcmV3JunctionNetworkId>
      readonly index: Compact<u64>
    } & Struct
    readonly isAccountKey20: boolean
    readonly asAccountKey20: {
      readonly network: Option<XcmV3JunctionNetworkId>
      readonly key: U8aFixed
    } & Struct
    readonly isPalletInstance: boolean
    readonly asPalletInstance: u8
    readonly isGeneralIndex: boolean
    readonly asGeneralIndex: Compact<u128>
    readonly isGeneralKey: boolean
    readonly asGeneralKey: {
      readonly length: u8
      readonly data: U8aFixed
    } & Struct
    readonly isOnlyChild: boolean
    readonly isPlurality: boolean
    readonly asPlurality: {
      readonly id: XcmV3JunctionBodyId
      readonly part: XcmV3JunctionBodyPart
    } & Struct
    readonly isGlobalConsensus: boolean
    readonly asGlobalConsensus: XcmV3JunctionNetworkId
    readonly type:
      | 'Parachain'
      | 'AccountId32'
      | 'AccountIndex64'
      | 'AccountKey20'
      | 'PalletInstance'
      | 'GeneralIndex'
      | 'GeneralKey'
      | 'OnlyChild'
      | 'Plurality'
      | 'GlobalConsensus'
  }

  /** @name XcmV3JunctionNetworkId (74) */
  interface XcmV3JunctionNetworkId extends Enum {
    readonly isByGenesis: boolean
    readonly asByGenesis: U8aFixed
    readonly isByFork: boolean
    readonly asByFork: {
      readonly blockNumber: u64
      readonly blockHash: U8aFixed
    } & Struct
    readonly isPolkadot: boolean
    readonly isKusama: boolean
    readonly isWestend: boolean
    readonly isRococo: boolean
    readonly isWococo: boolean
    readonly isEthereum: boolean
    readonly asEthereum: {
      readonly chainId: Compact<u64>
    } & Struct
    readonly isBitcoinCore: boolean
    readonly isBitcoinCash: boolean
    readonly type:
      | 'ByGenesis'
      | 'ByFork'
      | 'Polkadot'
      | 'Kusama'
      | 'Westend'
      | 'Rococo'
      | 'Wococo'
      | 'Ethereum'
      | 'BitcoinCore'
      | 'BitcoinCash'
  }

  /** @name XcmV3JunctionBodyId (75) */
  interface XcmV3JunctionBodyId extends Enum {
    readonly isUnit: boolean
    readonly isMoniker: boolean
    readonly asMoniker: U8aFixed
    readonly isIndex: boolean
    readonly asIndex: Compact<u32>
    readonly isExecutive: boolean
    readonly isTechnical: boolean
    readonly isLegislative: boolean
    readonly isJudicial: boolean
    readonly isDefense: boolean
    readonly isAdministration: boolean
    readonly isTreasury: boolean
    readonly type:
      | 'Unit'
      | 'Moniker'
      | 'Index'
      | 'Executive'
      | 'Technical'
      | 'Legislative'
      | 'Judicial'
      | 'Defense'
      | 'Administration'
      | 'Treasury'
  }

  /** @name XcmV3JunctionBodyPart (76) */
  interface XcmV3JunctionBodyPart extends Enum {
    readonly isVoice: boolean
    readonly isMembers: boolean
    readonly asMembers: {
      readonly count: Compact<u32>
    } & Struct
    readonly isFraction: boolean
    readonly asFraction: {
      readonly nom: Compact<u32>
      readonly denom: Compact<u32>
    } & Struct
    readonly isAtLeastProportion: boolean
    readonly asAtLeastProportion: {
      readonly nom: Compact<u32>
      readonly denom: Compact<u32>
    } & Struct
    readonly isMoreThanProportion: boolean
    readonly asMoreThanProportion: {
      readonly nom: Compact<u32>
      readonly denom: Compact<u32>
    } & Struct
    readonly type: 'Voice' | 'Members' | 'Fraction' | 'AtLeastProportion' | 'MoreThanProportion'
  }

  /** @name XcmV3Xcm (77) */
  interface XcmV3Xcm extends Vec<XcmV3Instruction> {}

  /** @name XcmV3Instruction (79) */
  interface XcmV3Instruction extends Enum {
    readonly isWithdrawAsset: boolean
    readonly asWithdrawAsset: XcmV3MultiassetMultiAssets
    readonly isReserveAssetDeposited: boolean
    readonly asReserveAssetDeposited: XcmV3MultiassetMultiAssets
    readonly isReceiveTeleportedAsset: boolean
    readonly asReceiveTeleportedAsset: XcmV3MultiassetMultiAssets
    readonly isQueryResponse: boolean
    readonly asQueryResponse: {
      readonly queryId: Compact<u64>
      readonly response: XcmV3Response
      readonly maxWeight: SpWeightsWeightV2Weight
      readonly querier: Option<XcmV3MultiLocation>
    } & Struct
    readonly isTransferAsset: boolean
    readonly asTransferAsset: {
      readonly assets: XcmV3MultiassetMultiAssets
      readonly beneficiary: XcmV3MultiLocation
    } & Struct
    readonly isTransferReserveAsset: boolean
    readonly asTransferReserveAsset: {
      readonly assets: XcmV3MultiassetMultiAssets
      readonly dest: XcmV3MultiLocation
      readonly xcm: XcmV3Xcm
    } & Struct
    readonly isTransact: boolean
    readonly asTransact: {
      readonly originKind: XcmV2OriginKind
      readonly requireWeightAtMost: SpWeightsWeightV2Weight
      readonly call: XcmDoubleEncoded
    } & Struct
    readonly isHrmpNewChannelOpenRequest: boolean
    readonly asHrmpNewChannelOpenRequest: {
      readonly sender: Compact<u32>
      readonly maxMessageSize: Compact<u32>
      readonly maxCapacity: Compact<u32>
    } & Struct
    readonly isHrmpChannelAccepted: boolean
    readonly asHrmpChannelAccepted: {
      readonly recipient: Compact<u32>
    } & Struct
    readonly isHrmpChannelClosing: boolean
    readonly asHrmpChannelClosing: {
      readonly initiator: Compact<u32>
      readonly sender: Compact<u32>
      readonly recipient: Compact<u32>
    } & Struct
    readonly isClearOrigin: boolean
    readonly isDescendOrigin: boolean
    readonly asDescendOrigin: XcmV3Junctions
    readonly isReportError: boolean
    readonly asReportError: XcmV3QueryResponseInfo
    readonly isDepositAsset: boolean
    readonly asDepositAsset: {
      readonly assets: XcmV3MultiassetMultiAssetFilter
      readonly beneficiary: XcmV3MultiLocation
    } & Struct
    readonly isDepositReserveAsset: boolean
    readonly asDepositReserveAsset: {
      readonly assets: XcmV3MultiassetMultiAssetFilter
      readonly dest: XcmV3MultiLocation
      readonly xcm: XcmV3Xcm
    } & Struct
    readonly isExchangeAsset: boolean
    readonly asExchangeAsset: {
      readonly give: XcmV3MultiassetMultiAssetFilter
      readonly want: XcmV3MultiassetMultiAssets
      readonly maximal: bool
    } & Struct
    readonly isInitiateReserveWithdraw: boolean
    readonly asInitiateReserveWithdraw: {
      readonly assets: XcmV3MultiassetMultiAssetFilter
      readonly reserve: XcmV3MultiLocation
      readonly xcm: XcmV3Xcm
    } & Struct
    readonly isInitiateTeleport: boolean
    readonly asInitiateTeleport: {
      readonly assets: XcmV3MultiassetMultiAssetFilter
      readonly dest: XcmV3MultiLocation
      readonly xcm: XcmV3Xcm
    } & Struct
    readonly isReportHolding: boolean
    readonly asReportHolding: {
      readonly responseInfo: XcmV3QueryResponseInfo
      readonly assets: XcmV3MultiassetMultiAssetFilter
    } & Struct
    readonly isBuyExecution: boolean
    readonly asBuyExecution: {
      readonly fees: XcmV3MultiAsset
      readonly weightLimit: XcmV3WeightLimit
    } & Struct
    readonly isRefundSurplus: boolean
    readonly isSetErrorHandler: boolean
    readonly asSetErrorHandler: XcmV3Xcm
    readonly isSetAppendix: boolean
    readonly asSetAppendix: XcmV3Xcm
    readonly isClearError: boolean
    readonly isClaimAsset: boolean
    readonly asClaimAsset: {
      readonly assets: XcmV3MultiassetMultiAssets
      readonly ticket: XcmV3MultiLocation
    } & Struct
    readonly isTrap: boolean
    readonly asTrap: Compact<u64>
    readonly isSubscribeVersion: boolean
    readonly asSubscribeVersion: {
      readonly queryId: Compact<u64>
      readonly maxResponseWeight: SpWeightsWeightV2Weight
    } & Struct
    readonly isUnsubscribeVersion: boolean
    readonly isBurnAsset: boolean
    readonly asBurnAsset: XcmV3MultiassetMultiAssets
    readonly isExpectAsset: boolean
    readonly asExpectAsset: XcmV3MultiassetMultiAssets
    readonly isExpectOrigin: boolean
    readonly asExpectOrigin: Option<XcmV3MultiLocation>
    readonly isExpectError: boolean
    readonly asExpectError: Option<ITuple<[u32, XcmV3TraitsError]>>
    readonly isExpectTransactStatus: boolean
    readonly asExpectTransactStatus: XcmV3MaybeErrorCode
    readonly isQueryPallet: boolean
    readonly asQueryPallet: {
      readonly moduleName: Bytes
      readonly responseInfo: XcmV3QueryResponseInfo
    } & Struct
    readonly isExpectPallet: boolean
    readonly asExpectPallet: {
      readonly index: Compact<u32>
      readonly name: Bytes
      readonly moduleName: Bytes
      readonly crateMajor: Compact<u32>
      readonly minCrateMinor: Compact<u32>
    } & Struct
    readonly isReportTransactStatus: boolean
    readonly asReportTransactStatus: XcmV3QueryResponseInfo
    readonly isClearTransactStatus: boolean
    readonly isUniversalOrigin: boolean
    readonly asUniversalOrigin: XcmV3Junction
    readonly isExportMessage: boolean
    readonly asExportMessage: {
      readonly network: XcmV3JunctionNetworkId
      readonly destination: XcmV3Junctions
      readonly xcm: XcmV3Xcm
    } & Struct
    readonly isLockAsset: boolean
    readonly asLockAsset: {
      readonly asset: XcmV3MultiAsset
      readonly unlocker: XcmV3MultiLocation
    } & Struct
    readonly isUnlockAsset: boolean
    readonly asUnlockAsset: {
      readonly asset: XcmV3MultiAsset
      readonly target: XcmV3MultiLocation
    } & Struct
    readonly isNoteUnlockable: boolean
    readonly asNoteUnlockable: {
      readonly asset: XcmV3MultiAsset
      readonly owner: XcmV3MultiLocation
    } & Struct
    readonly isRequestUnlock: boolean
    readonly asRequestUnlock: {
      readonly asset: XcmV3MultiAsset
      readonly locker: XcmV3MultiLocation
    } & Struct
    readonly isSetFeesMode: boolean
    readonly asSetFeesMode: {
      readonly jitWithdraw: bool
    } & Struct
    readonly isSetTopic: boolean
    readonly asSetTopic: U8aFixed
    readonly isClearTopic: boolean
    readonly isAliasOrigin: boolean
    readonly asAliasOrigin: XcmV3MultiLocation
    readonly isUnpaidExecution: boolean
    readonly asUnpaidExecution: {
      readonly weightLimit: XcmV3WeightLimit
      readonly checkOrigin: Option<XcmV3MultiLocation>
    } & Struct
    readonly type:
      | 'WithdrawAsset'
      | 'ReserveAssetDeposited'
      | 'ReceiveTeleportedAsset'
      | 'QueryResponse'
      | 'TransferAsset'
      | 'TransferReserveAsset'
      | 'Transact'
      | 'HrmpNewChannelOpenRequest'
      | 'HrmpChannelAccepted'
      | 'HrmpChannelClosing'
      | 'ClearOrigin'
      | 'DescendOrigin'
      | 'ReportError'
      | 'DepositAsset'
      | 'DepositReserveAsset'
      | 'ExchangeAsset'
      | 'InitiateReserveWithdraw'
      | 'InitiateTeleport'
      | 'ReportHolding'
      | 'BuyExecution'
      | 'RefundSurplus'
      | 'SetErrorHandler'
      | 'SetAppendix'
      | 'ClearError'
      | 'ClaimAsset'
      | 'Trap'
      | 'SubscribeVersion'
      | 'UnsubscribeVersion'
      | 'BurnAsset'
      | 'ExpectAsset'
      | 'ExpectOrigin'
      | 'ExpectError'
      | 'ExpectTransactStatus'
      | 'QueryPallet'
      | 'ExpectPallet'
      | 'ReportTransactStatus'
      | 'ClearTransactStatus'
      | 'UniversalOrigin'
      | 'ExportMessage'
      | 'LockAsset'
      | 'UnlockAsset'
      | 'NoteUnlockable'
      | 'RequestUnlock'
      | 'SetFeesMode'
      | 'SetTopic'
      | 'ClearTopic'
      | 'AliasOrigin'
      | 'UnpaidExecution'
  }

  /** @name XcmV3MultiassetMultiAssets (80) */
  interface XcmV3MultiassetMultiAssets extends Vec<XcmV3MultiAsset> {}

  /** @name XcmV3MultiAsset (82) */
  interface XcmV3MultiAsset extends Struct {
    readonly id: XcmV3MultiassetAssetId
    readonly fun: XcmV3MultiassetFungibility
  }

  /** @name XcmV3MultiassetAssetId (83) */
  interface XcmV3MultiassetAssetId extends Enum {
    readonly isConcrete: boolean
    readonly asConcrete: XcmV3MultiLocation
    readonly isAbstract: boolean
    readonly asAbstract: U8aFixed
    readonly type: 'Concrete' | 'Abstract'
  }

  /** @name XcmV3MultiassetFungibility (84) */
  interface XcmV3MultiassetFungibility extends Enum {
    readonly isFungible: boolean
    readonly asFungible: Compact<u128>
    readonly isNonFungible: boolean
    readonly asNonFungible: XcmV3MultiassetAssetInstance
    readonly type: 'Fungible' | 'NonFungible'
  }

  /** @name XcmV3MultiassetAssetInstance (85) */
  interface XcmV3MultiassetAssetInstance extends Enum {
    readonly isUndefined: boolean
    readonly isIndex: boolean
    readonly asIndex: Compact<u128>
    readonly isArray4: boolean
    readonly asArray4: U8aFixed
    readonly isArray8: boolean
    readonly asArray8: U8aFixed
    readonly isArray16: boolean
    readonly asArray16: U8aFixed
    readonly isArray32: boolean
    readonly asArray32: U8aFixed
    readonly type: 'Undefined' | 'Index' | 'Array4' | 'Array8' | 'Array16' | 'Array32'
  }

  /** @name XcmV3Response (88) */
  interface XcmV3Response extends Enum {
    readonly isNull: boolean
    readonly isAssets: boolean
    readonly asAssets: XcmV3MultiassetMultiAssets
    readonly isExecutionResult: boolean
    readonly asExecutionResult: Option<ITuple<[u32, XcmV3TraitsError]>>
    readonly isVersion: boolean
    readonly asVersion: u32
    readonly isPalletsInfo: boolean
    readonly asPalletsInfo: Vec<XcmV3PalletInfo>
    readonly isDispatchResult: boolean
    readonly asDispatchResult: XcmV3MaybeErrorCode
    readonly type: 'Null' | 'Assets' | 'ExecutionResult' | 'Version' | 'PalletsInfo' | 'DispatchResult'
  }

  /** @name XcmV3PalletInfo (92) */
  interface XcmV3PalletInfo extends Struct {
    readonly index: Compact<u32>
    readonly name: Bytes
    readonly moduleName: Bytes
    readonly major: Compact<u32>
    readonly minor: Compact<u32>
    readonly patch: Compact<u32>
  }

  /** @name XcmV3MaybeErrorCode (95) */
  interface XcmV3MaybeErrorCode extends Enum {
    readonly isSuccess: boolean
    readonly isError: boolean
    readonly asError: Bytes
    readonly isTruncatedError: boolean
    readonly asTruncatedError: Bytes
    readonly type: 'Success' | 'Error' | 'TruncatedError'
  }

  /** @name XcmV2OriginKind (98) */
  interface XcmV2OriginKind extends Enum {
    readonly isNative: boolean
    readonly isSovereignAccount: boolean
    readonly isSuperuser: boolean
    readonly isXcm: boolean
    readonly type: 'Native' | 'SovereignAccount' | 'Superuser' | 'Xcm'
  }

  /** @name XcmDoubleEncoded (99) */
  interface XcmDoubleEncoded extends Struct {
    readonly encoded: Bytes
  }

  /** @name XcmV3QueryResponseInfo (100) */
  interface XcmV3QueryResponseInfo extends Struct {
    readonly destination: XcmV3MultiLocation
    readonly queryId: Compact<u64>
    readonly maxWeight: SpWeightsWeightV2Weight
  }

  /** @name XcmV3MultiassetMultiAssetFilter (101) */
  interface XcmV3MultiassetMultiAssetFilter extends Enum {
    readonly isDefinite: boolean
    readonly asDefinite: XcmV3MultiassetMultiAssets
    readonly isWild: boolean
    readonly asWild: XcmV3MultiassetWildMultiAsset
    readonly type: 'Definite' | 'Wild'
  }

  /** @name XcmV3MultiassetWildMultiAsset (102) */
  interface XcmV3MultiassetWildMultiAsset extends Enum {
    readonly isAll: boolean
    readonly isAllOf: boolean
    readonly asAllOf: {
      readonly id: XcmV3MultiassetAssetId
      readonly fun: XcmV3MultiassetWildFungibility
    } & Struct
    readonly isAllCounted: boolean
    readonly asAllCounted: Compact<u32>
    readonly isAllOfCounted: boolean
    readonly asAllOfCounted: {
      readonly id: XcmV3MultiassetAssetId
      readonly fun: XcmV3MultiassetWildFungibility
      readonly count: Compact<u32>
    } & Struct
    readonly type: 'All' | 'AllOf' | 'AllCounted' | 'AllOfCounted'
  }

  /** @name XcmV3MultiassetWildFungibility (103) */
  interface XcmV3MultiassetWildFungibility extends Enum {
    readonly isFungible: boolean
    readonly isNonFungible: boolean
    readonly type: 'Fungible' | 'NonFungible'
  }

  /** @name XcmV3WeightLimit (104) */
  interface XcmV3WeightLimit extends Enum {
    readonly isUnlimited: boolean
    readonly isLimited: boolean
    readonly asLimited: SpWeightsWeightV2Weight
    readonly type: 'Unlimited' | 'Limited'
  }

  /** @name XcmVersionedMultiAssets (105) */
  interface XcmVersionedMultiAssets extends Enum {
    readonly isV2: boolean
    readonly asV2: XcmV2MultiassetMultiAssets
    readonly isV3: boolean
    readonly asV3: XcmV3MultiassetMultiAssets
    readonly type: 'V2' | 'V3'
  }

  /** @name XcmV2MultiassetMultiAssets (106) */
  interface XcmV2MultiassetMultiAssets extends Vec<XcmV2MultiAsset> {}

  /** @name XcmV2MultiAsset (108) */
  interface XcmV2MultiAsset extends Struct {
    readonly id: XcmV2MultiassetAssetId
    readonly fun: XcmV2MultiassetFungibility
  }

  /** @name XcmV2MultiassetAssetId (109) */
  interface XcmV2MultiassetAssetId extends Enum {
    readonly isConcrete: boolean
    readonly asConcrete: XcmV2MultiLocation
    readonly isAbstract: boolean
    readonly asAbstract: Bytes
    readonly type: 'Concrete' | 'Abstract'
  }

  /** @name XcmV2MultiLocation (110) */
  interface XcmV2MultiLocation extends Struct {
    readonly parents: u8
    readonly interior: XcmV2MultilocationJunctions
  }

  /** @name XcmV2MultilocationJunctions (111) */
  interface XcmV2MultilocationJunctions extends Enum {
    readonly isHere: boolean
    readonly isX1: boolean
    readonly asX1: XcmV2Junction
    readonly isX2: boolean
    readonly asX2: ITuple<[XcmV2Junction, XcmV2Junction]>
    readonly isX3: boolean
    readonly asX3: ITuple<[XcmV2Junction, XcmV2Junction, XcmV2Junction]>
    readonly isX4: boolean
    readonly asX4: ITuple<[XcmV2Junction, XcmV2Junction, XcmV2Junction, XcmV2Junction]>
    readonly isX5: boolean
    readonly asX5: ITuple<[XcmV2Junction, XcmV2Junction, XcmV2Junction, XcmV2Junction, XcmV2Junction]>
    readonly isX6: boolean
    readonly asX6: ITuple<[XcmV2Junction, XcmV2Junction, XcmV2Junction, XcmV2Junction, XcmV2Junction, XcmV2Junction]>
    readonly isX7: boolean
    readonly asX7: ITuple<
      [XcmV2Junction, XcmV2Junction, XcmV2Junction, XcmV2Junction, XcmV2Junction, XcmV2Junction, XcmV2Junction]
    >
    readonly isX8: boolean
    readonly asX8: ITuple<
      [
        XcmV2Junction,
        XcmV2Junction,
        XcmV2Junction,
        XcmV2Junction,
        XcmV2Junction,
        XcmV2Junction,
        XcmV2Junction,
        XcmV2Junction
      ]
    >
    readonly type: 'Here' | 'X1' | 'X2' | 'X3' | 'X4' | 'X5' | 'X6' | 'X7' | 'X8'
  }

  /** @name XcmV2Junction (112) */
  interface XcmV2Junction extends Enum {
    readonly isParachain: boolean
    readonly asParachain: Compact<u32>
    readonly isAccountId32: boolean
    readonly asAccountId32: {
      readonly network: XcmV2NetworkId
      readonly id: U8aFixed
    } & Struct
    readonly isAccountIndex64: boolean
    readonly asAccountIndex64: {
      readonly network: XcmV2NetworkId
      readonly index: Compact<u64>
    } & Struct
    readonly isAccountKey20: boolean
    readonly asAccountKey20: {
      readonly network: XcmV2NetworkId
      readonly key: U8aFixed
    } & Struct
    readonly isPalletInstance: boolean
    readonly asPalletInstance: u8
    readonly isGeneralIndex: boolean
    readonly asGeneralIndex: Compact<u128>
    readonly isGeneralKey: boolean
    readonly asGeneralKey: Bytes
    readonly isOnlyChild: boolean
    readonly isPlurality: boolean
    readonly asPlurality: {
      readonly id: XcmV2BodyId
      readonly part: XcmV2BodyPart
    } & Struct
    readonly type:
      | 'Parachain'
      | 'AccountId32'
      | 'AccountIndex64'
      | 'AccountKey20'
      | 'PalletInstance'
      | 'GeneralIndex'
      | 'GeneralKey'
      | 'OnlyChild'
      | 'Plurality'
  }

  /** @name XcmV2NetworkId (113) */
  interface XcmV2NetworkId extends Enum {
    readonly isAny: boolean
    readonly isNamed: boolean
    readonly asNamed: Bytes
    readonly isPolkadot: boolean
    readonly isKusama: boolean
    readonly type: 'Any' | 'Named' | 'Polkadot' | 'Kusama'
  }

  /** @name XcmV2BodyId (115) */
  interface XcmV2BodyId extends Enum {
    readonly isUnit: boolean
    readonly isNamed: boolean
    readonly asNamed: Bytes
    readonly isIndex: boolean
    readonly asIndex: Compact<u32>
    readonly isExecutive: boolean
    readonly isTechnical: boolean
    readonly isLegislative: boolean
    readonly isJudicial: boolean
    readonly isDefense: boolean
    readonly isAdministration: boolean
    readonly isTreasury: boolean
    readonly type:
      | 'Unit'
      | 'Named'
      | 'Index'
      | 'Executive'
      | 'Technical'
      | 'Legislative'
      | 'Judicial'
      | 'Defense'
      | 'Administration'
      | 'Treasury'
  }

  /** @name XcmV2BodyPart (116) */
  interface XcmV2BodyPart extends Enum {
    readonly isVoice: boolean
    readonly isMembers: boolean
    readonly asMembers: {
      readonly count: Compact<u32>
    } & Struct
    readonly isFraction: boolean
    readonly asFraction: {
      readonly nom: Compact<u32>
      readonly denom: Compact<u32>
    } & Struct
    readonly isAtLeastProportion: boolean
    readonly asAtLeastProportion: {
      readonly nom: Compact<u32>
      readonly denom: Compact<u32>
    } & Struct
    readonly isMoreThanProportion: boolean
    readonly asMoreThanProportion: {
      readonly nom: Compact<u32>
      readonly denom: Compact<u32>
    } & Struct
    readonly type: 'Voice' | 'Members' | 'Fraction' | 'AtLeastProportion' | 'MoreThanProportion'
  }

  /** @name XcmV2MultiassetFungibility (117) */
  interface XcmV2MultiassetFungibility extends Enum {
    readonly isFungible: boolean
    readonly asFungible: Compact<u128>
    readonly isNonFungible: boolean
    readonly asNonFungible: XcmV2MultiassetAssetInstance
    readonly type: 'Fungible' | 'NonFungible'
  }

  /** @name XcmV2MultiassetAssetInstance (118) */
  interface XcmV2MultiassetAssetInstance extends Enum {
    readonly isUndefined: boolean
    readonly isIndex: boolean
    readonly asIndex: Compact<u128>
    readonly isArray4: boolean
    readonly asArray4: U8aFixed
    readonly isArray8: boolean
    readonly asArray8: U8aFixed
    readonly isArray16: boolean
    readonly asArray16: U8aFixed
    readonly isArray32: boolean
    readonly asArray32: U8aFixed
    readonly isBlob: boolean
    readonly asBlob: Bytes
    readonly type: 'Undefined' | 'Index' | 'Array4' | 'Array8' | 'Array16' | 'Array32' | 'Blob'
  }

  /** @name XcmVersionedMultiLocation (119) */
  interface XcmVersionedMultiLocation extends Enum {
    readonly isV2: boolean
    readonly asV2: XcmV2MultiLocation
    readonly isV3: boolean
    readonly asV3: XcmV3MultiLocation
    readonly type: 'V2' | 'V3'
  }

  /** @name CumulusPalletXcmEvent (120) */
  interface CumulusPalletXcmEvent extends Enum {
    readonly isInvalidFormat: boolean
    readonly asInvalidFormat: U8aFixed
    readonly isUnsupportedVersion: boolean
    readonly asUnsupportedVersion: U8aFixed
    readonly isExecutedDownward: boolean
    readonly asExecutedDownward: ITuple<[U8aFixed, XcmV3TraitsOutcome]>
    readonly type: 'InvalidFormat' | 'UnsupportedVersion' | 'ExecutedDownward'
  }

  /** @name CumulusPalletDmpQueueEvent (121) */
  interface CumulusPalletDmpQueueEvent extends Enum {
    readonly isInvalidFormat: boolean
    readonly asInvalidFormat: {
      readonly messageId: U8aFixed
    } & Struct
    readonly isUnsupportedVersion: boolean
    readonly asUnsupportedVersion: {
      readonly messageId: U8aFixed
    } & Struct
    readonly isExecutedDownward: boolean
    readonly asExecutedDownward: {
      readonly messageId: U8aFixed
      readonly outcome: XcmV3TraitsOutcome
    } & Struct
    readonly isWeightExhausted: boolean
    readonly asWeightExhausted: {
      readonly messageId: U8aFixed
      readonly remainingWeight: SpWeightsWeightV2Weight
      readonly requiredWeight: SpWeightsWeightV2Weight
    } & Struct
    readonly isOverweightEnqueued: boolean
    readonly asOverweightEnqueued: {
      readonly messageId: U8aFixed
      readonly overweightIndex: u64
      readonly requiredWeight: SpWeightsWeightV2Weight
    } & Struct
    readonly isOverweightServiced: boolean
    readonly asOverweightServiced: {
      readonly overweightIndex: u64
      readonly weightUsed: SpWeightsWeightV2Weight
    } & Struct
    readonly isMaxMessagesExhausted: boolean
    readonly asMaxMessagesExhausted: {
      readonly messageId: U8aFixed
    } & Struct
    readonly type:
      | 'InvalidFormat'
      | 'UnsupportedVersion'
      | 'ExecutedDownward'
      | 'WeightExhausted'
      | 'OverweightEnqueued'
      | 'OverweightServiced'
      | 'MaxMessagesExhausted'
  }

  /** @name PalletXcAssetConfigEvent (122) */
  interface PalletXcAssetConfigEvent extends Enum {
    readonly isAssetRegistered: boolean
    readonly asAssetRegistered: {
      readonly assetLocation: XcmVersionedMultiLocation
      readonly assetId: u128
    } & Struct
    readonly isUnitsPerSecondChanged: boolean
    readonly asUnitsPerSecondChanged: {
      readonly assetLocation: XcmVersionedMultiLocation
      readonly unitsPerSecond: u128
    } & Struct
    readonly isAssetLocationChanged: boolean
    readonly asAssetLocationChanged: {
      readonly previousAssetLocation: XcmVersionedMultiLocation
      readonly assetId: u128
      readonly newAssetLocation: XcmVersionedMultiLocation
    } & Struct
    readonly isSupportedAssetRemoved: boolean
    readonly asSupportedAssetRemoved: {
      readonly assetLocation: XcmVersionedMultiLocation
    } & Struct
    readonly isAssetRemoved: boolean
    readonly asAssetRemoved: {
      readonly assetLocation: XcmVersionedMultiLocation
      readonly assetId: u128
    } & Struct
    readonly type:
      | 'AssetRegistered'
      | 'UnitsPerSecondChanged'
      | 'AssetLocationChanged'
      | 'SupportedAssetRemoved'
      | 'AssetRemoved'
  }

  /** @name OrmlXtokensModuleEvent (123) */
  interface OrmlXtokensModuleEvent extends Enum {
    readonly isTransferredMultiAssets: boolean
    readonly asTransferredMultiAssets: {
      readonly sender: AccountId32
      readonly assets: XcmV3MultiassetMultiAssets
      readonly fee: XcmV3MultiAsset
      readonly dest: XcmV3MultiLocation
    } & Struct
    readonly type: 'TransferredMultiAssets'
  }

  /** @name PalletEvmEvent (124) */
  interface PalletEvmEvent extends Enum {
    readonly isLog: boolean
    readonly asLog: {
      readonly log: EthereumLog
    } & Struct
    readonly isCreated: boolean
    readonly asCreated: {
      readonly address: H160
    } & Struct
    readonly isCreatedFailed: boolean
    readonly asCreatedFailed: {
      readonly address: H160
    } & Struct
    readonly isExecuted: boolean
    readonly asExecuted: {
      readonly address: H160
    } & Struct
    readonly isExecutedFailed: boolean
    readonly asExecutedFailed: {
      readonly address: H160
    } & Struct
    readonly type: 'Log' | 'Created' | 'CreatedFailed' | 'Executed' | 'ExecutedFailed'
  }

  /** @name EthereumLog (125) */
  interface EthereumLog extends Struct {
    readonly address: H160
    readonly topics: Vec<H256>
    readonly data: Bytes
  }

  /** @name PalletEthereumEvent (127) */
  interface PalletEthereumEvent extends Enum {
    readonly isExecuted: boolean
    readonly asExecuted: {
      readonly from: H160
      readonly to: H160
      readonly transactionHash: H256
      readonly exitReason: EvmCoreErrorExitReason
      readonly extraData: Bytes
    } & Struct
    readonly type: 'Executed'
  }

  /** @name EvmCoreErrorExitReason (128) */
  interface EvmCoreErrorExitReason extends Enum {
    readonly isSucceed: boolean
    readonly asSucceed: EvmCoreErrorExitSucceed
    readonly isError: boolean
    readonly asError: EvmCoreErrorExitError
    readonly isRevert: boolean
    readonly asRevert: EvmCoreErrorExitRevert
    readonly isFatal: boolean
    readonly asFatal: EvmCoreErrorExitFatal
    readonly type: 'Succeed' | 'Error' | 'Revert' | 'Fatal'
  }

  /** @name EvmCoreErrorExitSucceed (129) */
  interface EvmCoreErrorExitSucceed extends Enum {
    readonly isStopped: boolean
    readonly isReturned: boolean
    readonly isSuicided: boolean
    readonly type: 'Stopped' | 'Returned' | 'Suicided'
  }

  /** @name EvmCoreErrorExitError (130) */
  interface EvmCoreErrorExitError extends Enum {
    readonly isStackUnderflow: boolean
    readonly isStackOverflow: boolean
    readonly isInvalidJump: boolean
    readonly isInvalidRange: boolean
    readonly isDesignatedInvalid: boolean
    readonly isCallTooDeep: boolean
    readonly isCreateCollision: boolean
    readonly isCreateContractLimit: boolean
    readonly isOutOfOffset: boolean
    readonly isOutOfGas: boolean
    readonly isOutOfFund: boolean
    readonly isPcUnderflow: boolean
    readonly isCreateEmpty: boolean
    readonly isOther: boolean
    readonly asOther: Text
    readonly isMaxNonce: boolean
    readonly isInvalidCode: boolean
    readonly asInvalidCode: u8
    readonly type:
      | 'StackUnderflow'
      | 'StackOverflow'
      | 'InvalidJump'
      | 'InvalidRange'
      | 'DesignatedInvalid'
      | 'CallTooDeep'
      | 'CreateCollision'
      | 'CreateContractLimit'
      | 'OutOfOffset'
      | 'OutOfGas'
      | 'OutOfFund'
      | 'PcUnderflow'
      | 'CreateEmpty'
      | 'Other'
      | 'MaxNonce'
      | 'InvalidCode'
  }

  /** @name EvmCoreErrorExitRevert (134) */
  interface EvmCoreErrorExitRevert extends Enum {
    readonly isReverted: boolean
    readonly type: 'Reverted'
  }

  /** @name EvmCoreErrorExitFatal (135) */
  interface EvmCoreErrorExitFatal extends Enum {
    readonly isNotSupported: boolean
    readonly isUnhandledInterrupt: boolean
    readonly isCallErrorAsFatal: boolean
    readonly asCallErrorAsFatal: EvmCoreErrorExitError
    readonly isOther: boolean
    readonly asOther: Text
    readonly type: 'NotSupported' | 'UnhandledInterrupt' | 'CallErrorAsFatal' | 'Other'
  }

  /** @name PalletDynamicEvmBaseFeeEvent (136) */
  interface PalletDynamicEvmBaseFeeEvent extends Enum {
    readonly isNewBaseFeePerGas: boolean
    readonly asNewBaseFeePerGas: {
      readonly fee: U256
    } & Struct
    readonly type: 'NewBaseFeePerGas'
  }

  /** @name PalletUnifiedAccountsEvent (139) */
  interface PalletUnifiedAccountsEvent extends Enum {
    readonly isAccountClaimed: boolean
    readonly asAccountClaimed: {
      readonly accountId: AccountId32
      readonly evmAddress: H160
    } & Struct
    readonly type: 'AccountClaimed'
  }

  /** @name PalletContractsEvent (140) */
  interface PalletContractsEvent extends Enum {
    readonly isInstantiated: boolean
    readonly asInstantiated: {
      readonly deployer: AccountId32
      readonly contract: AccountId32
    } & Struct
    readonly isTerminated: boolean
    readonly asTerminated: {
      readonly contract: AccountId32
      readonly beneficiary: AccountId32
    } & Struct
    readonly isCodeStored: boolean
    readonly asCodeStored: {
      readonly codeHash: H256
    } & Struct
    readonly isContractEmitted: boolean
    readonly asContractEmitted: {
      readonly contract: AccountId32
      readonly data: Bytes
    } & Struct
    readonly isCodeRemoved: boolean
    readonly asCodeRemoved: {
      readonly codeHash: H256
    } & Struct
    readonly isContractCodeUpdated: boolean
    readonly asContractCodeUpdated: {
      readonly contract: AccountId32
      readonly newCodeHash: H256
      readonly oldCodeHash: H256
    } & Struct
    readonly isCalled: boolean
    readonly asCalled: {
      readonly caller: PalletContractsOrigin
      readonly contract: AccountId32
    } & Struct
    readonly isDelegateCalled: boolean
    readonly asDelegateCalled: {
      readonly contract: AccountId32
      readonly codeHash: H256
    } & Struct
    readonly type:
      | 'Instantiated'
      | 'Terminated'
      | 'CodeStored'
      | 'ContractEmitted'
      | 'CodeRemoved'
      | 'ContractCodeUpdated'
      | 'Called'
      | 'DelegateCalled'
  }

  /** @name PalletContractsOrigin (141) */
  interface PalletContractsOrigin extends Enum {
    readonly isRoot: boolean
    readonly isSigned: boolean
    readonly asSigned: AccountId32
    readonly type: 'Root' | 'Signed'
  }

  /** @name ShibuyaRuntimeRuntime (142) */
  type ShibuyaRuntimeRuntime = Null

  /** @name PalletDemocracyEvent (143) */
  interface PalletDemocracyEvent extends Enum {
    readonly isProposed: boolean
    readonly asProposed: {
      readonly proposalIndex: u32
      readonly deposit: u128
    } & Struct
    readonly isTabled: boolean
    readonly asTabled: {
      readonly proposalIndex: u32
      readonly deposit: u128
    } & Struct
    readonly isExternalTabled: boolean
    readonly isStarted: boolean
    readonly asStarted: {
      readonly refIndex: u32
      readonly threshold: PalletDemocracyVoteThreshold
    } & Struct
    readonly isPassed: boolean
    readonly asPassed: {
      readonly refIndex: u32
    } & Struct
    readonly isNotPassed: boolean
    readonly asNotPassed: {
      readonly refIndex: u32
    } & Struct
    readonly isCancelled: boolean
    readonly asCancelled: {
      readonly refIndex: u32
    } & Struct
    readonly isDelegated: boolean
    readonly asDelegated: {
      readonly who: AccountId32
      readonly target: AccountId32
    } & Struct
    readonly isUndelegated: boolean
    readonly asUndelegated: {
      readonly account: AccountId32
    } & Struct
    readonly isVetoed: boolean
    readonly asVetoed: {
      readonly who: AccountId32
      readonly proposalHash: H256
      readonly until: u32
    } & Struct
    readonly isBlacklisted: boolean
    readonly asBlacklisted: {
      readonly proposalHash: H256
    } & Struct
    readonly isVoted: boolean
    readonly asVoted: {
      readonly voter: AccountId32
      readonly refIndex: u32
      readonly vote: PalletDemocracyVoteAccountVote
    } & Struct
    readonly isSeconded: boolean
    readonly asSeconded: {
      readonly seconder: AccountId32
      readonly propIndex: u32
    } & Struct
    readonly isProposalCanceled: boolean
    readonly asProposalCanceled: {
      readonly propIndex: u32
    } & Struct
    readonly isMetadataSet: boolean
    readonly asMetadataSet: {
      readonly owner: PalletDemocracyMetadataOwner
      readonly hash_: H256
    } & Struct
    readonly isMetadataCleared: boolean
    readonly asMetadataCleared: {
      readonly owner: PalletDemocracyMetadataOwner
      readonly hash_: H256
    } & Struct
    readonly isMetadataTransferred: boolean
    readonly asMetadataTransferred: {
      readonly prevOwner: PalletDemocracyMetadataOwner
      readonly owner: PalletDemocracyMetadataOwner
      readonly hash_: H256
    } & Struct
    readonly type:
      | 'Proposed'
      | 'Tabled'
      | 'ExternalTabled'
      | 'Started'
      | 'Passed'
      | 'NotPassed'
      | 'Cancelled'
      | 'Delegated'
      | 'Undelegated'
      | 'Vetoed'
      | 'Blacklisted'
      | 'Voted'
      | 'Seconded'
      | 'ProposalCanceled'
      | 'MetadataSet'
      | 'MetadataCleared'
      | 'MetadataTransferred'
  }

  /** @name PalletDemocracyVoteThreshold (144) */
  interface PalletDemocracyVoteThreshold extends Enum {
    readonly isSuperMajorityApprove: boolean
    readonly isSuperMajorityAgainst: boolean
    readonly isSimpleMajority: boolean
    readonly type: 'SuperMajorityApprove' | 'SuperMajorityAgainst' | 'SimpleMajority'
  }

  /** @name PalletDemocracyVoteAccountVote (145) */
  interface PalletDemocracyVoteAccountVote extends Enum {
    readonly isStandard: boolean
    readonly asStandard: {
      readonly vote: Vote
      readonly balance: u128
    } & Struct
    readonly isSplit: boolean
    readonly asSplit: {
      readonly aye: u128
      readonly nay: u128
    } & Struct
    readonly type: 'Standard' | 'Split'
  }

  /** @name PalletDemocracyMetadataOwner (147) */
  interface PalletDemocracyMetadataOwner extends Enum {
    readonly isExternal: boolean
    readonly isProposal: boolean
    readonly asProposal: u32
    readonly isReferendum: boolean
    readonly asReferendum: u32
    readonly type: 'External' | 'Proposal' | 'Referendum'
  }

  /** @name PalletCollectiveEvent (148) */
  interface PalletCollectiveEvent extends Enum {
    readonly isProposed: boolean
    readonly asProposed: {
      readonly account: AccountId32
      readonly proposalIndex: u32
      readonly proposalHash: H256
      readonly threshold: u32
    } & Struct
    readonly isVoted: boolean
    readonly asVoted: {
      readonly account: AccountId32
      readonly proposalHash: H256
      readonly voted: bool
      readonly yes: u32
      readonly no: u32
    } & Struct
    readonly isApproved: boolean
    readonly asApproved: {
      readonly proposalHash: H256
    } & Struct
    readonly isDisapproved: boolean
    readonly asDisapproved: {
      readonly proposalHash: H256
    } & Struct
    readonly isExecuted: boolean
    readonly asExecuted: {
      readonly proposalHash: H256
      readonly result: Result<Null, SpRuntimeDispatchError>
    } & Struct
    readonly isMemberExecuted: boolean
    readonly asMemberExecuted: {
      readonly proposalHash: H256
      readonly result: Result<Null, SpRuntimeDispatchError>
    } & Struct
    readonly isClosed: boolean
    readonly asClosed: {
      readonly proposalHash: H256
      readonly yes: u32
      readonly no: u32
    } & Struct
    readonly type: 'Proposed' | 'Voted' | 'Approved' | 'Disapproved' | 'Executed' | 'MemberExecuted' | 'Closed'
  }

  /** @name PalletTreasuryEvent (150) */
  interface PalletTreasuryEvent extends Enum {
    readonly isProposed: boolean
    readonly asProposed: {
      readonly proposalIndex: u32
    } & Struct
    readonly isSpending: boolean
    readonly asSpending: {
      readonly budgetRemaining: u128
    } & Struct
    readonly isAwarded: boolean
    readonly asAwarded: {
      readonly proposalIndex: u32
      readonly award: u128
      readonly account: AccountId32
    } & Struct
    readonly isRejected: boolean
    readonly asRejected: {
      readonly proposalIndex: u32
      readonly slashed: u128
    } & Struct
    readonly isBurnt: boolean
    readonly asBurnt: {
      readonly burntFunds: u128
    } & Struct
    readonly isRollover: boolean
    readonly asRollover: {
      readonly rolloverBalance: u128
    } & Struct
    readonly isDeposit: boolean
    readonly asDeposit: {
      readonly value: u128
    } & Struct
    readonly isSpendApproved: boolean
    readonly asSpendApproved: {
      readonly proposalIndex: u32
      readonly amount: u128
      readonly beneficiary: AccountId32
    } & Struct
    readonly isUpdatedInactive: boolean
    readonly asUpdatedInactive: {
      readonly reactivated: u128
      readonly deactivated: u128
    } & Struct
    readonly type:
      | 'Proposed'
      | 'Spending'
      | 'Awarded'
      | 'Rejected'
      | 'Burnt'
      | 'Rollover'
      | 'Deposit'
      | 'SpendApproved'
      | 'UpdatedInactive'
  }

  /** @name PalletPreimageEvent (151) */
  interface PalletPreimageEvent extends Enum {
    readonly isNoted: boolean
    readonly asNoted: {
      readonly hash_: H256
    } & Struct
    readonly isRequested: boolean
    readonly asRequested: {
      readonly hash_: H256
    } & Struct
    readonly isCleared: boolean
    readonly asCleared: {
      readonly hash_: H256
    } & Struct
    readonly type: 'Noted' | 'Requested' | 'Cleared'
  }

  /** @name PalletSudoEvent (152) */
  interface PalletSudoEvent extends Enum {
    readonly isSudid: boolean
    readonly asSudid: {
      readonly sudoResult: Result<Null, SpRuntimeDispatchError>
    } & Struct
    readonly isKeyChanged: boolean
    readonly asKeyChanged: {
      readonly oldSudoer: Option<AccountId32>
    } & Struct
    readonly isSudoAsDone: boolean
    readonly asSudoAsDone: {
      readonly sudoResult: Result<Null, SpRuntimeDispatchError>
    } & Struct
    readonly type: 'Sudid' | 'KeyChanged' | 'SudoAsDone'
  }

  /** @name PalletStaticPriceProviderEvent (153) */
  interface PalletStaticPriceProviderEvent extends Enum {
    readonly isPriceSet: boolean
    readonly asPriceSet: {
      readonly price: u64
    } & Struct
    readonly type: 'PriceSet'
  }

  /** @name FrameSystemPhase (155) */
  interface FrameSystemPhase extends Enum {
    readonly isApplyExtrinsic: boolean
    readonly asApplyExtrinsic: u32
    readonly isFinalization: boolean
    readonly isInitialization: boolean
    readonly type: 'ApplyExtrinsic' | 'Finalization' | 'Initialization'
  }

  /** @name FrameSystemLastRuntimeUpgradeInfo (157) */
  interface FrameSystemLastRuntimeUpgradeInfo extends Struct {
    readonly specVersion: Compact<u32>
    readonly specName: Text
  }

  /** @name FrameSystemCall (158) */
  interface FrameSystemCall extends Enum {
    readonly isRemark: boolean
    readonly asRemark: {
      readonly remark: Bytes
    } & Struct
    readonly isSetHeapPages: boolean
    readonly asSetHeapPages: {
      readonly pages: u64
    } & Struct
    readonly isSetCode: boolean
    readonly asSetCode: {
      readonly code: Bytes
    } & Struct
    readonly isSetCodeWithoutChecks: boolean
    readonly asSetCodeWithoutChecks: {
      readonly code: Bytes
    } & Struct
    readonly isSetStorage: boolean
    readonly asSetStorage: {
      readonly items: Vec<ITuple<[Bytes, Bytes]>>
    } & Struct
    readonly isKillStorage: boolean
    readonly asKillStorage: {
      readonly keys_: Vec<Bytes>
    } & Struct
    readonly isKillPrefix: boolean
    readonly asKillPrefix: {
      readonly prefix: Bytes
      readonly subkeys: u32
    } & Struct
    readonly isRemarkWithEvent: boolean
    readonly asRemarkWithEvent: {
      readonly remark: Bytes
    } & Struct
    readonly type:
      | 'Remark'
      | 'SetHeapPages'
      | 'SetCode'
      | 'SetCodeWithoutChecks'
      | 'SetStorage'
      | 'KillStorage'
      | 'KillPrefix'
      | 'RemarkWithEvent'
  }

  /** @name FrameSystemLimitsBlockWeights (162) */
  interface FrameSystemLimitsBlockWeights extends Struct {
    readonly baseBlock: SpWeightsWeightV2Weight
    readonly maxBlock: SpWeightsWeightV2Weight
    readonly perClass: FrameSupportDispatchPerDispatchClassWeightsPerClass
  }

  /** @name FrameSupportDispatchPerDispatchClassWeightsPerClass (163) */
  interface FrameSupportDispatchPerDispatchClassWeightsPerClass extends Struct {
    readonly normal: FrameSystemLimitsWeightsPerClass
    readonly operational: FrameSystemLimitsWeightsPerClass
    readonly mandatory: FrameSystemLimitsWeightsPerClass
  }

  /** @name FrameSystemLimitsWeightsPerClass (164) */
  interface FrameSystemLimitsWeightsPerClass extends Struct {
    readonly baseExtrinsic: SpWeightsWeightV2Weight
    readonly maxExtrinsic: Option<SpWeightsWeightV2Weight>
    readonly maxTotal: Option<SpWeightsWeightV2Weight>
    readonly reserved: Option<SpWeightsWeightV2Weight>
  }

  /** @name FrameSystemLimitsBlockLength (166) */
  interface FrameSystemLimitsBlockLength extends Struct {
    readonly max: FrameSupportDispatchPerDispatchClassU32
  }

  /** @name FrameSupportDispatchPerDispatchClassU32 (167) */
  interface FrameSupportDispatchPerDispatchClassU32 extends Struct {
    readonly normal: u32
    readonly operational: u32
    readonly mandatory: u32
  }

  /** @name SpWeightsRuntimeDbWeight (168) */
  interface SpWeightsRuntimeDbWeight extends Struct {
    readonly read: u64
    readonly write: u64
  }

  /** @name SpVersionRuntimeVersion (169) */
  interface SpVersionRuntimeVersion extends Struct {
    readonly specName: Text
    readonly implName: Text
    readonly authoringVersion: u32
    readonly specVersion: u32
    readonly implVersion: u32
    readonly apis: Vec<ITuple<[U8aFixed, u32]>>
    readonly transactionVersion: u32
    readonly stateVersion: u8
  }

  /** @name FrameSystemError (173) */
  interface FrameSystemError extends Enum {
    readonly isInvalidSpecName: boolean
    readonly isSpecVersionNeedsToIncrease: boolean
    readonly isFailedToExtractRuntimeVersion: boolean
    readonly isNonDefaultComposite: boolean
    readonly isNonZeroRefCount: boolean
    readonly isCallFiltered: boolean
    readonly type:
      | 'InvalidSpecName'
      | 'SpecVersionNeedsToIncrease'
      | 'FailedToExtractRuntimeVersion'
      | 'NonDefaultComposite'
      | 'NonZeroRefCount'
      | 'CallFiltered'
  }

  /** @name PalletUtilityCall (174) */
  interface PalletUtilityCall extends Enum {
    readonly isBatch: boolean
    readonly asBatch: {
      readonly calls: Vec<Call>
    } & Struct
    readonly isAsDerivative: boolean
    readonly asAsDerivative: {
      readonly index: u16
      readonly call: Call
    } & Struct
    readonly isBatchAll: boolean
    readonly asBatchAll: {
      readonly calls: Vec<Call>
    } & Struct
    readonly isDispatchAs: boolean
    readonly asDispatchAs: {
      readonly asOrigin: ShibuyaRuntimeOriginCaller
      readonly call: Call
    } & Struct
    readonly isForceBatch: boolean
    readonly asForceBatch: {
      readonly calls: Vec<Call>
    } & Struct
    readonly isWithWeight: boolean
    readonly asWithWeight: {
      readonly call: Call
      readonly weight: SpWeightsWeightV2Weight
    } & Struct
    readonly type: 'Batch' | 'AsDerivative' | 'BatchAll' | 'DispatchAs' | 'ForceBatch' | 'WithWeight'
  }

  /** @name PalletIdentityCall (177) */
  interface PalletIdentityCall extends Enum {
    readonly isAddRegistrar: boolean
    readonly asAddRegistrar: {
      readonly account: MultiAddress
    } & Struct
    readonly isSetIdentity: boolean
    readonly asSetIdentity: {
      readonly info: PalletIdentityIdentityInfo
    } & Struct
    readonly isSetSubs: boolean
    readonly asSetSubs: {
      readonly subs: Vec<ITuple<[AccountId32, Data]>>
    } & Struct
    readonly isClearIdentity: boolean
    readonly isRequestJudgement: boolean
    readonly asRequestJudgement: {
      readonly regIndex: Compact<u32>
      readonly maxFee: Compact<u128>
    } & Struct
    readonly isCancelRequest: boolean
    readonly asCancelRequest: {
      readonly regIndex: u32
    } & Struct
    readonly isSetFee: boolean
    readonly asSetFee: {
      readonly index: Compact<u32>
      readonly fee: Compact<u128>
    } & Struct
    readonly isSetAccountId: boolean
    readonly asSetAccountId: {
      readonly index: Compact<u32>
      readonly new_: MultiAddress
    } & Struct
    readonly isSetFields: boolean
    readonly asSetFields: {
      readonly index: Compact<u32>
      readonly fields: PalletIdentityBitFlags
    } & Struct
    readonly isProvideJudgement: boolean
    readonly asProvideJudgement: {
      readonly regIndex: Compact<u32>
      readonly target: MultiAddress
      readonly judgement: PalletIdentityJudgement
      readonly identity: H256
    } & Struct
    readonly isKillIdentity: boolean
    readonly asKillIdentity: {
      readonly target: MultiAddress
    } & Struct
    readonly isAddSub: boolean
    readonly asAddSub: {
      readonly sub: MultiAddress
      readonly data: Data
    } & Struct
    readonly isRenameSub: boolean
    readonly asRenameSub: {
      readonly sub: MultiAddress
      readonly data: Data
    } & Struct
    readonly isRemoveSub: boolean
    readonly asRemoveSub: {
      readonly sub: MultiAddress
    } & Struct
    readonly isQuitSub: boolean
    readonly type:
      | 'AddRegistrar'
      | 'SetIdentity'
      | 'SetSubs'
      | 'ClearIdentity'
      | 'RequestJudgement'
      | 'CancelRequest'
      | 'SetFee'
      | 'SetAccountId'
      | 'SetFields'
      | 'ProvideJudgement'
      | 'KillIdentity'
      | 'AddSub'
      | 'RenameSub'
      | 'RemoveSub'
      | 'QuitSub'
  }

  /** @name PalletIdentityIdentityInfo (180) */
  interface PalletIdentityIdentityInfo extends Struct {
    readonly additional: Vec<ITuple<[Data, Data]>>
    readonly display: Data
    readonly legal: Data
    readonly web: Data
    readonly riot: Data
    readonly email: Data
    readonly pgpFingerprint: Option<U8aFixed>
    readonly image: Data
    readonly twitter: Data
  }

  /** @name PalletIdentityBitFlags (216) */
  interface PalletIdentityBitFlags extends Set {
    readonly isDisplay: boolean
    readonly isLegal: boolean
    readonly isWeb: boolean
    readonly isRiot: boolean
    readonly isEmail: boolean
    readonly isPgpFingerprint: boolean
    readonly isImage: boolean
    readonly isTwitter: boolean
  }

  /** @name PalletIdentityIdentityField (217) */
  interface PalletIdentityIdentityField extends Enum {
    readonly isDisplay: boolean
    readonly isLegal: boolean
    readonly isWeb: boolean
    readonly isRiot: boolean
    readonly isEmail: boolean
    readonly isPgpFingerprint: boolean
    readonly isImage: boolean
    readonly isTwitter: boolean
    readonly type: 'Display' | 'Legal' | 'Web' | 'Riot' | 'Email' | 'PgpFingerprint' | 'Image' | 'Twitter'
  }

  /** @name PalletIdentityJudgement (218) */
  interface PalletIdentityJudgement extends Enum {
    readonly isUnknown: boolean
    readonly isFeePaid: boolean
    readonly asFeePaid: u128
    readonly isReasonable: boolean
    readonly isKnownGood: boolean
    readonly isOutOfDate: boolean
    readonly isLowQuality: boolean
    readonly isErroneous: boolean
    readonly type: 'Unknown' | 'FeePaid' | 'Reasonable' | 'KnownGood' | 'OutOfDate' | 'LowQuality' | 'Erroneous'
  }

  /** @name PalletTimestampCall (219) */
  interface PalletTimestampCall extends Enum {
    readonly isSet: boolean
    readonly asSet: {
      readonly now: Compact<u64>
    } & Struct
    readonly type: 'Set'
  }

  /** @name PalletMultisigCall (220) */
  interface PalletMultisigCall extends Enum {
    readonly isAsMultiThreshold1: boolean
    readonly asAsMultiThreshold1: {
      readonly otherSignatories: Vec<AccountId32>
      readonly call: Call
    } & Struct
    readonly isAsMulti: boolean
    readonly asAsMulti: {
      readonly threshold: u16
      readonly otherSignatories: Vec<AccountId32>
      readonly maybeTimepoint: Option<PalletMultisigTimepoint>
      readonly call: Call
      readonly maxWeight: SpWeightsWeightV2Weight
    } & Struct
    readonly isApproveAsMulti: boolean
    readonly asApproveAsMulti: {
      readonly threshold: u16
      readonly otherSignatories: Vec<AccountId32>
      readonly maybeTimepoint: Option<PalletMultisigTimepoint>
      readonly callHash: U8aFixed
      readonly maxWeight: SpWeightsWeightV2Weight
    } & Struct
    readonly isCancelAsMulti: boolean
    readonly asCancelAsMulti: {
      readonly threshold: u16
      readonly otherSignatories: Vec<AccountId32>
      readonly timepoint: PalletMultisigTimepoint
      readonly callHash: U8aFixed
    } & Struct
    readonly type: 'AsMultiThreshold1' | 'AsMulti' | 'ApproveAsMulti' | 'CancelAsMulti'
  }

  /** @name PalletSchedulerCall (222) */
  interface PalletSchedulerCall extends Enum {
    readonly isSchedule: boolean
    readonly asSchedule: {
      readonly when: u32
      readonly maybePeriodic: Option<ITuple<[u32, u32]>>
      readonly priority: u8
      readonly call: Call
    } & Struct
    readonly isCancel: boolean
    readonly asCancel: {
      readonly when: u32
      readonly index: u32
    } & Struct
    readonly isScheduleNamed: boolean
    readonly asScheduleNamed: {
      readonly id: U8aFixed
      readonly when: u32
      readonly maybePeriodic: Option<ITuple<[u32, u32]>>
      readonly priority: u8
      readonly call: Call
    } & Struct
    readonly isCancelNamed: boolean
    readonly asCancelNamed: {
      readonly id: U8aFixed
    } & Struct
    readonly isScheduleAfter: boolean
    readonly asScheduleAfter: {
      readonly after: u32
      readonly maybePeriodic: Option<ITuple<[u32, u32]>>
      readonly priority: u8
      readonly call: Call
    } & Struct
    readonly isScheduleNamedAfter: boolean
    readonly asScheduleNamedAfter: {
      readonly id: U8aFixed
      readonly after: u32
      readonly maybePeriodic: Option<ITuple<[u32, u32]>>
      readonly priority: u8
      readonly call: Call
    } & Struct
    readonly type: 'Schedule' | 'Cancel' | 'ScheduleNamed' | 'CancelNamed' | 'ScheduleAfter' | 'ScheduleNamedAfter'
  }

  /** @name PalletProxyCall (224) */
  interface PalletProxyCall extends Enum {
    readonly isProxy: boolean
    readonly asProxy: {
      readonly real: MultiAddress
      readonly forceProxyType: Option<ShibuyaRuntimeProxyType>
      readonly call: Call
    } & Struct
    readonly isAddProxy: boolean
    readonly asAddProxy: {
      readonly delegate: MultiAddress
      readonly proxyType: ShibuyaRuntimeProxyType
      readonly delay: u32
    } & Struct
    readonly isRemoveProxy: boolean
    readonly asRemoveProxy: {
      readonly delegate: MultiAddress
      readonly proxyType: ShibuyaRuntimeProxyType
      readonly delay: u32
    } & Struct
    readonly isRemoveProxies: boolean
    readonly isCreatePure: boolean
    readonly asCreatePure: {
      readonly proxyType: ShibuyaRuntimeProxyType
      readonly delay: u32
      readonly index: u16
    } & Struct
    readonly isKillPure: boolean
    readonly asKillPure: {
      readonly spawner: MultiAddress
      readonly proxyType: ShibuyaRuntimeProxyType
      readonly index: u16
      readonly height: Compact<u32>
      readonly extIndex: Compact<u32>
    } & Struct
    readonly isAnnounce: boolean
    readonly asAnnounce: {
      readonly real: MultiAddress
      readonly callHash: H256
    } & Struct
    readonly isRemoveAnnouncement: boolean
    readonly asRemoveAnnouncement: {
      readonly real: MultiAddress
      readonly callHash: H256
    } & Struct
    readonly isRejectAnnouncement: boolean
    readonly asRejectAnnouncement: {
      readonly delegate: MultiAddress
      readonly callHash: H256
    } & Struct
    readonly isProxyAnnounced: boolean
    readonly asProxyAnnounced: {
      readonly delegate: MultiAddress
      readonly real: MultiAddress
      readonly forceProxyType: Option<ShibuyaRuntimeProxyType>
      readonly call: Call
    } & Struct
    readonly type:
      | 'Proxy'
      | 'AddProxy'
      | 'RemoveProxy'
      | 'RemoveProxies'
      | 'CreatePure'
      | 'KillPure'
      | 'Announce'
      | 'RemoveAnnouncement'
      | 'RejectAnnouncement'
      | 'ProxyAnnounced'
  }

  /** @name CumulusPalletParachainSystemCall (226) */
  interface CumulusPalletParachainSystemCall extends Enum {
    readonly isSetValidationData: boolean
    readonly asSetValidationData: {
      readonly data: CumulusPrimitivesParachainInherentParachainInherentData
    } & Struct
    readonly isSudoSendUpwardMessage: boolean
    readonly asSudoSendUpwardMessage: {
      readonly message: Bytes
    } & Struct
    readonly isAuthorizeUpgrade: boolean
    readonly asAuthorizeUpgrade: {
      readonly codeHash: H256
      readonly checkVersion: bool
    } & Struct
    readonly isEnactAuthorizedUpgrade: boolean
    readonly asEnactAuthorizedUpgrade: {
      readonly code: Bytes
    } & Struct
    readonly type: 'SetValidationData' | 'SudoSendUpwardMessage' | 'AuthorizeUpgrade' | 'EnactAuthorizedUpgrade'
  }

  /** @name CumulusPrimitivesParachainInherentParachainInherentData (227) */
  interface CumulusPrimitivesParachainInherentParachainInherentData extends Struct {
    readonly validationData: PolkadotPrimitivesV4PersistedValidationData
    readonly relayChainState: SpTrieStorageProof
    readonly downwardMessages: Vec<PolkadotCorePrimitivesInboundDownwardMessage>
    readonly horizontalMessages: BTreeMap<u32, Vec<PolkadotCorePrimitivesInboundHrmpMessage>>
  }

  /** @name PolkadotPrimitivesV4PersistedValidationData (228) */
  interface PolkadotPrimitivesV4PersistedValidationData extends Struct {
    readonly parentHead: Bytes
    readonly relayParentNumber: u32
    readonly relayParentStorageRoot: H256
    readonly maxPovSize: u32
  }

  /** @name SpTrieStorageProof (230) */
  interface SpTrieStorageProof extends Struct {
    readonly trieNodes: BTreeSet<Bytes>
  }

  /** @name PolkadotCorePrimitivesInboundDownwardMessage (233) */
  interface PolkadotCorePrimitivesInboundDownwardMessage extends Struct {
    readonly sentAt: u32
    readonly msg: Bytes
  }

  /** @name PolkadotCorePrimitivesInboundHrmpMessage (236) */
  interface PolkadotCorePrimitivesInboundHrmpMessage extends Struct {
    readonly sentAt: u32
    readonly data: Bytes
  }

  /** @name ParachainInfoCall (239) */
  type ParachainInfoCall = Null

  /** @name PalletBalancesCall (240) */
  interface PalletBalancesCall extends Enum {
    readonly isTransferAllowDeath: boolean
    readonly asTransferAllowDeath: {
      readonly dest: MultiAddress
      readonly value: Compact<u128>
    } & Struct
    readonly isSetBalanceDeprecated: boolean
    readonly asSetBalanceDeprecated: {
      readonly who: MultiAddress
      readonly newFree: Compact<u128>
      readonly oldReserved: Compact<u128>
    } & Struct
    readonly isForceTransfer: boolean
    readonly asForceTransfer: {
      readonly source: MultiAddress
      readonly dest: MultiAddress
      readonly value: Compact<u128>
    } & Struct
    readonly isTransferKeepAlive: boolean
    readonly asTransferKeepAlive: {
      readonly dest: MultiAddress
      readonly value: Compact<u128>
    } & Struct
    readonly isTransferAll: boolean
    readonly asTransferAll: {
      readonly dest: MultiAddress
      readonly keepAlive: bool
    } & Struct
    readonly isForceUnreserve: boolean
    readonly asForceUnreserve: {
      readonly who: MultiAddress
      readonly amount: u128
    } & Struct
    readonly isUpgradeAccounts: boolean
    readonly asUpgradeAccounts: {
      readonly who: Vec<AccountId32>
    } & Struct
    readonly isTransfer: boolean
    readonly asTransfer: {
      readonly dest: MultiAddress
      readonly value: Compact<u128>
    } & Struct
    readonly isForceSetBalance: boolean
    readonly asForceSetBalance: {
      readonly who: MultiAddress
      readonly newFree: Compact<u128>
    } & Struct
    readonly type:
      | 'TransferAllowDeath'
      | 'SetBalanceDeprecated'
      | 'ForceTransfer'
      | 'TransferKeepAlive'
      | 'TransferAll'
      | 'ForceUnreserve'
      | 'UpgradeAccounts'
      | 'Transfer'
      | 'ForceSetBalance'
  }

  /** @name PalletVestingCall (241) */
  interface PalletVestingCall extends Enum {
    readonly isVest: boolean
    readonly isVestOther: boolean
    readonly asVestOther: {
      readonly target: MultiAddress
    } & Struct
    readonly isVestedTransfer: boolean
    readonly asVestedTransfer: {
      readonly target: MultiAddress
      readonly schedule: PalletVestingVestingInfo
    } & Struct
    readonly isForceVestedTransfer: boolean
    readonly asForceVestedTransfer: {
      readonly source: MultiAddress
      readonly target: MultiAddress
      readonly schedule: PalletVestingVestingInfo
    } & Struct
    readonly isMergeSchedules: boolean
    readonly asMergeSchedules: {
      readonly schedule1Index: u32
      readonly schedule2Index: u32
    } & Struct
    readonly type: 'Vest' | 'VestOther' | 'VestedTransfer' | 'ForceVestedTransfer' | 'MergeSchedules'
  }

  /** @name PalletVestingVestingInfo (242) */
  interface PalletVestingVestingInfo extends Struct {
    readonly locked: u128
    readonly perBlock: u128
    readonly startingBlock: u32
  }

  /** @name PalletDappStakingV3Call (243) */
  interface PalletDappStakingV3Call extends Enum {
    readonly isMaintenanceMode: boolean
    readonly asMaintenanceMode: {
      readonly enabled: bool
    } & Struct
    readonly isRegister: boolean
    readonly asRegister: {
      readonly owner: AccountId32
      readonly smartContract: AstarPrimitivesDappStakingSmartContract
    } & Struct
    readonly isSetDappRewardBeneficiary: boolean
    readonly asSetDappRewardBeneficiary: {
      readonly smartContract: AstarPrimitivesDappStakingSmartContract
      readonly beneficiary: Option<AccountId32>
    } & Struct
    readonly isSetDappOwner: boolean
    readonly asSetDappOwner: {
      readonly smartContract: AstarPrimitivesDappStakingSmartContract
      readonly newOwner: AccountId32
    } & Struct
    readonly isUnbondAndUnstake: boolean
    readonly asUnbondAndUnstake: {
      readonly contractId: AstarPrimitivesDappStakingSmartContract
      readonly value: Compact<u128>
    } & Struct
    readonly isWithdrawUnbonded: boolean
    readonly isUnregister: boolean
    readonly asUnregister: {
      readonly smartContract: AstarPrimitivesDappStakingSmartContract
    } & Struct
    readonly isLock: boolean
    readonly asLock: {
      readonly amount: Compact<u128>
    } & Struct
    readonly isUnlock: boolean
    readonly asUnlock: {
      readonly amount: Compact<u128>
    } & Struct
    readonly isClaimUnlocked: boolean
    readonly isRelockUnlocking: boolean
    readonly isStake: boolean
    readonly asStake: {
      readonly smartContract: AstarPrimitivesDappStakingSmartContract
      readonly amount: Compact<u128>
    } & Struct
    readonly isUnstake: boolean
    readonly asUnstake: {
      readonly smartContract: AstarPrimitivesDappStakingSmartContract
      readonly amount: Compact<u128>
    } & Struct
    readonly isClaimStakerRewards: boolean
    readonly isClaimBonusReward: boolean
    readonly asClaimBonusReward: {
      readonly smartContract: AstarPrimitivesDappStakingSmartContract
    } & Struct
    readonly isClaimDappReward: boolean
    readonly asClaimDappReward: {
      readonly smartContract: AstarPrimitivesDappStakingSmartContract
      readonly era: Compact<u32>
    } & Struct
    readonly isUnstakeFromUnregistered: boolean
    readonly asUnstakeFromUnregistered: {
      readonly smartContract: AstarPrimitivesDappStakingSmartContract
    } & Struct
    readonly isCleanupExpiredEntries: boolean
    readonly isForce: boolean
    readonly asForce: {
      readonly forcingType: PalletDappStakingV3ForcingType
    } & Struct
    readonly isForceSetTierParams: boolean
    readonly asForceSetTierParams: {
      readonly value: PalletDappStakingV3TierParameters
    } & Struct
    readonly isForceSetTierConfig: boolean
    readonly asForceSetTierConfig: {
      readonly value: PalletDappStakingV3TiersConfiguration
    } & Struct
    readonly type:
      | 'MaintenanceMode'
      | 'Register'
      | 'SetDappRewardBeneficiary'
      | 'SetDappOwner'
      | 'UnbondAndUnstake'
      | 'WithdrawUnbonded'
      | 'Unregister'
      | 'Lock'
      | 'Unlock'
      | 'ClaimUnlocked'
      | 'RelockUnlocking'
      | 'Stake'
      | 'Unstake'
      | 'ClaimStakerRewards'
      | 'ClaimBonusReward'
      | 'ClaimDappReward'
      | 'UnstakeFromUnregistered'
      | 'CleanupExpiredEntries'
      | 'Force'
      | 'ForceSetTierParams'
      | 'ForceSetTierConfig'
  }

  /** @name PalletDappStakingV3TierParameters (244) */
  interface PalletDappStakingV3TierParameters extends Struct {
    readonly rewardPortion: Vec<Permill>
    readonly slotDistribution: Vec<Permill>
    readonly tierThresholds: Vec<PalletDappStakingV3TierThreshold>
  }

  /** @name PalletDappStakingV3TierThreshold (249) */
  interface PalletDappStakingV3TierThreshold extends Enum {
    readonly isFixedTvlAmount: boolean
    readonly asFixedTvlAmount: {
      readonly amount: u128
    } & Struct
    readonly isDynamicTvlAmount: boolean
    readonly asDynamicTvlAmount: {
      readonly amount: u128
      readonly minimumAmount: u128
    } & Struct
    readonly type: 'FixedTvlAmount' | 'DynamicTvlAmount'
  }

  /** @name PalletDappStakingV3TiersConfiguration (251) */
  interface PalletDappStakingV3TiersConfiguration extends Struct {
    readonly numberOfSlots: Compact<u16>
    readonly slotsPerTier: Vec<u16>
    readonly rewardPortion: Vec<Permill>
    readonly tierThresholds: Vec<PalletDappStakingV3TierThreshold>
  }

  /** @name PalletInflationCall (255) */
  interface PalletInflationCall extends Enum {
    readonly isForceSetInflationParams: boolean
    readonly asForceSetInflationParams: {
      readonly params: PalletInflationInflationParameters
    } & Struct
    readonly isForceInflationRecalculation: boolean
    readonly asForceInflationRecalculation: {
      readonly nextEra: u32
    } & Struct
    readonly isForceSetInflationConfig: boolean
    readonly asForceSetInflationConfig: {
      readonly config: PalletInflationInflationConfiguration
    } & Struct
    readonly type: 'ForceSetInflationParams' | 'ForceInflationRecalculation' | 'ForceSetInflationConfig'
  }

  /** @name PalletInflationInflationParameters (256) */
  interface PalletInflationInflationParameters extends Struct {
    readonly maxInflationRate: Compact<Perquintill>
    readonly treasuryPart: Compact<Perquintill>
    readonly collatorsPart: Compact<Perquintill>
    readonly dappsPart: Compact<Perquintill>
    readonly baseStakersPart: Compact<Perquintill>
    readonly adjustableStakersPart: Compact<Perquintill>
    readonly bonusPart: Compact<Perquintill>
    readonly idealStakingRate: Compact<Perquintill>
  }

  /** @name PalletAssetsCall (257) */
  interface PalletAssetsCall extends Enum {
    readonly isCreate: boolean
    readonly asCreate: {
      readonly id: Compact<u128>
      readonly admin: MultiAddress
      readonly minBalance: u128
    } & Struct
    readonly isForceCreate: boolean
    readonly asForceCreate: {
      readonly id: Compact<u128>
      readonly owner: MultiAddress
      readonly isSufficient: bool
      readonly minBalance: Compact<u128>
    } & Struct
    readonly isStartDestroy: boolean
    readonly asStartDestroy: {
      readonly id: Compact<u128>
    } & Struct
    readonly isDestroyAccounts: boolean
    readonly asDestroyAccounts: {
      readonly id: Compact<u128>
    } & Struct
    readonly isDestroyApprovals: boolean
    readonly asDestroyApprovals: {
      readonly id: Compact<u128>
    } & Struct
    readonly isFinishDestroy: boolean
    readonly asFinishDestroy: {
      readonly id: Compact<u128>
    } & Struct
    readonly isMint: boolean
    readonly asMint: {
      readonly id: Compact<u128>
      readonly beneficiary: MultiAddress
      readonly amount: Compact<u128>
    } & Struct
    readonly isBurn: boolean
    readonly asBurn: {
      readonly id: Compact<u128>
      readonly who: MultiAddress
      readonly amount: Compact<u128>
    } & Struct
    readonly isTransfer: boolean
    readonly asTransfer: {
      readonly id: Compact<u128>
      readonly target: MultiAddress
      readonly amount: Compact<u128>
    } & Struct
    readonly isTransferKeepAlive: boolean
    readonly asTransferKeepAlive: {
      readonly id: Compact<u128>
      readonly target: MultiAddress
      readonly amount: Compact<u128>
    } & Struct
    readonly isForceTransfer: boolean
    readonly asForceTransfer: {
      readonly id: Compact<u128>
      readonly source: MultiAddress
      readonly dest: MultiAddress
      readonly amount: Compact<u128>
    } & Struct
    readonly isFreeze: boolean
    readonly asFreeze: {
      readonly id: Compact<u128>
      readonly who: MultiAddress
    } & Struct
    readonly isThaw: boolean
    readonly asThaw: {
      readonly id: Compact<u128>
      readonly who: MultiAddress
    } & Struct
    readonly isFreezeAsset: boolean
    readonly asFreezeAsset: {
      readonly id: Compact<u128>
    } & Struct
    readonly isThawAsset: boolean
    readonly asThawAsset: {
      readonly id: Compact<u128>
    } & Struct
    readonly isTransferOwnership: boolean
    readonly asTransferOwnership: {
      readonly id: Compact<u128>
      readonly owner: MultiAddress
    } & Struct
    readonly isSetTeam: boolean
    readonly asSetTeam: {
      readonly id: Compact<u128>
      readonly issuer: MultiAddress
      readonly admin: MultiAddress
      readonly freezer: MultiAddress
    } & Struct
    readonly isSetMetadata: boolean
    readonly asSetMetadata: {
      readonly id: Compact<u128>
      readonly name: Bytes
      readonly symbol: Bytes
      readonly decimals: u8
    } & Struct
    readonly isClearMetadata: boolean
    readonly asClearMetadata: {
      readonly id: Compact<u128>
    } & Struct
    readonly isForceSetMetadata: boolean
    readonly asForceSetMetadata: {
      readonly id: Compact<u128>
      readonly name: Bytes
      readonly symbol: Bytes
      readonly decimals: u8
      readonly isFrozen: bool
    } & Struct
    readonly isForceClearMetadata: boolean
    readonly asForceClearMetadata: {
      readonly id: Compact<u128>
    } & Struct
    readonly isForceAssetStatus: boolean
    readonly asForceAssetStatus: {
      readonly id: Compact<u128>
      readonly owner: MultiAddress
      readonly issuer: MultiAddress
      readonly admin: MultiAddress
      readonly freezer: MultiAddress
      readonly minBalance: Compact<u128>
      readonly isSufficient: bool
      readonly isFrozen: bool
    } & Struct
    readonly isApproveTransfer: boolean
    readonly asApproveTransfer: {
      readonly id: Compact<u128>
      readonly delegate: MultiAddress
      readonly amount: Compact<u128>
    } & Struct
    readonly isCancelApproval: boolean
    readonly asCancelApproval: {
      readonly id: Compact<u128>
      readonly delegate: MultiAddress
    } & Struct
    readonly isForceCancelApproval: boolean
    readonly asForceCancelApproval: {
      readonly id: Compact<u128>
      readonly owner: MultiAddress
      readonly delegate: MultiAddress
    } & Struct
    readonly isTransferApproved: boolean
    readonly asTransferApproved: {
      readonly id: Compact<u128>
      readonly owner: MultiAddress
      readonly destination: MultiAddress
      readonly amount: Compact<u128>
    } & Struct
    readonly isTouch: boolean
    readonly asTouch: {
      readonly id: Compact<u128>
    } & Struct
    readonly isRefund: boolean
    readonly asRefund: {
      readonly id: Compact<u128>
      readonly allowBurn: bool
    } & Struct
    readonly isSetMinBalance: boolean
    readonly asSetMinBalance: {
      readonly id: Compact<u128>
      readonly minBalance: u128
    } & Struct
    readonly isTouchOther: boolean
    readonly asTouchOther: {
      readonly id: Compact<u128>
      readonly who: MultiAddress
    } & Struct
    readonly isRefundOther: boolean
    readonly asRefundOther: {
      readonly id: Compact<u128>
      readonly who: MultiAddress
    } & Struct
    readonly isBlock: boolean
    readonly asBlock: {
      readonly id: Compact<u128>
      readonly who: MultiAddress
    } & Struct
    readonly type:
      | 'Create'
      | 'ForceCreate'
      | 'StartDestroy'
      | 'DestroyAccounts'
      | 'DestroyApprovals'
      | 'FinishDestroy'
      | 'Mint'
      | 'Burn'
      | 'Transfer'
      | 'TransferKeepAlive'
      | 'ForceTransfer'
      | 'Freeze'
      | 'Thaw'
      | 'FreezeAsset'
      | 'ThawAsset'
      | 'TransferOwnership'
      | 'SetTeam'
      | 'SetMetadata'
      | 'ClearMetadata'
      | 'ForceSetMetadata'
      | 'ForceClearMetadata'
      | 'ForceAssetStatus'
      | 'ApproveTransfer'
      | 'CancelApproval'
      | 'ForceCancelApproval'
      | 'TransferApproved'
      | 'Touch'
      | 'Refund'
      | 'SetMinBalance'
      | 'TouchOther'
      | 'RefundOther'
      | 'Block'
  }

  /** @name PalletCollatorSelectionCall (258) */
  interface PalletCollatorSelectionCall extends Enum {
    readonly isSetInvulnerables: boolean
    readonly asSetInvulnerables: {
      readonly new_: Vec<AccountId32>
    } & Struct
    readonly isSetDesiredCandidates: boolean
    readonly asSetDesiredCandidates: {
      readonly max: u32
    } & Struct
    readonly isSetCandidacyBond: boolean
    readonly asSetCandidacyBond: {
      readonly bond: u128
    } & Struct
    readonly isRegisterAsCandidate: boolean
    readonly isLeaveIntent: boolean
    readonly type:
      | 'SetInvulnerables'
      | 'SetDesiredCandidates'
      | 'SetCandidacyBond'
      | 'RegisterAsCandidate'
      | 'LeaveIntent'
  }

  /** @name PalletSessionCall (259) */
  interface PalletSessionCall extends Enum {
    readonly isSetKeys: boolean
    readonly asSetKeys: {
      readonly keys_: ShibuyaRuntimeSessionKeys
      readonly proof: Bytes
    } & Struct
    readonly isPurgeKeys: boolean
    readonly type: 'SetKeys' | 'PurgeKeys'
  }

  /** @name ShibuyaRuntimeSessionKeys (260) */
  interface ShibuyaRuntimeSessionKeys extends Struct {
    readonly aura: SpConsensusAuraSr25519AppSr25519Public
  }

  /** @name SpConsensusAuraSr25519AppSr25519Public (261) */
  interface SpConsensusAuraSr25519AppSr25519Public extends SpCoreSr25519Public {}

  /** @name SpCoreSr25519Public (262) */
  interface SpCoreSr25519Public extends U8aFixed {}

  /** @name CumulusPalletXcmpQueueCall (263) */
  interface CumulusPalletXcmpQueueCall extends Enum {
    readonly isServiceOverweight: boolean
    readonly asServiceOverweight: {
      readonly index: u64
      readonly weightLimit: SpWeightsWeightV2Weight
    } & Struct
    readonly isSuspendXcmExecution: boolean
    readonly isResumeXcmExecution: boolean
    readonly isUpdateSuspendThreshold: boolean
    readonly asUpdateSuspendThreshold: {
      readonly new_: u32
    } & Struct
    readonly isUpdateDropThreshold: boolean
    readonly asUpdateDropThreshold: {
      readonly new_: u32
    } & Struct
    readonly isUpdateResumeThreshold: boolean
    readonly asUpdateResumeThreshold: {
      readonly new_: u32
    } & Struct
    readonly isUpdateThresholdWeight: boolean
    readonly asUpdateThresholdWeight: {
      readonly new_: SpWeightsWeightV2Weight
    } & Struct
    readonly isUpdateWeightRestrictDecay: boolean
    readonly asUpdateWeightRestrictDecay: {
      readonly new_: SpWeightsWeightV2Weight
    } & Struct
    readonly isUpdateXcmpMaxIndividualWeight: boolean
    readonly asUpdateXcmpMaxIndividualWeight: {
      readonly new_: SpWeightsWeightV2Weight
    } & Struct
    readonly type:
      | 'ServiceOverweight'
      | 'SuspendXcmExecution'
      | 'ResumeXcmExecution'
      | 'UpdateSuspendThreshold'
      | 'UpdateDropThreshold'
      | 'UpdateResumeThreshold'
      | 'UpdateThresholdWeight'
      | 'UpdateWeightRestrictDecay'
      | 'UpdateXcmpMaxIndividualWeight'
  }

  /** @name PalletXcmCall (264) */
  interface PalletXcmCall extends Enum {
    readonly isSend: boolean
    readonly asSend: {
      readonly dest: XcmVersionedMultiLocation
      readonly message: XcmVersionedXcm
    } & Struct
    readonly isTeleportAssets: boolean
    readonly asTeleportAssets: {
      readonly dest: XcmVersionedMultiLocation
      readonly beneficiary: XcmVersionedMultiLocation
      readonly assets: XcmVersionedMultiAssets
      readonly feeAssetItem: u32
    } & Struct
    readonly isReserveTransferAssets: boolean
    readonly asReserveTransferAssets: {
      readonly dest: XcmVersionedMultiLocation
      readonly beneficiary: XcmVersionedMultiLocation
      readonly assets: XcmVersionedMultiAssets
      readonly feeAssetItem: u32
    } & Struct
    readonly isExecute: boolean
    readonly asExecute: {
      readonly message: XcmVersionedXcm
      readonly maxWeight: SpWeightsWeightV2Weight
    } & Struct
    readonly isForceXcmVersion: boolean
    readonly asForceXcmVersion: {
      readonly location: XcmV3MultiLocation
      readonly xcmVersion: u32
    } & Struct
    readonly isForceDefaultXcmVersion: boolean
    readonly asForceDefaultXcmVersion: {
      readonly maybeXcmVersion: Option<u32>
    } & Struct
    readonly isForceSubscribeVersionNotify: boolean
    readonly asForceSubscribeVersionNotify: {
      readonly location: XcmVersionedMultiLocation
    } & Struct
    readonly isForceUnsubscribeVersionNotify: boolean
    readonly asForceUnsubscribeVersionNotify: {
      readonly location: XcmVersionedMultiLocation
    } & Struct
    readonly isLimitedReserveTransferAssets: boolean
    readonly asLimitedReserveTransferAssets: {
      readonly dest: XcmVersionedMultiLocation
      readonly beneficiary: XcmVersionedMultiLocation
      readonly assets: XcmVersionedMultiAssets
      readonly feeAssetItem: u32
      readonly weightLimit: XcmV3WeightLimit
    } & Struct
    readonly isLimitedTeleportAssets: boolean
    readonly asLimitedTeleportAssets: {
      readonly dest: XcmVersionedMultiLocation
      readonly beneficiary: XcmVersionedMultiLocation
      readonly assets: XcmVersionedMultiAssets
      readonly feeAssetItem: u32
      readonly weightLimit: XcmV3WeightLimit
    } & Struct
    readonly isForceSuspension: boolean
    readonly asForceSuspension: {
      readonly suspended: bool
    } & Struct
    readonly type:
      | 'Send'
      | 'TeleportAssets'
      | 'ReserveTransferAssets'
      | 'Execute'
      | 'ForceXcmVersion'
      | 'ForceDefaultXcmVersion'
      | 'ForceSubscribeVersionNotify'
      | 'ForceUnsubscribeVersionNotify'
      | 'LimitedReserveTransferAssets'
      | 'LimitedTeleportAssets'
      | 'ForceSuspension'
  }

  /** @name XcmVersionedXcm (265) */
  interface XcmVersionedXcm extends Enum {
    readonly isV2: boolean
    readonly asV2: XcmV2Xcm
    readonly isV3: boolean
    readonly asV3: XcmV3Xcm
    readonly type: 'V2' | 'V3'
  }

  /** @name XcmV2Xcm (266) */
  interface XcmV2Xcm extends Vec<XcmV2Instruction> {}

  /** @name XcmV2Instruction (268) */
  interface XcmV2Instruction extends Enum {
    readonly isWithdrawAsset: boolean
    readonly asWithdrawAsset: XcmV2MultiassetMultiAssets
    readonly isReserveAssetDeposited: boolean
    readonly asReserveAssetDeposited: XcmV2MultiassetMultiAssets
    readonly isReceiveTeleportedAsset: boolean
    readonly asReceiveTeleportedAsset: XcmV2MultiassetMultiAssets
    readonly isQueryResponse: boolean
    readonly asQueryResponse: {
      readonly queryId: Compact<u64>
      readonly response: XcmV2Response
      readonly maxWeight: Compact<u64>
    } & Struct
    readonly isTransferAsset: boolean
    readonly asTransferAsset: {
      readonly assets: XcmV2MultiassetMultiAssets
      readonly beneficiary: XcmV2MultiLocation
    } & Struct
    readonly isTransferReserveAsset: boolean
    readonly asTransferReserveAsset: {
      readonly assets: XcmV2MultiassetMultiAssets
      readonly dest: XcmV2MultiLocation
      readonly xcm: XcmV2Xcm
    } & Struct
    readonly isTransact: boolean
    readonly asTransact: {
      readonly originType: XcmV2OriginKind
      readonly requireWeightAtMost: Compact<u64>
      readonly call: XcmDoubleEncoded
    } & Struct
    readonly isHrmpNewChannelOpenRequest: boolean
    readonly asHrmpNewChannelOpenRequest: {
      readonly sender: Compact<u32>
      readonly maxMessageSize: Compact<u32>
      readonly maxCapacity: Compact<u32>
    } & Struct
    readonly isHrmpChannelAccepted: boolean
    readonly asHrmpChannelAccepted: {
      readonly recipient: Compact<u32>
    } & Struct
    readonly isHrmpChannelClosing: boolean
    readonly asHrmpChannelClosing: {
      readonly initiator: Compact<u32>
      readonly sender: Compact<u32>
      readonly recipient: Compact<u32>
    } & Struct
    readonly isClearOrigin: boolean
    readonly isDescendOrigin: boolean
    readonly asDescendOrigin: XcmV2MultilocationJunctions
    readonly isReportError: boolean
    readonly asReportError: {
      readonly queryId: Compact<u64>
      readonly dest: XcmV2MultiLocation
      readonly maxResponseWeight: Compact<u64>
    } & Struct
    readonly isDepositAsset: boolean
    readonly asDepositAsset: {
      readonly assets: XcmV2MultiassetMultiAssetFilter
      readonly maxAssets: Compact<u32>
      readonly beneficiary: XcmV2MultiLocation
    } & Struct
    readonly isDepositReserveAsset: boolean
    readonly asDepositReserveAsset: {
      readonly assets: XcmV2MultiassetMultiAssetFilter
      readonly maxAssets: Compact<u32>
      readonly dest: XcmV2MultiLocation
      readonly xcm: XcmV2Xcm
    } & Struct
    readonly isExchangeAsset: boolean
    readonly asExchangeAsset: {
      readonly give: XcmV2MultiassetMultiAssetFilter
      readonly receive: XcmV2MultiassetMultiAssets
    } & Struct
    readonly isInitiateReserveWithdraw: boolean
    readonly asInitiateReserveWithdraw: {
      readonly assets: XcmV2MultiassetMultiAssetFilter
      readonly reserve: XcmV2MultiLocation
      readonly xcm: XcmV2Xcm
    } & Struct
    readonly isInitiateTeleport: boolean
    readonly asInitiateTeleport: {
      readonly assets: XcmV2MultiassetMultiAssetFilter
      readonly dest: XcmV2MultiLocation
      readonly xcm: XcmV2Xcm
    } & Struct
    readonly isQueryHolding: boolean
    readonly asQueryHolding: {
      readonly queryId: Compact<u64>
      readonly dest: XcmV2MultiLocation
      readonly assets: XcmV2MultiassetMultiAssetFilter
      readonly maxResponseWeight: Compact<u64>
    } & Struct
    readonly isBuyExecution: boolean
    readonly asBuyExecution: {
      readonly fees: XcmV2MultiAsset
      readonly weightLimit: XcmV2WeightLimit
    } & Struct
    readonly isRefundSurplus: boolean
    readonly isSetErrorHandler: boolean
    readonly asSetErrorHandler: XcmV2Xcm
    readonly isSetAppendix: boolean
    readonly asSetAppendix: XcmV2Xcm
    readonly isClearError: boolean
    readonly isClaimAsset: boolean
    readonly asClaimAsset: {
      readonly assets: XcmV2MultiassetMultiAssets
      readonly ticket: XcmV2MultiLocation
    } & Struct
    readonly isTrap: boolean
    readonly asTrap: Compact<u64>
    readonly isSubscribeVersion: boolean
    readonly asSubscribeVersion: {
      readonly queryId: Compact<u64>
      readonly maxResponseWeight: Compact<u64>
    } & Struct
    readonly isUnsubscribeVersion: boolean
    readonly type:
      | 'WithdrawAsset'
      | 'ReserveAssetDeposited'
      | 'ReceiveTeleportedAsset'
      | 'QueryResponse'
      | 'TransferAsset'
      | 'TransferReserveAsset'
      | 'Transact'
      | 'HrmpNewChannelOpenRequest'
      | 'HrmpChannelAccepted'
      | 'HrmpChannelClosing'
      | 'ClearOrigin'
      | 'DescendOrigin'
      | 'ReportError'
      | 'DepositAsset'
      | 'DepositReserveAsset'
      | 'ExchangeAsset'
      | 'InitiateReserveWithdraw'
      | 'InitiateTeleport'
      | 'QueryHolding'
      | 'BuyExecution'
      | 'RefundSurplus'
      | 'SetErrorHandler'
      | 'SetAppendix'
      | 'ClearError'
      | 'ClaimAsset'
      | 'Trap'
      | 'SubscribeVersion'
      | 'UnsubscribeVersion'
  }

  /** @name XcmV2Response (269) */
  interface XcmV2Response extends Enum {
    readonly isNull: boolean
    readonly isAssets: boolean
    readonly asAssets: XcmV2MultiassetMultiAssets
    readonly isExecutionResult: boolean
    readonly asExecutionResult: Option<ITuple<[u32, XcmV2TraitsError]>>
    readonly isVersion: boolean
    readonly asVersion: u32
    readonly type: 'Null' | 'Assets' | 'ExecutionResult' | 'Version'
  }

  /** @name XcmV2TraitsError (272) */
  interface XcmV2TraitsError extends Enum {
    readonly isOverflow: boolean
    readonly isUnimplemented: boolean
    readonly isUntrustedReserveLocation: boolean
    readonly isUntrustedTeleportLocation: boolean
    readonly isMultiLocationFull: boolean
    readonly isMultiLocationNotInvertible: boolean
    readonly isBadOrigin: boolean
    readonly isInvalidLocation: boolean
    readonly isAssetNotFound: boolean
    readonly isFailedToTransactAsset: boolean
    readonly isNotWithdrawable: boolean
    readonly isLocationCannotHold: boolean
    readonly isExceedsMaxMessageSize: boolean
    readonly isDestinationUnsupported: boolean
    readonly isTransport: boolean
    readonly isUnroutable: boolean
    readonly isUnknownClaim: boolean
    readonly isFailedToDecode: boolean
    readonly isMaxWeightInvalid: boolean
    readonly isNotHoldingFees: boolean
    readonly isTooExpensive: boolean
    readonly isTrap: boolean
    readonly asTrap: u64
    readonly isUnhandledXcmVersion: boolean
    readonly isWeightLimitReached: boolean
    readonly asWeightLimitReached: u64
    readonly isBarrier: boolean
    readonly isWeightNotComputable: boolean
    readonly type:
      | 'Overflow'
      | 'Unimplemented'
      | 'UntrustedReserveLocation'
      | 'UntrustedTeleportLocation'
      | 'MultiLocationFull'
      | 'MultiLocationNotInvertible'
      | 'BadOrigin'
      | 'InvalidLocation'
      | 'AssetNotFound'
      | 'FailedToTransactAsset'
      | 'NotWithdrawable'
      | 'LocationCannotHold'
      | 'ExceedsMaxMessageSize'
      | 'DestinationUnsupported'
      | 'Transport'
      | 'Unroutable'
      | 'UnknownClaim'
      | 'FailedToDecode'
      | 'MaxWeightInvalid'
      | 'NotHoldingFees'
      | 'TooExpensive'
      | 'Trap'
      | 'UnhandledXcmVersion'
      | 'WeightLimitReached'
      | 'Barrier'
      | 'WeightNotComputable'
  }

  /** @name XcmV2MultiassetMultiAssetFilter (273) */
  interface XcmV2MultiassetMultiAssetFilter extends Enum {
    readonly isDefinite: boolean
    readonly asDefinite: XcmV2MultiassetMultiAssets
    readonly isWild: boolean
    readonly asWild: XcmV2MultiassetWildMultiAsset
    readonly type: 'Definite' | 'Wild'
  }

  /** @name XcmV2MultiassetWildMultiAsset (274) */
  interface XcmV2MultiassetWildMultiAsset extends Enum {
    readonly isAll: boolean
    readonly isAllOf: boolean
    readonly asAllOf: {
      readonly id: XcmV2MultiassetAssetId
      readonly fun: XcmV2MultiassetWildFungibility
    } & Struct
    readonly type: 'All' | 'AllOf'
  }

  /** @name XcmV2MultiassetWildFungibility (275) */
  interface XcmV2MultiassetWildFungibility extends Enum {
    readonly isFungible: boolean
    readonly isNonFungible: boolean
    readonly type: 'Fungible' | 'NonFungible'
  }

  /** @name XcmV2WeightLimit (276) */
  interface XcmV2WeightLimit extends Enum {
    readonly isUnlimited: boolean
    readonly isLimited: boolean
    readonly asLimited: Compact<u64>
    readonly type: 'Unlimited' | 'Limited'
  }

  /** @name CumulusPalletXcmCall (286) */
  type CumulusPalletXcmCall = Null

  /** @name CumulusPalletDmpQueueCall (287) */
  interface CumulusPalletDmpQueueCall extends Enum {
    readonly isServiceOverweight: boolean
    readonly asServiceOverweight: {
      readonly index: u64
      readonly weightLimit: SpWeightsWeightV2Weight
    } & Struct
    readonly type: 'ServiceOverweight'
  }

  /** @name PalletXcAssetConfigCall (288) */
  interface PalletXcAssetConfigCall extends Enum {
    readonly isRegisterAssetLocation: boolean
    readonly asRegisterAssetLocation: {
      readonly assetLocation: XcmVersionedMultiLocation
      readonly assetId: Compact<u128>
    } & Struct
    readonly isSetAssetUnitsPerSecond: boolean
    readonly asSetAssetUnitsPerSecond: {
      readonly assetLocation: XcmVersionedMultiLocation
      readonly unitsPerSecond: Compact<u128>
    } & Struct
    readonly isChangeExistingAssetLocation: boolean
    readonly asChangeExistingAssetLocation: {
      readonly newAssetLocation: XcmVersionedMultiLocation
      readonly assetId: Compact<u128>
    } & Struct
    readonly isRemovePaymentAsset: boolean
    readonly asRemovePaymentAsset: {
      readonly assetLocation: XcmVersionedMultiLocation
    } & Struct
    readonly isRemoveAsset: boolean
    readonly asRemoveAsset: {
      readonly assetId: Compact<u128>
    } & Struct
    readonly type:
      | 'RegisterAssetLocation'
      | 'SetAssetUnitsPerSecond'
      | 'ChangeExistingAssetLocation'
      | 'RemovePaymentAsset'
      | 'RemoveAsset'
  }

  /** @name OrmlXtokensModuleCall (289) */
  interface OrmlXtokensModuleCall extends Enum {
    readonly isTransfer: boolean
    readonly asTransfer: {
      readonly currencyId: u128
      readonly amount: u128
      readonly dest: XcmVersionedMultiLocation
      readonly destWeightLimit: XcmV3WeightLimit
    } & Struct
    readonly isTransferMultiasset: boolean
    readonly asTransferMultiasset: {
      readonly asset: XcmVersionedMultiAsset
      readonly dest: XcmVersionedMultiLocation
      readonly destWeightLimit: XcmV3WeightLimit
    } & Struct
    readonly isTransferWithFee: boolean
    readonly asTransferWithFee: {
      readonly currencyId: u128
      readonly amount: u128
      readonly fee: u128
      readonly dest: XcmVersionedMultiLocation
      readonly destWeightLimit: XcmV3WeightLimit
    } & Struct
    readonly isTransferMultiassetWithFee: boolean
    readonly asTransferMultiassetWithFee: {
      readonly asset: XcmVersionedMultiAsset
      readonly fee: XcmVersionedMultiAsset
      readonly dest: XcmVersionedMultiLocation
      readonly destWeightLimit: XcmV3WeightLimit
    } & Struct
    readonly isTransferMulticurrencies: boolean
    readonly asTransferMulticurrencies: {
      readonly currencies: Vec<ITuple<[u128, u128]>>
      readonly feeItem: u32
      readonly dest: XcmVersionedMultiLocation
      readonly destWeightLimit: XcmV3WeightLimit
    } & Struct
    readonly isTransferMultiassets: boolean
    readonly asTransferMultiassets: {
      readonly assets: XcmVersionedMultiAssets
      readonly feeItem: u32
      readonly dest: XcmVersionedMultiLocation
      readonly destWeightLimit: XcmV3WeightLimit
    } & Struct
    readonly type:
      | 'Transfer'
      | 'TransferMultiasset'
      | 'TransferWithFee'
      | 'TransferMultiassetWithFee'
      | 'TransferMulticurrencies'
      | 'TransferMultiassets'
  }

  /** @name XcmVersionedMultiAsset (290) */
  interface XcmVersionedMultiAsset extends Enum {
    readonly isV2: boolean
    readonly asV2: XcmV2MultiAsset
    readonly isV3: boolean
    readonly asV3: XcmV3MultiAsset
    readonly type: 'V2' | 'V3'
  }

  /** @name PalletEvmCall (293) */
  interface PalletEvmCall extends Enum {
    readonly isWithdraw: boolean
    readonly asWithdraw: {
      readonly address: H160
      readonly value: u128
    } & Struct
    readonly isCall: boolean
    readonly asCall: {
      readonly source: H160
      readonly target: H160
      readonly input: Bytes
      readonly value: U256
      readonly gasLimit: u64
      readonly maxFeePerGas: U256
      readonly maxPriorityFeePerGas: Option<U256>
      readonly nonce: Option<U256>
      readonly accessList: Vec<ITuple<[H160, Vec<H256>]>>
    } & Struct
    readonly isCreate: boolean
    readonly asCreate: {
      readonly source: H160
      readonly init: Bytes
      readonly value: U256
      readonly gasLimit: u64
      readonly maxFeePerGas: U256
      readonly maxPriorityFeePerGas: Option<U256>
      readonly nonce: Option<U256>
      readonly accessList: Vec<ITuple<[H160, Vec<H256>]>>
    } & Struct
    readonly isCreate2: boolean
    readonly asCreate2: {
      readonly source: H160
      readonly init: Bytes
      readonly salt: H256
      readonly value: U256
      readonly gasLimit: u64
      readonly maxFeePerGas: U256
      readonly maxPriorityFeePerGas: Option<U256>
      readonly nonce: Option<U256>
      readonly accessList: Vec<ITuple<[H160, Vec<H256>]>>
    } & Struct
    readonly type: 'Withdraw' | 'Call' | 'Create' | 'Create2'
  }

  /** @name PalletEthereumCall (297) */
  interface PalletEthereumCall extends Enum {
    readonly isTransact: boolean
    readonly asTransact: {
      readonly transaction: EthereumTransactionTransactionV2
    } & Struct
    readonly type: 'Transact'
  }

  /** @name EthereumTransactionTransactionV2 (298) */
  interface EthereumTransactionTransactionV2 extends Enum {
    readonly isLegacy: boolean
    readonly asLegacy: EthereumTransactionLegacyTransaction
    readonly isEip2930: boolean
    readonly asEip2930: EthereumTransactionEip2930Transaction
    readonly isEip1559: boolean
    readonly asEip1559: EthereumTransactionEip1559Transaction
    readonly type: 'Legacy' | 'Eip2930' | 'Eip1559'
  }

  /** @name EthereumTransactionLegacyTransaction (299) */
  interface EthereumTransactionLegacyTransaction extends Struct {
    readonly nonce: U256
    readonly gasPrice: U256
    readonly gasLimit: U256
    readonly action: EthereumTransactionTransactionAction
    readonly value: U256
    readonly input: Bytes
    readonly signature: EthereumTransactionTransactionSignature
  }

  /** @name EthereumTransactionTransactionAction (300) */
  interface EthereumTransactionTransactionAction extends Enum {
    readonly isCall: boolean
    readonly asCall: H160
    readonly isCreate: boolean
    readonly type: 'Call' | 'Create'
  }

  /** @name EthereumTransactionTransactionSignature (301) */
  interface EthereumTransactionTransactionSignature extends Struct {
    readonly v: u64
    readonly r: H256
    readonly s: H256
  }

  /** @name EthereumTransactionEip2930Transaction (303) */
  interface EthereumTransactionEip2930Transaction extends Struct {
    readonly chainId: u64
    readonly nonce: U256
    readonly gasPrice: U256
    readonly gasLimit: U256
    readonly action: EthereumTransactionTransactionAction
    readonly value: U256
    readonly input: Bytes
    readonly accessList: Vec<EthereumTransactionAccessListItem>
    readonly oddYParity: bool
    readonly r: H256
    readonly s: H256
  }

  /** @name EthereumTransactionAccessListItem (305) */
  interface EthereumTransactionAccessListItem extends Struct {
    readonly address: H160
    readonly storageKeys: Vec<H256>
  }

  /** @name EthereumTransactionEip1559Transaction (306) */
  interface EthereumTransactionEip1559Transaction extends Struct {
    readonly chainId: u64
    readonly nonce: U256
    readonly maxPriorityFeePerGas: U256
    readonly maxFeePerGas: U256
    readonly gasLimit: U256
    readonly action: EthereumTransactionTransactionAction
    readonly value: U256
    readonly input: Bytes
    readonly accessList: Vec<EthereumTransactionAccessListItem>
    readonly oddYParity: bool
    readonly r: H256
    readonly s: H256
  }

  /** @name PalletDynamicEvmBaseFeeCall (307) */
  interface PalletDynamicEvmBaseFeeCall extends Enum {
    readonly isSetBaseFeePerGas: boolean
    readonly asSetBaseFeePerGas: {
      readonly fee: U256
    } & Struct
    readonly type: 'SetBaseFeePerGas'
  }

  /** @name PalletEthereumCheckedCall (308) */
  interface PalletEthereumCheckedCall extends Enum {
    readonly isTransact: boolean
    readonly asTransact: {
      readonly tx: AstarPrimitivesEthereumCheckedCheckedEthereumTx
    } & Struct
    readonly type: 'Transact'
  }

  /** @name AstarPrimitivesEthereumCheckedCheckedEthereumTx (309) */
  interface AstarPrimitivesEthereumCheckedCheckedEthereumTx extends Struct {
    readonly gasLimit: U256
    readonly target: H160
    readonly value: U256
    readonly input: Bytes
    readonly maybeAccessList: Option<Vec<ITuple<[H160, Vec<H256>]>>>
  }

  /** @name PalletUnifiedAccountsCall (312) */
  interface PalletUnifiedAccountsCall extends Enum {
    readonly isClaimEvmAddress: boolean
    readonly asClaimEvmAddress: {
      readonly evmAddress: H160
      readonly signature: U8aFixed
    } & Struct
    readonly isClaimDefaultEvmAddress: boolean
    readonly type: 'ClaimEvmAddress' | 'ClaimDefaultEvmAddress'
  }

  /** @name PalletContractsCall (314) */
  interface PalletContractsCall extends Enum {
    readonly isCallOldWeight: boolean
    readonly asCallOldWeight: {
      readonly dest: MultiAddress
      readonly value: Compact<u128>
      readonly gasLimit: Compact<u64>
      readonly storageDepositLimit: Option<Compact<u128>>
      readonly data: Bytes
    } & Struct
    readonly isInstantiateWithCodeOldWeight: boolean
    readonly asInstantiateWithCodeOldWeight: {
      readonly value: Compact<u128>
      readonly gasLimit: Compact<u64>
      readonly storageDepositLimit: Option<Compact<u128>>
      readonly code: Bytes
      readonly data: Bytes
      readonly salt: Bytes
    } & Struct
    readonly isInstantiateOldWeight: boolean
    readonly asInstantiateOldWeight: {
      readonly value: Compact<u128>
      readonly gasLimit: Compact<u64>
      readonly storageDepositLimit: Option<Compact<u128>>
      readonly codeHash: H256
      readonly data: Bytes
      readonly salt: Bytes
    } & Struct
    readonly isUploadCode: boolean
    readonly asUploadCode: {
      readonly code: Bytes
      readonly storageDepositLimit: Option<Compact<u128>>
      readonly determinism: PalletContractsWasmDeterminism
    } & Struct
    readonly isRemoveCode: boolean
    readonly asRemoveCode: {
      readonly codeHash: H256
    } & Struct
    readonly isSetCode: boolean
    readonly asSetCode: {
      readonly dest: MultiAddress
      readonly codeHash: H256
    } & Struct
    readonly isCall: boolean
    readonly asCall: {
      readonly dest: MultiAddress
      readonly value: Compact<u128>
      readonly gasLimit: SpWeightsWeightV2Weight
      readonly storageDepositLimit: Option<Compact<u128>>
      readonly data: Bytes
    } & Struct
    readonly isInstantiateWithCode: boolean
    readonly asInstantiateWithCode: {
      readonly value: Compact<u128>
      readonly gasLimit: SpWeightsWeightV2Weight
      readonly storageDepositLimit: Option<Compact<u128>>
      readonly code: Bytes
      readonly data: Bytes
      readonly salt: Bytes
    } & Struct
    readonly isInstantiate: boolean
    readonly asInstantiate: {
      readonly value: Compact<u128>
      readonly gasLimit: SpWeightsWeightV2Weight
      readonly storageDepositLimit: Option<Compact<u128>>
      readonly codeHash: H256
      readonly data: Bytes
      readonly salt: Bytes
    } & Struct
    readonly isMigrate: boolean
    readonly asMigrate: {
      readonly weightLimit: SpWeightsWeightV2Weight
    } & Struct
    readonly type:
      | 'CallOldWeight'
      | 'InstantiateWithCodeOldWeight'
      | 'InstantiateOldWeight'
      | 'UploadCode'
      | 'RemoveCode'
      | 'SetCode'
      | 'Call'
      | 'InstantiateWithCode'
      | 'Instantiate'
      | 'Migrate'
  }

  /** @name PalletContractsWasmDeterminism (316) */
  interface PalletContractsWasmDeterminism extends Enum {
    readonly isEnforced: boolean
    readonly isRelaxed: boolean
    readonly type: 'Enforced' | 'Relaxed'
  }

  /** @name PalletDemocracyCall (317) */
  interface PalletDemocracyCall extends Enum {
    readonly isPropose: boolean
    readonly asPropose: {
      readonly proposal: FrameSupportPreimagesBounded
      readonly value: Compact<u128>
    } & Struct
    readonly isSecond: boolean
    readonly asSecond: {
      readonly proposal: Compact<u32>
    } & Struct
    readonly isVote: boolean
    readonly asVote: {
      readonly refIndex: Compact<u32>
      readonly vote: PalletDemocracyVoteAccountVote
    } & Struct
    readonly isEmergencyCancel: boolean
    readonly asEmergencyCancel: {
      readonly refIndex: u32
    } & Struct
    readonly isExternalPropose: boolean
    readonly asExternalPropose: {
      readonly proposal: FrameSupportPreimagesBounded
    } & Struct
    readonly isExternalProposeMajority: boolean
    readonly asExternalProposeMajority: {
      readonly proposal: FrameSupportPreimagesBounded
    } & Struct
    readonly isExternalProposeDefault: boolean
    readonly asExternalProposeDefault: {
      readonly proposal: FrameSupportPreimagesBounded
    } & Struct
    readonly isFastTrack: boolean
    readonly asFastTrack: {
      readonly proposalHash: H256
      readonly votingPeriod: u32
      readonly delay: u32
    } & Struct
    readonly isVetoExternal: boolean
    readonly asVetoExternal: {
      readonly proposalHash: H256
    } & Struct
    readonly isCancelReferendum: boolean
    readonly asCancelReferendum: {
      readonly refIndex: Compact<u32>
    } & Struct
    readonly isDelegate: boolean
    readonly asDelegate: {
      readonly to: MultiAddress
      readonly conviction: PalletDemocracyConviction
      readonly balance: u128
    } & Struct
    readonly isUndelegate: boolean
    readonly isClearPublicProposals: boolean
    readonly isUnlock: boolean
    readonly asUnlock: {
      readonly target: MultiAddress
    } & Struct
    readonly isRemoveVote: boolean
    readonly asRemoveVote: {
      readonly index: u32
    } & Struct
    readonly isRemoveOtherVote: boolean
    readonly asRemoveOtherVote: {
      readonly target: MultiAddress
      readonly index: u32
    } & Struct
    readonly isBlacklist: boolean
    readonly asBlacklist: {
      readonly proposalHash: H256
      readonly maybeRefIndex: Option<u32>
    } & Struct
    readonly isCancelProposal: boolean
    readonly asCancelProposal: {
      readonly propIndex: Compact<u32>
    } & Struct
    readonly isSetMetadata: boolean
    readonly asSetMetadata: {
      readonly owner: PalletDemocracyMetadataOwner
      readonly maybeHash: Option<H256>
    } & Struct
    readonly type:
      | 'Propose'
      | 'Second'
      | 'Vote'
      | 'EmergencyCancel'
      | 'ExternalPropose'
      | 'ExternalProposeMajority'
      | 'ExternalProposeDefault'
      | 'FastTrack'
      | 'VetoExternal'
      | 'CancelReferendum'
      | 'Delegate'
      | 'Undelegate'
      | 'ClearPublicProposals'
      | 'Unlock'
      | 'RemoveVote'
      | 'RemoveOtherVote'
      | 'Blacklist'
      | 'CancelProposal'
      | 'SetMetadata'
  }

  /** @name FrameSupportPreimagesBounded (318) */
  interface FrameSupportPreimagesBounded extends Enum {
    readonly isLegacy: boolean
    readonly asLegacy: {
      readonly hash_: H256
    } & Struct
    readonly isInline: boolean
    readonly asInline: Bytes
    readonly isLookup: boolean
    readonly asLookup: {
      readonly hash_: H256
      readonly len: u32
    } & Struct
    readonly type: 'Legacy' | 'Inline' | 'Lookup'
  }

  /** @name PalletDemocracyConviction (320) */
  interface PalletDemocracyConviction extends Enum {
    readonly isNone: boolean
    readonly isLocked1x: boolean
    readonly isLocked2x: boolean
    readonly isLocked3x: boolean
    readonly isLocked4x: boolean
    readonly isLocked5x: boolean
    readonly isLocked6x: boolean
    readonly type: 'None' | 'Locked1x' | 'Locked2x' | 'Locked3x' | 'Locked4x' | 'Locked5x' | 'Locked6x'
  }

  /** @name PalletCollectiveCall (322) */
  interface PalletCollectiveCall extends Enum {
    readonly isSetMembers: boolean
    readonly asSetMembers: {
      readonly newMembers: Vec<AccountId32>
      readonly prime: Option<AccountId32>
      readonly oldCount: u32
    } & Struct
    readonly isExecute: boolean
    readonly asExecute: {
      readonly proposal: Call
      readonly lengthBound: Compact<u32>
    } & Struct
    readonly isPropose: boolean
    readonly asPropose: {
      readonly threshold: Compact<u32>
      readonly proposal: Call
      readonly lengthBound: Compact<u32>
    } & Struct
    readonly isVote: boolean
    readonly asVote: {
      readonly proposal: H256
      readonly index: Compact<u32>
      readonly approve: bool
    } & Struct
    readonly isDisapproveProposal: boolean
    readonly asDisapproveProposal: {
      readonly proposalHash: H256
    } & Struct
    readonly isClose: boolean
    readonly asClose: {
      readonly proposalHash: H256
      readonly index: Compact<u32>
      readonly proposalWeightBound: SpWeightsWeightV2Weight
      readonly lengthBound: Compact<u32>
    } & Struct
    readonly type: 'SetMembers' | 'Execute' | 'Propose' | 'Vote' | 'DisapproveProposal' | 'Close'
  }

  /** @name PalletTreasuryCall (324) */
  interface PalletTreasuryCall extends Enum {
    readonly isProposeSpend: boolean
    readonly asProposeSpend: {
      readonly value: Compact<u128>
      readonly beneficiary: MultiAddress
    } & Struct
    readonly isRejectProposal: boolean
    readonly asRejectProposal: {
      readonly proposalId: Compact<u32>
    } & Struct
    readonly isApproveProposal: boolean
    readonly asApproveProposal: {
      readonly proposalId: Compact<u32>
    } & Struct
    readonly isSpend: boolean
    readonly asSpend: {
      readonly amount: Compact<u128>
      readonly beneficiary: MultiAddress
    } & Struct
    readonly isRemoveApproval: boolean
    readonly asRemoveApproval: {
      readonly proposalId: Compact<u32>
    } & Struct
    readonly type: 'ProposeSpend' | 'RejectProposal' | 'ApproveProposal' | 'Spend' | 'RemoveApproval'
  }

  /** @name PalletPreimageCall (325) */
  interface PalletPreimageCall extends Enum {
    readonly isNotePreimage: boolean
    readonly asNotePreimage: {
      readonly bytes: Bytes
    } & Struct
    readonly isUnnotePreimage: boolean
    readonly asUnnotePreimage: {
      readonly hash_: H256
    } & Struct
    readonly isRequestPreimage: boolean
    readonly asRequestPreimage: {
      readonly hash_: H256
    } & Struct
    readonly isUnrequestPreimage: boolean
    readonly asUnrequestPreimage: {
      readonly hash_: H256
    } & Struct
    readonly type: 'NotePreimage' | 'UnnotePreimage' | 'RequestPreimage' | 'UnrequestPreimage'
  }

  /** @name PalletSudoCall (326) */
  interface PalletSudoCall extends Enum {
    readonly isSudo: boolean
    readonly asSudo: {
      readonly call: Call
    } & Struct
    readonly isSudoUncheckedWeight: boolean
    readonly asSudoUncheckedWeight: {
      readonly call: Call
      readonly weight: SpWeightsWeightV2Weight
    } & Struct
    readonly isSetKey: boolean
    readonly asSetKey: {
      readonly new_: MultiAddress
    } & Struct
    readonly isSudoAs: boolean
    readonly asSudoAs: {
      readonly who: MultiAddress
      readonly call: Call
    } & Struct
    readonly type: 'Sudo' | 'SudoUncheckedWeight' | 'SetKey' | 'SudoAs'
  }

  /** @name PalletStaticPriceProviderCall (327) */
  interface PalletStaticPriceProviderCall extends Enum {
    readonly isForceSetPrice: boolean
    readonly asForceSetPrice: {
      readonly price: u64
    } & Struct
    readonly type: 'ForceSetPrice'
  }

  /** @name ShibuyaRuntimeOriginCaller (328) */
  interface ShibuyaRuntimeOriginCaller extends Enum {
    readonly isVoid: boolean
    readonly isSystem: boolean
    readonly asSystem: FrameSupportDispatchRawOrigin
    readonly isPolkadotXcm: boolean
    readonly asPolkadotXcm: PalletXcmOrigin
    readonly isCumulusXcm: boolean
    readonly asCumulusXcm: CumulusPalletXcmOrigin
    readonly isEthereum: boolean
    readonly asEthereum: PalletEthereumRawOrigin
    readonly isEthereumChecked: boolean
    readonly asEthereumChecked: PalletEthereumCheckedRawOrigin
    readonly isCouncil: boolean
    readonly asCouncil: PalletCollectiveRawOrigin
    readonly isTechnicalCommittee: boolean
    readonly asTechnicalCommittee: PalletCollectiveRawOrigin
    readonly type:
      | 'Void'
      | 'System'
      | 'PolkadotXcm'
      | 'CumulusXcm'
      | 'Ethereum'
      | 'EthereumChecked'
      | 'Council'
      | 'TechnicalCommittee'
  }

  /** @name FrameSupportDispatchRawOrigin (329) */
  interface FrameSupportDispatchRawOrigin extends Enum {
    readonly isRoot: boolean
    readonly isSigned: boolean
    readonly asSigned: AccountId32
    readonly isNone: boolean
    readonly type: 'Root' | 'Signed' | 'None'
  }

  /** @name PalletXcmOrigin (330) */
  interface PalletXcmOrigin extends Enum {
    readonly isXcm: boolean
    readonly asXcm: XcmV3MultiLocation
    readonly isResponse: boolean
    readonly asResponse: XcmV3MultiLocation
    readonly type: 'Xcm' | 'Response'
  }

  /** @name CumulusPalletXcmOrigin (331) */
  interface CumulusPalletXcmOrigin extends Enum {
    readonly isRelay: boolean
    readonly isSiblingParachain: boolean
    readonly asSiblingParachain: u32
    readonly type: 'Relay' | 'SiblingParachain'
  }

  /** @name PalletEthereumRawOrigin (332) */
  interface PalletEthereumRawOrigin extends Enum {
    readonly isEthereumTransaction: boolean
    readonly asEthereumTransaction: H160
    readonly type: 'EthereumTransaction'
  }

  /** @name PalletEthereumCheckedRawOrigin (333) */
  interface PalletEthereumCheckedRawOrigin extends Enum {
    readonly isXcmEthereumTx: boolean
    readonly asXcmEthereumTx: AccountId32
    readonly type: 'XcmEthereumTx'
  }

  /** @name PalletCollectiveRawOrigin (334) */
  interface PalletCollectiveRawOrigin extends Enum {
    readonly isMembers: boolean
    readonly asMembers: ITuple<[u32, u32]>
    readonly isMember: boolean
    readonly asMember: AccountId32
    readonly isPhantom: boolean
    readonly type: 'Members' | 'Member' | 'Phantom'
  }

  /** @name SpCoreVoid (336) */
  type SpCoreVoid = Null

  /** @name PalletUtilityError (337) */
  interface PalletUtilityError extends Enum {
    readonly isTooManyCalls: boolean
    readonly type: 'TooManyCalls'
  }

  /** @name PalletIdentityRegistration (338) */
  interface PalletIdentityRegistration extends Struct {
    readonly judgements: Vec<ITuple<[u32, PalletIdentityJudgement]>>
    readonly deposit: u128
    readonly info: PalletIdentityIdentityInfo
  }

  /** @name PalletIdentityRegistrarInfo (346) */
  interface PalletIdentityRegistrarInfo extends Struct {
    readonly account: AccountId32
    readonly fee: u128
    readonly fields: PalletIdentityBitFlags
  }

  /** @name PalletIdentityError (348) */
  interface PalletIdentityError extends Enum {
    readonly isTooManySubAccounts: boolean
    readonly isNotFound: boolean
    readonly isNotNamed: boolean
    readonly isEmptyIndex: boolean
    readonly isFeeChanged: boolean
    readonly isNoIdentity: boolean
    readonly isStickyJudgement: boolean
    readonly isJudgementGiven: boolean
    readonly isInvalidJudgement: boolean
    readonly isInvalidIndex: boolean
    readonly isInvalidTarget: boolean
    readonly isTooManyFields: boolean
    readonly isTooManyRegistrars: boolean
    readonly isAlreadyClaimed: boolean
    readonly isNotSub: boolean
    readonly isNotOwned: boolean
    readonly isJudgementForDifferentIdentity: boolean
    readonly isJudgementPaymentFailed: boolean
    readonly type:
      | 'TooManySubAccounts'
      | 'NotFound'
      | 'NotNamed'
      | 'EmptyIndex'
      | 'FeeChanged'
      | 'NoIdentity'
      | 'StickyJudgement'
      | 'JudgementGiven'
      | 'InvalidJudgement'
      | 'InvalidIndex'
      | 'InvalidTarget'
      | 'TooManyFields'
      | 'TooManyRegistrars'
      | 'AlreadyClaimed'
      | 'NotSub'
      | 'NotOwned'
      | 'JudgementForDifferentIdentity'
      | 'JudgementPaymentFailed'
  }

  /** @name PalletMultisigMultisig (350) */
  interface PalletMultisigMultisig extends Struct {
    readonly when: PalletMultisigTimepoint
    readonly deposit: u128
    readonly depositor: AccountId32
    readonly approvals: Vec<AccountId32>
  }

  /** @name PalletMultisigError (352) */
  interface PalletMultisigError extends Enum {
    readonly isMinimumThreshold: boolean
    readonly isAlreadyApproved: boolean
    readonly isNoApprovalsNeeded: boolean
    readonly isTooFewSignatories: boolean
    readonly isTooManySignatories: boolean
    readonly isSignatoriesOutOfOrder: boolean
    readonly isSenderInSignatories: boolean
    readonly isNotFound: boolean
    readonly isNotOwner: boolean
    readonly isNoTimepoint: boolean
    readonly isWrongTimepoint: boolean
    readonly isUnexpectedTimepoint: boolean
    readonly isMaxWeightTooLow: boolean
    readonly isAlreadyStored: boolean
    readonly type:
      | 'MinimumThreshold'
      | 'AlreadyApproved'
      | 'NoApprovalsNeeded'
      | 'TooFewSignatories'
      | 'TooManySignatories'
      | 'SignatoriesOutOfOrder'
      | 'SenderInSignatories'
      | 'NotFound'
      | 'NotOwner'
      | 'NoTimepoint'
      | 'WrongTimepoint'
      | 'UnexpectedTimepoint'
      | 'MaxWeightTooLow'
      | 'AlreadyStored'
  }

  /** @name PalletSchedulerScheduled (356) */
  interface PalletSchedulerScheduled extends Struct {
    readonly maybeId: Option<U8aFixed>
    readonly priority: u8
    readonly call: FrameSupportPreimagesBounded
    readonly maybePeriodic: Option<ITuple<[u32, u32]>>
    readonly origin: ShibuyaRuntimeOriginCaller
  }

  /** @name PalletSchedulerError (358) */
  interface PalletSchedulerError extends Enum {
    readonly isFailedToSchedule: boolean
    readonly isNotFound: boolean
    readonly isTargetBlockNumberInPast: boolean
    readonly isRescheduleNoChange: boolean
    readonly isNamed: boolean
    readonly type: 'FailedToSchedule' | 'NotFound' | 'TargetBlockNumberInPast' | 'RescheduleNoChange' | 'Named'
  }

  /** @name PalletProxyProxyDefinition (361) */
  interface PalletProxyProxyDefinition extends Struct {
    readonly delegate: AccountId32
    readonly proxyType: ShibuyaRuntimeProxyType
    readonly delay: u32
  }

  /** @name PalletProxyAnnouncement (365) */
  interface PalletProxyAnnouncement extends Struct {
    readonly real: AccountId32
    readonly callHash: H256
    readonly height: u32
  }

  /** @name PalletProxyError (367) */
  interface PalletProxyError extends Enum {
    readonly isTooMany: boolean
    readonly isNotFound: boolean
    readonly isNotProxy: boolean
    readonly isUnproxyable: boolean
    readonly isDuplicate: boolean
    readonly isNoPermission: boolean
    readonly isUnannounced: boolean
    readonly isNoSelfProxy: boolean
    readonly type:
      | 'TooMany'
      | 'NotFound'
      | 'NotProxy'
      | 'Unproxyable'
      | 'Duplicate'
      | 'NoPermission'
      | 'Unannounced'
      | 'NoSelfProxy'
  }

  /** @name PolkadotPrimitivesV4UpgradeRestriction (369) */
  interface PolkadotPrimitivesV4UpgradeRestriction extends Enum {
    readonly isPresent: boolean
    readonly type: 'Present'
  }

  /** @name CumulusPalletParachainSystemRelayStateSnapshotMessagingStateSnapshot (370) */
  interface CumulusPalletParachainSystemRelayStateSnapshotMessagingStateSnapshot extends Struct {
    readonly dmqMqcHead: H256
    readonly relayDispatchQueueSize: CumulusPalletParachainSystemRelayStateSnapshotRelayDispachQueueSize
    readonly ingressChannels: Vec<ITuple<[u32, PolkadotPrimitivesV4AbridgedHrmpChannel]>>
    readonly egressChannels: Vec<ITuple<[u32, PolkadotPrimitivesV4AbridgedHrmpChannel]>>
  }

  /** @name CumulusPalletParachainSystemRelayStateSnapshotRelayDispachQueueSize (371) */
  interface CumulusPalletParachainSystemRelayStateSnapshotRelayDispachQueueSize extends Struct {
    readonly remainingCount: u32
    readonly remainingSize: u32
  }

  /** @name PolkadotPrimitivesV4AbridgedHrmpChannel (374) */
  interface PolkadotPrimitivesV4AbridgedHrmpChannel extends Struct {
    readonly maxCapacity: u32
    readonly maxTotalSize: u32
    readonly maxMessageSize: u32
    readonly msgCount: u32
    readonly totalSize: u32
    readonly mqcHead: Option<H256>
  }

  /** @name PolkadotPrimitivesV4AbridgedHostConfiguration (375) */
  interface PolkadotPrimitivesV4AbridgedHostConfiguration extends Struct {
    readonly maxCodeSize: u32
    readonly maxHeadDataSize: u32
    readonly maxUpwardQueueCount: u32
    readonly maxUpwardQueueSize: u32
    readonly maxUpwardMessageSize: u32
    readonly maxUpwardMessageNumPerCandidate: u32
    readonly hrmpMaxMessageNumPerCandidate: u32
    readonly validationUpgradeCooldown: u32
    readonly validationUpgradeDelay: u32
  }

  /** @name PolkadotCorePrimitivesOutboundHrmpMessage (381) */
  interface PolkadotCorePrimitivesOutboundHrmpMessage extends Struct {
    readonly recipient: u32
    readonly data: Bytes
  }

  /** @name CumulusPalletParachainSystemCodeUpgradeAuthorization (382) */
  interface CumulusPalletParachainSystemCodeUpgradeAuthorization extends Struct {
    readonly codeHash: H256
    readonly checkVersion: bool
  }

  /** @name CumulusPalletParachainSystemError (383) */
  interface CumulusPalletParachainSystemError extends Enum {
    readonly isOverlappingUpgrades: boolean
    readonly isProhibitedByPolkadot: boolean
    readonly isTooBig: boolean
    readonly isValidationDataNotAvailable: boolean
    readonly isHostConfigurationNotAvailable: boolean
    readonly isNotScheduled: boolean
    readonly isNothingAuthorized: boolean
    readonly isUnauthorized: boolean
    readonly type:
      | 'OverlappingUpgrades'
      | 'ProhibitedByPolkadot'
      | 'TooBig'
      | 'ValidationDataNotAvailable'
      | 'HostConfigurationNotAvailable'
      | 'NotScheduled'
      | 'NothingAuthorized'
      | 'Unauthorized'
  }

  /** @name PalletTransactionPaymentReleases (385) */
  interface PalletTransactionPaymentReleases extends Enum {
    readonly isV1Ancient: boolean
    readonly isV2: boolean
    readonly type: 'V1Ancient' | 'V2'
  }

  /** @name PalletBalancesBalanceLock (387) */
  interface PalletBalancesBalanceLock extends Struct {
    readonly id: U8aFixed
    readonly amount: u128
    readonly reasons: PalletBalancesReasons
  }

  /** @name PalletBalancesReasons (388) */
  interface PalletBalancesReasons extends Enum {
    readonly isFee: boolean
    readonly isMisc: boolean
    readonly isAll: boolean
    readonly type: 'Fee' | 'Misc' | 'All'
  }

  /** @name PalletBalancesReserveData (391) */
  interface PalletBalancesReserveData extends Struct {
    readonly id: U8aFixed
    readonly amount: u128
  }

  /** @name PalletBalancesIdAmount (397) */
  interface PalletBalancesIdAmount extends Struct {
    readonly id: ShibuyaRuntimeRuntimeFreezeReason
    readonly amount: u128
  }

  /** @name ShibuyaRuntimeRuntimeFreezeReason (398) */
  interface ShibuyaRuntimeRuntimeFreezeReason extends Enum {
    readonly isDappStaking: boolean
    readonly asDappStaking: PalletDappStakingV3FreezeReason
    readonly type: 'DappStaking'
  }

  /** @name PalletDappStakingV3FreezeReason (399) */
  interface PalletDappStakingV3FreezeReason extends Enum {
    readonly isDAppStaking: boolean
    readonly type: 'DAppStaking'
  }

  /** @name PalletBalancesError (401) */
  interface PalletBalancesError extends Enum {
    readonly isVestingBalance: boolean
    readonly isLiquidityRestrictions: boolean
    readonly isInsufficientBalance: boolean
    readonly isExistentialDeposit: boolean
    readonly isExpendability: boolean
    readonly isExistingVestingSchedule: boolean
    readonly isDeadAccount: boolean
    readonly isTooManyReserves: boolean
    readonly isTooManyHolds: boolean
    readonly isTooManyFreezes: boolean
    readonly type:
      | 'VestingBalance'
      | 'LiquidityRestrictions'
      | 'InsufficientBalance'
      | 'ExistentialDeposit'
      | 'Expendability'
      | 'ExistingVestingSchedule'
      | 'DeadAccount'
      | 'TooManyReserves'
      | 'TooManyHolds'
      | 'TooManyFreezes'
  }

  /** @name PalletVestingReleases (404) */
  interface PalletVestingReleases extends Enum {
    readonly isV0: boolean
    readonly isV1: boolean
    readonly type: 'V0' | 'V1'
  }

  /** @name PalletVestingError (405) */
  interface PalletVestingError extends Enum {
    readonly isNotVesting: boolean
    readonly isAtMaxVestingSchedules: boolean
    readonly isAmountLow: boolean
    readonly isScheduleIndexOutOfBounds: boolean
    readonly isInvalidScheduleParams: boolean
    readonly type:
      | 'NotVesting'
      | 'AtMaxVestingSchedules'
      | 'AmountLow'
      | 'ScheduleIndexOutOfBounds'
      | 'InvalidScheduleParams'
  }

  /** @name PalletDappStakingV3ProtocolState (406) */
  interface PalletDappStakingV3ProtocolState extends Struct {
    readonly era: Compact<u32>
    readonly nextEraStart: Compact<u32>
    readonly periodInfo: PalletDappStakingV3PeriodInfo
    readonly maintenance: bool
  }

  /** @name PalletDappStakingV3PeriodInfo (407) */
  interface PalletDappStakingV3PeriodInfo extends Struct {
    readonly number: Compact<u32>
    readonly subperiod: PalletDappStakingV3Subperiod
    readonly nextSubperiodStartEra: Compact<u32>
  }

  /** @name PalletDappStakingV3DAppInfo (408) */
  interface PalletDappStakingV3DAppInfo extends Struct {
    readonly owner: AccountId32
    readonly id: Compact<u16>
    readonly state: PalletDappStakingV3DAppState
    readonly rewardBeneficiary: Option<AccountId32>
  }

  /** @name PalletDappStakingV3DAppState (409) */
  interface PalletDappStakingV3DAppState extends Enum {
    readonly isRegistered: boolean
    readonly isUnregistered: boolean
    readonly asUnregistered: Compact<u32>
    readonly type: 'Registered' | 'Unregistered'
  }

  /** @name PalletDappStakingV3AccountLedger (410) */
  interface PalletDappStakingV3AccountLedger extends Struct {
    readonly locked: Compact<u128>
    readonly unlocking: Vec<PalletDappStakingV3UnlockingChunk>
    readonly staked: PalletDappStakingV3StakeAmount
    readonly stakedFuture: Option<PalletDappStakingV3StakeAmount>
    readonly contractStakeCount: Compact<u32>
  }

  /** @name PalletDappStakingV3UnlockingChunk (412) */
  interface PalletDappStakingV3UnlockingChunk extends Struct {
    readonly amount: Compact<u128>
    readonly unlockBlock: Compact<u32>
  }

  /** @name PalletDappStakingV3StakeAmount (414) */
  interface PalletDappStakingV3StakeAmount extends Struct {
    readonly voting: Compact<u128>
    readonly buildAndEarn: Compact<u128>
    readonly era: Compact<u32>
    readonly period: Compact<u32>
  }

  /** @name PalletDappStakingV3SingularStakingInfo (417) */
  interface PalletDappStakingV3SingularStakingInfo extends Struct {
    readonly staked: PalletDappStakingV3StakeAmount
    readonly loyalStaker: bool
  }

  /** @name PalletDappStakingV3ContractStakeAmount (418) */
  interface PalletDappStakingV3ContractStakeAmount extends Struct {
    readonly staked: PalletDappStakingV3StakeAmount
    readonly stakedFuture: Option<PalletDappStakingV3StakeAmount>
  }

  /** @name PalletDappStakingV3EraInfo (419) */
  interface PalletDappStakingV3EraInfo extends Struct {
    readonly totalLocked: Compact<u128>
    readonly unlocking: Compact<u128>
    readonly currentStakeAmount: PalletDappStakingV3StakeAmount
    readonly nextStakeAmount: PalletDappStakingV3StakeAmount
  }

  /** @name PalletDappStakingV3EraRewardSpan (420) */
  interface PalletDappStakingV3EraRewardSpan extends Struct {
    readonly span: Vec<PalletDappStakingV3EraReward>
    readonly firstEra: Compact<u32>
    readonly lastEra: Compact<u32>
  }

  /** @name PalletDappStakingV3EraReward (422) */
  interface PalletDappStakingV3EraReward extends Struct {
    readonly stakerRewardPool: Compact<u128>
    readonly staked: Compact<u128>
    readonly dappRewardPool: Compact<u128>
  }

  /** @name PalletDappStakingV3PeriodEndInfo (424) */
  interface PalletDappStakingV3PeriodEndInfo extends Struct {
    readonly bonusRewardPool: Compact<u128>
    readonly totalVpStake: Compact<u128>
    readonly finalEra: Compact<u32>
  }

  /** @name PalletDappStakingV3DAppTierRewards (425) */
  interface PalletDappStakingV3DAppTierRewards extends Struct {
    readonly dapps: BTreeMap<u16, u8>
    readonly rewards: Vec<u128>
    readonly period: Compact<u32>
  }

  /** @name PalletDappStakingV3CleanupMarker (432) */
  interface PalletDappStakingV3CleanupMarker extends Struct {
    readonly eraRewardIndex: Compact<u32>
    readonly dappTiersIndex: Compact<u32>
    readonly oldestValidEra: Compact<u32>
  }

  /** @name PalletDappStakingV3Error (433) */
  interface PalletDappStakingV3Error extends Enum {
    readonly isDisabled: boolean
    readonly isContractAlreadyExists: boolean
    readonly isExceededMaxNumberOfContracts: boolean
    readonly isNewDAppIdUnavailable: boolean
    readonly isContractNotFound: boolean
    readonly isOriginNotOwner: boolean
    readonly isNotOperatedDApp: boolean
    readonly isZeroAmount: boolean
    readonly isLockedAmountBelowThreshold: boolean
    readonly isTooManyUnlockingChunks: boolean
    readonly isRemainingStakePreventsFullUnlock: boolean
    readonly isNoUnlockedChunksToClaim: boolean
    readonly isNoUnlockingChunks: boolean
    readonly isUnavailableStakeFunds: boolean
    readonly isUnclaimedRewards: boolean
    readonly isInternalStakeError: boolean
    readonly isInsufficientStakeAmount: boolean
    readonly isPeriodEndsInNextEra: boolean
    readonly isUnstakeFromPastPeriod: boolean
    readonly isUnstakeAmountTooLarge: boolean
    readonly isNoStakingInfo: boolean
    readonly isInternalUnstakeError: boolean
    readonly isRewardExpired: boolean
    readonly isRewardPayoutFailed: boolean
    readonly isNoClaimableRewards: boolean
    readonly isInternalClaimStakerError: boolean
    readonly isNotEligibleForBonusReward: boolean
    readonly isInternalClaimBonusError: boolean
    readonly isInvalidClaimEra: boolean
    readonly isNoDAppTierInfo: boolean
    readonly isInternalClaimDAppError: boolean
    readonly isContractStillActive: boolean
    readonly isTooManyStakedContracts: boolean
    readonly isNoExpiredEntries: boolean
    readonly isInvalidTierParameters: boolean
    readonly type:
      | 'Disabled'
      | 'ContractAlreadyExists'
      | 'ExceededMaxNumberOfContracts'
      | 'NewDAppIdUnavailable'
      | 'ContractNotFound'
      | 'OriginNotOwner'
      | 'NotOperatedDApp'
      | 'ZeroAmount'
      | 'LockedAmountBelowThreshold'
      | 'TooManyUnlockingChunks'
      | 'RemainingStakePreventsFullUnlock'
      | 'NoUnlockedChunksToClaim'
      | 'NoUnlockingChunks'
      | 'UnavailableStakeFunds'
      | 'UnclaimedRewards'
      | 'InternalStakeError'
      | 'InsufficientStakeAmount'
      | 'PeriodEndsInNextEra'
      | 'UnstakeFromPastPeriod'
      | 'UnstakeAmountTooLarge'
      | 'NoStakingInfo'
      | 'InternalUnstakeError'
      | 'RewardExpired'
      | 'RewardPayoutFailed'
      | 'NoClaimableRewards'
      | 'InternalClaimStakerError'
      | 'NotEligibleForBonusReward'
      | 'InternalClaimBonusError'
      | 'InvalidClaimEra'
      | 'NoDAppTierInfo'
      | 'InternalClaimDAppError'
      | 'ContractStillActive'
      | 'TooManyStakedContracts'
      | 'NoExpiredEntries'
      | 'InvalidTierParameters'
  }

  /** @name PalletInflationError (434) */
  interface PalletInflationError extends Enum {
    readonly isInvalidInflationParameters: boolean
    readonly type: 'InvalidInflationParameters'
  }

  /** @name PalletAssetsAssetDetails (435) */
  interface PalletAssetsAssetDetails extends Struct {
    readonly owner: AccountId32
    readonly issuer: AccountId32
    readonly admin: AccountId32
    readonly freezer: AccountId32
    readonly supply: u128
    readonly deposit: u128
    readonly minBalance: u128
    readonly isSufficient: bool
    readonly accounts: u32
    readonly sufficients: u32
    readonly approvals: u32
    readonly status: PalletAssetsAssetStatus
  }

  /** @name PalletAssetsAssetStatus (436) */
  interface PalletAssetsAssetStatus extends Enum {
    readonly isLive: boolean
    readonly isFrozen: boolean
    readonly isDestroying: boolean
    readonly type: 'Live' | 'Frozen' | 'Destroying'
  }

  /** @name PalletAssetsAssetAccount (438) */
  interface PalletAssetsAssetAccount extends Struct {
    readonly balance: u128
    readonly status: PalletAssetsAccountStatus
    readonly reason: PalletAssetsExistenceReason
    readonly extra: Null
  }

  /** @name PalletAssetsAccountStatus (439) */
  interface PalletAssetsAccountStatus extends Enum {
    readonly isLiquid: boolean
    readonly isFrozen: boolean
    readonly isBlocked: boolean
    readonly type: 'Liquid' | 'Frozen' | 'Blocked'
  }

  /** @name PalletAssetsExistenceReason (440) */
  interface PalletAssetsExistenceReason extends Enum {
    readonly isConsumer: boolean
    readonly isSufficient: boolean
    readonly isDepositHeld: boolean
    readonly asDepositHeld: u128
    readonly isDepositRefunded: boolean
    readonly isDepositFrom: boolean
    readonly asDepositFrom: ITuple<[AccountId32, u128]>
    readonly type: 'Consumer' | 'Sufficient' | 'DepositHeld' | 'DepositRefunded' | 'DepositFrom'
  }

  /** @name PalletAssetsApproval (442) */
  interface PalletAssetsApproval extends Struct {
    readonly amount: u128
    readonly deposit: u128
  }

  /** @name PalletAssetsAssetMetadata (443) */
  interface PalletAssetsAssetMetadata extends Struct {
    readonly deposit: u128
    readonly name: Bytes
    readonly symbol: Bytes
    readonly decimals: u8
    readonly isFrozen: bool
  }

  /** @name PalletAssetsError (445) */
  interface PalletAssetsError extends Enum {
    readonly isBalanceLow: boolean
    readonly isNoAccount: boolean
    readonly isNoPermission: boolean
    readonly isUnknown: boolean
    readonly isFrozen: boolean
    readonly isInUse: boolean
    readonly isBadWitness: boolean
    readonly isMinBalanceZero: boolean
    readonly isUnavailableConsumer: boolean
    readonly isBadMetadata: boolean
    readonly isUnapproved: boolean
    readonly isWouldDie: boolean
    readonly isAlreadyExists: boolean
    readonly isNoDeposit: boolean
    readonly isWouldBurn: boolean
    readonly isLiveAsset: boolean
    readonly isAssetNotLive: boolean
    readonly isIncorrectStatus: boolean
    readonly isNotFrozen: boolean
    readonly isCallbackFailed: boolean
    readonly type:
      | 'BalanceLow'
      | 'NoAccount'
      | 'NoPermission'
      | 'Unknown'
      | 'Frozen'
      | 'InUse'
      | 'BadWitness'
      | 'MinBalanceZero'
      | 'UnavailableConsumer'
      | 'BadMetadata'
      | 'Unapproved'
      | 'WouldDie'
      | 'AlreadyExists'
      | 'NoDeposit'
      | 'WouldBurn'
      | 'LiveAsset'
      | 'AssetNotLive'
      | 'IncorrectStatus'
      | 'NotFrozen'
      | 'CallbackFailed'
  }

  /** @name PalletCollatorSelectionCandidateInfo (447) */
  interface PalletCollatorSelectionCandidateInfo extends Struct {
    readonly who: AccountId32
    readonly deposit: u128
  }

  /** @name PalletCollatorSelectionError (448) */
  interface PalletCollatorSelectionError extends Enum {
    readonly isTooManyCandidates: boolean
    readonly isTooFewCandidates: boolean
    readonly isUnknown: boolean
    readonly isPermission: boolean
    readonly isAlreadyCandidate: boolean
    readonly isNotCandidate: boolean
    readonly isAlreadyInvulnerable: boolean
    readonly isNoAssociatedValidatorId: boolean
    readonly isValidatorNotRegistered: boolean
    readonly type:
      | 'TooManyCandidates'
      | 'TooFewCandidates'
      | 'Unknown'
      | 'Permission'
      | 'AlreadyCandidate'
      | 'NotCandidate'
      | 'AlreadyInvulnerable'
      | 'NoAssociatedValidatorId'
      | 'ValidatorNotRegistered'
  }

  /** @name SpCoreCryptoKeyTypeId (453) */
  interface SpCoreCryptoKeyTypeId extends U8aFixed {}

  /** @name PalletSessionError (454) */
  interface PalletSessionError extends Enum {
    readonly isInvalidProof: boolean
    readonly isNoAssociatedValidatorId: boolean
    readonly isDuplicatedKey: boolean
    readonly isNoKeys: boolean
    readonly isNoAccount: boolean
    readonly type: 'InvalidProof' | 'NoAssociatedValidatorId' | 'DuplicatedKey' | 'NoKeys' | 'NoAccount'
  }

  /** @name CumulusPalletXcmpQueueInboundChannelDetails (459) */
  interface CumulusPalletXcmpQueueInboundChannelDetails extends Struct {
    readonly sender: u32
    readonly state: CumulusPalletXcmpQueueInboundState
    readonly messageMetadata: Vec<ITuple<[u32, PolkadotParachainPrimitivesXcmpMessageFormat]>>
  }

  /** @name CumulusPalletXcmpQueueInboundState (460) */
  interface CumulusPalletXcmpQueueInboundState extends Enum {
    readonly isOk: boolean
    readonly isSuspended: boolean
    readonly type: 'Ok' | 'Suspended'
  }

  /** @name PolkadotParachainPrimitivesXcmpMessageFormat (463) */
  interface PolkadotParachainPrimitivesXcmpMessageFormat extends Enum {
    readonly isConcatenatedVersionedXcm: boolean
    readonly isConcatenatedEncodedBlob: boolean
    readonly isSignals: boolean
    readonly type: 'ConcatenatedVersionedXcm' | 'ConcatenatedEncodedBlob' | 'Signals'
  }

  /** @name CumulusPalletXcmpQueueOutboundChannelDetails (466) */
  interface CumulusPalletXcmpQueueOutboundChannelDetails extends Struct {
    readonly recipient: u32
    readonly state: CumulusPalletXcmpQueueOutboundState
    readonly signalsExist: bool
    readonly firstIndex: u16
    readonly lastIndex: u16
  }

  /** @name CumulusPalletXcmpQueueOutboundState (467) */
  interface CumulusPalletXcmpQueueOutboundState extends Enum {
    readonly isOk: boolean
    readonly isSuspended: boolean
    readonly type: 'Ok' | 'Suspended'
  }

  /** @name CumulusPalletXcmpQueueQueueConfigData (469) */
  interface CumulusPalletXcmpQueueQueueConfigData extends Struct {
    readonly suspendThreshold: u32
    readonly dropThreshold: u32
    readonly resumeThreshold: u32
    readonly thresholdWeight: SpWeightsWeightV2Weight
    readonly weightRestrictDecay: SpWeightsWeightV2Weight
    readonly xcmpMaxIndividualWeight: SpWeightsWeightV2Weight
  }

  /** @name CumulusPalletXcmpQueueError (471) */
  interface CumulusPalletXcmpQueueError extends Enum {
    readonly isFailedToSend: boolean
    readonly isBadXcmOrigin: boolean
    readonly isBadXcm: boolean
    readonly isBadOverweightIndex: boolean
    readonly isWeightOverLimit: boolean
    readonly type: 'FailedToSend' | 'BadXcmOrigin' | 'BadXcm' | 'BadOverweightIndex' | 'WeightOverLimit'
  }

  /** @name PalletXcmQueryStatus (472) */
  interface PalletXcmQueryStatus extends Enum {
    readonly isPending: boolean
    readonly asPending: {
      readonly responder: XcmVersionedMultiLocation
      readonly maybeMatchQuerier: Option<XcmVersionedMultiLocation>
      readonly maybeNotify: Option<ITuple<[u8, u8]>>
      readonly timeout: u32
    } & Struct
    readonly isVersionNotifier: boolean
    readonly asVersionNotifier: {
      readonly origin: XcmVersionedMultiLocation
      readonly isActive: bool
    } & Struct
    readonly isReady: boolean
    readonly asReady: {
      readonly response: XcmVersionedResponse
      readonly at: u32
    } & Struct
    readonly type: 'Pending' | 'VersionNotifier' | 'Ready'
  }

  /** @name XcmVersionedResponse (476) */
  interface XcmVersionedResponse extends Enum {
    readonly isV2: boolean
    readonly asV2: XcmV2Response
    readonly isV3: boolean
    readonly asV3: XcmV3Response
    readonly type: 'V2' | 'V3'
  }

  /** @name PalletXcmVersionMigrationStage (482) */
  interface PalletXcmVersionMigrationStage extends Enum {
    readonly isMigrateSupportedVersion: boolean
    readonly isMigrateVersionNotifiers: boolean
    readonly isNotifyCurrentTargets: boolean
    readonly asNotifyCurrentTargets: Option<Bytes>
    readonly isMigrateAndNotifyOldTargets: boolean
    readonly type:
      | 'MigrateSupportedVersion'
      | 'MigrateVersionNotifiers'
      | 'NotifyCurrentTargets'
      | 'MigrateAndNotifyOldTargets'
  }

  /** @name XcmVersionedAssetId (485) */
  interface XcmVersionedAssetId extends Enum {
    readonly isV3: boolean
    readonly asV3: XcmV3MultiassetAssetId
    readonly type: 'V3'
  }

  /** @name PalletXcmRemoteLockedFungibleRecord (486) */
  interface PalletXcmRemoteLockedFungibleRecord extends Struct {
    readonly amount: u128
    readonly owner: XcmVersionedMultiLocation
    readonly locker: XcmVersionedMultiLocation
    readonly consumers: Vec<ITuple<[Null, u128]>>
  }

  /** @name PalletXcmError (493) */
  interface PalletXcmError extends Enum {
    readonly isUnreachable: boolean
    readonly isSendFailure: boolean
    readonly isFiltered: boolean
    readonly isUnweighableMessage: boolean
    readonly isDestinationNotInvertible: boolean
    readonly isEmpty: boolean
    readonly isCannotReanchor: boolean
    readonly isTooManyAssets: boolean
    readonly isInvalidOrigin: boolean
    readonly isBadVersion: boolean
    readonly isBadLocation: boolean
    readonly isNoSubscription: boolean
    readonly isAlreadySubscribed: boolean
    readonly isInvalidAsset: boolean
    readonly isLowBalance: boolean
    readonly isTooManyLocks: boolean
    readonly isAccountNotSovereign: boolean
    readonly isFeesNotMet: boolean
    readonly isLockNotFound: boolean
    readonly isInUse: boolean
    readonly type:
      | 'Unreachable'
      | 'SendFailure'
      | 'Filtered'
      | 'UnweighableMessage'
      | 'DestinationNotInvertible'
      | 'Empty'
      | 'CannotReanchor'
      | 'TooManyAssets'
      | 'InvalidOrigin'
      | 'BadVersion'
      | 'BadLocation'
      | 'NoSubscription'
      | 'AlreadySubscribed'
      | 'InvalidAsset'
      | 'LowBalance'
      | 'TooManyLocks'
      | 'AccountNotSovereign'
      | 'FeesNotMet'
      | 'LockNotFound'
      | 'InUse'
  }

  /** @name CumulusPalletXcmError (494) */
  type CumulusPalletXcmError = Null

  /** @name CumulusPalletDmpQueueConfigData (495) */
  interface CumulusPalletDmpQueueConfigData extends Struct {
    readonly maxIndividual: SpWeightsWeightV2Weight
  }

  /** @name CumulusPalletDmpQueuePageIndexData (496) */
  interface CumulusPalletDmpQueuePageIndexData extends Struct {
    readonly beginUsed: u32
    readonly endUsed: u32
    readonly overweightCount: u64
  }

  /** @name CumulusPalletDmpQueueError (499) */
  interface CumulusPalletDmpQueueError extends Enum {
    readonly isUnknown: boolean
    readonly isOverLimit: boolean
    readonly type: 'Unknown' | 'OverLimit'
  }

  /** @name PalletXcAssetConfigError (500) */
  interface PalletXcAssetConfigError extends Enum {
    readonly isAssetAlreadyRegistered: boolean
    readonly isAssetDoesNotExist: boolean
    readonly isMultiLocationNotSupported: boolean
    readonly type: 'AssetAlreadyRegistered' | 'AssetDoesNotExist' | 'MultiLocationNotSupported'
  }

  /** @name OrmlXtokensModuleError (501) */
  interface OrmlXtokensModuleError extends Enum {
    readonly isAssetHasNoReserve: boolean
    readonly isNotCrossChainTransfer: boolean
    readonly isInvalidDest: boolean
    readonly isNotCrossChainTransferableCurrency: boolean
    readonly isUnweighableMessage: boolean
    readonly isXcmExecutionFailed: boolean
    readonly isCannotReanchor: boolean
    readonly isInvalidAncestry: boolean
    readonly isInvalidAsset: boolean
    readonly isDestinationNotInvertible: boolean
    readonly isBadVersion: boolean
    readonly isDistinctReserveForAssetAndFee: boolean
    readonly isZeroFee: boolean
    readonly isZeroAmount: boolean
    readonly isTooManyAssetsBeingSent: boolean
    readonly isAssetIndexNonExistent: boolean
    readonly isFeeNotEnough: boolean
    readonly isNotSupportedMultiLocation: boolean
    readonly isMinXcmFeeNotDefined: boolean
    readonly type:
      | 'AssetHasNoReserve'
      | 'NotCrossChainTransfer'
      | 'InvalidDest'
      | 'NotCrossChainTransferableCurrency'
      | 'UnweighableMessage'
      | 'XcmExecutionFailed'
      | 'CannotReanchor'
      | 'InvalidAncestry'
      | 'InvalidAsset'
      | 'DestinationNotInvertible'
      | 'BadVersion'
      | 'DistinctReserveForAssetAndFee'
      | 'ZeroFee'
      | 'ZeroAmount'
      | 'TooManyAssetsBeingSent'
      | 'AssetIndexNonExistent'
      | 'FeeNotEnough'
      | 'NotSupportedMultiLocation'
      | 'MinXcmFeeNotDefined'
  }

  /** @name PalletEvmCodeMetadata (502) */
  interface PalletEvmCodeMetadata extends Struct {
    readonly size_: u64
    readonly hash_: H256
  }

  /** @name PalletEvmError (504) */
  interface PalletEvmError extends Enum {
    readonly isBalanceLow: boolean
    readonly isFeeOverflow: boolean
    readonly isPaymentOverflow: boolean
    readonly isWithdrawFailed: boolean
    readonly isGasPriceTooLow: boolean
    readonly isInvalidNonce: boolean
    readonly isGasLimitTooLow: boolean
    readonly isGasLimitTooHigh: boolean
    readonly isUndefined: boolean
    readonly isReentrancy: boolean
    readonly isTransactionMustComeFromEOA: boolean
    readonly type:
      | 'BalanceLow'
      | 'FeeOverflow'
      | 'PaymentOverflow'
      | 'WithdrawFailed'
      | 'GasPriceTooLow'
      | 'InvalidNonce'
      | 'GasLimitTooLow'
      | 'GasLimitTooHigh'
      | 'Undefined'
      | 'Reentrancy'
      | 'TransactionMustComeFromEOA'
  }

  /** @name FpRpcTransactionStatus (507) */
  interface FpRpcTransactionStatus extends Struct {
    readonly transactionHash: H256
    readonly transactionIndex: u32
    readonly from: H160
    readonly to: Option<H160>
    readonly contractAddress: Option<H160>
    readonly logs: Vec<EthereumLog>
    readonly logsBloom: EthbloomBloom
  }

  /** @name EthbloomBloom (510) */
  interface EthbloomBloom extends U8aFixed {}

  /** @name EthereumReceiptReceiptV3 (512) */
  interface EthereumReceiptReceiptV3 extends Enum {
    readonly isLegacy: boolean
    readonly asLegacy: EthereumReceiptEip658ReceiptData
    readonly isEip2930: boolean
    readonly asEip2930: EthereumReceiptEip658ReceiptData
    readonly isEip1559: boolean
    readonly asEip1559: EthereumReceiptEip658ReceiptData
    readonly type: 'Legacy' | 'Eip2930' | 'Eip1559'
  }

  /** @name EthereumReceiptEip658ReceiptData (513) */
  interface EthereumReceiptEip658ReceiptData extends Struct {
    readonly statusCode: u8
    readonly usedGas: U256
    readonly logsBloom: EthbloomBloom
    readonly logs: Vec<EthereumLog>
  }

  /** @name EthereumBlock (514) */
  interface EthereumBlock extends Struct {
    readonly header: EthereumHeader
    readonly transactions: Vec<EthereumTransactionTransactionV2>
    readonly ommers: Vec<EthereumHeader>
  }

  /** @name EthereumHeader (515) */
  interface EthereumHeader extends Struct {
    readonly parentHash: H256
    readonly ommersHash: H256
    readonly beneficiary: H160
    readonly stateRoot: H256
    readonly transactionsRoot: H256
    readonly receiptsRoot: H256
    readonly logsBloom: EthbloomBloom
    readonly difficulty: U256
    readonly number: U256
    readonly gasLimit: U256
    readonly gasUsed: U256
    readonly timestamp: u64
    readonly extraData: Bytes
    readonly mixHash: H256
    readonly nonce: EthereumTypesHashH64
  }

  /** @name EthereumTypesHashH64 (516) */
  interface EthereumTypesHashH64 extends U8aFixed {}

  /** @name PalletEthereumError (521) */
  interface PalletEthereumError extends Enum {
    readonly isInvalidSignature: boolean
    readonly isPreLogExists: boolean
    readonly type: 'InvalidSignature' | 'PreLogExists'
  }

  /** @name PalletDynamicEvmBaseFeeError (522) */
  interface PalletDynamicEvmBaseFeeError extends Enum {
    readonly isValueOutOfBounds: boolean
    readonly type: 'ValueOutOfBounds'
  }

  /** @name PalletUnifiedAccountsError (523) */
  interface PalletUnifiedAccountsError extends Enum {
    readonly isAlreadyMapped: boolean
    readonly isUnexpectedSignatureFormat: boolean
    readonly isInvalidSignature: boolean
    readonly isFundsUnavailable: boolean
    readonly type: 'AlreadyMapped' | 'UnexpectedSignatureFormat' | 'InvalidSignature' | 'FundsUnavailable'
  }

  /** @name PalletContractsWasmPrefabWasmModule (525) */
  interface PalletContractsWasmPrefabWasmModule extends Struct {
    readonly instructionWeightsVersion: Compact<u32>
    readonly initial: Compact<u32>
    readonly maximum: Compact<u32>
    readonly code: Bytes
    readonly determinism: PalletContractsWasmDeterminism
  }

  /** @name PalletContractsWasmOwnerInfo (527) */
  interface PalletContractsWasmOwnerInfo extends Struct {
    readonly owner: AccountId32
    readonly deposit: Compact<u128>
    readonly refcount: Compact<u64>
  }

  /** @name PalletContractsStorageContractInfo (528) */
  interface PalletContractsStorageContractInfo extends Struct {
    readonly trieId: Bytes
    readonly depositAccount: AccountId32
    readonly codeHash: H256
    readonly storageBytes: u32
    readonly storageItems: u32
    readonly storageByteDeposit: u128
    readonly storageItemDeposit: u128
    readonly storageBaseDeposit: u128
  }

  /** @name PalletContractsStorageDeletionQueueManager (530) */
  interface PalletContractsStorageDeletionQueueManager extends Struct {
    readonly insertCounter: u32
    readonly deleteCounter: u32
  }

  /** @name PalletContractsSchedule (532) */
  interface PalletContractsSchedule extends Struct {
    readonly limits: PalletContractsScheduleLimits
    readonly instructionWeights: PalletContractsScheduleInstructionWeights
    readonly hostFnWeights: PalletContractsScheduleHostFnWeights
  }

  /** @name PalletContractsScheduleLimits (533) */
  interface PalletContractsScheduleLimits extends Struct {
    readonly eventTopics: u32
    readonly globals: u32
    readonly locals: u32
    readonly parameters: u32
    readonly memoryPages: u32
    readonly tableSize: u32
    readonly brTableSize: u32
    readonly subjectLen: u32
    readonly payloadLen: u32
    readonly runtimeMemory: u32
  }

  /** @name PalletContractsScheduleInstructionWeights (534) */
  interface PalletContractsScheduleInstructionWeights extends Struct {
    readonly version: u32
    readonly fallback: u32
    readonly i64const: u32
    readonly i64load: u32
    readonly i64store: u32
    readonly select: u32
    readonly r_if: u32
    readonly br: u32
    readonly brIf: u32
    readonly brTable: u32
    readonly brTablePerEntry: u32
    readonly call: u32
    readonly callIndirect: u32
    readonly callPerLocal: u32
    readonly localGet: u32
    readonly localSet: u32
    readonly localTee: u32
    readonly globalGet: u32
    readonly globalSet: u32
    readonly memoryCurrent: u32
    readonly memoryGrow: u32
    readonly i64clz: u32
    readonly i64ctz: u32
    readonly i64popcnt: u32
    readonly i64eqz: u32
    readonly i64extendsi32: u32
    readonly i64extendui32: u32
    readonly i32wrapi64: u32
    readonly i64eq: u32
    readonly i64ne: u32
    readonly i64lts: u32
    readonly i64ltu: u32
    readonly i64gts: u32
    readonly i64gtu: u32
    readonly i64les: u32
    readonly i64leu: u32
    readonly i64ges: u32
    readonly i64geu: u32
    readonly i64add: u32
    readonly i64sub: u32
    readonly i64mul: u32
    readonly i64divs: u32
    readonly i64divu: u32
    readonly i64rems: u32
    readonly i64remu: u32
    readonly i64and: u32
    readonly i64or: u32
    readonly i64xor: u32
    readonly i64shl: u32
    readonly i64shrs: u32
    readonly i64shru: u32
    readonly i64rotl: u32
    readonly i64rotr: u32
  }

  /** @name PalletContractsScheduleHostFnWeights (535) */
  interface PalletContractsScheduleHostFnWeights extends Struct {
    readonly caller: SpWeightsWeightV2Weight
    readonly isContract: SpWeightsWeightV2Weight
    readonly codeHash: SpWeightsWeightV2Weight
    readonly ownCodeHash: SpWeightsWeightV2Weight
    readonly callerIsOrigin: SpWeightsWeightV2Weight
    readonly callerIsRoot: SpWeightsWeightV2Weight
    readonly address: SpWeightsWeightV2Weight
    readonly gasLeft: SpWeightsWeightV2Weight
    readonly balance: SpWeightsWeightV2Weight
    readonly valueTransferred: SpWeightsWeightV2Weight
    readonly minimumBalance: SpWeightsWeightV2Weight
    readonly blockNumber: SpWeightsWeightV2Weight
    readonly now: SpWeightsWeightV2Weight
    readonly weightToFee: SpWeightsWeightV2Weight
    readonly gas: SpWeightsWeightV2Weight
    readonly input: SpWeightsWeightV2Weight
    readonly inputPerByte: SpWeightsWeightV2Weight
    readonly r_return: SpWeightsWeightV2Weight
    readonly returnPerByte: SpWeightsWeightV2Weight
    readonly terminate: SpWeightsWeightV2Weight
    readonly random: SpWeightsWeightV2Weight
    readonly depositEvent: SpWeightsWeightV2Weight
    readonly depositEventPerTopic: SpWeightsWeightV2Weight
    readonly depositEventPerByte: SpWeightsWeightV2Weight
    readonly debugMessage: SpWeightsWeightV2Weight
    readonly debugMessagePerByte: SpWeightsWeightV2Weight
    readonly setStorage: SpWeightsWeightV2Weight
    readonly setStoragePerNewByte: SpWeightsWeightV2Weight
    readonly setStoragePerOldByte: SpWeightsWeightV2Weight
    readonly setCodeHash: SpWeightsWeightV2Weight
    readonly clearStorage: SpWeightsWeightV2Weight
    readonly clearStoragePerByte: SpWeightsWeightV2Weight
    readonly containsStorage: SpWeightsWeightV2Weight
    readonly containsStoragePerByte: SpWeightsWeightV2Weight
    readonly getStorage: SpWeightsWeightV2Weight
    readonly getStoragePerByte: SpWeightsWeightV2Weight
    readonly takeStorage: SpWeightsWeightV2Weight
    readonly takeStoragePerByte: SpWeightsWeightV2Weight
    readonly transfer: SpWeightsWeightV2Weight
    readonly call: SpWeightsWeightV2Weight
    readonly delegateCall: SpWeightsWeightV2Weight
    readonly callTransferSurcharge: SpWeightsWeightV2Weight
    readonly callPerClonedByte: SpWeightsWeightV2Weight
    readonly instantiate: SpWeightsWeightV2Weight
    readonly instantiateTransferSurcharge: SpWeightsWeightV2Weight
    readonly instantiatePerInputByte: SpWeightsWeightV2Weight
    readonly instantiatePerSaltByte: SpWeightsWeightV2Weight
    readonly hashSha2256: SpWeightsWeightV2Weight
    readonly hashSha2256PerByte: SpWeightsWeightV2Weight
    readonly hashKeccak256: SpWeightsWeightV2Weight
    readonly hashKeccak256PerByte: SpWeightsWeightV2Weight
    readonly hashBlake2256: SpWeightsWeightV2Weight
    readonly hashBlake2256PerByte: SpWeightsWeightV2Weight
    readonly hashBlake2128: SpWeightsWeightV2Weight
    readonly hashBlake2128PerByte: SpWeightsWeightV2Weight
    readonly ecdsaRecover: SpWeightsWeightV2Weight
    readonly ecdsaToEthAddress: SpWeightsWeightV2Weight
    readonly sr25519Verify: SpWeightsWeightV2Weight
    readonly sr25519VerifyPerByte: SpWeightsWeightV2Weight
    readonly reentranceCount: SpWeightsWeightV2Weight
    readonly accountReentranceCount: SpWeightsWeightV2Weight
    readonly instantiationNonce: SpWeightsWeightV2Weight
  }

  /** @name PalletContractsError (536) */
  interface PalletContractsError extends Enum {
    readonly isInvalidScheduleVersion: boolean
    readonly isInvalidCallFlags: boolean
    readonly isOutOfGas: boolean
    readonly isOutputBufferTooSmall: boolean
    readonly isTransferFailed: boolean
    readonly isMaxCallDepthReached: boolean
    readonly isContractNotFound: boolean
    readonly isCodeTooLarge: boolean
    readonly isCodeNotFound: boolean
    readonly isOutOfBounds: boolean
    readonly isDecodingFailed: boolean
    readonly isContractTrapped: boolean
    readonly isValueTooLarge: boolean
    readonly isTerminatedWhileReentrant: boolean
    readonly isInputForwarded: boolean
    readonly isRandomSubjectTooLong: boolean
    readonly isTooManyTopics: boolean
    readonly isNoChainExtension: boolean
    readonly isDuplicateContract: boolean
    readonly isTerminatedInConstructor: boolean
    readonly isReentranceDenied: boolean
    readonly isStorageDepositNotEnoughFunds: boolean
    readonly isStorageDepositLimitExhausted: boolean
    readonly isCodeInUse: boolean
    readonly isContractReverted: boolean
    readonly isCodeRejected: boolean
    readonly isIndeterministic: boolean
    readonly isMigrationInProgress: boolean
    readonly isNoMigrationPerformed: boolean
    readonly type:
      | 'InvalidScheduleVersion'
      | 'InvalidCallFlags'
      | 'OutOfGas'
      | 'OutputBufferTooSmall'
      | 'TransferFailed'
      | 'MaxCallDepthReached'
      | 'ContractNotFound'
      | 'CodeTooLarge'
      | 'CodeNotFound'
      | 'OutOfBounds'
      | 'DecodingFailed'
      | 'ContractTrapped'
      | 'ValueTooLarge'
      | 'TerminatedWhileReentrant'
      | 'InputForwarded'
      | 'RandomSubjectTooLong'
      | 'TooManyTopics'
      | 'NoChainExtension'
      | 'DuplicateContract'
      | 'TerminatedInConstructor'
      | 'ReentranceDenied'
      | 'StorageDepositNotEnoughFunds'
      | 'StorageDepositLimitExhausted'
      | 'CodeInUse'
      | 'ContractReverted'
      | 'CodeRejected'
      | 'Indeterministic'
      | 'MigrationInProgress'
      | 'NoMigrationPerformed'
  }

  /** @name PalletDemocracyReferendumInfo (541) */
  interface PalletDemocracyReferendumInfo extends Enum {
    readonly isOngoing: boolean
    readonly asOngoing: PalletDemocracyReferendumStatus
    readonly isFinished: boolean
    readonly asFinished: {
      readonly approved: bool
      readonly end: u32
    } & Struct
    readonly type: 'Ongoing' | 'Finished'
  }

  /** @name PalletDemocracyReferendumStatus (542) */
  interface PalletDemocracyReferendumStatus extends Struct {
    readonly end: u32
    readonly proposal: FrameSupportPreimagesBounded
    readonly threshold: PalletDemocracyVoteThreshold
    readonly delay: u32
    readonly tally: PalletDemocracyTally
  }

  /** @name PalletDemocracyTally (543) */
  interface PalletDemocracyTally extends Struct {
    readonly ayes: u128
    readonly nays: u128
    readonly turnout: u128
  }

  /** @name PalletDemocracyVoteVoting (544) */
  interface PalletDemocracyVoteVoting extends Enum {
    readonly isDirect: boolean
    readonly asDirect: {
      readonly votes: Vec<ITuple<[u32, PalletDemocracyVoteAccountVote]>>
      readonly delegations: PalletDemocracyDelegations
      readonly prior: PalletDemocracyVotePriorLock
    } & Struct
    readonly isDelegating: boolean
    readonly asDelegating: {
      readonly balance: u128
      readonly target: AccountId32
      readonly conviction: PalletDemocracyConviction
      readonly delegations: PalletDemocracyDelegations
      readonly prior: PalletDemocracyVotePriorLock
    } & Struct
    readonly type: 'Direct' | 'Delegating'
  }

  /** @name PalletDemocracyDelegations (548) */
  interface PalletDemocracyDelegations extends Struct {
    readonly votes: u128
    readonly capital: u128
  }

  /** @name PalletDemocracyVotePriorLock (549) */
  interface PalletDemocracyVotePriorLock extends ITuple<[u32, u128]> {}

  /** @name PalletDemocracyError (552) */
  interface PalletDemocracyError extends Enum {
    readonly isValueLow: boolean
    readonly isProposalMissing: boolean
    readonly isAlreadyCanceled: boolean
    readonly isDuplicateProposal: boolean
    readonly isProposalBlacklisted: boolean
    readonly isNotSimpleMajority: boolean
    readonly isInvalidHash: boolean
    readonly isNoProposal: boolean
    readonly isAlreadyVetoed: boolean
    readonly isReferendumInvalid: boolean
    readonly isNoneWaiting: boolean
    readonly isNotVoter: boolean
    readonly isNoPermission: boolean
    readonly isAlreadyDelegating: boolean
    readonly isInsufficientFunds: boolean
    readonly isNotDelegating: boolean
    readonly isVotesExist: boolean
    readonly isInstantNotAllowed: boolean
    readonly isNonsense: boolean
    readonly isWrongUpperBound: boolean
    readonly isMaxVotesReached: boolean
    readonly isTooMany: boolean
    readonly isVotingPeriodLow: boolean
    readonly isPreimageNotExist: boolean
    readonly type:
      | 'ValueLow'
      | 'ProposalMissing'
      | 'AlreadyCanceled'
      | 'DuplicateProposal'
      | 'ProposalBlacklisted'
      | 'NotSimpleMajority'
      | 'InvalidHash'
      | 'NoProposal'
      | 'AlreadyVetoed'
      | 'ReferendumInvalid'
      | 'NoneWaiting'
      | 'NotVoter'
      | 'NoPermission'
      | 'AlreadyDelegating'
      | 'InsufficientFunds'
      | 'NotDelegating'
      | 'VotesExist'
      | 'InstantNotAllowed'
      | 'Nonsense'
      | 'WrongUpperBound'
      | 'MaxVotesReached'
      | 'TooMany'
      | 'VotingPeriodLow'
      | 'PreimageNotExist'
  }

  /** @name PalletCollectiveVotes (554) */
  interface PalletCollectiveVotes extends Struct {
    readonly index: u32
    readonly threshold: u32
    readonly ayes: Vec<AccountId32>
    readonly nays: Vec<AccountId32>
    readonly end: u32
  }

  /** @name PalletCollectiveError (555) */
  interface PalletCollectiveError extends Enum {
    readonly isNotMember: boolean
    readonly isDuplicateProposal: boolean
    readonly isProposalMissing: boolean
    readonly isWrongIndex: boolean
    readonly isDuplicateVote: boolean
    readonly isAlreadyInitialized: boolean
    readonly isTooEarly: boolean
    readonly isTooManyProposals: boolean
    readonly isWrongProposalWeight: boolean
    readonly isWrongProposalLength: boolean
    readonly type:
      | 'NotMember'
      | 'DuplicateProposal'
      | 'ProposalMissing'
      | 'WrongIndex'
      | 'DuplicateVote'
      | 'AlreadyInitialized'
      | 'TooEarly'
      | 'TooManyProposals'
      | 'WrongProposalWeight'
      | 'WrongProposalLength'
  }

  /** @name PalletTreasuryProposal (557) */
  interface PalletTreasuryProposal extends Struct {
    readonly proposer: AccountId32
    readonly value: u128
    readonly beneficiary: AccountId32
    readonly bond: u128
  }

  /** @name FrameSupportPalletId (560) */
  interface FrameSupportPalletId extends U8aFixed {}

  /** @name PalletTreasuryError (561) */
  interface PalletTreasuryError extends Enum {
    readonly isInsufficientProposersBalance: boolean
    readonly isInvalidIndex: boolean
    readonly isTooManyApprovals: boolean
    readonly isInsufficientPermission: boolean
    readonly isProposalNotApproved: boolean
    readonly type:
      | 'InsufficientProposersBalance'
      | 'InvalidIndex'
      | 'TooManyApprovals'
      | 'InsufficientPermission'
      | 'ProposalNotApproved'
  }

  /** @name PalletPreimageRequestStatus (562) */
  interface PalletPreimageRequestStatus extends Enum {
    readonly isUnrequested: boolean
    readonly asUnrequested: {
      readonly deposit: ITuple<[AccountId32, u128]>
      readonly len: u32
    } & Struct
    readonly isRequested: boolean
    readonly asRequested: {
      readonly deposit: Option<ITuple<[AccountId32, u128]>>
      readonly count: u32
      readonly len: Option<u32>
    } & Struct
    readonly type: 'Unrequested' | 'Requested'
  }

  /** @name PalletPreimageError (567) */
  interface PalletPreimageError extends Enum {
    readonly isTooBig: boolean
    readonly isAlreadyNoted: boolean
    readonly isNotAuthorized: boolean
    readonly isNotNoted: boolean
    readonly isRequested: boolean
    readonly isNotRequested: boolean
    readonly type: 'TooBig' | 'AlreadyNoted' | 'NotAuthorized' | 'NotNoted' | 'Requested' | 'NotRequested'
  }

  /** @name PalletSudoError (568) */
  interface PalletSudoError extends Enum {
    readonly isRequireSudo: boolean
    readonly type: 'RequireSudo'
  }

  /** @name PalletStaticPriceProviderError (569) */
  interface PalletStaticPriceProviderError extends Enum {
    readonly isZeroPrice: boolean
    readonly type: 'ZeroPrice'
  }

  /** @name SpRuntimeMultiSignature (571) */
  interface SpRuntimeMultiSignature extends Enum {
    readonly isEd25519: boolean
    readonly asEd25519: SpCoreEd25519Signature
    readonly isSr25519: boolean
    readonly asSr25519: SpCoreSr25519Signature
    readonly isEcdsa: boolean
    readonly asEcdsa: SpCoreEcdsaSignature
    readonly type: 'Ed25519' | 'Sr25519' | 'Ecdsa'
  }

  /** @name SpCoreEd25519Signature (572) */
  interface SpCoreEd25519Signature extends U8aFixed {}

  /** @name SpCoreSr25519Signature (574) */
  interface SpCoreSr25519Signature extends U8aFixed {}

  /** @name SpCoreEcdsaSignature (575) */
  interface SpCoreEcdsaSignature extends U8aFixed {}

  /** @name FrameSystemExtensionsCheckSpecVersion (577) */
  type FrameSystemExtensionsCheckSpecVersion = Null

  /** @name FrameSystemExtensionsCheckTxVersion (578) */
  type FrameSystemExtensionsCheckTxVersion = Null

  /** @name FrameSystemExtensionsCheckGenesis (579) */
  type FrameSystemExtensionsCheckGenesis = Null

  /** @name FrameSystemExtensionsCheckNonce (582) */
  interface FrameSystemExtensionsCheckNonce extends Compact<u32> {}

  /** @name FrameSystemExtensionsCheckWeight (583) */
  type FrameSystemExtensionsCheckWeight = Null

  /** @name PalletTransactionPaymentChargeTransactionPayment (584) */
  interface PalletTransactionPaymentChargeTransactionPayment extends Compact<u128> {}
} // declare module
