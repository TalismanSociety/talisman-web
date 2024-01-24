// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/api-base/types/errors'

import type { ApiTypes, AugmentedError } from '@polkadot/api-base/types'

export type __AugmentedError<ApiType extends ApiTypes> = AugmentedError<ApiType>

declare module '@polkadot/api-base/types/errors' {
  interface AugmentedErrors<ApiType extends ApiTypes> {
    assets: {
      /**
       * The asset-account already exists.
       **/
      AlreadyExists: AugmentedError<ApiType>
      /**
       * The asset is not live, and likely being destroyed.
       **/
      AssetNotLive: AugmentedError<ApiType>
      /**
       * Invalid metadata given.
       **/
      BadMetadata: AugmentedError<ApiType>
      /**
       * Invalid witness data given.
       **/
      BadWitness: AugmentedError<ApiType>
      /**
       * Account balance must be greater than or equal to the transfer amount.
       **/
      BalanceLow: AugmentedError<ApiType>
      /**
       * Callback action resulted in error
       **/
      CallbackFailed: AugmentedError<ApiType>
      /**
       * The origin account is frozen.
       **/
      Frozen: AugmentedError<ApiType>
      /**
       * The asset status is not the expected status.
       **/
      IncorrectStatus: AugmentedError<ApiType>
      /**
       * The asset ID is already taken.
       **/
      InUse: AugmentedError<ApiType>
      /**
       * The asset is a live asset and is actively being used. Usually emit for operations such
       * as `start_destroy` which require the asset to be in a destroying state.
       **/
      LiveAsset: AugmentedError<ApiType>
      /**
       * Minimum balance should be non-zero.
       **/
      MinBalanceZero: AugmentedError<ApiType>
      /**
       * The account to alter does not exist.
       **/
      NoAccount: AugmentedError<ApiType>
      /**
       * The asset-account doesn't have an associated deposit.
       **/
      NoDeposit: AugmentedError<ApiType>
      /**
       * The signing account has no permission to do the operation.
       **/
      NoPermission: AugmentedError<ApiType>
      /**
       * The asset should be frozen before the given operation.
       **/
      NotFrozen: AugmentedError<ApiType>
      /**
       * No approval exists that would allow the transfer.
       **/
      Unapproved: AugmentedError<ApiType>
      /**
       * Unable to increment the consumer reference counters on the account. Either no provider
       * reference exists to allow a non-zero balance of a non-self-sufficient asset, or one
       * fewer then the maximum number of consumers has been reached.
       **/
      UnavailableConsumer: AugmentedError<ApiType>
      /**
       * The given asset ID is unknown.
       **/
      Unknown: AugmentedError<ApiType>
      /**
       * The operation would result in funds being burned.
       **/
      WouldBurn: AugmentedError<ApiType>
      /**
       * The source account would not survive the transfer and it needs to stay alive.
       **/
      WouldDie: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    balances: {
      /**
       * Beneficiary account must pre-exist.
       **/
      DeadAccount: AugmentedError<ApiType>
      /**
       * Value too low to create account due to existential deposit.
       **/
      ExistentialDeposit: AugmentedError<ApiType>
      /**
       * A vesting schedule already exists for this account.
       **/
      ExistingVestingSchedule: AugmentedError<ApiType>
      /**
       * Transfer/payment would kill account.
       **/
      Expendability: AugmentedError<ApiType>
      /**
       * Balance too low to send value.
       **/
      InsufficientBalance: AugmentedError<ApiType>
      /**
       * Account liquidity restrictions prevent withdrawal.
       **/
      LiquidityRestrictions: AugmentedError<ApiType>
      /**
       * Number of freezes exceed `MaxFreezes`.
       **/
      TooManyFreezes: AugmentedError<ApiType>
      /**
       * Number of holds exceed `MaxHolds`.
       **/
      TooManyHolds: AugmentedError<ApiType>
      /**
       * Number of named reserves exceed `MaxReserves`.
       **/
      TooManyReserves: AugmentedError<ApiType>
      /**
       * Vesting balance too high to send value.
       **/
      VestingBalance: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    collatorSelection: {
      /**
       * User is already a candidate
       **/
      AlreadyCandidate: AugmentedError<ApiType>
      /**
       * User is already an Invulnerable
       **/
      AlreadyInvulnerable: AugmentedError<ApiType>
      /**
       * Account has no associated validator ID
       **/
      NoAssociatedValidatorId: AugmentedError<ApiType>
      /**
       * User is not a candidate
       **/
      NotCandidate: AugmentedError<ApiType>
      /**
       * Permission issue
       **/
      Permission: AugmentedError<ApiType>
      /**
       * Too few candidates
       **/
      TooFewCandidates: AugmentedError<ApiType>
      /**
       * Too many candidates
       **/
      TooManyCandidates: AugmentedError<ApiType>
      /**
       * Unknown error
       **/
      Unknown: AugmentedError<ApiType>
      /**
       * Validator ID is not yet registered
       **/
      ValidatorNotRegistered: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    contracts: {
      /**
       * Code removal was denied because the code is still in use by at least one contract.
       **/
      CodeInUse: AugmentedError<ApiType>
      /**
       * No code could be found at the supplied code hash.
       **/
      CodeNotFound: AugmentedError<ApiType>
      /**
       * The contract's code was found to be invalid during validation or instrumentation.
       *
       * The most likely cause of this is that an API was used which is not supported by the
       * node. This happens if an older node is used with a new version of ink!. Try updating
       * your node to the newest available version.
       *
       * A more detailed error can be found on the node console if debug messages are enabled
       * by supplying `-lruntime::contracts=debug`.
       **/
      CodeRejected: AugmentedError<ApiType>
      /**
       * The code supplied to `instantiate_with_code` exceeds the limit specified in the
       * current schedule.
       **/
      CodeTooLarge: AugmentedError<ApiType>
      /**
       * No contract was found at the specified address.
       **/
      ContractNotFound: AugmentedError<ApiType>
      /**
       * The contract ran to completion but decided to revert its storage changes.
       * Please note that this error is only returned from extrinsics. When called directly
       * or via RPC an `Ok` will be returned. In this case the caller needs to inspect the flags
       * to determine whether a reversion has taken place.
       **/
      ContractReverted: AugmentedError<ApiType>
      /**
       * Contract trapped during execution.
       **/
      ContractTrapped: AugmentedError<ApiType>
      /**
       * Input passed to a contract API function failed to decode as expected type.
       **/
      DecodingFailed: AugmentedError<ApiType>
      /**
       * A contract with the same AccountId already exists.
       **/
      DuplicateContract: AugmentedError<ApiType>
      /**
       * An indetermistic code was used in a context where this is not permitted.
       **/
      Indeterministic: AugmentedError<ApiType>
      /**
       * `seal_call` forwarded this contracts input. It therefore is no longer available.
       **/
      InputForwarded: AugmentedError<ApiType>
      /**
       * Invalid combination of flags supplied to `seal_call` or `seal_delegate_call`.
       **/
      InvalidCallFlags: AugmentedError<ApiType>
      /**
       * A new schedule must have a greater version than the current one.
       **/
      InvalidScheduleVersion: AugmentedError<ApiType>
      /**
       * Performing a call was denied because the calling depth reached the limit
       * of what is specified in the schedule.
       **/
      MaxCallDepthReached: AugmentedError<ApiType>
      /**
       * A pending migration needs to complete before the extrinsic can be called.
       **/
      MigrationInProgress: AugmentedError<ApiType>
      /**
       * The chain does not provide a chain extension. Calling the chain extension results
       * in this error. Note that this usually  shouldn't happen as deploying such contracts
       * is rejected.
       **/
      NoChainExtension: AugmentedError<ApiType>
      /**
       * Migrate dispatch call was attempted but no migration was performed.
       **/
      NoMigrationPerformed: AugmentedError<ApiType>
      /**
       * A buffer outside of sandbox memory was passed to a contract API function.
       **/
      OutOfBounds: AugmentedError<ApiType>
      /**
       * The executed contract exhausted its gas limit.
       **/
      OutOfGas: AugmentedError<ApiType>
      /**
       * The output buffer supplied to a contract API call was too small.
       **/
      OutputBufferTooSmall: AugmentedError<ApiType>
      /**
       * The subject passed to `seal_random` exceeds the limit.
       **/
      RandomSubjectTooLong: AugmentedError<ApiType>
      /**
       * A call tried to invoke a contract that is flagged as non-reentrant.
       * The only other cause is that a call from a contract into the runtime tried to call back
       * into `pallet-contracts`. This would make the whole pallet reentrant with regard to
       * contract code execution which is not supported.
       **/
      ReentranceDenied: AugmentedError<ApiType>
      /**
       * More storage was created than allowed by the storage deposit limit.
       **/
      StorageDepositLimitExhausted: AugmentedError<ApiType>
      /**
       * Origin doesn't have enough balance to pay the required storage deposits.
       **/
      StorageDepositNotEnoughFunds: AugmentedError<ApiType>
      /**
       * A contract self destructed in its constructor.
       *
       * This can be triggered by a call to `seal_terminate`.
       **/
      TerminatedInConstructor: AugmentedError<ApiType>
      /**
       * Termination of a contract is not allowed while the contract is already
       * on the call stack. Can be triggered by `seal_terminate`.
       **/
      TerminatedWhileReentrant: AugmentedError<ApiType>
      /**
       * The amount of topics passed to `seal_deposit_events` exceeds the limit.
       **/
      TooManyTopics: AugmentedError<ApiType>
      /**
       * Performing the requested transfer failed. Probably because there isn't enough
       * free balance in the sender's account.
       **/
      TransferFailed: AugmentedError<ApiType>
      /**
       * The size defined in `T::MaxValueSize` was exceeded.
       **/
      ValueTooLarge: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    council: {
      /**
       * Members are already initialized!
       **/
      AlreadyInitialized: AugmentedError<ApiType>
      /**
       * Duplicate proposals not allowed
       **/
      DuplicateProposal: AugmentedError<ApiType>
      /**
       * Duplicate vote ignored
       **/
      DuplicateVote: AugmentedError<ApiType>
      /**
       * Account is not a member
       **/
      NotMember: AugmentedError<ApiType>
      /**
       * Proposal must exist
       **/
      ProposalMissing: AugmentedError<ApiType>
      /**
       * The close call was made too early, before the end of the voting.
       **/
      TooEarly: AugmentedError<ApiType>
      /**
       * There can only be a maximum of `MaxProposals` active proposals.
       **/
      TooManyProposals: AugmentedError<ApiType>
      /**
       * Mismatched index
       **/
      WrongIndex: AugmentedError<ApiType>
      /**
       * The given length bound for the proposal was too low.
       **/
      WrongProposalLength: AugmentedError<ApiType>
      /**
       * The given weight bound for the proposal was too low.
       **/
      WrongProposalWeight: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    cumulusXcm: {
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    dappStaking: {
      /**
       * Smart contract already exists within dApp staking protocol.
       **/
      ContractAlreadyExists: AugmentedError<ApiType>
      /**
       * Specified smart contract does not exist in dApp staking.
       **/
      ContractNotFound: AugmentedError<ApiType>
      /**
       * Contract is still active, not unregistered.
       **/
      ContractStillActive: AugmentedError<ApiType>
      /**
       * Pallet is disabled/in maintenance mode.
       **/
      Disabled: AugmentedError<ApiType>
      /**
       * Maximum number of smart contracts has been reached.
       **/
      ExceededMaxNumberOfContracts: AugmentedError<ApiType>
      /**
       * Total staked amount on contract is below the minimum required value.
       **/
      InsufficientStakeAmount: AugmentedError<ApiType>
      /**
       * An unexpected error occurred while trying to claim bonus reward.
       **/
      InternalClaimBonusError: AugmentedError<ApiType>
      /**
       * An unexpected error occurred while trying to claim dApp reward.
       **/
      InternalClaimDAppError: AugmentedError<ApiType>
      /**
       * An unexpected error occurred while trying to claim staker rewards.
       **/
      InternalClaimStakerError: AugmentedError<ApiType>
      /**
       * An unexpected error occurred while trying to stake.
       **/
      InternalStakeError: AugmentedError<ApiType>
      /**
       * An unexpected error occurred while trying to unstake.
       **/
      InternalUnstakeError: AugmentedError<ApiType>
      /**
       * Claim era is invalid - it must be in history, and rewards must exist for it.
       **/
      InvalidClaimEra: AugmentedError<ApiType>
      /**
       * Tier parameters aren't valid.
       **/
      InvalidTierParameters: AugmentedError<ApiType>
      /**
       * Total locked amount for staker is below minimum threshold.
       **/
      LockedAmountBelowThreshold: AugmentedError<ApiType>
      /**
       * Not possible to assign a new dApp Id.
       * This should never happen since current type can support up to 65536 - 1 unique dApps.
       **/
      NewDAppIdUnavailable: AugmentedError<ApiType>
      /**
       * There are no claimable rewards.
       **/
      NoClaimableRewards: AugmentedError<ApiType>
      /**
       * No dApp tier info exists for the specified era. This can be because era has expired
       * or because during the specified era there were no eligible rewards or protocol wasn't active.
       **/
      NoDAppTierInfo: AugmentedError<ApiType>
      /**
       * There are no expired entries to cleanup for the account.
       **/
      NoExpiredEntries: AugmentedError<ApiType>
      /**
       * Account has no staking information for the contract.
       **/
      NoStakingInfo: AugmentedError<ApiType>
      /**
       * Account is has no eligible stake amount for bonus reward.
       **/
      NotEligibleForBonusReward: AugmentedError<ApiType>
      /**
       * dApp is part of dApp staking but isn't active anymore.
       **/
      NotOperatedDApp: AugmentedError<ApiType>
      /**
       * There are no eligible unlocked chunks to claim. This can happen either if no eligible chunks exist, or if user has no chunks at all.
       **/
      NoUnlockedChunksToClaim: AugmentedError<ApiType>
      /**
       * There are no unlocking chunks available to relock.
       **/
      NoUnlockingChunks: AugmentedError<ApiType>
      /**
       * Call origin is not dApp owner.
       **/
      OriginNotOwner: AugmentedError<ApiType>
      /**
       * Stake operation is rejected since period ends in the next era.
       **/
      PeriodEndsInNextEra: AugmentedError<ApiType>
      /**
       * Remaining stake prevents entire balance of starting the unlocking process.
       **/
      RemainingStakePreventsFullUnlock: AugmentedError<ApiType>
      /**
       * Rewards are no longer claimable since they are too old.
       **/
      RewardExpired: AugmentedError<ApiType>
      /**
       * Reward payout has failed due to an unexpected reason.
       **/
      RewardPayoutFailed: AugmentedError<ApiType>
      /**
       * There are too many contract stake entries for the account. This can be cleaned up by either unstaking or cleaning expired entries.
       **/
      TooManyStakedContracts: AugmentedError<ApiType>
      /**
       * Cannot add additional unlocking chunks due to capacity limit.
       **/
      TooManyUnlockingChunks: AugmentedError<ApiType>
      /**
       * The amount being staked is too large compared to what's available for staking.
       **/
      UnavailableStakeFunds: AugmentedError<ApiType>
      /**
       * There are unclaimed rewards remaining from past eras or periods. They should be claimed before attempting any stake modification again.
       **/
      UnclaimedRewards: AugmentedError<ApiType>
      /**
       * Unstake amount is greater than the staked amount.
       **/
      UnstakeAmountTooLarge: AugmentedError<ApiType>
      /**
       * Unstaking is rejected since the period in which past stake was active has passed.
       **/
      UnstakeFromPastPeriod: AugmentedError<ApiType>
      /**
       * Performing locking or staking with 0 amount.
       **/
      ZeroAmount: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    democracy: {
      /**
       * Cannot cancel the same proposal twice
       **/
      AlreadyCanceled: AugmentedError<ApiType>
      /**
       * The account is already delegating.
       **/
      AlreadyDelegating: AugmentedError<ApiType>
      /**
       * Identity may not veto a proposal twice
       **/
      AlreadyVetoed: AugmentedError<ApiType>
      /**
       * Proposal already made
       **/
      DuplicateProposal: AugmentedError<ApiType>
      /**
       * The instant referendum origin is currently disallowed.
       **/
      InstantNotAllowed: AugmentedError<ApiType>
      /**
       * Too high a balance was provided that the account cannot afford.
       **/
      InsufficientFunds: AugmentedError<ApiType>
      /**
       * Invalid hash
       **/
      InvalidHash: AugmentedError<ApiType>
      /**
       * Maximum number of votes reached.
       **/
      MaxVotesReached: AugmentedError<ApiType>
      /**
       * No proposals waiting
       **/
      NoneWaiting: AugmentedError<ApiType>
      /**
       * Delegation to oneself makes no sense.
       **/
      Nonsense: AugmentedError<ApiType>
      /**
       * The actor has no permission to conduct the action.
       **/
      NoPermission: AugmentedError<ApiType>
      /**
       * No external proposal
       **/
      NoProposal: AugmentedError<ApiType>
      /**
       * The account is not currently delegating.
       **/
      NotDelegating: AugmentedError<ApiType>
      /**
       * Next external proposal not simple majority
       **/
      NotSimpleMajority: AugmentedError<ApiType>
      /**
       * The given account did not vote on the referendum.
       **/
      NotVoter: AugmentedError<ApiType>
      /**
       * The preimage does not exist.
       **/
      PreimageNotExist: AugmentedError<ApiType>
      /**
       * Proposal still blacklisted
       **/
      ProposalBlacklisted: AugmentedError<ApiType>
      /**
       * Proposal does not exist
       **/
      ProposalMissing: AugmentedError<ApiType>
      /**
       * Vote given for invalid referendum
       **/
      ReferendumInvalid: AugmentedError<ApiType>
      /**
       * Maximum number of items reached.
       **/
      TooMany: AugmentedError<ApiType>
      /**
       * Value too low
       **/
      ValueLow: AugmentedError<ApiType>
      /**
       * The account currently has votes attached to it and the operation cannot succeed until
       * these are removed, either through `unvote` or `reap_vote`.
       **/
      VotesExist: AugmentedError<ApiType>
      /**
       * Voting period too low
       **/
      VotingPeriodLow: AugmentedError<ApiType>
      /**
       * Invalid upper bound.
       **/
      WrongUpperBound: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    dmpQueue: {
      /**
       * The amount of weight given is possibly not enough for executing the message.
       **/
      OverLimit: AugmentedError<ApiType>
      /**
       * The message index given is unknown.
       **/
      Unknown: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    dynamicEvmBaseFee: {
      /**
       * Specified value is outside of the allowed range.
       **/
      ValueOutOfBounds: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    ethereum: {
      /**
       * Signature is invalid.
       **/
      InvalidSignature: AugmentedError<ApiType>
      /**
       * Pre-log is present, therefore transact is not allowed.
       **/
      PreLogExists: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    evm: {
      /**
       * Not enough balance to perform action
       **/
      BalanceLow: AugmentedError<ApiType>
      /**
       * Calculating total fee overflowed
       **/
      FeeOverflow: AugmentedError<ApiType>
      /**
       * Gas limit is too high.
       **/
      GasLimitTooHigh: AugmentedError<ApiType>
      /**
       * Gas limit is too low.
       **/
      GasLimitTooLow: AugmentedError<ApiType>
      /**
       * Gas price is too low.
       **/
      GasPriceTooLow: AugmentedError<ApiType>
      /**
       * Nonce is invalid
       **/
      InvalidNonce: AugmentedError<ApiType>
      /**
       * Calculating total payment overflowed
       **/
      PaymentOverflow: AugmentedError<ApiType>
      /**
       * EVM reentrancy
       **/
      Reentrancy: AugmentedError<ApiType>
      /**
       * EIP-3607,
       **/
      TransactionMustComeFromEOA: AugmentedError<ApiType>
      /**
       * Undefined error.
       **/
      Undefined: AugmentedError<ApiType>
      /**
       * Withdraw fee failed
       **/
      WithdrawFailed: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    identity: {
      /**
       * Account ID is already named.
       **/
      AlreadyClaimed: AugmentedError<ApiType>
      /**
       * Empty index.
       **/
      EmptyIndex: AugmentedError<ApiType>
      /**
       * Fee is changed.
       **/
      FeeChanged: AugmentedError<ApiType>
      /**
       * The index is invalid.
       **/
      InvalidIndex: AugmentedError<ApiType>
      /**
       * Invalid judgement.
       **/
      InvalidJudgement: AugmentedError<ApiType>
      /**
       * The target is invalid.
       **/
      InvalidTarget: AugmentedError<ApiType>
      /**
       * The provided judgement was for a different identity.
       **/
      JudgementForDifferentIdentity: AugmentedError<ApiType>
      /**
       * Judgement given.
       **/
      JudgementGiven: AugmentedError<ApiType>
      /**
       * Error that occurs when there is an issue paying for judgement.
       **/
      JudgementPaymentFailed: AugmentedError<ApiType>
      /**
       * No identity found.
       **/
      NoIdentity: AugmentedError<ApiType>
      /**
       * Account isn't found.
       **/
      NotFound: AugmentedError<ApiType>
      /**
       * Account isn't named.
       **/
      NotNamed: AugmentedError<ApiType>
      /**
       * Sub-account isn't owned by sender.
       **/
      NotOwned: AugmentedError<ApiType>
      /**
       * Sender is not a sub-account.
       **/
      NotSub: AugmentedError<ApiType>
      /**
       * Sticky judgement.
       **/
      StickyJudgement: AugmentedError<ApiType>
      /**
       * Too many additional fields.
       **/
      TooManyFields: AugmentedError<ApiType>
      /**
       * Maximum amount of registrars reached. Cannot add any more.
       **/
      TooManyRegistrars: AugmentedError<ApiType>
      /**
       * Too many subs-accounts.
       **/
      TooManySubAccounts: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    inflation: {
      /**
       * Sum of all parts must be one whole (100%).
       **/
      InvalidInflationParameters: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    multisig: {
      /**
       * Call is already approved by this signatory.
       **/
      AlreadyApproved: AugmentedError<ApiType>
      /**
       * The data to be stored is already stored.
       **/
      AlreadyStored: AugmentedError<ApiType>
      /**
       * The maximum weight information provided was too low.
       **/
      MaxWeightTooLow: AugmentedError<ApiType>
      /**
       * Threshold must be 2 or greater.
       **/
      MinimumThreshold: AugmentedError<ApiType>
      /**
       * Call doesn't need any (more) approvals.
       **/
      NoApprovalsNeeded: AugmentedError<ApiType>
      /**
       * Multisig operation not found when attempting to cancel.
       **/
      NotFound: AugmentedError<ApiType>
      /**
       * No timepoint was given, yet the multisig operation is already underway.
       **/
      NoTimepoint: AugmentedError<ApiType>
      /**
       * Only the account that originally created the multisig is able to cancel it.
       **/
      NotOwner: AugmentedError<ApiType>
      /**
       * The sender was contained in the other signatories; it shouldn't be.
       **/
      SenderInSignatories: AugmentedError<ApiType>
      /**
       * The signatories were provided out of order; they should be ordered.
       **/
      SignatoriesOutOfOrder: AugmentedError<ApiType>
      /**
       * There are too few signatories in the list.
       **/
      TooFewSignatories: AugmentedError<ApiType>
      /**
       * There are too many signatories in the list.
       **/
      TooManySignatories: AugmentedError<ApiType>
      /**
       * A timepoint was given, yet no multisig operation is underway.
       **/
      UnexpectedTimepoint: AugmentedError<ApiType>
      /**
       * A different timepoint was given to the multisig operation that is underway.
       **/
      WrongTimepoint: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    parachainSystem: {
      /**
       * The inherent which supplies the host configuration did not run this block.
       **/
      HostConfigurationNotAvailable: AugmentedError<ApiType>
      /**
       * No code upgrade has been authorized.
       **/
      NothingAuthorized: AugmentedError<ApiType>
      /**
       * No validation function upgrade is currently scheduled.
       **/
      NotScheduled: AugmentedError<ApiType>
      /**
       * Attempt to upgrade validation function while existing upgrade pending.
       **/
      OverlappingUpgrades: AugmentedError<ApiType>
      /**
       * Polkadot currently prohibits this parachain from upgrading its validation function.
       **/
      ProhibitedByPolkadot: AugmentedError<ApiType>
      /**
       * The supplied validation function has compiled into a blob larger than Polkadot is
       * willing to run.
       **/
      TooBig: AugmentedError<ApiType>
      /**
       * The given code upgrade has not been authorized.
       **/
      Unauthorized: AugmentedError<ApiType>
      /**
       * The inherent which supplies the validation data did not run this block.
       **/
      ValidationDataNotAvailable: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    polkadotXcm: {
      /**
       * The given account is not an identifiable sovereign account for any location.
       **/
      AccountNotSovereign: AugmentedError<ApiType>
      /**
       * The location is invalid since it already has a subscription from us.
       **/
      AlreadySubscribed: AugmentedError<ApiType>
      /**
       * The given location could not be used (e.g. because it cannot be expressed in the
       * desired version of XCM).
       **/
      BadLocation: AugmentedError<ApiType>
      /**
       * The version of the `Versioned` value used is not able to be interpreted.
       **/
      BadVersion: AugmentedError<ApiType>
      /**
       * Could not re-anchor the assets to declare the fees for the destination chain.
       **/
      CannotReanchor: AugmentedError<ApiType>
      /**
       * The destination `MultiLocation` provided cannot be inverted.
       **/
      DestinationNotInvertible: AugmentedError<ApiType>
      /**
       * The assets to be sent are empty.
       **/
      Empty: AugmentedError<ApiType>
      /**
       * The operation required fees to be paid which the initiator could not meet.
       **/
      FeesNotMet: AugmentedError<ApiType>
      /**
       * The message execution fails the filter.
       **/
      Filtered: AugmentedError<ApiType>
      /**
       * The unlock operation cannot succeed because there are still consumers of the lock.
       **/
      InUse: AugmentedError<ApiType>
      /**
       * Invalid asset for the operation.
       **/
      InvalidAsset: AugmentedError<ApiType>
      /**
       * Origin is invalid for sending.
       **/
      InvalidOrigin: AugmentedError<ApiType>
      /**
       * A remote lock with the corresponding data could not be found.
       **/
      LockNotFound: AugmentedError<ApiType>
      /**
       * The owner does not own (all) of the asset that they wish to do the operation on.
       **/
      LowBalance: AugmentedError<ApiType>
      /**
       * The referenced subscription could not be found.
       **/
      NoSubscription: AugmentedError<ApiType>
      /**
       * There was some other issue (i.e. not to do with routing) in sending the message. Perhaps
       * a lack of space for buffering the message.
       **/
      SendFailure: AugmentedError<ApiType>
      /**
       * Too many assets have been attempted for transfer.
       **/
      TooManyAssets: AugmentedError<ApiType>
      /**
       * The asset owner has too many locks on the asset.
       **/
      TooManyLocks: AugmentedError<ApiType>
      /**
       * The desired destination was unreachable, generally because there is a no way of routing
       * to it.
       **/
      Unreachable: AugmentedError<ApiType>
      /**
       * The message's weight could not be determined.
       **/
      UnweighableMessage: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    preimage: {
      /**
       * Preimage has already been noted on-chain.
       **/
      AlreadyNoted: AugmentedError<ApiType>
      /**
       * The user is not authorized to perform this action.
       **/
      NotAuthorized: AugmentedError<ApiType>
      /**
       * The preimage cannot be removed since it has not yet been noted.
       **/
      NotNoted: AugmentedError<ApiType>
      /**
       * The preimage request cannot be removed since no outstanding requests exist.
       **/
      NotRequested: AugmentedError<ApiType>
      /**
       * A preimage may not be removed when there are outstanding requests.
       **/
      Requested: AugmentedError<ApiType>
      /**
       * Preimage is too large to store on-chain.
       **/
      TooBig: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    proxy: {
      /**
       * Account is already a proxy.
       **/
      Duplicate: AugmentedError<ApiType>
      /**
       * Call may not be made by proxy because it may escalate its privileges.
       **/
      NoPermission: AugmentedError<ApiType>
      /**
       * Cannot add self as proxy.
       **/
      NoSelfProxy: AugmentedError<ApiType>
      /**
       * Proxy registration not found.
       **/
      NotFound: AugmentedError<ApiType>
      /**
       * Sender is not a proxy of the account to be proxied.
       **/
      NotProxy: AugmentedError<ApiType>
      /**
       * There are too many proxies registered or too many announcements pending.
       **/
      TooMany: AugmentedError<ApiType>
      /**
       * Announcement, if made at all, was made too recently.
       **/
      Unannounced: AugmentedError<ApiType>
      /**
       * A call which is incompatible with the proxy type's filter was attempted.
       **/
      Unproxyable: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    scheduler: {
      /**
       * Failed to schedule a call
       **/
      FailedToSchedule: AugmentedError<ApiType>
      /**
       * Attempt to use a non-named function on a named task.
       **/
      Named: AugmentedError<ApiType>
      /**
       * Cannot find the scheduled call.
       **/
      NotFound: AugmentedError<ApiType>
      /**
       * Reschedule failed because it does not change scheduled time.
       **/
      RescheduleNoChange: AugmentedError<ApiType>
      /**
       * Given target block number is in the past.
       **/
      TargetBlockNumberInPast: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    session: {
      /**
       * Registered duplicate key.
       **/
      DuplicatedKey: AugmentedError<ApiType>
      /**
       * Invalid ownership proof.
       **/
      InvalidProof: AugmentedError<ApiType>
      /**
       * Key setting account is not live, so it's impossible to associate keys.
       **/
      NoAccount: AugmentedError<ApiType>
      /**
       * No associated validator ID for account.
       **/
      NoAssociatedValidatorId: AugmentedError<ApiType>
      /**
       * No keys are associated with this account.
       **/
      NoKeys: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    staticPriceProvider: {
      /**
       * Zero is invalid value for the price (hopefully).
       **/
      ZeroPrice: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    sudo: {
      /**
       * Sender must be the Sudo account
       **/
      RequireSudo: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    system: {
      /**
       * The origin filter prevent the call to be dispatched.
       **/
      CallFiltered: AugmentedError<ApiType>
      /**
       * Failed to extract the runtime version from the new runtime.
       *
       * Either calling `Core_version` or decoding `RuntimeVersion` failed.
       **/
      FailedToExtractRuntimeVersion: AugmentedError<ApiType>
      /**
       * The name of specification does not match between the current runtime
       * and the new runtime.
       **/
      InvalidSpecName: AugmentedError<ApiType>
      /**
       * Suicide called when the account has non-default composite data.
       **/
      NonDefaultComposite: AugmentedError<ApiType>
      /**
       * There is a non-zero reference count preventing the account from being purged.
       **/
      NonZeroRefCount: AugmentedError<ApiType>
      /**
       * The specification version is not allowed to decrease between the current runtime
       * and the new runtime.
       **/
      SpecVersionNeedsToIncrease: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    technicalCommittee: {
      /**
       * Members are already initialized!
       **/
      AlreadyInitialized: AugmentedError<ApiType>
      /**
       * Duplicate proposals not allowed
       **/
      DuplicateProposal: AugmentedError<ApiType>
      /**
       * Duplicate vote ignored
       **/
      DuplicateVote: AugmentedError<ApiType>
      /**
       * Account is not a member
       **/
      NotMember: AugmentedError<ApiType>
      /**
       * Proposal must exist
       **/
      ProposalMissing: AugmentedError<ApiType>
      /**
       * The close call was made too early, before the end of the voting.
       **/
      TooEarly: AugmentedError<ApiType>
      /**
       * There can only be a maximum of `MaxProposals` active proposals.
       **/
      TooManyProposals: AugmentedError<ApiType>
      /**
       * Mismatched index
       **/
      WrongIndex: AugmentedError<ApiType>
      /**
       * The given length bound for the proposal was too low.
       **/
      WrongProposalLength: AugmentedError<ApiType>
      /**
       * The given weight bound for the proposal was too low.
       **/
      WrongProposalWeight: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    treasury: {
      /**
       * The spend origin is valid but the amount it is allowed to spend is lower than the
       * amount to be spent.
       **/
      InsufficientPermission: AugmentedError<ApiType>
      /**
       * Proposer's balance is too low.
       **/
      InsufficientProposersBalance: AugmentedError<ApiType>
      /**
       * No proposal or bounty at that index.
       **/
      InvalidIndex: AugmentedError<ApiType>
      /**
       * Proposal has not been approved.
       **/
      ProposalNotApproved: AugmentedError<ApiType>
      /**
       * Too many approvals in the queue.
       **/
      TooManyApprovals: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    unifiedAccounts: {
      /**
       * AccountId or EvmAddress already mapped
       **/
      AlreadyMapped: AugmentedError<ApiType>
      /**
       * Funds unavailable to claim account
       **/
      FundsUnavailable: AugmentedError<ApiType>
      /**
       * The signature verification failed due to mismatch evm address
       **/
      InvalidSignature: AugmentedError<ApiType>
      /**
       * The signature is malformed
       **/
      UnexpectedSignatureFormat: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    utility: {
      /**
       * Too many calls batched.
       **/
      TooManyCalls: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    vesting: {
      /**
       * Amount being transferred is too low to create a vesting schedule.
       **/
      AmountLow: AugmentedError<ApiType>
      /**
       * The account already has `MaxVestingSchedules` count of schedules and thus
       * cannot add another one. Consider merging existing schedules in order to add another.
       **/
      AtMaxVestingSchedules: AugmentedError<ApiType>
      /**
       * Failed to create a new schedule because some parameter was invalid.
       **/
      InvalidScheduleParams: AugmentedError<ApiType>
      /**
       * The account given is not vesting.
       **/
      NotVesting: AugmentedError<ApiType>
      /**
       * An index was out of bounds of the vesting schedules.
       **/
      ScheduleIndexOutOfBounds: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    xcAssetConfig: {
      /**
       * Asset is already registered.
       **/
      AssetAlreadyRegistered: AugmentedError<ApiType>
      /**
       * Asset does not exist (hasn't been registered).
       **/
      AssetDoesNotExist: AugmentedError<ApiType>
      /**
       * Failed to convert to latest versioned MultiLocation
       **/
      MultiLocationNotSupported: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    xcmpQueue: {
      /**
       * Bad overweight index.
       **/
      BadOverweightIndex: AugmentedError<ApiType>
      /**
       * Bad XCM data.
       **/
      BadXcm: AugmentedError<ApiType>
      /**
       * Bad XCM origin.
       **/
      BadXcmOrigin: AugmentedError<ApiType>
      /**
       * Failed to send XCM message.
       **/
      FailedToSend: AugmentedError<ApiType>
      /**
       * Provided weight is possibly not enough to execute the message.
       **/
      WeightOverLimit: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
    xTokens: {
      /**
       * Asset has no reserve location.
       **/
      AssetHasNoReserve: AugmentedError<ApiType>
      /**
       * The specified index does not exist in a MultiAssets struct.
       **/
      AssetIndexNonExistent: AugmentedError<ApiType>
      /**
       * The version of the `Versioned` value used is not able to be
       * interpreted.
       **/
      BadVersion: AugmentedError<ApiType>
      /**
       * Could not re-anchor the assets to declare the fees for the
       * destination chain.
       **/
      CannotReanchor: AugmentedError<ApiType>
      /**
       * The destination `MultiLocation` provided cannot be inverted.
       **/
      DestinationNotInvertible: AugmentedError<ApiType>
      /**
       * We tried sending distinct asset and fee but they have different
       * reserve chains.
       **/
      DistinctReserveForAssetAndFee: AugmentedError<ApiType>
      /**
       * Fee is not enough.
       **/
      FeeNotEnough: AugmentedError<ApiType>
      /**
       * Could not get ancestry of asset reserve location.
       **/
      InvalidAncestry: AugmentedError<ApiType>
      /**
       * The MultiAsset is invalid.
       **/
      InvalidAsset: AugmentedError<ApiType>
      /**
       * Invalid transfer destination.
       **/
      InvalidDest: AugmentedError<ApiType>
      /**
       * MinXcmFee not registered for certain reserve location
       **/
      MinXcmFeeNotDefined: AugmentedError<ApiType>
      /**
       * Not cross-chain transfer.
       **/
      NotCrossChainTransfer: AugmentedError<ApiType>
      /**
       * Currency is not cross-chain transferable.
       **/
      NotCrossChainTransferableCurrency: AugmentedError<ApiType>
      /**
       * Not supported MultiLocation
       **/
      NotSupportedMultiLocation: AugmentedError<ApiType>
      /**
       * The number of assets to be sent is over the maximum.
       **/
      TooManyAssetsBeingSent: AugmentedError<ApiType>
      /**
       * The message's weight could not be determined.
       **/
      UnweighableMessage: AugmentedError<ApiType>
      /**
       * XCM execution failed.
       **/
      XcmExecutionFailed: AugmentedError<ApiType>
      /**
       * The transfering asset amount is zero.
       **/
      ZeroAmount: AugmentedError<ApiType>
      /**
       * The fee is zero.
       **/
      ZeroFee: AugmentedError<ApiType>
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>
    }
  } // AugmentedErrors
} // declare module
