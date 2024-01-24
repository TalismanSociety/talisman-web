// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/types/types/registry'

import type {
  AstarPrimitivesDappStakingSmartContract,
  AstarPrimitivesEthereumCheckedCheckedEthereumTx,
  CumulusPalletDmpQueueCall,
  CumulusPalletDmpQueueConfigData,
  CumulusPalletDmpQueueError,
  CumulusPalletDmpQueueEvent,
  CumulusPalletDmpQueuePageIndexData,
  CumulusPalletParachainSystemCall,
  CumulusPalletParachainSystemCodeUpgradeAuthorization,
  CumulusPalletParachainSystemError,
  CumulusPalletParachainSystemEvent,
  CumulusPalletParachainSystemRelayStateSnapshotMessagingStateSnapshot,
  CumulusPalletParachainSystemRelayStateSnapshotRelayDispachQueueSize,
  CumulusPalletXcmCall,
  CumulusPalletXcmError,
  CumulusPalletXcmEvent,
  CumulusPalletXcmOrigin,
  CumulusPalletXcmpQueueCall,
  CumulusPalletXcmpQueueError,
  CumulusPalletXcmpQueueEvent,
  CumulusPalletXcmpQueueInboundChannelDetails,
  CumulusPalletXcmpQueueInboundState,
  CumulusPalletXcmpQueueOutboundChannelDetails,
  CumulusPalletXcmpQueueOutboundState,
  CumulusPalletXcmpQueueQueueConfigData,
  CumulusPrimitivesParachainInherentParachainInherentData,
  EthbloomBloom,
  EthereumBlock,
  EthereumHeader,
  EthereumLog,
  EthereumReceiptEip658ReceiptData,
  EthereumReceiptReceiptV3,
  EthereumTransactionAccessListItem,
  EthereumTransactionEip1559Transaction,
  EthereumTransactionEip2930Transaction,
  EthereumTransactionLegacyTransaction,
  EthereumTransactionTransactionAction,
  EthereumTransactionTransactionSignature,
  EthereumTransactionTransactionV2,
  EthereumTypesHashH64,
  EvmCoreErrorExitError,
  EvmCoreErrorExitFatal,
  EvmCoreErrorExitReason,
  EvmCoreErrorExitRevert,
  EvmCoreErrorExitSucceed,
  FpRpcTransactionStatus,
  FrameSupportDispatchDispatchClass,
  FrameSupportDispatchDispatchInfo,
  FrameSupportDispatchPays,
  FrameSupportDispatchPerDispatchClassU32,
  FrameSupportDispatchPerDispatchClassWeight,
  FrameSupportDispatchPerDispatchClassWeightsPerClass,
  FrameSupportDispatchRawOrigin,
  FrameSupportPalletId,
  FrameSupportPreimagesBounded,
  FrameSupportTokensMiscBalanceStatus,
  FrameSystemAccountInfo,
  FrameSystemCall,
  FrameSystemError,
  FrameSystemEvent,
  FrameSystemEventRecord,
  FrameSystemExtensionsCheckGenesis,
  FrameSystemExtensionsCheckNonce,
  FrameSystemExtensionsCheckSpecVersion,
  FrameSystemExtensionsCheckTxVersion,
  FrameSystemExtensionsCheckWeight,
  FrameSystemLastRuntimeUpgradeInfo,
  FrameSystemLimitsBlockLength,
  FrameSystemLimitsBlockWeights,
  FrameSystemLimitsWeightsPerClass,
  FrameSystemPhase,
  OrmlXtokensModuleCall,
  OrmlXtokensModuleError,
  OrmlXtokensModuleEvent,
  PalletAssetsAccountStatus,
  PalletAssetsApproval,
  PalletAssetsAssetAccount,
  PalletAssetsAssetDetails,
  PalletAssetsAssetMetadata,
  PalletAssetsAssetStatus,
  PalletAssetsCall,
  PalletAssetsError,
  PalletAssetsEvent,
  PalletAssetsExistenceReason,
  PalletBalancesAccountData,
  PalletBalancesBalanceLock,
  PalletBalancesCall,
  PalletBalancesError,
  PalletBalancesEvent,
  PalletBalancesIdAmount,
  PalletBalancesReasons,
  PalletBalancesReserveData,
  PalletCollatorSelectionCall,
  PalletCollatorSelectionCandidateInfo,
  PalletCollatorSelectionError,
  PalletCollatorSelectionEvent,
  PalletCollectiveCall,
  PalletCollectiveError,
  PalletCollectiveEvent,
  PalletCollectiveRawOrigin,
  PalletCollectiveVotes,
  PalletContractsCall,
  PalletContractsError,
  PalletContractsEvent,
  PalletContractsOrigin,
  PalletContractsSchedule,
  PalletContractsScheduleHostFnWeights,
  PalletContractsScheduleInstructionWeights,
  PalletContractsScheduleLimits,
  PalletContractsStorageContractInfo,
  PalletContractsStorageDeletionQueueManager,
  PalletContractsWasmDeterminism,
  PalletContractsWasmOwnerInfo,
  PalletContractsWasmPrefabWasmModule,
  PalletDappStakingV3AccountLedger,
  PalletDappStakingV3Call,
  PalletDappStakingV3CleanupMarker,
  PalletDappStakingV3ContractStakeAmount,
  PalletDappStakingV3DAppInfo,
  PalletDappStakingV3DAppState,
  PalletDappStakingV3DAppTierRewards,
  PalletDappStakingV3EraInfo,
  PalletDappStakingV3EraReward,
  PalletDappStakingV3EraRewardSpan,
  PalletDappStakingV3Error,
  PalletDappStakingV3Event,
  PalletDappStakingV3ForcingType,
  PalletDappStakingV3FreezeReason,
  PalletDappStakingV3PeriodEndInfo,
  PalletDappStakingV3PeriodInfo,
  PalletDappStakingV3ProtocolState,
  PalletDappStakingV3SingularStakingInfo,
  PalletDappStakingV3StakeAmount,
  PalletDappStakingV3Subperiod,
  PalletDappStakingV3TierParameters,
  PalletDappStakingV3TierThreshold,
  PalletDappStakingV3TiersConfiguration,
  PalletDappStakingV3UnlockingChunk,
  PalletDemocracyCall,
  PalletDemocracyConviction,
  PalletDemocracyDelegations,
  PalletDemocracyError,
  PalletDemocracyEvent,
  PalletDemocracyMetadataOwner,
  PalletDemocracyReferendumInfo,
  PalletDemocracyReferendumStatus,
  PalletDemocracyTally,
  PalletDemocracyVoteAccountVote,
  PalletDemocracyVotePriorLock,
  PalletDemocracyVoteThreshold,
  PalletDemocracyVoteVoting,
  PalletDynamicEvmBaseFeeCall,
  PalletDynamicEvmBaseFeeError,
  PalletDynamicEvmBaseFeeEvent,
  PalletEthereumCall,
  PalletEthereumCheckedCall,
  PalletEthereumCheckedRawOrigin,
  PalletEthereumError,
  PalletEthereumEvent,
  PalletEthereumRawOrigin,
  PalletEvmCall,
  PalletEvmCodeMetadata,
  PalletEvmError,
  PalletEvmEvent,
  PalletIdentityBitFlags,
  PalletIdentityCall,
  PalletIdentityError,
  PalletIdentityEvent,
  PalletIdentityIdentityField,
  PalletIdentityIdentityInfo,
  PalletIdentityJudgement,
  PalletIdentityRegistrarInfo,
  PalletIdentityRegistration,
  PalletInflationCall,
  PalletInflationError,
  PalletInflationEvent,
  PalletInflationInflationConfiguration,
  PalletInflationInflationParameters,
  PalletMultisigCall,
  PalletMultisigError,
  PalletMultisigEvent,
  PalletMultisigMultisig,
  PalletMultisigTimepoint,
  PalletPreimageCall,
  PalletPreimageError,
  PalletPreimageEvent,
  PalletPreimageRequestStatus,
  PalletProxyAnnouncement,
  PalletProxyCall,
  PalletProxyError,
  PalletProxyEvent,
  PalletProxyProxyDefinition,
  PalletSchedulerCall,
  PalletSchedulerError,
  PalletSchedulerEvent,
  PalletSchedulerScheduled,
  PalletSessionCall,
  PalletSessionError,
  PalletSessionEvent,
  PalletStaticPriceProviderCall,
  PalletStaticPriceProviderError,
  PalletStaticPriceProviderEvent,
  PalletSudoCall,
  PalletSudoError,
  PalletSudoEvent,
  PalletTimestampCall,
  PalletTransactionPaymentChargeTransactionPayment,
  PalletTransactionPaymentEvent,
  PalletTransactionPaymentReleases,
  PalletTreasuryCall,
  PalletTreasuryError,
  PalletTreasuryEvent,
  PalletTreasuryProposal,
  PalletUnifiedAccountsCall,
  PalletUnifiedAccountsError,
  PalletUnifiedAccountsEvent,
  PalletUtilityCall,
  PalletUtilityError,
  PalletUtilityEvent,
  PalletVestingCall,
  PalletVestingError,
  PalletVestingEvent,
  PalletVestingReleases,
  PalletVestingVestingInfo,
  PalletXcAssetConfigCall,
  PalletXcAssetConfigError,
  PalletXcAssetConfigEvent,
  PalletXcmCall,
  PalletXcmError,
  PalletXcmEvent,
  PalletXcmOrigin,
  PalletXcmQueryStatus,
  PalletXcmRemoteLockedFungibleRecord,
  PalletXcmVersionMigrationStage,
  ParachainInfoCall,
  PolkadotCorePrimitivesInboundDownwardMessage,
  PolkadotCorePrimitivesInboundHrmpMessage,
  PolkadotCorePrimitivesOutboundHrmpMessage,
  PolkadotParachainPrimitivesXcmpMessageFormat,
  PolkadotPrimitivesV4AbridgedHostConfiguration,
  PolkadotPrimitivesV4AbridgedHrmpChannel,
  PolkadotPrimitivesV4PersistedValidationData,
  PolkadotPrimitivesV4UpgradeRestriction,
  ShibuyaRuntimeOriginCaller,
  ShibuyaRuntimeProxyType,
  ShibuyaRuntimeRuntime,
  ShibuyaRuntimeRuntimeFreezeReason,
  ShibuyaRuntimeSessionKeys,
  SpArithmeticArithmeticError,
  SpConsensusAuraSr25519AppSr25519Public,
  SpCoreCryptoKeyTypeId,
  SpCoreEcdsaSignature,
  SpCoreEd25519Signature,
  SpCoreSr25519Public,
  SpCoreSr25519Signature,
  SpCoreVoid,
  SpRuntimeDigest,
  SpRuntimeDigestDigestItem,
  SpRuntimeDispatchError,
  SpRuntimeModuleError,
  SpRuntimeMultiSignature,
  SpRuntimeTokenError,
  SpRuntimeTransactionalError,
  SpTrieStorageProof,
  SpVersionRuntimeVersion,
  SpWeightsRuntimeDbWeight,
  SpWeightsWeightV2Weight,
  XcmDoubleEncoded,
  XcmV2BodyId,
  XcmV2BodyPart,
  XcmV2Instruction,
  XcmV2Junction,
  XcmV2MultiAsset,
  XcmV2MultiLocation,
  XcmV2MultiassetAssetId,
  XcmV2MultiassetAssetInstance,
  XcmV2MultiassetFungibility,
  XcmV2MultiassetMultiAssetFilter,
  XcmV2MultiassetMultiAssets,
  XcmV2MultiassetWildFungibility,
  XcmV2MultiassetWildMultiAsset,
  XcmV2MultilocationJunctions,
  XcmV2NetworkId,
  XcmV2OriginKind,
  XcmV2Response,
  XcmV2TraitsError,
  XcmV2WeightLimit,
  XcmV2Xcm,
  XcmV3Instruction,
  XcmV3Junction,
  XcmV3JunctionBodyId,
  XcmV3JunctionBodyPart,
  XcmV3JunctionNetworkId,
  XcmV3Junctions,
  XcmV3MaybeErrorCode,
  XcmV3MultiAsset,
  XcmV3MultiLocation,
  XcmV3MultiassetAssetId,
  XcmV3MultiassetAssetInstance,
  XcmV3MultiassetFungibility,
  XcmV3MultiassetMultiAssetFilter,
  XcmV3MultiassetMultiAssets,
  XcmV3MultiassetWildFungibility,
  XcmV3MultiassetWildMultiAsset,
  XcmV3PalletInfo,
  XcmV3QueryResponseInfo,
  XcmV3Response,
  XcmV3TraitsError,
  XcmV3TraitsOutcome,
  XcmV3WeightLimit,
  XcmV3Xcm,
  XcmVersionedAssetId,
  XcmVersionedMultiAsset,
  XcmVersionedMultiAssets,
  XcmVersionedMultiLocation,
  XcmVersionedResponse,
  XcmVersionedXcm,
} from '@polkadot/types/lookup'

declare module '@polkadot/types/types/registry' {
  interface InterfaceTypes {
    AstarPrimitivesDappStakingSmartContract: AstarPrimitivesDappStakingSmartContract
    AstarPrimitivesEthereumCheckedCheckedEthereumTx: AstarPrimitivesEthereumCheckedCheckedEthereumTx
    CumulusPalletDmpQueueCall: CumulusPalletDmpQueueCall
    CumulusPalletDmpQueueConfigData: CumulusPalletDmpQueueConfigData
    CumulusPalletDmpQueueError: CumulusPalletDmpQueueError
    CumulusPalletDmpQueueEvent: CumulusPalletDmpQueueEvent
    CumulusPalletDmpQueuePageIndexData: CumulusPalletDmpQueuePageIndexData
    CumulusPalletParachainSystemCall: CumulusPalletParachainSystemCall
    CumulusPalletParachainSystemCodeUpgradeAuthorization: CumulusPalletParachainSystemCodeUpgradeAuthorization
    CumulusPalletParachainSystemError: CumulusPalletParachainSystemError
    CumulusPalletParachainSystemEvent: CumulusPalletParachainSystemEvent
    CumulusPalletParachainSystemRelayStateSnapshotMessagingStateSnapshot: CumulusPalletParachainSystemRelayStateSnapshotMessagingStateSnapshot
    CumulusPalletParachainSystemRelayStateSnapshotRelayDispachQueueSize: CumulusPalletParachainSystemRelayStateSnapshotRelayDispachQueueSize
    CumulusPalletXcmCall: CumulusPalletXcmCall
    CumulusPalletXcmError: CumulusPalletXcmError
    CumulusPalletXcmEvent: CumulusPalletXcmEvent
    CumulusPalletXcmOrigin: CumulusPalletXcmOrigin
    CumulusPalletXcmpQueueCall: CumulusPalletXcmpQueueCall
    CumulusPalletXcmpQueueError: CumulusPalletXcmpQueueError
    CumulusPalletXcmpQueueEvent: CumulusPalletXcmpQueueEvent
    CumulusPalletXcmpQueueInboundChannelDetails: CumulusPalletXcmpQueueInboundChannelDetails
    CumulusPalletXcmpQueueInboundState: CumulusPalletXcmpQueueInboundState
    CumulusPalletXcmpQueueOutboundChannelDetails: CumulusPalletXcmpQueueOutboundChannelDetails
    CumulusPalletXcmpQueueOutboundState: CumulusPalletXcmpQueueOutboundState
    CumulusPalletXcmpQueueQueueConfigData: CumulusPalletXcmpQueueQueueConfigData
    CumulusPrimitivesParachainInherentParachainInherentData: CumulusPrimitivesParachainInherentParachainInherentData
    EthbloomBloom: EthbloomBloom
    EthereumBlock: EthereumBlock
    EthereumHeader: EthereumHeader
    EthereumLog: EthereumLog
    EthereumReceiptEip658ReceiptData: EthereumReceiptEip658ReceiptData
    EthereumReceiptReceiptV3: EthereumReceiptReceiptV3
    EthereumTransactionAccessListItem: EthereumTransactionAccessListItem
    EthereumTransactionEip1559Transaction: EthereumTransactionEip1559Transaction
    EthereumTransactionEip2930Transaction: EthereumTransactionEip2930Transaction
    EthereumTransactionLegacyTransaction: EthereumTransactionLegacyTransaction
    EthereumTransactionTransactionAction: EthereumTransactionTransactionAction
    EthereumTransactionTransactionSignature: EthereumTransactionTransactionSignature
    EthereumTransactionTransactionV2: EthereumTransactionTransactionV2
    EthereumTypesHashH64: EthereumTypesHashH64
    EvmCoreErrorExitError: EvmCoreErrorExitError
    EvmCoreErrorExitFatal: EvmCoreErrorExitFatal
    EvmCoreErrorExitReason: EvmCoreErrorExitReason
    EvmCoreErrorExitRevert: EvmCoreErrorExitRevert
    EvmCoreErrorExitSucceed: EvmCoreErrorExitSucceed
    FpRpcTransactionStatus: FpRpcTransactionStatus
    FrameSupportDispatchDispatchClass: FrameSupportDispatchDispatchClass
    FrameSupportDispatchDispatchInfo: FrameSupportDispatchDispatchInfo
    FrameSupportDispatchPays: FrameSupportDispatchPays
    FrameSupportDispatchPerDispatchClassU32: FrameSupportDispatchPerDispatchClassU32
    FrameSupportDispatchPerDispatchClassWeight: FrameSupportDispatchPerDispatchClassWeight
    FrameSupportDispatchPerDispatchClassWeightsPerClass: FrameSupportDispatchPerDispatchClassWeightsPerClass
    FrameSupportDispatchRawOrigin: FrameSupportDispatchRawOrigin
    FrameSupportPalletId: FrameSupportPalletId
    FrameSupportPreimagesBounded: FrameSupportPreimagesBounded
    FrameSupportTokensMiscBalanceStatus: FrameSupportTokensMiscBalanceStatus
    FrameSystemAccountInfo: FrameSystemAccountInfo
    FrameSystemCall: FrameSystemCall
    FrameSystemError: FrameSystemError
    FrameSystemEvent: FrameSystemEvent
    FrameSystemEventRecord: FrameSystemEventRecord
    FrameSystemExtensionsCheckGenesis: FrameSystemExtensionsCheckGenesis
    FrameSystemExtensionsCheckNonce: FrameSystemExtensionsCheckNonce
    FrameSystemExtensionsCheckSpecVersion: FrameSystemExtensionsCheckSpecVersion
    FrameSystemExtensionsCheckTxVersion: FrameSystemExtensionsCheckTxVersion
    FrameSystemExtensionsCheckWeight: FrameSystemExtensionsCheckWeight
    FrameSystemLastRuntimeUpgradeInfo: FrameSystemLastRuntimeUpgradeInfo
    FrameSystemLimitsBlockLength: FrameSystemLimitsBlockLength
    FrameSystemLimitsBlockWeights: FrameSystemLimitsBlockWeights
    FrameSystemLimitsWeightsPerClass: FrameSystemLimitsWeightsPerClass
    FrameSystemPhase: FrameSystemPhase
    OrmlXtokensModuleCall: OrmlXtokensModuleCall
    OrmlXtokensModuleError: OrmlXtokensModuleError
    OrmlXtokensModuleEvent: OrmlXtokensModuleEvent
    PalletAssetsAccountStatus: PalletAssetsAccountStatus
    PalletAssetsApproval: PalletAssetsApproval
    PalletAssetsAssetAccount: PalletAssetsAssetAccount
    PalletAssetsAssetDetails: PalletAssetsAssetDetails
    PalletAssetsAssetMetadata: PalletAssetsAssetMetadata
    PalletAssetsAssetStatus: PalletAssetsAssetStatus
    PalletAssetsCall: PalletAssetsCall
    PalletAssetsError: PalletAssetsError
    PalletAssetsEvent: PalletAssetsEvent
    PalletAssetsExistenceReason: PalletAssetsExistenceReason
    PalletBalancesAccountData: PalletBalancesAccountData
    PalletBalancesBalanceLock: PalletBalancesBalanceLock
    PalletBalancesCall: PalletBalancesCall
    PalletBalancesError: PalletBalancesError
    PalletBalancesEvent: PalletBalancesEvent
    PalletBalancesIdAmount: PalletBalancesIdAmount
    PalletBalancesReasons: PalletBalancesReasons
    PalletBalancesReserveData: PalletBalancesReserveData
    PalletCollatorSelectionCall: PalletCollatorSelectionCall
    PalletCollatorSelectionCandidateInfo: PalletCollatorSelectionCandidateInfo
    PalletCollatorSelectionError: PalletCollatorSelectionError
    PalletCollatorSelectionEvent: PalletCollatorSelectionEvent
    PalletCollectiveCall: PalletCollectiveCall
    PalletCollectiveError: PalletCollectiveError
    PalletCollectiveEvent: PalletCollectiveEvent
    PalletCollectiveRawOrigin: PalletCollectiveRawOrigin
    PalletCollectiveVotes: PalletCollectiveVotes
    PalletContractsCall: PalletContractsCall
    PalletContractsError: PalletContractsError
    PalletContractsEvent: PalletContractsEvent
    PalletContractsOrigin: PalletContractsOrigin
    PalletContractsSchedule: PalletContractsSchedule
    PalletContractsScheduleHostFnWeights: PalletContractsScheduleHostFnWeights
    PalletContractsScheduleInstructionWeights: PalletContractsScheduleInstructionWeights
    PalletContractsScheduleLimits: PalletContractsScheduleLimits
    PalletContractsStorageContractInfo: PalletContractsStorageContractInfo
    PalletContractsStorageDeletionQueueManager: PalletContractsStorageDeletionQueueManager
    PalletContractsWasmDeterminism: PalletContractsWasmDeterminism
    PalletContractsWasmOwnerInfo: PalletContractsWasmOwnerInfo
    PalletContractsWasmPrefabWasmModule: PalletContractsWasmPrefabWasmModule
    PalletDappStakingV3AccountLedger: PalletDappStakingV3AccountLedger
    PalletDappStakingV3Call: PalletDappStakingV3Call
    PalletDappStakingV3CleanupMarker: PalletDappStakingV3CleanupMarker
    PalletDappStakingV3ContractStakeAmount: PalletDappStakingV3ContractStakeAmount
    PalletDappStakingV3DAppInfo: PalletDappStakingV3DAppInfo
    PalletDappStakingV3DAppState: PalletDappStakingV3DAppState
    PalletDappStakingV3DAppTierRewards: PalletDappStakingV3DAppTierRewards
    PalletDappStakingV3EraInfo: PalletDappStakingV3EraInfo
    PalletDappStakingV3EraReward: PalletDappStakingV3EraReward
    PalletDappStakingV3EraRewardSpan: PalletDappStakingV3EraRewardSpan
    PalletDappStakingV3Error: PalletDappStakingV3Error
    PalletDappStakingV3Event: PalletDappStakingV3Event
    PalletDappStakingV3ForcingType: PalletDappStakingV3ForcingType
    PalletDappStakingV3FreezeReason: PalletDappStakingV3FreezeReason
    PalletDappStakingV3PeriodEndInfo: PalletDappStakingV3PeriodEndInfo
    PalletDappStakingV3PeriodInfo: PalletDappStakingV3PeriodInfo
    PalletDappStakingV3ProtocolState: PalletDappStakingV3ProtocolState
    PalletDappStakingV3SingularStakingInfo: PalletDappStakingV3SingularStakingInfo
    PalletDappStakingV3StakeAmount: PalletDappStakingV3StakeAmount
    PalletDappStakingV3Subperiod: PalletDappStakingV3Subperiod
    PalletDappStakingV3TierParameters: PalletDappStakingV3TierParameters
    PalletDappStakingV3TierThreshold: PalletDappStakingV3TierThreshold
    PalletDappStakingV3TiersConfiguration: PalletDappStakingV3TiersConfiguration
    PalletDappStakingV3UnlockingChunk: PalletDappStakingV3UnlockingChunk
    PalletDemocracyCall: PalletDemocracyCall
    PalletDemocracyConviction: PalletDemocracyConviction
    PalletDemocracyDelegations: PalletDemocracyDelegations
    PalletDemocracyError: PalletDemocracyError
    PalletDemocracyEvent: PalletDemocracyEvent
    PalletDemocracyMetadataOwner: PalletDemocracyMetadataOwner
    PalletDemocracyReferendumInfo: PalletDemocracyReferendumInfo
    PalletDemocracyReferendumStatus: PalletDemocracyReferendumStatus
    PalletDemocracyTally: PalletDemocracyTally
    PalletDemocracyVoteAccountVote: PalletDemocracyVoteAccountVote
    PalletDemocracyVotePriorLock: PalletDemocracyVotePriorLock
    PalletDemocracyVoteThreshold: PalletDemocracyVoteThreshold
    PalletDemocracyVoteVoting: PalletDemocracyVoteVoting
    PalletDynamicEvmBaseFeeCall: PalletDynamicEvmBaseFeeCall
    PalletDynamicEvmBaseFeeError: PalletDynamicEvmBaseFeeError
    PalletDynamicEvmBaseFeeEvent: PalletDynamicEvmBaseFeeEvent
    PalletEthereumCall: PalletEthereumCall
    PalletEthereumCheckedCall: PalletEthereumCheckedCall
    PalletEthereumCheckedRawOrigin: PalletEthereumCheckedRawOrigin
    PalletEthereumError: PalletEthereumError
    PalletEthereumEvent: PalletEthereumEvent
    PalletEthereumRawOrigin: PalletEthereumRawOrigin
    PalletEvmCall: PalletEvmCall
    PalletEvmCodeMetadata: PalletEvmCodeMetadata
    PalletEvmError: PalletEvmError
    PalletEvmEvent: PalletEvmEvent
    PalletIdentityBitFlags: PalletIdentityBitFlags
    PalletIdentityCall: PalletIdentityCall
    PalletIdentityError: PalletIdentityError
    PalletIdentityEvent: PalletIdentityEvent
    PalletIdentityIdentityField: PalletIdentityIdentityField
    PalletIdentityIdentityInfo: PalletIdentityIdentityInfo
    PalletIdentityJudgement: PalletIdentityJudgement
    PalletIdentityRegistrarInfo: PalletIdentityRegistrarInfo
    PalletIdentityRegistration: PalletIdentityRegistration
    PalletInflationCall: PalletInflationCall
    PalletInflationError: PalletInflationError
    PalletInflationEvent: PalletInflationEvent
    PalletInflationInflationConfiguration: PalletInflationInflationConfiguration
    PalletInflationInflationParameters: PalletInflationInflationParameters
    PalletMultisigCall: PalletMultisigCall
    PalletMultisigError: PalletMultisigError
    PalletMultisigEvent: PalletMultisigEvent
    PalletMultisigMultisig: PalletMultisigMultisig
    PalletMultisigTimepoint: PalletMultisigTimepoint
    PalletPreimageCall: PalletPreimageCall
    PalletPreimageError: PalletPreimageError
    PalletPreimageEvent: PalletPreimageEvent
    PalletPreimageRequestStatus: PalletPreimageRequestStatus
    PalletProxyAnnouncement: PalletProxyAnnouncement
    PalletProxyCall: PalletProxyCall
    PalletProxyError: PalletProxyError
    PalletProxyEvent: PalletProxyEvent
    PalletProxyProxyDefinition: PalletProxyProxyDefinition
    PalletSchedulerCall: PalletSchedulerCall
    PalletSchedulerError: PalletSchedulerError
    PalletSchedulerEvent: PalletSchedulerEvent
    PalletSchedulerScheduled: PalletSchedulerScheduled
    PalletSessionCall: PalletSessionCall
    PalletSessionError: PalletSessionError
    PalletSessionEvent: PalletSessionEvent
    PalletStaticPriceProviderCall: PalletStaticPriceProviderCall
    PalletStaticPriceProviderError: PalletStaticPriceProviderError
    PalletStaticPriceProviderEvent: PalletStaticPriceProviderEvent
    PalletSudoCall: PalletSudoCall
    PalletSudoError: PalletSudoError
    PalletSudoEvent: PalletSudoEvent
    PalletTimestampCall: PalletTimestampCall
    PalletTransactionPaymentChargeTransactionPayment: PalletTransactionPaymentChargeTransactionPayment
    PalletTransactionPaymentEvent: PalletTransactionPaymentEvent
    PalletTransactionPaymentReleases: PalletTransactionPaymentReleases
    PalletTreasuryCall: PalletTreasuryCall
    PalletTreasuryError: PalletTreasuryError
    PalletTreasuryEvent: PalletTreasuryEvent
    PalletTreasuryProposal: PalletTreasuryProposal
    PalletUnifiedAccountsCall: PalletUnifiedAccountsCall
    PalletUnifiedAccountsError: PalletUnifiedAccountsError
    PalletUnifiedAccountsEvent: PalletUnifiedAccountsEvent
    PalletUtilityCall: PalletUtilityCall
    PalletUtilityError: PalletUtilityError
    PalletUtilityEvent: PalletUtilityEvent
    PalletVestingCall: PalletVestingCall
    PalletVestingError: PalletVestingError
    PalletVestingEvent: PalletVestingEvent
    PalletVestingReleases: PalletVestingReleases
    PalletVestingVestingInfo: PalletVestingVestingInfo
    PalletXcAssetConfigCall: PalletXcAssetConfigCall
    PalletXcAssetConfigError: PalletXcAssetConfigError
    PalletXcAssetConfigEvent: PalletXcAssetConfigEvent
    PalletXcmCall: PalletXcmCall
    PalletXcmError: PalletXcmError
    PalletXcmEvent: PalletXcmEvent
    PalletXcmOrigin: PalletXcmOrigin
    PalletXcmQueryStatus: PalletXcmQueryStatus
    PalletXcmRemoteLockedFungibleRecord: PalletXcmRemoteLockedFungibleRecord
    PalletXcmVersionMigrationStage: PalletXcmVersionMigrationStage
    ParachainInfoCall: ParachainInfoCall
    PolkadotCorePrimitivesInboundDownwardMessage: PolkadotCorePrimitivesInboundDownwardMessage
    PolkadotCorePrimitivesInboundHrmpMessage: PolkadotCorePrimitivesInboundHrmpMessage
    PolkadotCorePrimitivesOutboundHrmpMessage: PolkadotCorePrimitivesOutboundHrmpMessage
    PolkadotParachainPrimitivesXcmpMessageFormat: PolkadotParachainPrimitivesXcmpMessageFormat
    PolkadotPrimitivesV4AbridgedHostConfiguration: PolkadotPrimitivesV4AbridgedHostConfiguration
    PolkadotPrimitivesV4AbridgedHrmpChannel: PolkadotPrimitivesV4AbridgedHrmpChannel
    PolkadotPrimitivesV4PersistedValidationData: PolkadotPrimitivesV4PersistedValidationData
    PolkadotPrimitivesV4UpgradeRestriction: PolkadotPrimitivesV4UpgradeRestriction
    ShibuyaRuntimeOriginCaller: ShibuyaRuntimeOriginCaller
    ShibuyaRuntimeProxyType: ShibuyaRuntimeProxyType
    ShibuyaRuntimeRuntime: ShibuyaRuntimeRuntime
    ShibuyaRuntimeRuntimeFreezeReason: ShibuyaRuntimeRuntimeFreezeReason
    ShibuyaRuntimeSessionKeys: ShibuyaRuntimeSessionKeys
    SpArithmeticArithmeticError: SpArithmeticArithmeticError
    SpConsensusAuraSr25519AppSr25519Public: SpConsensusAuraSr25519AppSr25519Public
    SpCoreCryptoKeyTypeId: SpCoreCryptoKeyTypeId
    SpCoreEcdsaSignature: SpCoreEcdsaSignature
    SpCoreEd25519Signature: SpCoreEd25519Signature
    SpCoreSr25519Public: SpCoreSr25519Public
    SpCoreSr25519Signature: SpCoreSr25519Signature
    SpCoreVoid: SpCoreVoid
    SpRuntimeDigest: SpRuntimeDigest
    SpRuntimeDigestDigestItem: SpRuntimeDigestDigestItem
    SpRuntimeDispatchError: SpRuntimeDispatchError
    SpRuntimeModuleError: SpRuntimeModuleError
    SpRuntimeMultiSignature: SpRuntimeMultiSignature
    SpRuntimeTokenError: SpRuntimeTokenError
    SpRuntimeTransactionalError: SpRuntimeTransactionalError
    SpTrieStorageProof: SpTrieStorageProof
    SpVersionRuntimeVersion: SpVersionRuntimeVersion
    SpWeightsRuntimeDbWeight: SpWeightsRuntimeDbWeight
    SpWeightsWeightV2Weight: SpWeightsWeightV2Weight
    XcmDoubleEncoded: XcmDoubleEncoded
    XcmV2BodyId: XcmV2BodyId
    XcmV2BodyPart: XcmV2BodyPart
    XcmV2Instruction: XcmV2Instruction
    XcmV2Junction: XcmV2Junction
    XcmV2MultiAsset: XcmV2MultiAsset
    XcmV2MultiLocation: XcmV2MultiLocation
    XcmV2MultiassetAssetId: XcmV2MultiassetAssetId
    XcmV2MultiassetAssetInstance: XcmV2MultiassetAssetInstance
    XcmV2MultiassetFungibility: XcmV2MultiassetFungibility
    XcmV2MultiassetMultiAssetFilter: XcmV2MultiassetMultiAssetFilter
    XcmV2MultiassetMultiAssets: XcmV2MultiassetMultiAssets
    XcmV2MultiassetWildFungibility: XcmV2MultiassetWildFungibility
    XcmV2MultiassetWildMultiAsset: XcmV2MultiassetWildMultiAsset
    XcmV2MultilocationJunctions: XcmV2MultilocationJunctions
    XcmV2NetworkId: XcmV2NetworkId
    XcmV2OriginKind: XcmV2OriginKind
    XcmV2Response: XcmV2Response
    XcmV2TraitsError: XcmV2TraitsError
    XcmV2WeightLimit: XcmV2WeightLimit
    XcmV2Xcm: XcmV2Xcm
    XcmV3Instruction: XcmV3Instruction
    XcmV3Junction: XcmV3Junction
    XcmV3JunctionBodyId: XcmV3JunctionBodyId
    XcmV3JunctionBodyPart: XcmV3JunctionBodyPart
    XcmV3JunctionNetworkId: XcmV3JunctionNetworkId
    XcmV3Junctions: XcmV3Junctions
    XcmV3MaybeErrorCode: XcmV3MaybeErrorCode
    XcmV3MultiAsset: XcmV3MultiAsset
    XcmV3MultiLocation: XcmV3MultiLocation
    XcmV3MultiassetAssetId: XcmV3MultiassetAssetId
    XcmV3MultiassetAssetInstance: XcmV3MultiassetAssetInstance
    XcmV3MultiassetFungibility: XcmV3MultiassetFungibility
    XcmV3MultiassetMultiAssetFilter: XcmV3MultiassetMultiAssetFilter
    XcmV3MultiassetMultiAssets: XcmV3MultiassetMultiAssets
    XcmV3MultiassetWildFungibility: XcmV3MultiassetWildFungibility
    XcmV3MultiassetWildMultiAsset: XcmV3MultiassetWildMultiAsset
    XcmV3PalletInfo: XcmV3PalletInfo
    XcmV3QueryResponseInfo: XcmV3QueryResponseInfo
    XcmV3Response: XcmV3Response
    XcmV3TraitsError: XcmV3TraitsError
    XcmV3TraitsOutcome: XcmV3TraitsOutcome
    XcmV3WeightLimit: XcmV3WeightLimit
    XcmV3Xcm: XcmV3Xcm
    XcmVersionedAssetId: XcmVersionedAssetId
    XcmVersionedMultiAsset: XcmVersionedMultiAsset
    XcmVersionedMultiAssets: XcmVersionedMultiAssets
    XcmVersionedMultiLocation: XcmVersionedMultiLocation
    XcmVersionedResponse: XcmVersionedResponse
    XcmVersionedXcm: XcmVersionedXcm
  } // InterfaceTypes
} // declare module
