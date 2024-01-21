// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/api-base/types/events'

import type { ApiTypes, AugmentedEvent } from '@polkadot/api-base/types'
import type {
  Bytes,
  Null,
  Option,
  Result,
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
import type { AccountId32, H160, H256 } from '@polkadot/types/interfaces/runtime'
import type {
  AstarPrimitivesDappStakingSmartContract,
  EthereumLog,
  EvmCoreErrorExitReason,
  FrameSupportDispatchDispatchInfo,
  FrameSupportTokensMiscBalanceStatus,
  PalletContractsOrigin,
  PalletDappStakingV3ForcingType,
  PalletDappStakingV3Subperiod,
  PalletDemocracyMetadataOwner,
  PalletDemocracyVoteAccountVote,
  PalletDemocracyVoteThreshold,
  PalletInflationInflationConfiguration,
  PalletMultisigTimepoint,
  ShibuyaRuntimeProxyType,
  SpRuntimeDispatchError,
  SpWeightsWeightV2Weight,
  XcmV3MultiAsset,
  XcmV3MultiLocation,
  XcmV3MultiassetMultiAssets,
  XcmV3Response,
  XcmV3TraitsError,
  XcmV3TraitsOutcome,
  XcmV3Xcm,
  XcmVersionedMultiAssets,
  XcmVersionedMultiLocation,
} from '@polkadot/types/lookup'

export type __AugmentedEvent<ApiType extends ApiTypes> = AugmentedEvent<ApiType>

declare module '@polkadot/api-base/types/events' {
  interface AugmentedEvents<ApiType extends ApiTypes> {
    assets: {
      /**
       * Accounts were destroyed for given asset.
       **/
      AccountsDestroyed: AugmentedEvent<
        ApiType,
        [assetId: u128, accountsDestroyed: u32, accountsRemaining: u32],
        { assetId: u128; accountsDestroyed: u32; accountsRemaining: u32 }
      >
      /**
       * An approval for account `delegate` was cancelled by `owner`.
       **/
      ApprovalCancelled: AugmentedEvent<
        ApiType,
        [assetId: u128, owner: AccountId32, delegate: AccountId32],
        { assetId: u128; owner: AccountId32; delegate: AccountId32 }
      >
      /**
       * Approvals were destroyed for given asset.
       **/
      ApprovalsDestroyed: AugmentedEvent<
        ApiType,
        [assetId: u128, approvalsDestroyed: u32, approvalsRemaining: u32],
        { assetId: u128; approvalsDestroyed: u32; approvalsRemaining: u32 }
      >
      /**
       * (Additional) funds have been approved for transfer to a destination account.
       **/
      ApprovedTransfer: AugmentedEvent<
        ApiType,
        [assetId: u128, source: AccountId32, delegate: AccountId32, amount: u128],
        { assetId: u128; source: AccountId32; delegate: AccountId32; amount: u128 }
      >
      /**
       * Some asset `asset_id` was frozen.
       **/
      AssetFrozen: AugmentedEvent<ApiType, [assetId: u128], { assetId: u128 }>
      /**
       * The min_balance of an asset has been updated by the asset owner.
       **/
      AssetMinBalanceChanged: AugmentedEvent<
        ApiType,
        [assetId: u128, newMinBalance: u128],
        { assetId: u128; newMinBalance: u128 }
      >
      /**
       * An asset has had its attributes changed by the `Force` origin.
       **/
      AssetStatusChanged: AugmentedEvent<ApiType, [assetId: u128], { assetId: u128 }>
      /**
       * Some asset `asset_id` was thawed.
       **/
      AssetThawed: AugmentedEvent<ApiType, [assetId: u128], { assetId: u128 }>
      /**
       * Some account `who` was blocked.
       **/
      Blocked: AugmentedEvent<ApiType, [assetId: u128, who: AccountId32], { assetId: u128; who: AccountId32 }>
      /**
       * Some assets were destroyed.
       **/
      Burned: AugmentedEvent<
        ApiType,
        [assetId: u128, owner: AccountId32, balance: u128],
        { assetId: u128; owner: AccountId32; balance: u128 }
      >
      /**
       * Some asset class was created.
       **/
      Created: AugmentedEvent<
        ApiType,
        [assetId: u128, creator: AccountId32, owner: AccountId32],
        { assetId: u128; creator: AccountId32; owner: AccountId32 }
      >
      /**
       * An asset class was destroyed.
       **/
      Destroyed: AugmentedEvent<ApiType, [assetId: u128], { assetId: u128 }>
      /**
       * An asset class is in the process of being destroyed.
       **/
      DestructionStarted: AugmentedEvent<ApiType, [assetId: u128], { assetId: u128 }>
      /**
       * Some asset class was force-created.
       **/
      ForceCreated: AugmentedEvent<ApiType, [assetId: u128, owner: AccountId32], { assetId: u128; owner: AccountId32 }>
      /**
       * Some account `who` was frozen.
       **/
      Frozen: AugmentedEvent<ApiType, [assetId: u128, who: AccountId32], { assetId: u128; who: AccountId32 }>
      /**
       * Some assets were issued.
       **/
      Issued: AugmentedEvent<
        ApiType,
        [assetId: u128, owner: AccountId32, amount: u128],
        { assetId: u128; owner: AccountId32; amount: u128 }
      >
      /**
       * Metadata has been cleared for an asset.
       **/
      MetadataCleared: AugmentedEvent<ApiType, [assetId: u128], { assetId: u128 }>
      /**
       * New metadata has been set for an asset.
       **/
      MetadataSet: AugmentedEvent<
        ApiType,
        [assetId: u128, name: Bytes, symbol_: Bytes, decimals: u8, isFrozen: bool],
        { assetId: u128; name: Bytes; symbol: Bytes; decimals: u8; isFrozen: bool }
      >
      /**
       * The owner changed.
       **/
      OwnerChanged: AugmentedEvent<ApiType, [assetId: u128, owner: AccountId32], { assetId: u128; owner: AccountId32 }>
      /**
       * The management team changed.
       **/
      TeamChanged: AugmentedEvent<
        ApiType,
        [assetId: u128, issuer: AccountId32, admin: AccountId32, freezer: AccountId32],
        { assetId: u128; issuer: AccountId32; admin: AccountId32; freezer: AccountId32 }
      >
      /**
       * Some account `who` was thawed.
       **/
      Thawed: AugmentedEvent<ApiType, [assetId: u128, who: AccountId32], { assetId: u128; who: AccountId32 }>
      /**
       * Some account `who` was created with a deposit from `depositor`.
       **/
      Touched: AugmentedEvent<
        ApiType,
        [assetId: u128, who: AccountId32, depositor: AccountId32],
        { assetId: u128; who: AccountId32; depositor: AccountId32 }
      >
      /**
       * Some assets were transferred.
       **/
      Transferred: AugmentedEvent<
        ApiType,
        [assetId: u128, from: AccountId32, to: AccountId32, amount: u128],
        { assetId: u128; from: AccountId32; to: AccountId32; amount: u128 }
      >
      /**
       * An `amount` was transferred in its entirety from `owner` to `destination` by
       * the approved `delegate`.
       **/
      TransferredApproved: AugmentedEvent<
        ApiType,
        [assetId: u128, owner: AccountId32, delegate: AccountId32, destination: AccountId32, amount: u128],
        { assetId: u128; owner: AccountId32; delegate: AccountId32; destination: AccountId32; amount: u128 }
      >
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    balances: {
      /**
       * A balance was set by root.
       **/
      BalanceSet: AugmentedEvent<ApiType, [who: AccountId32, free: u128], { who: AccountId32; free: u128 }>
      /**
       * Some amount was burned from an account.
       **/
      Burned: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32; amount: u128 }>
      /**
       * Some amount was deposited (e.g. for transaction fees).
       **/
      Deposit: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32; amount: u128 }>
      /**
       * An account was removed whose balance was non-zero but below ExistentialDeposit,
       * resulting in an outright loss.
       **/
      DustLost: AugmentedEvent<ApiType, [account: AccountId32, amount: u128], { account: AccountId32; amount: u128 }>
      /**
       * An account was created with some free balance.
       **/
      Endowed: AugmentedEvent<
        ApiType,
        [account: AccountId32, freeBalance: u128],
        { account: AccountId32; freeBalance: u128 }
      >
      /**
       * Some balance was frozen.
       **/
      Frozen: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32; amount: u128 }>
      /**
       * Total issuance was increased by `amount`, creating a credit to be balanced.
       **/
      Issued: AugmentedEvent<ApiType, [amount: u128], { amount: u128 }>
      /**
       * Some balance was locked.
       **/
      Locked: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32; amount: u128 }>
      /**
       * Some amount was minted into an account.
       **/
      Minted: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32; amount: u128 }>
      /**
       * Total issuance was decreased by `amount`, creating a debt to be balanced.
       **/
      Rescinded: AugmentedEvent<ApiType, [amount: u128], { amount: u128 }>
      /**
       * Some balance was reserved (moved from free to reserved).
       **/
      Reserved: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32; amount: u128 }>
      /**
       * Some balance was moved from the reserve of the first account to the second account.
       * Final argument indicates the destination balance type.
       **/
      ReserveRepatriated: AugmentedEvent<
        ApiType,
        [from: AccountId32, to: AccountId32, amount: u128, destinationStatus: FrameSupportTokensMiscBalanceStatus],
        { from: AccountId32; to: AccountId32; amount: u128; destinationStatus: FrameSupportTokensMiscBalanceStatus }
      >
      /**
       * Some amount was restored into an account.
       **/
      Restored: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32; amount: u128 }>
      /**
       * Some amount was removed from the account (e.g. for misbehavior).
       **/
      Slashed: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32; amount: u128 }>
      /**
       * Some amount was suspended from an account (it can be restored later).
       **/
      Suspended: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32; amount: u128 }>
      /**
       * Some balance was thawed.
       **/
      Thawed: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32; amount: u128 }>
      /**
       * Transfer succeeded.
       **/
      Transfer: AugmentedEvent<
        ApiType,
        [from: AccountId32, to: AccountId32, amount: u128],
        { from: AccountId32; to: AccountId32; amount: u128 }
      >
      /**
       * Some balance was unlocked.
       **/
      Unlocked: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32; amount: u128 }>
      /**
       * Some balance was unreserved (moved from reserved to free).
       **/
      Unreserved: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32; amount: u128 }>
      /**
       * An account was upgraded.
       **/
      Upgraded: AugmentedEvent<ApiType, [who: AccountId32], { who: AccountId32 }>
      /**
       * Some amount was withdrawn from the account (e.g. for transaction fees).
       **/
      Withdraw: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32; amount: u128 }>
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    collatorSelection: {
      CandidateAdded: AugmentedEvent<ApiType, [AccountId32, u128]>
      CandidateRemoved: AugmentedEvent<ApiType, [AccountId32]>
      CandidateSlashed: AugmentedEvent<ApiType, [AccountId32]>
      NewCandidacyBond: AugmentedEvent<ApiType, [u128]>
      NewDesiredCandidates: AugmentedEvent<ApiType, [u32]>
      NewInvulnerables: AugmentedEvent<ApiType, [Vec<AccountId32>]>
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    contracts: {
      /**
       * A contract was called either by a plain account or another contract.
       *
       * # Note
       *
       * Please keep in mind that like all events this is only emitted for successful
       * calls. This is because on failure all storage changes including events are
       * rolled back.
       **/
      Called: AugmentedEvent<
        ApiType,
        [caller: PalletContractsOrigin, contract: AccountId32],
        { caller: PalletContractsOrigin; contract: AccountId32 }
      >
      /**
       * A code with the specified hash was removed.
       **/
      CodeRemoved: AugmentedEvent<ApiType, [codeHash: H256], { codeHash: H256 }>
      /**
       * Code with the specified hash has been stored.
       **/
      CodeStored: AugmentedEvent<ApiType, [codeHash: H256], { codeHash: H256 }>
      /**
       * A contract's code was updated.
       **/
      ContractCodeUpdated: AugmentedEvent<
        ApiType,
        [contract: AccountId32, newCodeHash: H256, oldCodeHash: H256],
        { contract: AccountId32; newCodeHash: H256; oldCodeHash: H256 }
      >
      /**
       * A custom event emitted by the contract.
       **/
      ContractEmitted: AugmentedEvent<
        ApiType,
        [contract: AccountId32, data: Bytes],
        { contract: AccountId32; data: Bytes }
      >
      /**
       * A contract delegate called a code hash.
       *
       * # Note
       *
       * Please keep in mind that like all events this is only emitted for successful
       * calls. This is because on failure all storage changes including events are
       * rolled back.
       **/
      DelegateCalled: AugmentedEvent<
        ApiType,
        [contract: AccountId32, codeHash: H256],
        { contract: AccountId32; codeHash: H256 }
      >
      /**
       * Contract deployed by address at the specified address.
       **/
      Instantiated: AugmentedEvent<
        ApiType,
        [deployer: AccountId32, contract: AccountId32],
        { deployer: AccountId32; contract: AccountId32 }
      >
      /**
       * Contract has been removed.
       *
       * # Note
       *
       * The only way for a contract to be removed and emitting this event is by calling
       * `seal_terminate`.
       **/
      Terminated: AugmentedEvent<
        ApiType,
        [contract: AccountId32, beneficiary: AccountId32],
        { contract: AccountId32; beneficiary: AccountId32 }
      >
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    council: {
      /**
       * A motion was approved by the required threshold.
       **/
      Approved: AugmentedEvent<ApiType, [proposalHash: H256], { proposalHash: H256 }>
      /**
       * A proposal was closed because its threshold was reached or after its duration was up.
       **/
      Closed: AugmentedEvent<
        ApiType,
        [proposalHash: H256, yes: u32, no: u32],
        { proposalHash: H256; yes: u32; no: u32 }
      >
      /**
       * A motion was not approved by the required threshold.
       **/
      Disapproved: AugmentedEvent<ApiType, [proposalHash: H256], { proposalHash: H256 }>
      /**
       * A motion was executed; result will be `Ok` if it returned without error.
       **/
      Executed: AugmentedEvent<
        ApiType,
        [proposalHash: H256, result: Result<Null, SpRuntimeDispatchError>],
        { proposalHash: H256; result: Result<Null, SpRuntimeDispatchError> }
      >
      /**
       * A single member did some action; result will be `Ok` if it returned without error.
       **/
      MemberExecuted: AugmentedEvent<
        ApiType,
        [proposalHash: H256, result: Result<Null, SpRuntimeDispatchError>],
        { proposalHash: H256; result: Result<Null, SpRuntimeDispatchError> }
      >
      /**
       * A motion (given hash) has been proposed (by given account) with a threshold (given
       * `MemberCount`).
       **/
      Proposed: AugmentedEvent<
        ApiType,
        [account: AccountId32, proposalIndex: u32, proposalHash: H256, threshold: u32],
        { account: AccountId32; proposalIndex: u32; proposalHash: H256; threshold: u32 }
      >
      /**
       * A motion (given hash) has been voted on by given account, leaving
       * a tally (yes votes and no votes given respectively as `MemberCount`).
       **/
      Voted: AugmentedEvent<
        ApiType,
        [account: AccountId32, proposalHash: H256, voted: bool, yes: u32, no: u32],
        { account: AccountId32; proposalHash: H256; voted: bool; yes: u32; no: u32 }
      >
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    cumulusXcm: {
      /**
       * Downward message executed with the given outcome.
       * \[ id, outcome \]
       **/
      ExecutedDownward: AugmentedEvent<ApiType, [U8aFixed, XcmV3TraitsOutcome]>
      /**
       * Downward message is invalid XCM.
       * \[ id \]
       **/
      InvalidFormat: AugmentedEvent<ApiType, [U8aFixed]>
      /**
       * Downward message is unsupported version of XCM.
       * \[ id \]
       **/
      UnsupportedVersion: AugmentedEvent<ApiType, [U8aFixed]>
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    dappStaking: {
      /**
       * Bonus reward has been paid out to a loyal staker.
       **/
      BonusReward: AugmentedEvent<
        ApiType,
        [account: AccountId32, smartContract: AstarPrimitivesDappStakingSmartContract, period: u32, amount: u128],
        { account: AccountId32; smartContract: AstarPrimitivesDappStakingSmartContract; period: u32; amount: u128 }
      >
      /**
       * Account has claimed unlocked amount, removing the lock from it.
       **/
      ClaimedUnlocked: AugmentedEvent<
        ApiType,
        [account: AccountId32, amount: u128],
        { account: AccountId32; amount: u128 }
      >
      /**
       * dApp owner has been changed.
       **/
      DAppOwnerChanged: AugmentedEvent<
        ApiType,
        [smartContract: AstarPrimitivesDappStakingSmartContract, newOwner: AccountId32],
        { smartContract: AstarPrimitivesDappStakingSmartContract; newOwner: AccountId32 }
      >
      /**
       * A smart contract has been registered for dApp staking
       **/
      DAppRegistered: AugmentedEvent<
        ApiType,
        [owner: AccountId32, smartContract: AstarPrimitivesDappStakingSmartContract, dappId: u16],
        { owner: AccountId32; smartContract: AstarPrimitivesDappStakingSmartContract; dappId: u16 }
      >
      /**
       * dApp reward has been paid out to a beneficiary.
       **/
      DAppReward: AugmentedEvent<
        ApiType,
        [
          beneficiary: AccountId32,
          smartContract: AstarPrimitivesDappStakingSmartContract,
          tierId: u8,
          era: u32,
          amount: u128
        ],
        {
          beneficiary: AccountId32
          smartContract: AstarPrimitivesDappStakingSmartContract
          tierId: u8
          era: u32
          amount: u128
        }
      >
      /**
       * dApp reward destination has been updated.
       **/
      DAppRewardDestinationUpdated: AugmentedEvent<
        ApiType,
        [smartContract: AstarPrimitivesDappStakingSmartContract, beneficiary: Option<AccountId32>],
        { smartContract: AstarPrimitivesDappStakingSmartContract; beneficiary: Option<AccountId32> }
      >
      /**
       * dApp has been unregistered
       **/
      DAppUnregistered: AugmentedEvent<
        ApiType,
        [smartContract: AstarPrimitivesDappStakingSmartContract, era: u32],
        { smartContract: AstarPrimitivesDappStakingSmartContract; era: u32 }
      >
      /**
       * Some expired stake entries have been removed from storage.
       **/
      ExpiredEntriesRemoved: AugmentedEvent<
        ApiType,
        [account: AccountId32, count: u16],
        { account: AccountId32; count: u16 }
      >
      /**
       * Privileged origin has forced a new era and possibly a subperiod to start from next block.
       **/
      Force: AugmentedEvent<
        ApiType,
        [forcingType: PalletDappStakingV3ForcingType],
        { forcingType: PalletDappStakingV3ForcingType }
      >
      /**
       * Account has locked some amount into dApp staking.
       **/
      Locked: AugmentedEvent<ApiType, [account: AccountId32, amount: u128], { account: AccountId32; amount: u128 }>
      /**
       * Maintenance mode has been either enabled or disabled.
       **/
      MaintenanceMode: AugmentedEvent<ApiType, [enabled: bool], { enabled: bool }>
      /**
       * New era has started.
       **/
      NewEra: AugmentedEvent<ApiType, [era: u32], { era: u32 }>
      /**
       * New subperiod has started.
       **/
      NewSubperiod: AugmentedEvent<
        ApiType,
        [subperiod: PalletDappStakingV3Subperiod, number: u32],
        { subperiod: PalletDappStakingV3Subperiod; number: u32 }
      >
      /**
       * Account has relocked all of the unlocking chunks.
       **/
      Relock: AugmentedEvent<ApiType, [account: AccountId32, amount: u128], { account: AccountId32; amount: u128 }>
      /**
       * Account has claimed some stake rewards.
       **/
      Reward: AugmentedEvent<
        ApiType,
        [account: AccountId32, era: u32, amount: u128],
        { account: AccountId32; era: u32; amount: u128 }
      >
      /**
       * Account has staked some amount on a smart contract.
       **/
      Stake: AugmentedEvent<
        ApiType,
        [account: AccountId32, smartContract: AstarPrimitivesDappStakingSmartContract, amount: u128],
        { account: AccountId32; smartContract: AstarPrimitivesDappStakingSmartContract; amount: u128 }
      >
      /**
       * Account has started the unlocking process for some amount.
       **/
      Unlocking: AugmentedEvent<ApiType, [account: AccountId32, amount: u128], { account: AccountId32; amount: u128 }>
      /**
       * Account has unstaked some amount from a smart contract.
       **/
      Unstake: AugmentedEvent<
        ApiType,
        [account: AccountId32, smartContract: AstarPrimitivesDappStakingSmartContract, amount: u128],
        { account: AccountId32; smartContract: AstarPrimitivesDappStakingSmartContract; amount: u128 }
      >
      /**
       * Account has unstaked funds from an unregistered smart contract
       **/
      UnstakeFromUnregistered: AugmentedEvent<
        ApiType,
        [account: AccountId32, smartContract: AstarPrimitivesDappStakingSmartContract, amount: u128],
        { account: AccountId32; smartContract: AstarPrimitivesDappStakingSmartContract; amount: u128 }
      >
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    democracy: {
      /**
       * A proposal_hash has been blacklisted permanently.
       **/
      Blacklisted: AugmentedEvent<ApiType, [proposalHash: H256], { proposalHash: H256 }>
      /**
       * A referendum has been cancelled.
       **/
      Cancelled: AugmentedEvent<ApiType, [refIndex: u32], { refIndex: u32 }>
      /**
       * An account has delegated their vote to another account.
       **/
      Delegated: AugmentedEvent<
        ApiType,
        [who: AccountId32, target: AccountId32],
        { who: AccountId32; target: AccountId32 }
      >
      /**
       * An external proposal has been tabled.
       **/
      ExternalTabled: AugmentedEvent<ApiType, []>
      /**
       * Metadata for a proposal or a referendum has been cleared.
       **/
      MetadataCleared: AugmentedEvent<
        ApiType,
        [owner: PalletDemocracyMetadataOwner, hash_: H256],
        { owner: PalletDemocracyMetadataOwner; hash_: H256 }
      >
      /**
       * Metadata for a proposal or a referendum has been set.
       **/
      MetadataSet: AugmentedEvent<
        ApiType,
        [owner: PalletDemocracyMetadataOwner, hash_: H256],
        { owner: PalletDemocracyMetadataOwner; hash_: H256 }
      >
      /**
       * Metadata has been transferred to new owner.
       **/
      MetadataTransferred: AugmentedEvent<
        ApiType,
        [prevOwner: PalletDemocracyMetadataOwner, owner: PalletDemocracyMetadataOwner, hash_: H256],
        { prevOwner: PalletDemocracyMetadataOwner; owner: PalletDemocracyMetadataOwner; hash_: H256 }
      >
      /**
       * A proposal has been rejected by referendum.
       **/
      NotPassed: AugmentedEvent<ApiType, [refIndex: u32], { refIndex: u32 }>
      /**
       * A proposal has been approved by referendum.
       **/
      Passed: AugmentedEvent<ApiType, [refIndex: u32], { refIndex: u32 }>
      /**
       * A proposal got canceled.
       **/
      ProposalCanceled: AugmentedEvent<ApiType, [propIndex: u32], { propIndex: u32 }>
      /**
       * A motion has been proposed by a public account.
       **/
      Proposed: AugmentedEvent<ApiType, [proposalIndex: u32, deposit: u128], { proposalIndex: u32; deposit: u128 }>
      /**
       * An account has secconded a proposal
       **/
      Seconded: AugmentedEvent<
        ApiType,
        [seconder: AccountId32, propIndex: u32],
        { seconder: AccountId32; propIndex: u32 }
      >
      /**
       * A referendum has begun.
       **/
      Started: AugmentedEvent<
        ApiType,
        [refIndex: u32, threshold: PalletDemocracyVoteThreshold],
        { refIndex: u32; threshold: PalletDemocracyVoteThreshold }
      >
      /**
       * A public proposal has been tabled for referendum vote.
       **/
      Tabled: AugmentedEvent<ApiType, [proposalIndex: u32, deposit: u128], { proposalIndex: u32; deposit: u128 }>
      /**
       * An account has cancelled a previous delegation operation.
       **/
      Undelegated: AugmentedEvent<ApiType, [account: AccountId32], { account: AccountId32 }>
      /**
       * An external proposal has been vetoed.
       **/
      Vetoed: AugmentedEvent<
        ApiType,
        [who: AccountId32, proposalHash: H256, until: u32],
        { who: AccountId32; proposalHash: H256; until: u32 }
      >
      /**
       * An account has voted in a referendum
       **/
      Voted: AugmentedEvent<
        ApiType,
        [voter: AccountId32, refIndex: u32, vote: PalletDemocracyVoteAccountVote],
        { voter: AccountId32; refIndex: u32; vote: PalletDemocracyVoteAccountVote }
      >
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    dmpQueue: {
      /**
       * Downward message executed with the given outcome.
       **/
      ExecutedDownward: AugmentedEvent<
        ApiType,
        [messageId: U8aFixed, outcome: XcmV3TraitsOutcome],
        { messageId: U8aFixed; outcome: XcmV3TraitsOutcome }
      >
      /**
       * Downward message is invalid XCM.
       **/
      InvalidFormat: AugmentedEvent<ApiType, [messageId: U8aFixed], { messageId: U8aFixed }>
      /**
       * The maximum number of downward messages was.
       **/
      MaxMessagesExhausted: AugmentedEvent<ApiType, [messageId: U8aFixed], { messageId: U8aFixed }>
      /**
       * Downward message is overweight and was placed in the overweight queue.
       **/
      OverweightEnqueued: AugmentedEvent<
        ApiType,
        [messageId: U8aFixed, overweightIndex: u64, requiredWeight: SpWeightsWeightV2Weight],
        { messageId: U8aFixed; overweightIndex: u64; requiredWeight: SpWeightsWeightV2Weight }
      >
      /**
       * Downward message from the overweight queue was executed.
       **/
      OverweightServiced: AugmentedEvent<
        ApiType,
        [overweightIndex: u64, weightUsed: SpWeightsWeightV2Weight],
        { overweightIndex: u64; weightUsed: SpWeightsWeightV2Weight }
      >
      /**
       * Downward message is unsupported version of XCM.
       **/
      UnsupportedVersion: AugmentedEvent<ApiType, [messageId: U8aFixed], { messageId: U8aFixed }>
      /**
       * The weight limit for handling downward messages was reached.
       **/
      WeightExhausted: AugmentedEvent<
        ApiType,
        [messageId: U8aFixed, remainingWeight: SpWeightsWeightV2Weight, requiredWeight: SpWeightsWeightV2Weight],
        { messageId: U8aFixed; remainingWeight: SpWeightsWeightV2Weight; requiredWeight: SpWeightsWeightV2Weight }
      >
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    dynamicEvmBaseFee: {
      /**
       * New `base fee per gas` value has been force-set.
       **/
      NewBaseFeePerGas: AugmentedEvent<ApiType, [fee: U256], { fee: U256 }>
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    ethereum: {
      /**
       * An ethereum transaction was successfully executed.
       **/
      Executed: AugmentedEvent<
        ApiType,
        [from: H160, to: H160, transactionHash: H256, exitReason: EvmCoreErrorExitReason, extraData: Bytes],
        { from: H160; to: H160; transactionHash: H256; exitReason: EvmCoreErrorExitReason; extraData: Bytes }
      >
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    evm: {
      /**
       * A contract has been created at given address.
       **/
      Created: AugmentedEvent<ApiType, [address: H160], { address: H160 }>
      /**
       * A contract was attempted to be created, but the execution failed.
       **/
      CreatedFailed: AugmentedEvent<ApiType, [address: H160], { address: H160 }>
      /**
       * A contract has been executed successfully with states applied.
       **/
      Executed: AugmentedEvent<ApiType, [address: H160], { address: H160 }>
      /**
       * A contract has been executed with errors. States are reverted with only gas fees applied.
       **/
      ExecutedFailed: AugmentedEvent<ApiType, [address: H160], { address: H160 }>
      /**
       * Ethereum events from contracts.
       **/
      Log: AugmentedEvent<ApiType, [log: EthereumLog], { log: EthereumLog }>
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    identity: {
      /**
       * A name was cleared, and the given balance returned.
       **/
      IdentityCleared: AugmentedEvent<ApiType, [who: AccountId32, deposit: u128], { who: AccountId32; deposit: u128 }>
      /**
       * A name was removed and the given balance slashed.
       **/
      IdentityKilled: AugmentedEvent<ApiType, [who: AccountId32, deposit: u128], { who: AccountId32; deposit: u128 }>
      /**
       * A name was set or reset (which will remove all judgements).
       **/
      IdentitySet: AugmentedEvent<ApiType, [who: AccountId32], { who: AccountId32 }>
      /**
       * A judgement was given by a registrar.
       **/
      JudgementGiven: AugmentedEvent<
        ApiType,
        [target: AccountId32, registrarIndex: u32],
        { target: AccountId32; registrarIndex: u32 }
      >
      /**
       * A judgement was asked from a registrar.
       **/
      JudgementRequested: AugmentedEvent<
        ApiType,
        [who: AccountId32, registrarIndex: u32],
        { who: AccountId32; registrarIndex: u32 }
      >
      /**
       * A judgement request was retracted.
       **/
      JudgementUnrequested: AugmentedEvent<
        ApiType,
        [who: AccountId32, registrarIndex: u32],
        { who: AccountId32; registrarIndex: u32 }
      >
      /**
       * A registrar was added.
       **/
      RegistrarAdded: AugmentedEvent<ApiType, [registrarIndex: u32], { registrarIndex: u32 }>
      /**
       * A sub-identity was added to an identity and the deposit paid.
       **/
      SubIdentityAdded: AugmentedEvent<
        ApiType,
        [sub: AccountId32, main: AccountId32, deposit: u128],
        { sub: AccountId32; main: AccountId32; deposit: u128 }
      >
      /**
       * A sub-identity was removed from an identity and the deposit freed.
       **/
      SubIdentityRemoved: AugmentedEvent<
        ApiType,
        [sub: AccountId32, main: AccountId32, deposit: u128],
        { sub: AccountId32; main: AccountId32; deposit: u128 }
      >
      /**
       * A sub-identity was cleared, and the given deposit repatriated from the
       * main identity account to the sub-identity account.
       **/
      SubIdentityRevoked: AugmentedEvent<
        ApiType,
        [sub: AccountId32, main: AccountId32, deposit: u128],
        { sub: AccountId32; main: AccountId32; deposit: u128 }
      >
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    inflation: {
      /**
       * Inflation recalculation has been forced.
       **/
      ForcedInflationRecalculation: AugmentedEvent<
        ApiType,
        [config: PalletInflationInflationConfiguration],
        { config: PalletInflationInflationConfiguration }
      >
      /**
       * Inflation configuration has been force changed. This will have an immediate effect from this block.
       **/
      InflationConfigurationForceChanged: AugmentedEvent<
        ApiType,
        [config: PalletInflationInflationConfiguration],
        { config: PalletInflationInflationConfiguration }
      >
      /**
       * Inflation parameters have been force changed. This will have effect on the next inflation recalculation.
       **/
      InflationParametersForceChanged: AugmentedEvent<ApiType, []>
      /**
       * New inflation configuration has been set.
       **/
      NewInflationConfiguration: AugmentedEvent<
        ApiType,
        [config: PalletInflationInflationConfiguration],
        { config: PalletInflationInflationConfiguration }
      >
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    multisig: {
      /**
       * A multisig operation has been approved by someone.
       **/
      MultisigApproval: AugmentedEvent<
        ApiType,
        [approving: AccountId32, timepoint: PalletMultisigTimepoint, multisig: AccountId32, callHash: U8aFixed],
        { approving: AccountId32; timepoint: PalletMultisigTimepoint; multisig: AccountId32; callHash: U8aFixed }
      >
      /**
       * A multisig operation has been cancelled.
       **/
      MultisigCancelled: AugmentedEvent<
        ApiType,
        [cancelling: AccountId32, timepoint: PalletMultisigTimepoint, multisig: AccountId32, callHash: U8aFixed],
        { cancelling: AccountId32; timepoint: PalletMultisigTimepoint; multisig: AccountId32; callHash: U8aFixed }
      >
      /**
       * A multisig operation has been executed.
       **/
      MultisigExecuted: AugmentedEvent<
        ApiType,
        [
          approving: AccountId32,
          timepoint: PalletMultisigTimepoint,
          multisig: AccountId32,
          callHash: U8aFixed,
          result: Result<Null, SpRuntimeDispatchError>
        ],
        {
          approving: AccountId32
          timepoint: PalletMultisigTimepoint
          multisig: AccountId32
          callHash: U8aFixed
          result: Result<Null, SpRuntimeDispatchError>
        }
      >
      /**
       * A new multisig operation has begun.
       **/
      NewMultisig: AugmentedEvent<
        ApiType,
        [approving: AccountId32, multisig: AccountId32, callHash: U8aFixed],
        { approving: AccountId32; multisig: AccountId32; callHash: U8aFixed }
      >
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    parachainSystem: {
      /**
       * Downward messages were processed using the given weight.
       **/
      DownwardMessagesProcessed: AugmentedEvent<
        ApiType,
        [weightUsed: SpWeightsWeightV2Weight, dmqHead: H256],
        { weightUsed: SpWeightsWeightV2Weight; dmqHead: H256 }
      >
      /**
       * Some downward messages have been received and will be processed.
       **/
      DownwardMessagesReceived: AugmentedEvent<ApiType, [count: u32], { count: u32 }>
      /**
       * An upgrade has been authorized.
       **/
      UpgradeAuthorized: AugmentedEvent<ApiType, [codeHash: H256], { codeHash: H256 }>
      /**
       * An upward message was sent to the relay chain.
       **/
      UpwardMessageSent: AugmentedEvent<ApiType, [messageHash: Option<U8aFixed>], { messageHash: Option<U8aFixed> }>
      /**
       * The validation function was applied as of the contained relay chain block number.
       **/
      ValidationFunctionApplied: AugmentedEvent<ApiType, [relayChainBlockNum: u32], { relayChainBlockNum: u32 }>
      /**
       * The relay-chain aborted the upgrade process.
       **/
      ValidationFunctionDiscarded: AugmentedEvent<ApiType, []>
      /**
       * The validation function has been scheduled to apply.
       **/
      ValidationFunctionStored: AugmentedEvent<ApiType, []>
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    polkadotXcm: {
      /**
       * Some assets have been claimed from an asset trap
       *
       * \[ hash, origin, assets \]
       **/
      AssetsClaimed: AugmentedEvent<ApiType, [H256, XcmV3MultiLocation, XcmVersionedMultiAssets]>
      /**
       * Some assets have been placed in an asset trap.
       *
       * \[ hash, origin, assets \]
       **/
      AssetsTrapped: AugmentedEvent<ApiType, [H256, XcmV3MultiLocation, XcmVersionedMultiAssets]>
      /**
       * Execution of an XCM message was attempted.
       *
       * \[ outcome \]
       **/
      Attempted: AugmentedEvent<ApiType, [XcmV3TraitsOutcome]>
      /**
       * Fees were paid from a location for an operation (often for using `SendXcm`).
       *
       * \[ paying location, fees \]
       **/
      FeesPaid: AugmentedEvent<ApiType, [XcmV3MultiLocation, XcmV3MultiassetMultiAssets]>
      /**
       * Expected query response has been received but the querier location of the response does
       * not match the expected. The query remains registered for a later, valid, response to
       * be received and acted upon.
       *
       * \[ origin location, id, expected querier, maybe actual querier \]
       **/
      InvalidQuerier: AugmentedEvent<ApiType, [XcmV3MultiLocation, u64, XcmV3MultiLocation, Option<XcmV3MultiLocation>]>
      /**
       * Expected query response has been received but the expected querier location placed in
       * storage by this runtime previously cannot be decoded. The query remains registered.
       *
       * This is unexpected (since a location placed in storage in a previously executing
       * runtime should be readable prior to query timeout) and dangerous since the possibly
       * valid response will be dropped. Manual governance intervention is probably going to be
       * needed.
       *
       * \[ origin location, id \]
       **/
      InvalidQuerierVersion: AugmentedEvent<ApiType, [XcmV3MultiLocation, u64]>
      /**
       * Expected query response has been received but the origin location of the response does
       * not match that expected. The query remains registered for a later, valid, response to
       * be received and acted upon.
       *
       * \[ origin location, id, expected location \]
       **/
      InvalidResponder: AugmentedEvent<ApiType, [XcmV3MultiLocation, u64, Option<XcmV3MultiLocation>]>
      /**
       * Expected query response has been received but the expected origin location placed in
       * storage by this runtime previously cannot be decoded. The query remains registered.
       *
       * This is unexpected (since a location placed in storage in a previously executing
       * runtime should be readable prior to query timeout) and dangerous since the possibly
       * valid response will be dropped. Manual governance intervention is probably going to be
       * needed.
       *
       * \[ origin location, id \]
       **/
      InvalidResponderVersion: AugmentedEvent<ApiType, [XcmV3MultiLocation, u64]>
      /**
       * Query response has been received and query is removed. The registered notification has
       * been dispatched and executed successfully.
       *
       * \[ id, pallet index, call index \]
       **/
      Notified: AugmentedEvent<ApiType, [u64, u8, u8]>
      /**
       * Query response has been received and query is removed. The dispatch was unable to be
       * decoded into a `Call`; this might be due to dispatch function having a signature which
       * is not `(origin, QueryId, Response)`.
       *
       * \[ id, pallet index, call index \]
       **/
      NotifyDecodeFailed: AugmentedEvent<ApiType, [u64, u8, u8]>
      /**
       * Query response has been received and query is removed. There was a general error with
       * dispatching the notification call.
       *
       * \[ id, pallet index, call index \]
       **/
      NotifyDispatchError: AugmentedEvent<ApiType, [u64, u8, u8]>
      /**
       * Query response has been received and query is removed. The registered notification could
       * not be dispatched because the dispatch weight is greater than the maximum weight
       * originally budgeted by this runtime for the query result.
       *
       * \[ id, pallet index, call index, actual weight, max budgeted weight \]
       **/
      NotifyOverweight: AugmentedEvent<ApiType, [u64, u8, u8, SpWeightsWeightV2Weight, SpWeightsWeightV2Weight]>
      /**
       * A given location which had a version change subscription was dropped owing to an error
       * migrating the location to our new XCM format.
       *
       * \[ location, query ID \]
       **/
      NotifyTargetMigrationFail: AugmentedEvent<ApiType, [XcmVersionedMultiLocation, u64]>
      /**
       * A given location which had a version change subscription was dropped owing to an error
       * sending the notification to it.
       *
       * \[ location, query ID, error \]
       **/
      NotifyTargetSendFail: AugmentedEvent<ApiType, [XcmV3MultiLocation, u64, XcmV3TraitsError]>
      /**
       * Query response has been received and is ready for taking with `take_response`. There is
       * no registered notification call.
       *
       * \[ id, response \]
       **/
      ResponseReady: AugmentedEvent<ApiType, [u64, XcmV3Response]>
      /**
       * Received query response has been read and removed.
       *
       * \[ id \]
       **/
      ResponseTaken: AugmentedEvent<ApiType, [u64]>
      /**
       * A XCM message was sent.
       *
       * \[ origin, destination, message \]
       **/
      Sent: AugmentedEvent<ApiType, [XcmV3MultiLocation, XcmV3MultiLocation, XcmV3Xcm]>
      /**
       * The supported version of a location has been changed. This might be through an
       * automatic notification or a manual intervention.
       *
       * \[ location, XCM version \]
       **/
      SupportedVersionChanged: AugmentedEvent<ApiType, [XcmV3MultiLocation, u32]>
      /**
       * Query response received which does not match a registered query. This may be because a
       * matching query was never registered, it may be because it is a duplicate response, or
       * because the query timed out.
       *
       * \[ origin location, id \]
       **/
      UnexpectedResponse: AugmentedEvent<ApiType, [XcmV3MultiLocation, u64]>
      /**
       * An XCM version change notification message has been attempted to be sent.
       *
       * The cost of sending it (borne by the chain) is included.
       *
       * \[ destination, result, cost \]
       **/
      VersionChangeNotified: AugmentedEvent<ApiType, [XcmV3MultiLocation, u32, XcmV3MultiassetMultiAssets]>
      /**
       * We have requested that a remote chain sends us XCM version change notifications.
       *
       * \[ destination location, cost \]
       **/
      VersionNotifyRequested: AugmentedEvent<ApiType, [XcmV3MultiLocation, XcmV3MultiassetMultiAssets]>
      /**
       * A remote has requested XCM version change notification from us and we have honored it.
       * A version information message is sent to them and its cost is included.
       *
       * \[ destination location, cost \]
       **/
      VersionNotifyStarted: AugmentedEvent<ApiType, [XcmV3MultiLocation, XcmV3MultiassetMultiAssets]>
      /**
       * We have requested that a remote chain stops sending us XCM version change notifications.
       *
       * \[ destination location, cost \]
       **/
      VersionNotifyUnrequested: AugmentedEvent<ApiType, [XcmV3MultiLocation, XcmV3MultiassetMultiAssets]>
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    preimage: {
      /**
       * A preimage has ben cleared.
       **/
      Cleared: AugmentedEvent<ApiType, [hash_: H256], { hash_: H256 }>
      /**
       * A preimage has been noted.
       **/
      Noted: AugmentedEvent<ApiType, [hash_: H256], { hash_: H256 }>
      /**
       * A preimage has been requested.
       **/
      Requested: AugmentedEvent<ApiType, [hash_: H256], { hash_: H256 }>
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    proxy: {
      /**
       * An announcement was placed to make a call in the future.
       **/
      Announced: AugmentedEvent<
        ApiType,
        [real: AccountId32, proxy: AccountId32, callHash: H256],
        { real: AccountId32; proxy: AccountId32; callHash: H256 }
      >
      /**
       * A proxy was added.
       **/
      ProxyAdded: AugmentedEvent<
        ApiType,
        [delegator: AccountId32, delegatee: AccountId32, proxyType: ShibuyaRuntimeProxyType, delay: u32],
        { delegator: AccountId32; delegatee: AccountId32; proxyType: ShibuyaRuntimeProxyType; delay: u32 }
      >
      /**
       * A proxy was executed correctly, with the given.
       **/
      ProxyExecuted: AugmentedEvent<
        ApiType,
        [result: Result<Null, SpRuntimeDispatchError>],
        { result: Result<Null, SpRuntimeDispatchError> }
      >
      /**
       * A proxy was removed.
       **/
      ProxyRemoved: AugmentedEvent<
        ApiType,
        [delegator: AccountId32, delegatee: AccountId32, proxyType: ShibuyaRuntimeProxyType, delay: u32],
        { delegator: AccountId32; delegatee: AccountId32; proxyType: ShibuyaRuntimeProxyType; delay: u32 }
      >
      /**
       * A pure account has been created by new proxy with given
       * disambiguation index and proxy type.
       **/
      PureCreated: AugmentedEvent<
        ApiType,
        [pure: AccountId32, who: AccountId32, proxyType: ShibuyaRuntimeProxyType, disambiguationIndex: u16],
        { pure: AccountId32; who: AccountId32; proxyType: ShibuyaRuntimeProxyType; disambiguationIndex: u16 }
      >
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    scheduler: {
      /**
       * The call for the provided hash was not found so the task has been aborted.
       **/
      CallUnavailable: AugmentedEvent<
        ApiType,
        [task: ITuple<[u32, u32]>, id: Option<U8aFixed>],
        { task: ITuple<[u32, u32]>; id: Option<U8aFixed> }
      >
      /**
       * Canceled some task.
       **/
      Canceled: AugmentedEvent<ApiType, [when: u32, index: u32], { when: u32; index: u32 }>
      /**
       * Dispatched some task.
       **/
      Dispatched: AugmentedEvent<
        ApiType,
        [task: ITuple<[u32, u32]>, id: Option<U8aFixed>, result: Result<Null, SpRuntimeDispatchError>],
        { task: ITuple<[u32, u32]>; id: Option<U8aFixed>; result: Result<Null, SpRuntimeDispatchError> }
      >
      /**
       * The given task was unable to be renewed since the agenda is full at that block.
       **/
      PeriodicFailed: AugmentedEvent<
        ApiType,
        [task: ITuple<[u32, u32]>, id: Option<U8aFixed>],
        { task: ITuple<[u32, u32]>; id: Option<U8aFixed> }
      >
      /**
       * The given task can never be executed since it is overweight.
       **/
      PermanentlyOverweight: AugmentedEvent<
        ApiType,
        [task: ITuple<[u32, u32]>, id: Option<U8aFixed>],
        { task: ITuple<[u32, u32]>; id: Option<U8aFixed> }
      >
      /**
       * Scheduled some task.
       **/
      Scheduled: AugmentedEvent<ApiType, [when: u32, index: u32], { when: u32; index: u32 }>
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    session: {
      /**
       * New session has happened. Note that the argument is the session index, not the
       * block number as the type might suggest.
       **/
      NewSession: AugmentedEvent<ApiType, [sessionIndex: u32], { sessionIndex: u32 }>
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    staticPriceProvider: {
      /**
       * New static native currency price has been set.
       **/
      PriceSet: AugmentedEvent<ApiType, [price: u64], { price: u64 }>
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    sudo: {
      /**
       * The \[sudoer\] just switched identity; the old key is supplied if one existed.
       **/
      KeyChanged: AugmentedEvent<ApiType, [oldSudoer: Option<AccountId32>], { oldSudoer: Option<AccountId32> }>
      /**
       * A sudo just took place. \[result\]
       **/
      Sudid: AugmentedEvent<
        ApiType,
        [sudoResult: Result<Null, SpRuntimeDispatchError>],
        { sudoResult: Result<Null, SpRuntimeDispatchError> }
      >
      /**
       * A sudo just took place. \[result\]
       **/
      SudoAsDone: AugmentedEvent<
        ApiType,
        [sudoResult: Result<Null, SpRuntimeDispatchError>],
        { sudoResult: Result<Null, SpRuntimeDispatchError> }
      >
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    system: {
      /**
       * `:code` was updated.
       **/
      CodeUpdated: AugmentedEvent<ApiType, []>
      /**
       * An extrinsic failed.
       **/
      ExtrinsicFailed: AugmentedEvent<
        ApiType,
        [dispatchError: SpRuntimeDispatchError, dispatchInfo: FrameSupportDispatchDispatchInfo],
        { dispatchError: SpRuntimeDispatchError; dispatchInfo: FrameSupportDispatchDispatchInfo }
      >
      /**
       * An extrinsic completed successfully.
       **/
      ExtrinsicSuccess: AugmentedEvent<
        ApiType,
        [dispatchInfo: FrameSupportDispatchDispatchInfo],
        { dispatchInfo: FrameSupportDispatchDispatchInfo }
      >
      /**
       * An account was reaped.
       **/
      KilledAccount: AugmentedEvent<ApiType, [account: AccountId32], { account: AccountId32 }>
      /**
       * A new account was created.
       **/
      NewAccount: AugmentedEvent<ApiType, [account: AccountId32], { account: AccountId32 }>
      /**
       * On on-chain remark happened.
       **/
      Remarked: AugmentedEvent<ApiType, [sender: AccountId32, hash_: H256], { sender: AccountId32; hash_: H256 }>
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    technicalCommittee: {
      /**
       * A motion was approved by the required threshold.
       **/
      Approved: AugmentedEvent<ApiType, [proposalHash: H256], { proposalHash: H256 }>
      /**
       * A proposal was closed because its threshold was reached or after its duration was up.
       **/
      Closed: AugmentedEvent<
        ApiType,
        [proposalHash: H256, yes: u32, no: u32],
        { proposalHash: H256; yes: u32; no: u32 }
      >
      /**
       * A motion was not approved by the required threshold.
       **/
      Disapproved: AugmentedEvent<ApiType, [proposalHash: H256], { proposalHash: H256 }>
      /**
       * A motion was executed; result will be `Ok` if it returned without error.
       **/
      Executed: AugmentedEvent<
        ApiType,
        [proposalHash: H256, result: Result<Null, SpRuntimeDispatchError>],
        { proposalHash: H256; result: Result<Null, SpRuntimeDispatchError> }
      >
      /**
       * A single member did some action; result will be `Ok` if it returned without error.
       **/
      MemberExecuted: AugmentedEvent<
        ApiType,
        [proposalHash: H256, result: Result<Null, SpRuntimeDispatchError>],
        { proposalHash: H256; result: Result<Null, SpRuntimeDispatchError> }
      >
      /**
       * A motion (given hash) has been proposed (by given account) with a threshold (given
       * `MemberCount`).
       **/
      Proposed: AugmentedEvent<
        ApiType,
        [account: AccountId32, proposalIndex: u32, proposalHash: H256, threshold: u32],
        { account: AccountId32; proposalIndex: u32; proposalHash: H256; threshold: u32 }
      >
      /**
       * A motion (given hash) has been voted on by given account, leaving
       * a tally (yes votes and no votes given respectively as `MemberCount`).
       **/
      Voted: AugmentedEvent<
        ApiType,
        [account: AccountId32, proposalHash: H256, voted: bool, yes: u32, no: u32],
        { account: AccountId32; proposalHash: H256; voted: bool; yes: u32; no: u32 }
      >
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    transactionPayment: {
      /**
       * A transaction fee `actual_fee`, of which `tip` was added to the minimum inclusion fee,
       * has been paid by `who`.
       **/
      TransactionFeePaid: AugmentedEvent<
        ApiType,
        [who: AccountId32, actualFee: u128, tip: u128],
        { who: AccountId32; actualFee: u128; tip: u128 }
      >
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    treasury: {
      /**
       * Some funds have been allocated.
       **/
      Awarded: AugmentedEvent<
        ApiType,
        [proposalIndex: u32, award: u128, account: AccountId32],
        { proposalIndex: u32; award: u128; account: AccountId32 }
      >
      /**
       * Some of our funds have been burnt.
       **/
      Burnt: AugmentedEvent<ApiType, [burntFunds: u128], { burntFunds: u128 }>
      /**
       * Some funds have been deposited.
       **/
      Deposit: AugmentedEvent<ApiType, [value: u128], { value: u128 }>
      /**
       * New proposal.
       **/
      Proposed: AugmentedEvent<ApiType, [proposalIndex: u32], { proposalIndex: u32 }>
      /**
       * A proposal was rejected; funds were slashed.
       **/
      Rejected: AugmentedEvent<ApiType, [proposalIndex: u32, slashed: u128], { proposalIndex: u32; slashed: u128 }>
      /**
       * Spending has finished; this is the amount that rolls over until next spend.
       **/
      Rollover: AugmentedEvent<ApiType, [rolloverBalance: u128], { rolloverBalance: u128 }>
      /**
       * A new spend proposal has been approved.
       **/
      SpendApproved: AugmentedEvent<
        ApiType,
        [proposalIndex: u32, amount: u128, beneficiary: AccountId32],
        { proposalIndex: u32; amount: u128; beneficiary: AccountId32 }
      >
      /**
       * We have ended a spend period and will now allocate funds.
       **/
      Spending: AugmentedEvent<ApiType, [budgetRemaining: u128], { budgetRemaining: u128 }>
      /**
       * The inactive funds of the pallet have been updated.
       **/
      UpdatedInactive: AugmentedEvent<
        ApiType,
        [reactivated: u128, deactivated: u128],
        { reactivated: u128; deactivated: u128 }
      >
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    unifiedAccounts: {
      /**
       * Evm Address claimed.
       * Double Mapping b/w native and evm address created
       **/
      AccountClaimed: AugmentedEvent<
        ApiType,
        [accountId: AccountId32, evmAddress: H160],
        { accountId: AccountId32; evmAddress: H160 }
      >
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    utility: {
      /**
       * Batch of dispatches completed fully with no error.
       **/
      BatchCompleted: AugmentedEvent<ApiType, []>
      /**
       * Batch of dispatches completed but has errors.
       **/
      BatchCompletedWithErrors: AugmentedEvent<ApiType, []>
      /**
       * Batch of dispatches did not complete fully. Index of first failing dispatch given, as
       * well as the error.
       **/
      BatchInterrupted: AugmentedEvent<
        ApiType,
        [index: u32, error: SpRuntimeDispatchError],
        { index: u32; error: SpRuntimeDispatchError }
      >
      /**
       * A call was dispatched.
       **/
      DispatchedAs: AugmentedEvent<
        ApiType,
        [result: Result<Null, SpRuntimeDispatchError>],
        { result: Result<Null, SpRuntimeDispatchError> }
      >
      /**
       * A single item within a Batch of dispatches has completed with no error.
       **/
      ItemCompleted: AugmentedEvent<ApiType, []>
      /**
       * A single item within a Batch of dispatches has completed with error.
       **/
      ItemFailed: AugmentedEvent<ApiType, [error: SpRuntimeDispatchError], { error: SpRuntimeDispatchError }>
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    vesting: {
      /**
       * An \[account\] has become fully vested.
       **/
      VestingCompleted: AugmentedEvent<ApiType, [account: AccountId32], { account: AccountId32 }>
      /**
       * The amount vested has been updated. This could indicate a change in funds available.
       * The balance given is the amount which is left unvested (and thus locked).
       **/
      VestingUpdated: AugmentedEvent<
        ApiType,
        [account: AccountId32, unvested: u128],
        { account: AccountId32; unvested: u128 }
      >
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    xcAssetConfig: {
      /**
       * Changed the asset type mapping for a given asset id
       **/
      AssetLocationChanged: AugmentedEvent<
        ApiType,
        [previousAssetLocation: XcmVersionedMultiLocation, assetId: u128, newAssetLocation: XcmVersionedMultiLocation],
        { previousAssetLocation: XcmVersionedMultiLocation; assetId: u128; newAssetLocation: XcmVersionedMultiLocation }
      >
      /**
       * Registed mapping between asset type and asset Id.
       **/
      AssetRegistered: AugmentedEvent<
        ApiType,
        [assetLocation: XcmVersionedMultiLocation, assetId: u128],
        { assetLocation: XcmVersionedMultiLocation; assetId: u128 }
      >
      /**
       * Removed all information related to an asset Id
       **/
      AssetRemoved: AugmentedEvent<
        ApiType,
        [assetLocation: XcmVersionedMultiLocation, assetId: u128],
        { assetLocation: XcmVersionedMultiLocation; assetId: u128 }
      >
      /**
       * Supported asset type for fee payment removed.
       **/
      SupportedAssetRemoved: AugmentedEvent<
        ApiType,
        [assetLocation: XcmVersionedMultiLocation],
        { assetLocation: XcmVersionedMultiLocation }
      >
      /**
       * Changed the amount of units we are charging per execution second for an asset
       **/
      UnitsPerSecondChanged: AugmentedEvent<
        ApiType,
        [assetLocation: XcmVersionedMultiLocation, unitsPerSecond: u128],
        { assetLocation: XcmVersionedMultiLocation; unitsPerSecond: u128 }
      >
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    xcmpQueue: {
      /**
       * Bad XCM format used.
       **/
      BadFormat: AugmentedEvent<ApiType, [messageHash: Option<U8aFixed>], { messageHash: Option<U8aFixed> }>
      /**
       * Bad XCM version used.
       **/
      BadVersion: AugmentedEvent<ApiType, [messageHash: Option<U8aFixed>], { messageHash: Option<U8aFixed> }>
      /**
       * Some XCM failed.
       **/
      Fail: AugmentedEvent<
        ApiType,
        [messageHash: Option<U8aFixed>, error: XcmV3TraitsError, weight: SpWeightsWeightV2Weight],
        { messageHash: Option<U8aFixed>; error: XcmV3TraitsError; weight: SpWeightsWeightV2Weight }
      >
      /**
       * An XCM exceeded the individual message weight budget.
       **/
      OverweightEnqueued: AugmentedEvent<
        ApiType,
        [sender: u32, sentAt: u32, index: u64, required: SpWeightsWeightV2Weight],
        { sender: u32; sentAt: u32; index: u64; required: SpWeightsWeightV2Weight }
      >
      /**
       * An XCM from the overweight queue was executed with the given actual weight used.
       **/
      OverweightServiced: AugmentedEvent<
        ApiType,
        [index: u64, used: SpWeightsWeightV2Weight],
        { index: u64; used: SpWeightsWeightV2Weight }
      >
      /**
       * Some XCM was executed ok.
       **/
      Success: AugmentedEvent<
        ApiType,
        [messageHash: Option<U8aFixed>, weight: SpWeightsWeightV2Weight],
        { messageHash: Option<U8aFixed>; weight: SpWeightsWeightV2Weight }
      >
      /**
       * An HRMP message was sent to a sibling parachain.
       **/
      XcmpMessageSent: AugmentedEvent<ApiType, [messageHash: Option<U8aFixed>], { messageHash: Option<U8aFixed> }>
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
    xTokens: {
      /**
       * Transferred `MultiAsset` with fee.
       **/
      TransferredMultiAssets: AugmentedEvent<
        ApiType,
        [sender: AccountId32, assets: XcmV3MultiassetMultiAssets, fee: XcmV3MultiAsset, dest: XcmV3MultiLocation],
        { sender: AccountId32; assets: XcmV3MultiassetMultiAssets; fee: XcmV3MultiAsset; dest: XcmV3MultiLocation }
      >
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>
    }
  } // AugmentedEvents
} // declare module
