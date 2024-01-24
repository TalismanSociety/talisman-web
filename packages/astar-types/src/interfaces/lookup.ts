// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

/* eslint-disable sort-keys */

export default {
  /**
   * Lookup3: frame_system::AccountInfo<Index, pallet_balances::types::AccountData<Balance>>
   **/
  FrameSystemAccountInfo: {
    nonce: 'u32',
    consumers: 'u32',
    providers: 'u32',
    sufficients: 'u32',
    data: 'PalletBalancesAccountData',
  },
  /**
   * Lookup5: pallet_balances::types::AccountData<Balance>
   **/
  PalletBalancesAccountData: {
    free: 'u128',
    reserved: 'u128',
    frozen: 'u128',
    flags: 'u128',
  },
  /**
   * Lookup8: frame_support::dispatch::PerDispatchClass<sp_weights::weight_v2::Weight>
   **/
  FrameSupportDispatchPerDispatchClassWeight: {
    normal: 'SpWeightsWeightV2Weight',
    operational: 'SpWeightsWeightV2Weight',
    mandatory: 'SpWeightsWeightV2Weight',
  },
  /**
   * Lookup9: sp_weights::weight_v2::Weight
   **/
  SpWeightsWeightV2Weight: {
    refTime: 'Compact<u64>',
    proofSize: 'Compact<u64>',
  },
  /**
   * Lookup14: sp_runtime::generic::digest::Digest
   **/
  SpRuntimeDigest: {
    logs: 'Vec<SpRuntimeDigestDigestItem>',
  },
  /**
   * Lookup16: sp_runtime::generic::digest::DigestItem
   **/
  SpRuntimeDigestDigestItem: {
    _enum: {
      Other: 'Bytes',
      __Unused1: 'Null',
      __Unused2: 'Null',
      __Unused3: 'Null',
      Consensus: '([u8;4],Bytes)',
      Seal: '([u8;4],Bytes)',
      PreRuntime: '([u8;4],Bytes)',
      __Unused7: 'Null',
      RuntimeEnvironmentUpdated: 'Null',
    },
  },
  /**
   * Lookup19: frame_system::EventRecord<shibuya_runtime::RuntimeEvent, primitive_types::H256>
   **/
  FrameSystemEventRecord: {
    phase: 'FrameSystemPhase',
    event: 'Event',
    topics: 'Vec<H256>',
  },
  /**
   * Lookup21: frame_system::pallet::Event<T>
   **/
  FrameSystemEvent: {
    _enum: {
      ExtrinsicSuccess: {
        dispatchInfo: 'FrameSupportDispatchDispatchInfo',
      },
      ExtrinsicFailed: {
        dispatchError: 'SpRuntimeDispatchError',
        dispatchInfo: 'FrameSupportDispatchDispatchInfo',
      },
      CodeUpdated: 'Null',
      NewAccount: {
        account: 'AccountId32',
      },
      KilledAccount: {
        account: 'AccountId32',
      },
      Remarked: {
        _alias: {
          hash_: 'hash',
        },
        sender: 'AccountId32',
        hash_: 'H256',
      },
    },
  },
  /**
   * Lookup22: frame_support::dispatch::DispatchInfo
   **/
  FrameSupportDispatchDispatchInfo: {
    weight: 'SpWeightsWeightV2Weight',
    class: 'FrameSupportDispatchDispatchClass',
    paysFee: 'FrameSupportDispatchPays',
  },
  /**
   * Lookup23: frame_support::dispatch::DispatchClass
   **/
  FrameSupportDispatchDispatchClass: {
    _enum: ['Normal', 'Operational', 'Mandatory'],
  },
  /**
   * Lookup24: frame_support::dispatch::Pays
   **/
  FrameSupportDispatchPays: {
    _enum: ['Yes', 'No'],
  },
  /**
   * Lookup25: sp_runtime::DispatchError
   **/
  SpRuntimeDispatchError: {
    _enum: {
      Other: 'Null',
      CannotLookup: 'Null',
      BadOrigin: 'Null',
      Module: 'SpRuntimeModuleError',
      ConsumerRemaining: 'Null',
      NoProviders: 'Null',
      TooManyConsumers: 'Null',
      Token: 'SpRuntimeTokenError',
      Arithmetic: 'SpArithmeticArithmeticError',
      Transactional: 'SpRuntimeTransactionalError',
      Exhausted: 'Null',
      Corruption: 'Null',
      Unavailable: 'Null',
      RootNotAllowed: 'Null',
    },
  },
  /**
   * Lookup26: sp_runtime::ModuleError
   **/
  SpRuntimeModuleError: {
    index: 'u8',
    error: '[u8;4]',
  },
  /**
   * Lookup27: sp_runtime::TokenError
   **/
  SpRuntimeTokenError: {
    _enum: [
      'FundsUnavailable',
      'OnlyProvider',
      'BelowMinimum',
      'CannotCreate',
      'UnknownAsset',
      'Frozen',
      'Unsupported',
      'CannotCreateHold',
      'NotExpendable',
      'Blocked',
    ],
  },
  /**
   * Lookup28: sp_arithmetic::ArithmeticError
   **/
  SpArithmeticArithmeticError: {
    _enum: ['Underflow', 'Overflow', 'DivisionByZero'],
  },
  /**
   * Lookup29: sp_runtime::TransactionalError
   **/
  SpRuntimeTransactionalError: {
    _enum: ['LimitReached', 'NoLayer'],
  },
  /**
   * Lookup30: pallet_utility::pallet::Event
   **/
  PalletUtilityEvent: {
    _enum: {
      BatchInterrupted: {
        index: 'u32',
        error: 'SpRuntimeDispatchError',
      },
      BatchCompleted: 'Null',
      BatchCompletedWithErrors: 'Null',
      ItemCompleted: 'Null',
      ItemFailed: {
        error: 'SpRuntimeDispatchError',
      },
      DispatchedAs: {
        result: 'Result<Null, SpRuntimeDispatchError>',
      },
    },
  },
  /**
   * Lookup33: pallet_identity::pallet::Event<T>
   **/
  PalletIdentityEvent: {
    _enum: {
      IdentitySet: {
        who: 'AccountId32',
      },
      IdentityCleared: {
        who: 'AccountId32',
        deposit: 'u128',
      },
      IdentityKilled: {
        who: 'AccountId32',
        deposit: 'u128',
      },
      JudgementRequested: {
        who: 'AccountId32',
        registrarIndex: 'u32',
      },
      JudgementUnrequested: {
        who: 'AccountId32',
        registrarIndex: 'u32',
      },
      JudgementGiven: {
        target: 'AccountId32',
        registrarIndex: 'u32',
      },
      RegistrarAdded: {
        registrarIndex: 'u32',
      },
      SubIdentityAdded: {
        sub: 'AccountId32',
        main: 'AccountId32',
        deposit: 'u128',
      },
      SubIdentityRemoved: {
        sub: 'AccountId32',
        main: 'AccountId32',
        deposit: 'u128',
      },
      SubIdentityRevoked: {
        sub: 'AccountId32',
        main: 'AccountId32',
        deposit: 'u128',
      },
    },
  },
  /**
   * Lookup34: pallet_multisig::pallet::Event<T>
   **/
  PalletMultisigEvent: {
    _enum: {
      NewMultisig: {
        approving: 'AccountId32',
        multisig: 'AccountId32',
        callHash: '[u8;32]',
      },
      MultisigApproval: {
        approving: 'AccountId32',
        timepoint: 'PalletMultisigTimepoint',
        multisig: 'AccountId32',
        callHash: '[u8;32]',
      },
      MultisigExecuted: {
        approving: 'AccountId32',
        timepoint: 'PalletMultisigTimepoint',
        multisig: 'AccountId32',
        callHash: '[u8;32]',
        result: 'Result<Null, SpRuntimeDispatchError>',
      },
      MultisigCancelled: {
        cancelling: 'AccountId32',
        timepoint: 'PalletMultisigTimepoint',
        multisig: 'AccountId32',
        callHash: '[u8;32]',
      },
    },
  },
  /**
   * Lookup35: pallet_multisig::Timepoint<BlockNumber>
   **/
  PalletMultisigTimepoint: {
    height: 'u32',
    index: 'u32',
  },
  /**
   * Lookup36: pallet_scheduler::pallet::Event<T>
   **/
  PalletSchedulerEvent: {
    _enum: {
      Scheduled: {
        when: 'u32',
        index: 'u32',
      },
      Canceled: {
        when: 'u32',
        index: 'u32',
      },
      Dispatched: {
        task: '(u32,u32)',
        id: 'Option<[u8;32]>',
        result: 'Result<Null, SpRuntimeDispatchError>',
      },
      CallUnavailable: {
        task: '(u32,u32)',
        id: 'Option<[u8;32]>',
      },
      PeriodicFailed: {
        task: '(u32,u32)',
        id: 'Option<[u8;32]>',
      },
      PermanentlyOverweight: {
        task: '(u32,u32)',
        id: 'Option<[u8;32]>',
      },
    },
  },
  /**
   * Lookup39: pallet_proxy::pallet::Event<T>
   **/
  PalletProxyEvent: {
    _enum: {
      ProxyExecuted: {
        result: 'Result<Null, SpRuntimeDispatchError>',
      },
      PureCreated: {
        pure: 'AccountId32',
        who: 'AccountId32',
        proxyType: 'ShibuyaRuntimeProxyType',
        disambiguationIndex: 'u16',
      },
      Announced: {
        real: 'AccountId32',
        proxy: 'AccountId32',
        callHash: 'H256',
      },
      ProxyAdded: {
        delegator: 'AccountId32',
        delegatee: 'AccountId32',
        proxyType: 'ShibuyaRuntimeProxyType',
        delay: 'u32',
      },
      ProxyRemoved: {
        delegator: 'AccountId32',
        delegatee: 'AccountId32',
        proxyType: 'ShibuyaRuntimeProxyType',
        delay: 'u32',
      },
    },
  },
  /**
   * Lookup40: shibuya_runtime::ProxyType
   **/
  ShibuyaRuntimeProxyType: {
    _enum: [
      'Any',
      'NonTransfer',
      'Balances',
      'Assets',
      'Governance',
      'IdentityJudgement',
      'CancelProxy',
      'DappStaking',
      'StakerRewardClaim',
    ],
  },
  /**
   * Lookup42: cumulus_pallet_parachain_system::pallet::Event<T>
   **/
  CumulusPalletParachainSystemEvent: {
    _enum: {
      ValidationFunctionStored: 'Null',
      ValidationFunctionApplied: {
        relayChainBlockNum: 'u32',
      },
      ValidationFunctionDiscarded: 'Null',
      UpgradeAuthorized: {
        codeHash: 'H256',
      },
      DownwardMessagesReceived: {
        count: 'u32',
      },
      DownwardMessagesProcessed: {
        weightUsed: 'SpWeightsWeightV2Weight',
        dmqHead: 'H256',
      },
      UpwardMessageSent: {
        messageHash: 'Option<[u8;32]>',
      },
    },
  },
  /**
   * Lookup43: pallet_transaction_payment::pallet::Event<T>
   **/
  PalletTransactionPaymentEvent: {
    _enum: {
      TransactionFeePaid: {
        who: 'AccountId32',
        actualFee: 'u128',
        tip: 'u128',
      },
    },
  },
  /**
   * Lookup44: pallet_balances::pallet::Event<T, I>
   **/
  PalletBalancesEvent: {
    _enum: {
      Endowed: {
        account: 'AccountId32',
        freeBalance: 'u128',
      },
      DustLost: {
        account: 'AccountId32',
        amount: 'u128',
      },
      Transfer: {
        from: 'AccountId32',
        to: 'AccountId32',
        amount: 'u128',
      },
      BalanceSet: {
        who: 'AccountId32',
        free: 'u128',
      },
      Reserved: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Unreserved: {
        who: 'AccountId32',
        amount: 'u128',
      },
      ReserveRepatriated: {
        from: 'AccountId32',
        to: 'AccountId32',
        amount: 'u128',
        destinationStatus: 'FrameSupportTokensMiscBalanceStatus',
      },
      Deposit: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Withdraw: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Slashed: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Minted: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Burned: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Suspended: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Restored: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Upgraded: {
        who: 'AccountId32',
      },
      Issued: {
        amount: 'u128',
      },
      Rescinded: {
        amount: 'u128',
      },
      Locked: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Unlocked: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Frozen: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Thawed: {
        who: 'AccountId32',
        amount: 'u128',
      },
    },
  },
  /**
   * Lookup45: frame_support::traits::tokens::misc::BalanceStatus
   **/
  FrameSupportTokensMiscBalanceStatus: {
    _enum: ['Free', 'Reserved'],
  },
  /**
   * Lookup46: pallet_vesting::pallet::Event<T>
   **/
  PalletVestingEvent: {
    _enum: {
      VestingUpdated: {
        account: 'AccountId32',
        unvested: 'u128',
      },
      VestingCompleted: {
        account: 'AccountId32',
      },
    },
  },
  /**
   * Lookup47: pallet_dapp_staking_v3::pallet::Event<T>
   **/
  PalletDappStakingV3Event: {
    _enum: {
      MaintenanceMode: {
        enabled: 'bool',
      },
      NewEra: {
        era: 'u32',
      },
      NewSubperiod: {
        subperiod: 'PalletDappStakingV3Subperiod',
        number: 'u32',
      },
      DAppRegistered: {
        owner: 'AccountId32',
        smartContract: 'AstarPrimitivesDappStakingSmartContract',
        dappId: 'u16',
      },
      DAppRewardDestinationUpdated: {
        smartContract: 'AstarPrimitivesDappStakingSmartContract',
        beneficiary: 'Option<AccountId32>',
      },
      DAppOwnerChanged: {
        smartContract: 'AstarPrimitivesDappStakingSmartContract',
        newOwner: 'AccountId32',
      },
      DAppUnregistered: {
        smartContract: 'AstarPrimitivesDappStakingSmartContract',
        era: 'u32',
      },
      Locked: {
        account: 'AccountId32',
        amount: 'u128',
      },
      Unlocking: {
        account: 'AccountId32',
        amount: 'u128',
      },
      ClaimedUnlocked: {
        account: 'AccountId32',
        amount: 'u128',
      },
      Relock: {
        account: 'AccountId32',
        amount: 'u128',
      },
      Stake: {
        account: 'AccountId32',
        smartContract: 'AstarPrimitivesDappStakingSmartContract',
        amount: 'u128',
      },
      Unstake: {
        account: 'AccountId32',
        smartContract: 'AstarPrimitivesDappStakingSmartContract',
        amount: 'u128',
      },
      Reward: {
        account: 'AccountId32',
        era: 'u32',
        amount: 'u128',
      },
      BonusReward: {
        account: 'AccountId32',
        smartContract: 'AstarPrimitivesDappStakingSmartContract',
        period: 'u32',
        amount: 'u128',
      },
      DAppReward: {
        beneficiary: 'AccountId32',
        smartContract: 'AstarPrimitivesDappStakingSmartContract',
        tierId: 'u8',
        era: 'u32',
        amount: 'u128',
      },
      UnstakeFromUnregistered: {
        account: 'AccountId32',
        smartContract: 'AstarPrimitivesDappStakingSmartContract',
        amount: 'u128',
      },
      ExpiredEntriesRemoved: {
        account: 'AccountId32',
        count: 'u16',
      },
      Force: {
        forcingType: 'PalletDappStakingV3ForcingType',
      },
    },
  },
  /**
   * Lookup49: pallet_dapp_staking_v3::types::Subperiod
   **/
  PalletDappStakingV3Subperiod: {
    _enum: ['Voting', 'BuildAndEarn'],
  },
  /**
   * Lookup50: astar_primitives::dapp_staking::SmartContract<sp_core::crypto::AccountId32>
   **/
  AstarPrimitivesDappStakingSmartContract: {
    _enum: {
      Evm: 'H160',
      Wasm: 'AccountId32',
    },
  },
  /**
   * Lookup54: pallet_dapp_staking_v3::types::ForcingType
   **/
  PalletDappStakingV3ForcingType: {
    _enum: ['Era', 'Subperiod'],
  },
  /**
   * Lookup55: pallet_inflation::pallet::Event<T>
   **/
  PalletInflationEvent: {
    _enum: {
      InflationParametersForceChanged: 'Null',
      InflationConfigurationForceChanged: {
        config: 'PalletInflationInflationConfiguration',
      },
      ForcedInflationRecalculation: {
        config: 'PalletInflationInflationConfiguration',
      },
      NewInflationConfiguration: {
        config: 'PalletInflationInflationConfiguration',
      },
    },
  },
  /**
   * Lookup56: pallet_inflation::InflationConfiguration
   **/
  PalletInflationInflationConfiguration: {
    recalculationEra: 'Compact<u32>',
    issuanceSafetyCap: 'Compact<u128>',
    collatorRewardPerBlock: 'Compact<u128>',
    treasuryRewardPerBlock: 'Compact<u128>',
    dappRewardPoolPerEra: 'Compact<u128>',
    baseStakerRewardPoolPerEra: 'Compact<u128>',
    adjustableStakerRewardPoolPerEra: 'Compact<u128>',
    bonusRewardPoolPerPeriod: 'Compact<u128>',
    idealStakingRate: 'Compact<Perquintill>',
  },
  /**
   * Lookup61: pallet_assets::pallet::Event<T, I>
   **/
  PalletAssetsEvent: {
    _enum: {
      Created: {
        assetId: 'u128',
        creator: 'AccountId32',
        owner: 'AccountId32',
      },
      Issued: {
        assetId: 'u128',
        owner: 'AccountId32',
        amount: 'u128',
      },
      Transferred: {
        assetId: 'u128',
        from: 'AccountId32',
        to: 'AccountId32',
        amount: 'u128',
      },
      Burned: {
        assetId: 'u128',
        owner: 'AccountId32',
        balance: 'u128',
      },
      TeamChanged: {
        assetId: 'u128',
        issuer: 'AccountId32',
        admin: 'AccountId32',
        freezer: 'AccountId32',
      },
      OwnerChanged: {
        assetId: 'u128',
        owner: 'AccountId32',
      },
      Frozen: {
        assetId: 'u128',
        who: 'AccountId32',
      },
      Thawed: {
        assetId: 'u128',
        who: 'AccountId32',
      },
      AssetFrozen: {
        assetId: 'u128',
      },
      AssetThawed: {
        assetId: 'u128',
      },
      AccountsDestroyed: {
        assetId: 'u128',
        accountsDestroyed: 'u32',
        accountsRemaining: 'u32',
      },
      ApprovalsDestroyed: {
        assetId: 'u128',
        approvalsDestroyed: 'u32',
        approvalsRemaining: 'u32',
      },
      DestructionStarted: {
        assetId: 'u128',
      },
      Destroyed: {
        assetId: 'u128',
      },
      ForceCreated: {
        assetId: 'u128',
        owner: 'AccountId32',
      },
      MetadataSet: {
        assetId: 'u128',
        name: 'Bytes',
        symbol: 'Bytes',
        decimals: 'u8',
        isFrozen: 'bool',
      },
      MetadataCleared: {
        assetId: 'u128',
      },
      ApprovedTransfer: {
        assetId: 'u128',
        source: 'AccountId32',
        delegate: 'AccountId32',
        amount: 'u128',
      },
      ApprovalCancelled: {
        assetId: 'u128',
        owner: 'AccountId32',
        delegate: 'AccountId32',
      },
      TransferredApproved: {
        assetId: 'u128',
        owner: 'AccountId32',
        delegate: 'AccountId32',
        destination: 'AccountId32',
        amount: 'u128',
      },
      AssetStatusChanged: {
        assetId: 'u128',
      },
      AssetMinBalanceChanged: {
        assetId: 'u128',
        newMinBalance: 'u128',
      },
      Touched: {
        assetId: 'u128',
        who: 'AccountId32',
        depositor: 'AccountId32',
      },
      Blocked: {
        assetId: 'u128',
        who: 'AccountId32',
      },
    },
  },
  /**
   * Lookup62: pallet_collator_selection::pallet::Event<T>
   **/
  PalletCollatorSelectionEvent: {
    _enum: {
      NewInvulnerables: 'Vec<AccountId32>',
      NewDesiredCandidates: 'u32',
      NewCandidacyBond: 'u128',
      CandidateAdded: '(AccountId32,u128)',
      CandidateRemoved: 'AccountId32',
      CandidateSlashed: 'AccountId32',
    },
  },
  /**
   * Lookup64: pallet_session::pallet::Event
   **/
  PalletSessionEvent: {
    _enum: {
      NewSession: {
        sessionIndex: 'u32',
      },
    },
  },
  /**
   * Lookup65: cumulus_pallet_xcmp_queue::pallet::Event<T>
   **/
  CumulusPalletXcmpQueueEvent: {
    _enum: {
      Success: {
        messageHash: 'Option<[u8;32]>',
        weight: 'SpWeightsWeightV2Weight',
      },
      Fail: {
        messageHash: 'Option<[u8;32]>',
        error: 'XcmV3TraitsError',
        weight: 'SpWeightsWeightV2Weight',
      },
      BadVersion: {
        messageHash: 'Option<[u8;32]>',
      },
      BadFormat: {
        messageHash: 'Option<[u8;32]>',
      },
      XcmpMessageSent: {
        messageHash: 'Option<[u8;32]>',
      },
      OverweightEnqueued: {
        sender: 'u32',
        sentAt: 'u32',
        index: 'u64',
        required: 'SpWeightsWeightV2Weight',
      },
      OverweightServiced: {
        index: 'u64',
        used: 'SpWeightsWeightV2Weight',
      },
    },
  },
  /**
   * Lookup66: xcm::v3::traits::Error
   **/
  XcmV3TraitsError: {
    _enum: {
      Overflow: 'Null',
      Unimplemented: 'Null',
      UntrustedReserveLocation: 'Null',
      UntrustedTeleportLocation: 'Null',
      LocationFull: 'Null',
      LocationNotInvertible: 'Null',
      BadOrigin: 'Null',
      InvalidLocation: 'Null',
      AssetNotFound: 'Null',
      FailedToTransactAsset: 'Null',
      NotWithdrawable: 'Null',
      LocationCannotHold: 'Null',
      ExceedsMaxMessageSize: 'Null',
      DestinationUnsupported: 'Null',
      Transport: 'Null',
      Unroutable: 'Null',
      UnknownClaim: 'Null',
      FailedToDecode: 'Null',
      MaxWeightInvalid: 'Null',
      NotHoldingFees: 'Null',
      TooExpensive: 'Null',
      Trap: 'u64',
      ExpectationFalse: 'Null',
      PalletNotFound: 'Null',
      NameMismatch: 'Null',
      VersionIncompatible: 'Null',
      HoldingWouldOverflow: 'Null',
      ExportError: 'Null',
      ReanchorFailed: 'Null',
      NoDeal: 'Null',
      FeesNotMet: 'Null',
      LockError: 'Null',
      NoPermission: 'Null',
      Unanchored: 'Null',
      NotDepositable: 'Null',
      UnhandledXcmVersion: 'Null',
      WeightLimitReached: 'SpWeightsWeightV2Weight',
      Barrier: 'Null',
      WeightNotComputable: 'Null',
      ExceedsStackLimit: 'Null',
    },
  },
  /**
   * Lookup68: pallet_xcm::pallet::Event<T>
   **/
  PalletXcmEvent: {
    _enum: {
      Attempted: 'XcmV3TraitsOutcome',
      Sent: '(XcmV3MultiLocation,XcmV3MultiLocation,XcmV3Xcm)',
      UnexpectedResponse: '(XcmV3MultiLocation,u64)',
      ResponseReady: '(u64,XcmV3Response)',
      Notified: '(u64,u8,u8)',
      NotifyOverweight: '(u64,u8,u8,SpWeightsWeightV2Weight,SpWeightsWeightV2Weight)',
      NotifyDispatchError: '(u64,u8,u8)',
      NotifyDecodeFailed: '(u64,u8,u8)',
      InvalidResponder: '(XcmV3MultiLocation,u64,Option<XcmV3MultiLocation>)',
      InvalidResponderVersion: '(XcmV3MultiLocation,u64)',
      ResponseTaken: 'u64',
      AssetsTrapped: '(H256,XcmV3MultiLocation,XcmVersionedMultiAssets)',
      VersionChangeNotified: '(XcmV3MultiLocation,u32,XcmV3MultiassetMultiAssets)',
      SupportedVersionChanged: '(XcmV3MultiLocation,u32)',
      NotifyTargetSendFail: '(XcmV3MultiLocation,u64,XcmV3TraitsError)',
      NotifyTargetMigrationFail: '(XcmVersionedMultiLocation,u64)',
      InvalidQuerierVersion: '(XcmV3MultiLocation,u64)',
      InvalidQuerier: '(XcmV3MultiLocation,u64,XcmV3MultiLocation,Option<XcmV3MultiLocation>)',
      VersionNotifyStarted: '(XcmV3MultiLocation,XcmV3MultiassetMultiAssets)',
      VersionNotifyRequested: '(XcmV3MultiLocation,XcmV3MultiassetMultiAssets)',
      VersionNotifyUnrequested: '(XcmV3MultiLocation,XcmV3MultiassetMultiAssets)',
      FeesPaid: '(XcmV3MultiLocation,XcmV3MultiassetMultiAssets)',
      AssetsClaimed: '(H256,XcmV3MultiLocation,XcmVersionedMultiAssets)',
    },
  },
  /**
   * Lookup69: xcm::v3::traits::Outcome
   **/
  XcmV3TraitsOutcome: {
    _enum: {
      Complete: 'SpWeightsWeightV2Weight',
      Incomplete: '(SpWeightsWeightV2Weight,XcmV3TraitsError)',
      Error: 'XcmV3TraitsError',
    },
  },
  /**
   * Lookup70: xcm::v3::multilocation::MultiLocation
   **/
  XcmV3MultiLocation: {
    parents: 'u8',
    interior: 'XcmV3Junctions',
  },
  /**
   * Lookup71: xcm::v3::junctions::Junctions
   **/
  XcmV3Junctions: {
    _enum: {
      Here: 'Null',
      X1: 'XcmV3Junction',
      X2: '(XcmV3Junction,XcmV3Junction)',
      X3: '(XcmV3Junction,XcmV3Junction,XcmV3Junction)',
      X4: '(XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction)',
      X5: '(XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction)',
      X6: '(XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction)',
      X7: '(XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction)',
      X8: '(XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction)',
    },
  },
  /**
   * Lookup72: xcm::v3::junction::Junction
   **/
  XcmV3Junction: {
    _enum: {
      Parachain: 'Compact<u32>',
      AccountId32: {
        network: 'Option<XcmV3JunctionNetworkId>',
        id: '[u8;32]',
      },
      AccountIndex64: {
        network: 'Option<XcmV3JunctionNetworkId>',
        index: 'Compact<u64>',
      },
      AccountKey20: {
        network: 'Option<XcmV3JunctionNetworkId>',
        key: '[u8;20]',
      },
      PalletInstance: 'u8',
      GeneralIndex: 'Compact<u128>',
      GeneralKey: {
        length: 'u8',
        data: '[u8;32]',
      },
      OnlyChild: 'Null',
      Plurality: {
        id: 'XcmV3JunctionBodyId',
        part: 'XcmV3JunctionBodyPart',
      },
      GlobalConsensus: 'XcmV3JunctionNetworkId',
    },
  },
  /**
   * Lookup74: xcm::v3::junction::NetworkId
   **/
  XcmV3JunctionNetworkId: {
    _enum: {
      ByGenesis: '[u8;32]',
      ByFork: {
        blockNumber: 'u64',
        blockHash: '[u8;32]',
      },
      Polkadot: 'Null',
      Kusama: 'Null',
      Westend: 'Null',
      Rococo: 'Null',
      Wococo: 'Null',
      Ethereum: {
        chainId: 'Compact<u64>',
      },
      BitcoinCore: 'Null',
      BitcoinCash: 'Null',
    },
  },
  /**
   * Lookup75: xcm::v3::junction::BodyId
   **/
  XcmV3JunctionBodyId: {
    _enum: {
      Unit: 'Null',
      Moniker: '[u8;4]',
      Index: 'Compact<u32>',
      Executive: 'Null',
      Technical: 'Null',
      Legislative: 'Null',
      Judicial: 'Null',
      Defense: 'Null',
      Administration: 'Null',
      Treasury: 'Null',
    },
  },
  /**
   * Lookup76: xcm::v3::junction::BodyPart
   **/
  XcmV3JunctionBodyPart: {
    _enum: {
      Voice: 'Null',
      Members: {
        count: 'Compact<u32>',
      },
      Fraction: {
        nom: 'Compact<u32>',
        denom: 'Compact<u32>',
      },
      AtLeastProportion: {
        nom: 'Compact<u32>',
        denom: 'Compact<u32>',
      },
      MoreThanProportion: {
        nom: 'Compact<u32>',
        denom: 'Compact<u32>',
      },
    },
  },
  /**
   * Lookup77: xcm::v3::Xcm<Call>
   **/
  XcmV3Xcm: 'Vec<XcmV3Instruction>',
  /**
   * Lookup79: xcm::v3::Instruction<Call>
   **/
  XcmV3Instruction: {
    _enum: {
      WithdrawAsset: 'XcmV3MultiassetMultiAssets',
      ReserveAssetDeposited: 'XcmV3MultiassetMultiAssets',
      ReceiveTeleportedAsset: 'XcmV3MultiassetMultiAssets',
      QueryResponse: {
        queryId: 'Compact<u64>',
        response: 'XcmV3Response',
        maxWeight: 'SpWeightsWeightV2Weight',
        querier: 'Option<XcmV3MultiLocation>',
      },
      TransferAsset: {
        assets: 'XcmV3MultiassetMultiAssets',
        beneficiary: 'XcmV3MultiLocation',
      },
      TransferReserveAsset: {
        assets: 'XcmV3MultiassetMultiAssets',
        dest: 'XcmV3MultiLocation',
        xcm: 'XcmV3Xcm',
      },
      Transact: {
        originKind: 'XcmV2OriginKind',
        requireWeightAtMost: 'SpWeightsWeightV2Weight',
        call: 'XcmDoubleEncoded',
      },
      HrmpNewChannelOpenRequest: {
        sender: 'Compact<u32>',
        maxMessageSize: 'Compact<u32>',
        maxCapacity: 'Compact<u32>',
      },
      HrmpChannelAccepted: {
        recipient: 'Compact<u32>',
      },
      HrmpChannelClosing: {
        initiator: 'Compact<u32>',
        sender: 'Compact<u32>',
        recipient: 'Compact<u32>',
      },
      ClearOrigin: 'Null',
      DescendOrigin: 'XcmV3Junctions',
      ReportError: 'XcmV3QueryResponseInfo',
      DepositAsset: {
        assets: 'XcmV3MultiassetMultiAssetFilter',
        beneficiary: 'XcmV3MultiLocation',
      },
      DepositReserveAsset: {
        assets: 'XcmV3MultiassetMultiAssetFilter',
        dest: 'XcmV3MultiLocation',
        xcm: 'XcmV3Xcm',
      },
      ExchangeAsset: {
        give: 'XcmV3MultiassetMultiAssetFilter',
        want: 'XcmV3MultiassetMultiAssets',
        maximal: 'bool',
      },
      InitiateReserveWithdraw: {
        assets: 'XcmV3MultiassetMultiAssetFilter',
        reserve: 'XcmV3MultiLocation',
        xcm: 'XcmV3Xcm',
      },
      InitiateTeleport: {
        assets: 'XcmV3MultiassetMultiAssetFilter',
        dest: 'XcmV3MultiLocation',
        xcm: 'XcmV3Xcm',
      },
      ReportHolding: {
        responseInfo: 'XcmV3QueryResponseInfo',
        assets: 'XcmV3MultiassetMultiAssetFilter',
      },
      BuyExecution: {
        fees: 'XcmV3MultiAsset',
        weightLimit: 'XcmV3WeightLimit',
      },
      RefundSurplus: 'Null',
      SetErrorHandler: 'XcmV3Xcm',
      SetAppendix: 'XcmV3Xcm',
      ClearError: 'Null',
      ClaimAsset: {
        assets: 'XcmV3MultiassetMultiAssets',
        ticket: 'XcmV3MultiLocation',
      },
      Trap: 'Compact<u64>',
      SubscribeVersion: {
        queryId: 'Compact<u64>',
        maxResponseWeight: 'SpWeightsWeightV2Weight',
      },
      UnsubscribeVersion: 'Null',
      BurnAsset: 'XcmV3MultiassetMultiAssets',
      ExpectAsset: 'XcmV3MultiassetMultiAssets',
      ExpectOrigin: 'Option<XcmV3MultiLocation>',
      ExpectError: 'Option<(u32,XcmV3TraitsError)>',
      ExpectTransactStatus: 'XcmV3MaybeErrorCode',
      QueryPallet: {
        moduleName: 'Bytes',
        responseInfo: 'XcmV3QueryResponseInfo',
      },
      ExpectPallet: {
        index: 'Compact<u32>',
        name: 'Bytes',
        moduleName: 'Bytes',
        crateMajor: 'Compact<u32>',
        minCrateMinor: 'Compact<u32>',
      },
      ReportTransactStatus: 'XcmV3QueryResponseInfo',
      ClearTransactStatus: 'Null',
      UniversalOrigin: 'XcmV3Junction',
      ExportMessage: {
        network: 'XcmV3JunctionNetworkId',
        destination: 'XcmV3Junctions',
        xcm: 'XcmV3Xcm',
      },
      LockAsset: {
        asset: 'XcmV3MultiAsset',
        unlocker: 'XcmV3MultiLocation',
      },
      UnlockAsset: {
        asset: 'XcmV3MultiAsset',
        target: 'XcmV3MultiLocation',
      },
      NoteUnlockable: {
        asset: 'XcmV3MultiAsset',
        owner: 'XcmV3MultiLocation',
      },
      RequestUnlock: {
        asset: 'XcmV3MultiAsset',
        locker: 'XcmV3MultiLocation',
      },
      SetFeesMode: {
        jitWithdraw: 'bool',
      },
      SetTopic: '[u8;32]',
      ClearTopic: 'Null',
      AliasOrigin: 'XcmV3MultiLocation',
      UnpaidExecution: {
        weightLimit: 'XcmV3WeightLimit',
        checkOrigin: 'Option<XcmV3MultiLocation>',
      },
    },
  },
  /**
   * Lookup80: xcm::v3::multiasset::MultiAssets
   **/
  XcmV3MultiassetMultiAssets: 'Vec<XcmV3MultiAsset>',
  /**
   * Lookup82: xcm::v3::multiasset::MultiAsset
   **/
  XcmV3MultiAsset: {
    id: 'XcmV3MultiassetAssetId',
    fun: 'XcmV3MultiassetFungibility',
  },
  /**
   * Lookup83: xcm::v3::multiasset::AssetId
   **/
  XcmV3MultiassetAssetId: {
    _enum: {
      Concrete: 'XcmV3MultiLocation',
      Abstract: '[u8;32]',
    },
  },
  /**
   * Lookup84: xcm::v3::multiasset::Fungibility
   **/
  XcmV3MultiassetFungibility: {
    _enum: {
      Fungible: 'Compact<u128>',
      NonFungible: 'XcmV3MultiassetAssetInstance',
    },
  },
  /**
   * Lookup85: xcm::v3::multiasset::AssetInstance
   **/
  XcmV3MultiassetAssetInstance: {
    _enum: {
      Undefined: 'Null',
      Index: 'Compact<u128>',
      Array4: '[u8;4]',
      Array8: '[u8;8]',
      Array16: '[u8;16]',
      Array32: '[u8;32]',
    },
  },
  /**
   * Lookup88: xcm::v3::Response
   **/
  XcmV3Response: {
    _enum: {
      Null: 'Null',
      Assets: 'XcmV3MultiassetMultiAssets',
      ExecutionResult: 'Option<(u32,XcmV3TraitsError)>',
      Version: 'u32',
      PalletsInfo: 'Vec<XcmV3PalletInfo>',
      DispatchResult: 'XcmV3MaybeErrorCode',
    },
  },
  /**
   * Lookup92: xcm::v3::PalletInfo
   **/
  XcmV3PalletInfo: {
    index: 'Compact<u32>',
    name: 'Bytes',
    moduleName: 'Bytes',
    major: 'Compact<u32>',
    minor: 'Compact<u32>',
    patch: 'Compact<u32>',
  },
  /**
   * Lookup95: xcm::v3::MaybeErrorCode
   **/
  XcmV3MaybeErrorCode: {
    _enum: {
      Success: 'Null',
      Error: 'Bytes',
      TruncatedError: 'Bytes',
    },
  },
  /**
   * Lookup98: xcm::v2::OriginKind
   **/
  XcmV2OriginKind: {
    _enum: ['Native', 'SovereignAccount', 'Superuser', 'Xcm'],
  },
  /**
   * Lookup99: xcm::double_encoded::DoubleEncoded<T>
   **/
  XcmDoubleEncoded: {
    encoded: 'Bytes',
  },
  /**
   * Lookup100: xcm::v3::QueryResponseInfo
   **/
  XcmV3QueryResponseInfo: {
    destination: 'XcmV3MultiLocation',
    queryId: 'Compact<u64>',
    maxWeight: 'SpWeightsWeightV2Weight',
  },
  /**
   * Lookup101: xcm::v3::multiasset::MultiAssetFilter
   **/
  XcmV3MultiassetMultiAssetFilter: {
    _enum: {
      Definite: 'XcmV3MultiassetMultiAssets',
      Wild: 'XcmV3MultiassetWildMultiAsset',
    },
  },
  /**
   * Lookup102: xcm::v3::multiasset::WildMultiAsset
   **/
  XcmV3MultiassetWildMultiAsset: {
    _enum: {
      All: 'Null',
      AllOf: {
        id: 'XcmV3MultiassetAssetId',
        fun: 'XcmV3MultiassetWildFungibility',
      },
      AllCounted: 'Compact<u32>',
      AllOfCounted: {
        id: 'XcmV3MultiassetAssetId',
        fun: 'XcmV3MultiassetWildFungibility',
        count: 'Compact<u32>',
      },
    },
  },
  /**
   * Lookup103: xcm::v3::multiasset::WildFungibility
   **/
  XcmV3MultiassetWildFungibility: {
    _enum: ['Fungible', 'NonFungible'],
  },
  /**
   * Lookup104: xcm::v3::WeightLimit
   **/
  XcmV3WeightLimit: {
    _enum: {
      Unlimited: 'Null',
      Limited: 'SpWeightsWeightV2Weight',
    },
  },
  /**
   * Lookup105: xcm::VersionedMultiAssets
   **/
  XcmVersionedMultiAssets: {
    _enum: {
      __Unused0: 'Null',
      V2: 'XcmV2MultiassetMultiAssets',
      __Unused2: 'Null',
      V3: 'XcmV3MultiassetMultiAssets',
    },
  },
  /**
   * Lookup106: xcm::v2::multiasset::MultiAssets
   **/
  XcmV2MultiassetMultiAssets: 'Vec<XcmV2MultiAsset>',
  /**
   * Lookup108: xcm::v2::multiasset::MultiAsset
   **/
  XcmV2MultiAsset: {
    id: 'XcmV2MultiassetAssetId',
    fun: 'XcmV2MultiassetFungibility',
  },
  /**
   * Lookup109: xcm::v2::multiasset::AssetId
   **/
  XcmV2MultiassetAssetId: {
    _enum: {
      Concrete: 'XcmV2MultiLocation',
      Abstract: 'Bytes',
    },
  },
  /**
   * Lookup110: xcm::v2::multilocation::MultiLocation
   **/
  XcmV2MultiLocation: {
    parents: 'u8',
    interior: 'XcmV2MultilocationJunctions',
  },
  /**
   * Lookup111: xcm::v2::multilocation::Junctions
   **/
  XcmV2MultilocationJunctions: {
    _enum: {
      Here: 'Null',
      X1: 'XcmV2Junction',
      X2: '(XcmV2Junction,XcmV2Junction)',
      X3: '(XcmV2Junction,XcmV2Junction,XcmV2Junction)',
      X4: '(XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction)',
      X5: '(XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction)',
      X6: '(XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction)',
      X7: '(XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction)',
      X8: '(XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction)',
    },
  },
  /**
   * Lookup112: xcm::v2::junction::Junction
   **/
  XcmV2Junction: {
    _enum: {
      Parachain: 'Compact<u32>',
      AccountId32: {
        network: 'XcmV2NetworkId',
        id: '[u8;32]',
      },
      AccountIndex64: {
        network: 'XcmV2NetworkId',
        index: 'Compact<u64>',
      },
      AccountKey20: {
        network: 'XcmV2NetworkId',
        key: '[u8;20]',
      },
      PalletInstance: 'u8',
      GeneralIndex: 'Compact<u128>',
      GeneralKey: 'Bytes',
      OnlyChild: 'Null',
      Plurality: {
        id: 'XcmV2BodyId',
        part: 'XcmV2BodyPart',
      },
    },
  },
  /**
   * Lookup113: xcm::v2::NetworkId
   **/
  XcmV2NetworkId: {
    _enum: {
      Any: 'Null',
      Named: 'Bytes',
      Polkadot: 'Null',
      Kusama: 'Null',
    },
  },
  /**
   * Lookup115: xcm::v2::BodyId
   **/
  XcmV2BodyId: {
    _enum: {
      Unit: 'Null',
      Named: 'Bytes',
      Index: 'Compact<u32>',
      Executive: 'Null',
      Technical: 'Null',
      Legislative: 'Null',
      Judicial: 'Null',
      Defense: 'Null',
      Administration: 'Null',
      Treasury: 'Null',
    },
  },
  /**
   * Lookup116: xcm::v2::BodyPart
   **/
  XcmV2BodyPart: {
    _enum: {
      Voice: 'Null',
      Members: {
        count: 'Compact<u32>',
      },
      Fraction: {
        nom: 'Compact<u32>',
        denom: 'Compact<u32>',
      },
      AtLeastProportion: {
        nom: 'Compact<u32>',
        denom: 'Compact<u32>',
      },
      MoreThanProportion: {
        nom: 'Compact<u32>',
        denom: 'Compact<u32>',
      },
    },
  },
  /**
   * Lookup117: xcm::v2::multiasset::Fungibility
   **/
  XcmV2MultiassetFungibility: {
    _enum: {
      Fungible: 'Compact<u128>',
      NonFungible: 'XcmV2MultiassetAssetInstance',
    },
  },
  /**
   * Lookup118: xcm::v2::multiasset::AssetInstance
   **/
  XcmV2MultiassetAssetInstance: {
    _enum: {
      Undefined: 'Null',
      Index: 'Compact<u128>',
      Array4: '[u8;4]',
      Array8: '[u8;8]',
      Array16: '[u8;16]',
      Array32: '[u8;32]',
      Blob: 'Bytes',
    },
  },
  /**
   * Lookup119: xcm::VersionedMultiLocation
   **/
  XcmVersionedMultiLocation: {
    _enum: {
      __Unused0: 'Null',
      V2: 'XcmV2MultiLocation',
      __Unused2: 'Null',
      V3: 'XcmV3MultiLocation',
    },
  },
  /**
   * Lookup120: cumulus_pallet_xcm::pallet::Event<T>
   **/
  CumulusPalletXcmEvent: {
    _enum: {
      InvalidFormat: '[u8;32]',
      UnsupportedVersion: '[u8;32]',
      ExecutedDownward: '([u8;32],XcmV3TraitsOutcome)',
    },
  },
  /**
   * Lookup121: cumulus_pallet_dmp_queue::pallet::Event<T>
   **/
  CumulusPalletDmpQueueEvent: {
    _enum: {
      InvalidFormat: {
        messageId: '[u8;32]',
      },
      UnsupportedVersion: {
        messageId: '[u8;32]',
      },
      ExecutedDownward: {
        messageId: '[u8;32]',
        outcome: 'XcmV3TraitsOutcome',
      },
      WeightExhausted: {
        messageId: '[u8;32]',
        remainingWeight: 'SpWeightsWeightV2Weight',
        requiredWeight: 'SpWeightsWeightV2Weight',
      },
      OverweightEnqueued: {
        messageId: '[u8;32]',
        overweightIndex: 'u64',
        requiredWeight: 'SpWeightsWeightV2Weight',
      },
      OverweightServiced: {
        overweightIndex: 'u64',
        weightUsed: 'SpWeightsWeightV2Weight',
      },
      MaxMessagesExhausted: {
        messageId: '[u8;32]',
      },
    },
  },
  /**
   * Lookup122: pallet_xc_asset_config::pallet::Event<T>
   **/
  PalletXcAssetConfigEvent: {
    _enum: {
      AssetRegistered: {
        assetLocation: 'XcmVersionedMultiLocation',
        assetId: 'u128',
      },
      UnitsPerSecondChanged: {
        assetLocation: 'XcmVersionedMultiLocation',
        unitsPerSecond: 'u128',
      },
      AssetLocationChanged: {
        previousAssetLocation: 'XcmVersionedMultiLocation',
        assetId: 'u128',
        newAssetLocation: 'XcmVersionedMultiLocation',
      },
      SupportedAssetRemoved: {
        assetLocation: 'XcmVersionedMultiLocation',
      },
      AssetRemoved: {
        assetLocation: 'XcmVersionedMultiLocation',
        assetId: 'u128',
      },
    },
  },
  /**
   * Lookup123: orml_xtokens::module::Event<T>
   **/
  OrmlXtokensModuleEvent: {
    _enum: {
      TransferredMultiAssets: {
        sender: 'AccountId32',
        assets: 'XcmV3MultiassetMultiAssets',
        fee: 'XcmV3MultiAsset',
        dest: 'XcmV3MultiLocation',
      },
    },
  },
  /**
   * Lookup124: pallet_evm::pallet::Event<T>
   **/
  PalletEvmEvent: {
    _enum: {
      Log: {
        log: 'EthereumLog',
      },
      Created: {
        address: 'H160',
      },
      CreatedFailed: {
        address: 'H160',
      },
      Executed: {
        address: 'H160',
      },
      ExecutedFailed: {
        address: 'H160',
      },
    },
  },
  /**
   * Lookup125: ethereum::log::Log
   **/
  EthereumLog: {
    address: 'H160',
    topics: 'Vec<H256>',
    data: 'Bytes',
  },
  /**
   * Lookup127: pallet_ethereum::pallet::Event
   **/
  PalletEthereumEvent: {
    _enum: {
      Executed: {
        from: 'H160',
        to: 'H160',
        transactionHash: 'H256',
        exitReason: 'EvmCoreErrorExitReason',
        extraData: 'Bytes',
      },
    },
  },
  /**
   * Lookup128: evm_core::error::ExitReason
   **/
  EvmCoreErrorExitReason: {
    _enum: {
      Succeed: 'EvmCoreErrorExitSucceed',
      Error: 'EvmCoreErrorExitError',
      Revert: 'EvmCoreErrorExitRevert',
      Fatal: 'EvmCoreErrorExitFatal',
    },
  },
  /**
   * Lookup129: evm_core::error::ExitSucceed
   **/
  EvmCoreErrorExitSucceed: {
    _enum: ['Stopped', 'Returned', 'Suicided'],
  },
  /**
   * Lookup130: evm_core::error::ExitError
   **/
  EvmCoreErrorExitError: {
    _enum: {
      StackUnderflow: 'Null',
      StackOverflow: 'Null',
      InvalidJump: 'Null',
      InvalidRange: 'Null',
      DesignatedInvalid: 'Null',
      CallTooDeep: 'Null',
      CreateCollision: 'Null',
      CreateContractLimit: 'Null',
      OutOfOffset: 'Null',
      OutOfGas: 'Null',
      OutOfFund: 'Null',
      PCUnderflow: 'Null',
      CreateEmpty: 'Null',
      Other: 'Text',
      MaxNonce: 'Null',
      InvalidCode: 'u8',
    },
  },
  /**
   * Lookup134: evm_core::error::ExitRevert
   **/
  EvmCoreErrorExitRevert: {
    _enum: ['Reverted'],
  },
  /**
   * Lookup135: evm_core::error::ExitFatal
   **/
  EvmCoreErrorExitFatal: {
    _enum: {
      NotSupported: 'Null',
      UnhandledInterrupt: 'Null',
      CallErrorAsFatal: 'EvmCoreErrorExitError',
      Other: 'Text',
    },
  },
  /**
   * Lookup136: pallet_dynamic_evm_base_fee::pallet::Event
   **/
  PalletDynamicEvmBaseFeeEvent: {
    _enum: {
      NewBaseFeePerGas: {
        fee: 'U256',
      },
    },
  },
  /**
   * Lookup139: pallet_unified_accounts::pallet::Event<T>
   **/
  PalletUnifiedAccountsEvent: {
    _enum: {
      AccountClaimed: {
        accountId: 'AccountId32',
        evmAddress: 'H160',
      },
    },
  },
  /**
   * Lookup140: pallet_contracts::pallet::Event<T>
   **/
  PalletContractsEvent: {
    _enum: {
      Instantiated: {
        deployer: 'AccountId32',
        contract: 'AccountId32',
      },
      Terminated: {
        contract: 'AccountId32',
        beneficiary: 'AccountId32',
      },
      CodeStored: {
        codeHash: 'H256',
      },
      ContractEmitted: {
        contract: 'AccountId32',
        data: 'Bytes',
      },
      CodeRemoved: {
        codeHash: 'H256',
      },
      ContractCodeUpdated: {
        contract: 'AccountId32',
        newCodeHash: 'H256',
        oldCodeHash: 'H256',
      },
      Called: {
        caller: 'PalletContractsOrigin',
        contract: 'AccountId32',
      },
      DelegateCalled: {
        contract: 'AccountId32',
        codeHash: 'H256',
      },
    },
  },
  /**
   * Lookup141: pallet_contracts::Origin<shibuya_runtime::Runtime>
   **/
  PalletContractsOrigin: {
    _enum: {
      Root: 'Null',
      Signed: 'AccountId32',
    },
  },
  /**
   * Lookup142: shibuya_runtime::Runtime
   **/
  ShibuyaRuntimeRuntime: 'Null',
  /**
   * Lookup143: pallet_democracy::pallet::Event<T>
   **/
  PalletDemocracyEvent: {
    _enum: {
      Proposed: {
        proposalIndex: 'u32',
        deposit: 'u128',
      },
      Tabled: {
        proposalIndex: 'u32',
        deposit: 'u128',
      },
      ExternalTabled: 'Null',
      Started: {
        refIndex: 'u32',
        threshold: 'PalletDemocracyVoteThreshold',
      },
      Passed: {
        refIndex: 'u32',
      },
      NotPassed: {
        refIndex: 'u32',
      },
      Cancelled: {
        refIndex: 'u32',
      },
      Delegated: {
        who: 'AccountId32',
        target: 'AccountId32',
      },
      Undelegated: {
        account: 'AccountId32',
      },
      Vetoed: {
        who: 'AccountId32',
        proposalHash: 'H256',
        until: 'u32',
      },
      Blacklisted: {
        proposalHash: 'H256',
      },
      Voted: {
        voter: 'AccountId32',
        refIndex: 'u32',
        vote: 'PalletDemocracyVoteAccountVote',
      },
      Seconded: {
        seconder: 'AccountId32',
        propIndex: 'u32',
      },
      ProposalCanceled: {
        propIndex: 'u32',
      },
      MetadataSet: {
        _alias: {
          hash_: 'hash',
        },
        owner: 'PalletDemocracyMetadataOwner',
        hash_: 'H256',
      },
      MetadataCleared: {
        _alias: {
          hash_: 'hash',
        },
        owner: 'PalletDemocracyMetadataOwner',
        hash_: 'H256',
      },
      MetadataTransferred: {
        _alias: {
          hash_: 'hash',
        },
        prevOwner: 'PalletDemocracyMetadataOwner',
        owner: 'PalletDemocracyMetadataOwner',
        hash_: 'H256',
      },
    },
  },
  /**
   * Lookup144: pallet_democracy::vote_threshold::VoteThreshold
   **/
  PalletDemocracyVoteThreshold: {
    _enum: ['SuperMajorityApprove', 'SuperMajorityAgainst', 'SimpleMajority'],
  },
  /**
   * Lookup145: pallet_democracy::vote::AccountVote<Balance>
   **/
  PalletDemocracyVoteAccountVote: {
    _enum: {
      Standard: {
        vote: 'Vote',
        balance: 'u128',
      },
      Split: {
        aye: 'u128',
        nay: 'u128',
      },
    },
  },
  /**
   * Lookup147: pallet_democracy::types::MetadataOwner
   **/
  PalletDemocracyMetadataOwner: {
    _enum: {
      External: 'Null',
      Proposal: 'u32',
      Referendum: 'u32',
    },
  },
  /**
   * Lookup148: pallet_collective::pallet::Event<T, I>
   **/
  PalletCollectiveEvent: {
    _enum: {
      Proposed: {
        account: 'AccountId32',
        proposalIndex: 'u32',
        proposalHash: 'H256',
        threshold: 'u32',
      },
      Voted: {
        account: 'AccountId32',
        proposalHash: 'H256',
        voted: 'bool',
        yes: 'u32',
        no: 'u32',
      },
      Approved: {
        proposalHash: 'H256',
      },
      Disapproved: {
        proposalHash: 'H256',
      },
      Executed: {
        proposalHash: 'H256',
        result: 'Result<Null, SpRuntimeDispatchError>',
      },
      MemberExecuted: {
        proposalHash: 'H256',
        result: 'Result<Null, SpRuntimeDispatchError>',
      },
      Closed: {
        proposalHash: 'H256',
        yes: 'u32',
        no: 'u32',
      },
    },
  },
  /**
   * Lookup150: pallet_treasury::pallet::Event<T, I>
   **/
  PalletTreasuryEvent: {
    _enum: {
      Proposed: {
        proposalIndex: 'u32',
      },
      Spending: {
        budgetRemaining: 'u128',
      },
      Awarded: {
        proposalIndex: 'u32',
        award: 'u128',
        account: 'AccountId32',
      },
      Rejected: {
        proposalIndex: 'u32',
        slashed: 'u128',
      },
      Burnt: {
        burntFunds: 'u128',
      },
      Rollover: {
        rolloverBalance: 'u128',
      },
      Deposit: {
        value: 'u128',
      },
      SpendApproved: {
        proposalIndex: 'u32',
        amount: 'u128',
        beneficiary: 'AccountId32',
      },
      UpdatedInactive: {
        reactivated: 'u128',
        deactivated: 'u128',
      },
    },
  },
  /**
   * Lookup151: pallet_preimage::pallet::Event<T>
   **/
  PalletPreimageEvent: {
    _enum: {
      Noted: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
      },
      Requested: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
      },
      Cleared: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
      },
    },
  },
  /**
   * Lookup152: pallet_sudo::pallet::Event<T>
   **/
  PalletSudoEvent: {
    _enum: {
      Sudid: {
        sudoResult: 'Result<Null, SpRuntimeDispatchError>',
      },
      KeyChanged: {
        oldSudoer: 'Option<AccountId32>',
      },
      SudoAsDone: {
        sudoResult: 'Result<Null, SpRuntimeDispatchError>',
      },
    },
  },
  /**
   * Lookup153: pallet_static_price_provider::pallet::Event<T>
   **/
  PalletStaticPriceProviderEvent: {
    _enum: {
      PriceSet: {
        price: 'u64',
      },
    },
  },
  /**
   * Lookup155: frame_system::Phase
   **/
  FrameSystemPhase: {
    _enum: {
      ApplyExtrinsic: 'u32',
      Finalization: 'Null',
      Initialization: 'Null',
    },
  },
  /**
   * Lookup157: frame_system::LastRuntimeUpgradeInfo
   **/
  FrameSystemLastRuntimeUpgradeInfo: {
    specVersion: 'Compact<u32>',
    specName: 'Text',
  },
  /**
   * Lookup158: frame_system::pallet::Call<T>
   **/
  FrameSystemCall: {
    _enum: {
      remark: {
        remark: 'Bytes',
      },
      set_heap_pages: {
        pages: 'u64',
      },
      set_code: {
        code: 'Bytes',
      },
      set_code_without_checks: {
        code: 'Bytes',
      },
      set_storage: {
        items: 'Vec<(Bytes,Bytes)>',
      },
      kill_storage: {
        _alias: {
          keys_: 'keys',
        },
        keys_: 'Vec<Bytes>',
      },
      kill_prefix: {
        prefix: 'Bytes',
        subkeys: 'u32',
      },
      remark_with_event: {
        remark: 'Bytes',
      },
    },
  },
  /**
   * Lookup162: frame_system::limits::BlockWeights
   **/
  FrameSystemLimitsBlockWeights: {
    baseBlock: 'SpWeightsWeightV2Weight',
    maxBlock: 'SpWeightsWeightV2Weight',
    perClass: 'FrameSupportDispatchPerDispatchClassWeightsPerClass',
  },
  /**
   * Lookup163: frame_support::dispatch::PerDispatchClass<frame_system::limits::WeightsPerClass>
   **/
  FrameSupportDispatchPerDispatchClassWeightsPerClass: {
    normal: 'FrameSystemLimitsWeightsPerClass',
    operational: 'FrameSystemLimitsWeightsPerClass',
    mandatory: 'FrameSystemLimitsWeightsPerClass',
  },
  /**
   * Lookup164: frame_system::limits::WeightsPerClass
   **/
  FrameSystemLimitsWeightsPerClass: {
    baseExtrinsic: 'SpWeightsWeightV2Weight',
    maxExtrinsic: 'Option<SpWeightsWeightV2Weight>',
    maxTotal: 'Option<SpWeightsWeightV2Weight>',
    reserved: 'Option<SpWeightsWeightV2Weight>',
  },
  /**
   * Lookup166: frame_system::limits::BlockLength
   **/
  FrameSystemLimitsBlockLength: {
    max: 'FrameSupportDispatchPerDispatchClassU32',
  },
  /**
   * Lookup167: frame_support::dispatch::PerDispatchClass<T>
   **/
  FrameSupportDispatchPerDispatchClassU32: {
    normal: 'u32',
    operational: 'u32',
    mandatory: 'u32',
  },
  /**
   * Lookup168: sp_weights::RuntimeDbWeight
   **/
  SpWeightsRuntimeDbWeight: {
    read: 'u64',
    write: 'u64',
  },
  /**
   * Lookup169: sp_version::RuntimeVersion
   **/
  SpVersionRuntimeVersion: {
    specName: 'Text',
    implName: 'Text',
    authoringVersion: 'u32',
    specVersion: 'u32',
    implVersion: 'u32',
    apis: 'Vec<([u8;8],u32)>',
    transactionVersion: 'u32',
    stateVersion: 'u8',
  },
  /**
   * Lookup173: frame_system::pallet::Error<T>
   **/
  FrameSystemError: {
    _enum: [
      'InvalidSpecName',
      'SpecVersionNeedsToIncrease',
      'FailedToExtractRuntimeVersion',
      'NonDefaultComposite',
      'NonZeroRefCount',
      'CallFiltered',
    ],
  },
  /**
   * Lookup174: pallet_utility::pallet::Call<T>
   **/
  PalletUtilityCall: {
    _enum: {
      batch: {
        calls: 'Vec<Call>',
      },
      as_derivative: {
        index: 'u16',
        call: 'Call',
      },
      batch_all: {
        calls: 'Vec<Call>',
      },
      dispatch_as: {
        asOrigin: 'ShibuyaRuntimeOriginCaller',
        call: 'Call',
      },
      force_batch: {
        calls: 'Vec<Call>',
      },
      with_weight: {
        call: 'Call',
        weight: 'SpWeightsWeightV2Weight',
      },
    },
  },
  /**
   * Lookup177: pallet_identity::pallet::Call<T>
   **/
  PalletIdentityCall: {
    _enum: {
      add_registrar: {
        account: 'MultiAddress',
      },
      set_identity: {
        info: 'PalletIdentityIdentityInfo',
      },
      set_subs: {
        subs: 'Vec<(AccountId32,Data)>',
      },
      clear_identity: 'Null',
      request_judgement: {
        regIndex: 'Compact<u32>',
        maxFee: 'Compact<u128>',
      },
      cancel_request: {
        regIndex: 'u32',
      },
      set_fee: {
        index: 'Compact<u32>',
        fee: 'Compact<u128>',
      },
      set_account_id: {
        _alias: {
          new_: 'new',
        },
        index: 'Compact<u32>',
        new_: 'MultiAddress',
      },
      set_fields: {
        index: 'Compact<u32>',
        fields: 'PalletIdentityBitFlags',
      },
      provide_judgement: {
        regIndex: 'Compact<u32>',
        target: 'MultiAddress',
        judgement: 'PalletIdentityJudgement',
        identity: 'H256',
      },
      kill_identity: {
        target: 'MultiAddress',
      },
      add_sub: {
        sub: 'MultiAddress',
        data: 'Data',
      },
      rename_sub: {
        sub: 'MultiAddress',
        data: 'Data',
      },
      remove_sub: {
        sub: 'MultiAddress',
      },
      quit_sub: 'Null',
    },
  },
  /**
   * Lookup180: pallet_identity::types::IdentityInfo<FieldLimit>
   **/
  PalletIdentityIdentityInfo: {
    additional: 'Vec<(Data,Data)>',
    display: 'Data',
    legal: 'Data',
    web: 'Data',
    riot: 'Data',
    email: 'Data',
    pgpFingerprint: 'Option<[u8;20]>',
    image: 'Data',
    twitter: 'Data',
  },
  /**
   * Lookup216: pallet_identity::types::BitFlags<pallet_identity::types::IdentityField>
   **/
  PalletIdentityBitFlags: {
    _bitLength: 64,
    Display: 1,
    Legal: 2,
    Web: 4,
    Riot: 8,
    Email: 16,
    PgpFingerprint: 32,
    Image: 64,
    Twitter: 128,
  },
  /**
   * Lookup217: pallet_identity::types::IdentityField
   **/
  PalletIdentityIdentityField: {
    _enum: [
      '__Unused0',
      'Display',
      'Legal',
      '__Unused3',
      'Web',
      '__Unused5',
      '__Unused6',
      '__Unused7',
      'Riot',
      '__Unused9',
      '__Unused10',
      '__Unused11',
      '__Unused12',
      '__Unused13',
      '__Unused14',
      '__Unused15',
      'Email',
      '__Unused17',
      '__Unused18',
      '__Unused19',
      '__Unused20',
      '__Unused21',
      '__Unused22',
      '__Unused23',
      '__Unused24',
      '__Unused25',
      '__Unused26',
      '__Unused27',
      '__Unused28',
      '__Unused29',
      '__Unused30',
      '__Unused31',
      'PgpFingerprint',
      '__Unused33',
      '__Unused34',
      '__Unused35',
      '__Unused36',
      '__Unused37',
      '__Unused38',
      '__Unused39',
      '__Unused40',
      '__Unused41',
      '__Unused42',
      '__Unused43',
      '__Unused44',
      '__Unused45',
      '__Unused46',
      '__Unused47',
      '__Unused48',
      '__Unused49',
      '__Unused50',
      '__Unused51',
      '__Unused52',
      '__Unused53',
      '__Unused54',
      '__Unused55',
      '__Unused56',
      '__Unused57',
      '__Unused58',
      '__Unused59',
      '__Unused60',
      '__Unused61',
      '__Unused62',
      '__Unused63',
      'Image',
      '__Unused65',
      '__Unused66',
      '__Unused67',
      '__Unused68',
      '__Unused69',
      '__Unused70',
      '__Unused71',
      '__Unused72',
      '__Unused73',
      '__Unused74',
      '__Unused75',
      '__Unused76',
      '__Unused77',
      '__Unused78',
      '__Unused79',
      '__Unused80',
      '__Unused81',
      '__Unused82',
      '__Unused83',
      '__Unused84',
      '__Unused85',
      '__Unused86',
      '__Unused87',
      '__Unused88',
      '__Unused89',
      '__Unused90',
      '__Unused91',
      '__Unused92',
      '__Unused93',
      '__Unused94',
      '__Unused95',
      '__Unused96',
      '__Unused97',
      '__Unused98',
      '__Unused99',
      '__Unused100',
      '__Unused101',
      '__Unused102',
      '__Unused103',
      '__Unused104',
      '__Unused105',
      '__Unused106',
      '__Unused107',
      '__Unused108',
      '__Unused109',
      '__Unused110',
      '__Unused111',
      '__Unused112',
      '__Unused113',
      '__Unused114',
      '__Unused115',
      '__Unused116',
      '__Unused117',
      '__Unused118',
      '__Unused119',
      '__Unused120',
      '__Unused121',
      '__Unused122',
      '__Unused123',
      '__Unused124',
      '__Unused125',
      '__Unused126',
      '__Unused127',
      'Twitter',
    ],
  },
  /**
   * Lookup218: pallet_identity::types::Judgement<Balance>
   **/
  PalletIdentityJudgement: {
    _enum: {
      Unknown: 'Null',
      FeePaid: 'u128',
      Reasonable: 'Null',
      KnownGood: 'Null',
      OutOfDate: 'Null',
      LowQuality: 'Null',
      Erroneous: 'Null',
    },
  },
  /**
   * Lookup219: pallet_timestamp::pallet::Call<T>
   **/
  PalletTimestampCall: {
    _enum: {
      set: {
        now: 'Compact<u64>',
      },
    },
  },
  /**
   * Lookup220: pallet_multisig::pallet::Call<T>
   **/
  PalletMultisigCall: {
    _enum: {
      as_multi_threshold_1: {
        otherSignatories: 'Vec<AccountId32>',
        call: 'Call',
      },
      as_multi: {
        threshold: 'u16',
        otherSignatories: 'Vec<AccountId32>',
        maybeTimepoint: 'Option<PalletMultisigTimepoint>',
        call: 'Call',
        maxWeight: 'SpWeightsWeightV2Weight',
      },
      approve_as_multi: {
        threshold: 'u16',
        otherSignatories: 'Vec<AccountId32>',
        maybeTimepoint: 'Option<PalletMultisigTimepoint>',
        callHash: '[u8;32]',
        maxWeight: 'SpWeightsWeightV2Weight',
      },
      cancel_as_multi: {
        threshold: 'u16',
        otherSignatories: 'Vec<AccountId32>',
        timepoint: 'PalletMultisigTimepoint',
        callHash: '[u8;32]',
      },
    },
  },
  /**
   * Lookup222: pallet_scheduler::pallet::Call<T>
   **/
  PalletSchedulerCall: {
    _enum: {
      schedule: {
        when: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'Call',
      },
      cancel: {
        when: 'u32',
        index: 'u32',
      },
      schedule_named: {
        id: '[u8;32]',
        when: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'Call',
      },
      cancel_named: {
        id: '[u8;32]',
      },
      schedule_after: {
        after: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'Call',
      },
      schedule_named_after: {
        id: '[u8;32]',
        after: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'Call',
      },
    },
  },
  /**
   * Lookup224: pallet_proxy::pallet::Call<T>
   **/
  PalletProxyCall: {
    _enum: {
      proxy: {
        real: 'MultiAddress',
        forceProxyType: 'Option<ShibuyaRuntimeProxyType>',
        call: 'Call',
      },
      add_proxy: {
        delegate: 'MultiAddress',
        proxyType: 'ShibuyaRuntimeProxyType',
        delay: 'u32',
      },
      remove_proxy: {
        delegate: 'MultiAddress',
        proxyType: 'ShibuyaRuntimeProxyType',
        delay: 'u32',
      },
      remove_proxies: 'Null',
      create_pure: {
        proxyType: 'ShibuyaRuntimeProxyType',
        delay: 'u32',
        index: 'u16',
      },
      kill_pure: {
        spawner: 'MultiAddress',
        proxyType: 'ShibuyaRuntimeProxyType',
        index: 'u16',
        height: 'Compact<u32>',
        extIndex: 'Compact<u32>',
      },
      announce: {
        real: 'MultiAddress',
        callHash: 'H256',
      },
      remove_announcement: {
        real: 'MultiAddress',
        callHash: 'H256',
      },
      reject_announcement: {
        delegate: 'MultiAddress',
        callHash: 'H256',
      },
      proxy_announced: {
        delegate: 'MultiAddress',
        real: 'MultiAddress',
        forceProxyType: 'Option<ShibuyaRuntimeProxyType>',
        call: 'Call',
      },
    },
  },
  /**
   * Lookup226: cumulus_pallet_parachain_system::pallet::Call<T>
   **/
  CumulusPalletParachainSystemCall: {
    _enum: {
      set_validation_data: {
        data: 'CumulusPrimitivesParachainInherentParachainInherentData',
      },
      sudo_send_upward_message: {
        message: 'Bytes',
      },
      authorize_upgrade: {
        codeHash: 'H256',
        checkVersion: 'bool',
      },
      enact_authorized_upgrade: {
        code: 'Bytes',
      },
    },
  },
  /**
   * Lookup227: cumulus_primitives_parachain_inherent::ParachainInherentData
   **/
  CumulusPrimitivesParachainInherentParachainInherentData: {
    validationData: 'PolkadotPrimitivesV4PersistedValidationData',
    relayChainState: 'SpTrieStorageProof',
    downwardMessages: 'Vec<PolkadotCorePrimitivesInboundDownwardMessage>',
    horizontalMessages: 'BTreeMap<u32, Vec<PolkadotCorePrimitivesInboundHrmpMessage>>',
  },
  /**
   * Lookup228: polkadot_primitives::v4::PersistedValidationData<primitive_types::H256, N>
   **/
  PolkadotPrimitivesV4PersistedValidationData: {
    parentHead: 'Bytes',
    relayParentNumber: 'u32',
    relayParentStorageRoot: 'H256',
    maxPovSize: 'u32',
  },
  /**
   * Lookup230: sp_trie::storage_proof::StorageProof
   **/
  SpTrieStorageProof: {
    trieNodes: 'BTreeSet<Bytes>',
  },
  /**
   * Lookup233: polkadot_core_primitives::InboundDownwardMessage<BlockNumber>
   **/
  PolkadotCorePrimitivesInboundDownwardMessage: {
    sentAt: 'u32',
    msg: 'Bytes',
  },
  /**
   * Lookup236: polkadot_core_primitives::InboundHrmpMessage<BlockNumber>
   **/
  PolkadotCorePrimitivesInboundHrmpMessage: {
    sentAt: 'u32',
    data: 'Bytes',
  },
  /**
   * Lookup239: parachain_info::pallet::Call<T>
   **/
  ParachainInfoCall: 'Null',
  /**
   * Lookup240: pallet_balances::pallet::Call<T, I>
   **/
  PalletBalancesCall: {
    _enum: {
      transfer_allow_death: {
        dest: 'MultiAddress',
        value: 'Compact<u128>',
      },
      set_balance_deprecated: {
        who: 'MultiAddress',
        newFree: 'Compact<u128>',
        oldReserved: 'Compact<u128>',
      },
      force_transfer: {
        source: 'MultiAddress',
        dest: 'MultiAddress',
        value: 'Compact<u128>',
      },
      transfer_keep_alive: {
        dest: 'MultiAddress',
        value: 'Compact<u128>',
      },
      transfer_all: {
        dest: 'MultiAddress',
        keepAlive: 'bool',
      },
      force_unreserve: {
        who: 'MultiAddress',
        amount: 'u128',
      },
      upgrade_accounts: {
        who: 'Vec<AccountId32>',
      },
      transfer: {
        dest: 'MultiAddress',
        value: 'Compact<u128>',
      },
      force_set_balance: {
        who: 'MultiAddress',
        newFree: 'Compact<u128>',
      },
    },
  },
  /**
   * Lookup241: pallet_vesting::pallet::Call<T>
   **/
  PalletVestingCall: {
    _enum: {
      vest: 'Null',
      vest_other: {
        target: 'MultiAddress',
      },
      vested_transfer: {
        target: 'MultiAddress',
        schedule: 'PalletVestingVestingInfo',
      },
      force_vested_transfer: {
        source: 'MultiAddress',
        target: 'MultiAddress',
        schedule: 'PalletVestingVestingInfo',
      },
      merge_schedules: {
        schedule1Index: 'u32',
        schedule2Index: 'u32',
      },
    },
  },
  /**
   * Lookup242: pallet_vesting::vesting_info::VestingInfo<Balance, BlockNumber>
   **/
  PalletVestingVestingInfo: {
    locked: 'u128',
    perBlock: 'u128',
    startingBlock: 'u32',
  },
  /**
   * Lookup243: pallet_dapp_staking_v3::pallet::Call<T>
   **/
  PalletDappStakingV3Call: {
    _enum: {
      maintenance_mode: {
        enabled: 'bool',
      },
      register: {
        owner: 'AccountId32',
        smartContract: 'AstarPrimitivesDappStakingSmartContract',
      },
      set_dapp_reward_beneficiary: {
        smartContract: 'AstarPrimitivesDappStakingSmartContract',
        beneficiary: 'Option<AccountId32>',
      },
      set_dapp_owner: {
        smartContract: 'AstarPrimitivesDappStakingSmartContract',
        newOwner: 'AccountId32',
      },
      unbond_and_unstake: {
        contractId: 'AstarPrimitivesDappStakingSmartContract',
        value: 'Compact<u128>',
      },
      withdraw_unbonded: 'Null',
      unregister: {
        smartContract: 'AstarPrimitivesDappStakingSmartContract',
      },
      lock: {
        amount: 'Compact<u128>',
      },
      unlock: {
        amount: 'Compact<u128>',
      },
      claim_unlocked: 'Null',
      relock_unlocking: 'Null',
      stake: {
        smartContract: 'AstarPrimitivesDappStakingSmartContract',
        amount: 'Compact<u128>',
      },
      unstake: {
        smartContract: 'AstarPrimitivesDappStakingSmartContract',
        amount: 'Compact<u128>',
      },
      claim_staker_rewards: 'Null',
      claim_bonus_reward: {
        smartContract: 'AstarPrimitivesDappStakingSmartContract',
      },
      claim_dapp_reward: {
        smartContract: 'AstarPrimitivesDappStakingSmartContract',
        era: 'Compact<u32>',
      },
      unstake_from_unregistered: {
        smartContract: 'AstarPrimitivesDappStakingSmartContract',
      },
      cleanup_expired_entries: 'Null',
      force: {
        forcingType: 'PalletDappStakingV3ForcingType',
      },
      __Unused19: 'Null',
      __Unused20: 'Null',
      __Unused21: 'Null',
      __Unused22: 'Null',
      __Unused23: 'Null',
      __Unused24: 'Null',
      __Unused25: 'Null',
      __Unused26: 'Null',
      __Unused27: 'Null',
      __Unused28: 'Null',
      __Unused29: 'Null',
      __Unused30: 'Null',
      __Unused31: 'Null',
      __Unused32: 'Null',
      __Unused33: 'Null',
      __Unused34: 'Null',
      __Unused35: 'Null',
      __Unused36: 'Null',
      __Unused37: 'Null',
      __Unused38: 'Null',
      __Unused39: 'Null',
      __Unused40: 'Null',
      __Unused41: 'Null',
      __Unused42: 'Null',
      __Unused43: 'Null',
      __Unused44: 'Null',
      __Unused45: 'Null',
      __Unused46: 'Null',
      __Unused47: 'Null',
      __Unused48: 'Null',
      __Unused49: 'Null',
      __Unused50: 'Null',
      __Unused51: 'Null',
      __Unused52: 'Null',
      __Unused53: 'Null',
      __Unused54: 'Null',
      __Unused55: 'Null',
      __Unused56: 'Null',
      __Unused57: 'Null',
      __Unused58: 'Null',
      __Unused59: 'Null',
      __Unused60: 'Null',
      __Unused61: 'Null',
      __Unused62: 'Null',
      __Unused63: 'Null',
      __Unused64: 'Null',
      __Unused65: 'Null',
      __Unused66: 'Null',
      __Unused67: 'Null',
      __Unused68: 'Null',
      __Unused69: 'Null',
      __Unused70: 'Null',
      __Unused71: 'Null',
      __Unused72: 'Null',
      __Unused73: 'Null',
      __Unused74: 'Null',
      __Unused75: 'Null',
      __Unused76: 'Null',
      __Unused77: 'Null',
      __Unused78: 'Null',
      __Unused79: 'Null',
      __Unused80: 'Null',
      __Unused81: 'Null',
      __Unused82: 'Null',
      __Unused83: 'Null',
      __Unused84: 'Null',
      __Unused85: 'Null',
      __Unused86: 'Null',
      __Unused87: 'Null',
      __Unused88: 'Null',
      __Unused89: 'Null',
      __Unused90: 'Null',
      __Unused91: 'Null',
      __Unused92: 'Null',
      __Unused93: 'Null',
      __Unused94: 'Null',
      __Unused95: 'Null',
      __Unused96: 'Null',
      __Unused97: 'Null',
      __Unused98: 'Null',
      __Unused99: 'Null',
      force_set_tier_params: {
        value: 'PalletDappStakingV3TierParameters',
      },
      force_set_tier_config: {
        value: 'PalletDappStakingV3TiersConfiguration',
      },
    },
  },
  /**
   * Lookup244: pallet_dapp_staking_v3::types::TierParameters<NT>
   **/
  PalletDappStakingV3TierParameters: {
    rewardPortion: 'Vec<Permill>',
    slotDistribution: 'Vec<Permill>',
    tierThresholds: 'Vec<PalletDappStakingV3TierThreshold>',
  },
  /**
   * Lookup249: pallet_dapp_staking_v3::types::TierThreshold
   **/
  PalletDappStakingV3TierThreshold: {
    _enum: {
      FixedTvlAmount: {
        amount: 'u128',
      },
      DynamicTvlAmount: {
        amount: 'u128',
        minimumAmount: 'u128',
      },
    },
  },
  /**
   * Lookup251: pallet_dapp_staking_v3::types::TiersConfiguration<NT>
   **/
  PalletDappStakingV3TiersConfiguration: {
    numberOfSlots: 'Compact<u16>',
    slotsPerTier: 'Vec<u16>',
    rewardPortion: 'Vec<Permill>',
    tierThresholds: 'Vec<PalletDappStakingV3TierThreshold>',
  },
  /**
   * Lookup255: pallet_inflation::pallet::Call<T>
   **/
  PalletInflationCall: {
    _enum: {
      force_set_inflation_params: {
        params: 'PalletInflationInflationParameters',
      },
      force_inflation_recalculation: {
        nextEra: 'u32',
      },
      force_set_inflation_config: {
        config: 'PalletInflationInflationConfiguration',
      },
    },
  },
  /**
   * Lookup256: pallet_inflation::InflationParameters
   **/
  PalletInflationInflationParameters: {
    maxInflationRate: 'Compact<Perquintill>',
    treasuryPart: 'Compact<Perquintill>',
    collatorsPart: 'Compact<Perquintill>',
    dappsPart: 'Compact<Perquintill>',
    baseStakersPart: 'Compact<Perquintill>',
    adjustableStakersPart: 'Compact<Perquintill>',
    bonusPart: 'Compact<Perquintill>',
    idealStakingRate: 'Compact<Perquintill>',
  },
  /**
   * Lookup257: pallet_assets::pallet::Call<T, I>
   **/
  PalletAssetsCall: {
    _enum: {
      create: {
        id: 'Compact<u128>',
        admin: 'MultiAddress',
        minBalance: 'u128',
      },
      force_create: {
        id: 'Compact<u128>',
        owner: 'MultiAddress',
        isSufficient: 'bool',
        minBalance: 'Compact<u128>',
      },
      start_destroy: {
        id: 'Compact<u128>',
      },
      destroy_accounts: {
        id: 'Compact<u128>',
      },
      destroy_approvals: {
        id: 'Compact<u128>',
      },
      finish_destroy: {
        id: 'Compact<u128>',
      },
      mint: {
        id: 'Compact<u128>',
        beneficiary: 'MultiAddress',
        amount: 'Compact<u128>',
      },
      burn: {
        id: 'Compact<u128>',
        who: 'MultiAddress',
        amount: 'Compact<u128>',
      },
      transfer: {
        id: 'Compact<u128>',
        target: 'MultiAddress',
        amount: 'Compact<u128>',
      },
      transfer_keep_alive: {
        id: 'Compact<u128>',
        target: 'MultiAddress',
        amount: 'Compact<u128>',
      },
      force_transfer: {
        id: 'Compact<u128>',
        source: 'MultiAddress',
        dest: 'MultiAddress',
        amount: 'Compact<u128>',
      },
      freeze: {
        id: 'Compact<u128>',
        who: 'MultiAddress',
      },
      thaw: {
        id: 'Compact<u128>',
        who: 'MultiAddress',
      },
      freeze_asset: {
        id: 'Compact<u128>',
      },
      thaw_asset: {
        id: 'Compact<u128>',
      },
      transfer_ownership: {
        id: 'Compact<u128>',
        owner: 'MultiAddress',
      },
      set_team: {
        id: 'Compact<u128>',
        issuer: 'MultiAddress',
        admin: 'MultiAddress',
        freezer: 'MultiAddress',
      },
      set_metadata: {
        id: 'Compact<u128>',
        name: 'Bytes',
        symbol: 'Bytes',
        decimals: 'u8',
      },
      clear_metadata: {
        id: 'Compact<u128>',
      },
      force_set_metadata: {
        id: 'Compact<u128>',
        name: 'Bytes',
        symbol: 'Bytes',
        decimals: 'u8',
        isFrozen: 'bool',
      },
      force_clear_metadata: {
        id: 'Compact<u128>',
      },
      force_asset_status: {
        id: 'Compact<u128>',
        owner: 'MultiAddress',
        issuer: 'MultiAddress',
        admin: 'MultiAddress',
        freezer: 'MultiAddress',
        minBalance: 'Compact<u128>',
        isSufficient: 'bool',
        isFrozen: 'bool',
      },
      approve_transfer: {
        id: 'Compact<u128>',
        delegate: 'MultiAddress',
        amount: 'Compact<u128>',
      },
      cancel_approval: {
        id: 'Compact<u128>',
        delegate: 'MultiAddress',
      },
      force_cancel_approval: {
        id: 'Compact<u128>',
        owner: 'MultiAddress',
        delegate: 'MultiAddress',
      },
      transfer_approved: {
        id: 'Compact<u128>',
        owner: 'MultiAddress',
        destination: 'MultiAddress',
        amount: 'Compact<u128>',
      },
      touch: {
        id: 'Compact<u128>',
      },
      refund: {
        id: 'Compact<u128>',
        allowBurn: 'bool',
      },
      set_min_balance: {
        id: 'Compact<u128>',
        minBalance: 'u128',
      },
      touch_other: {
        id: 'Compact<u128>',
        who: 'MultiAddress',
      },
      refund_other: {
        id: 'Compact<u128>',
        who: 'MultiAddress',
      },
      block: {
        id: 'Compact<u128>',
        who: 'MultiAddress',
      },
    },
  },
  /**
   * Lookup258: pallet_collator_selection::pallet::Call<T>
   **/
  PalletCollatorSelectionCall: {
    _enum: {
      set_invulnerables: {
        _alias: {
          new_: 'new',
        },
        new_: 'Vec<AccountId32>',
      },
      set_desired_candidates: {
        max: 'u32',
      },
      set_candidacy_bond: {
        bond: 'u128',
      },
      register_as_candidate: 'Null',
      leave_intent: 'Null',
    },
  },
  /**
   * Lookup259: pallet_session::pallet::Call<T>
   **/
  PalletSessionCall: {
    _enum: {
      set_keys: {
        _alias: {
          keys_: 'keys',
        },
        keys_: 'ShibuyaRuntimeSessionKeys',
        proof: 'Bytes',
      },
      purge_keys: 'Null',
    },
  },
  /**
   * Lookup260: shibuya_runtime::SessionKeys
   **/
  ShibuyaRuntimeSessionKeys: {
    aura: 'SpConsensusAuraSr25519AppSr25519Public',
  },
  /**
   * Lookup261: sp_consensus_aura::sr25519::app_sr25519::Public
   **/
  SpConsensusAuraSr25519AppSr25519Public: 'SpCoreSr25519Public',
  /**
   * Lookup262: sp_core::sr25519::Public
   **/
  SpCoreSr25519Public: '[u8;32]',
  /**
   * Lookup263: cumulus_pallet_xcmp_queue::pallet::Call<T>
   **/
  CumulusPalletXcmpQueueCall: {
    _enum: {
      service_overweight: {
        index: 'u64',
        weightLimit: 'SpWeightsWeightV2Weight',
      },
      suspend_xcm_execution: 'Null',
      resume_xcm_execution: 'Null',
      update_suspend_threshold: {
        _alias: {
          new_: 'new',
        },
        new_: 'u32',
      },
      update_drop_threshold: {
        _alias: {
          new_: 'new',
        },
        new_: 'u32',
      },
      update_resume_threshold: {
        _alias: {
          new_: 'new',
        },
        new_: 'u32',
      },
      update_threshold_weight: {
        _alias: {
          new_: 'new',
        },
        new_: 'SpWeightsWeightV2Weight',
      },
      update_weight_restrict_decay: {
        _alias: {
          new_: 'new',
        },
        new_: 'SpWeightsWeightV2Weight',
      },
      update_xcmp_max_individual_weight: {
        _alias: {
          new_: 'new',
        },
        new_: 'SpWeightsWeightV2Weight',
      },
    },
  },
  /**
   * Lookup264: pallet_xcm::pallet::Call<T>
   **/
  PalletXcmCall: {
    _enum: {
      send: {
        dest: 'XcmVersionedMultiLocation',
        message: 'XcmVersionedXcm',
      },
      teleport_assets: {
        dest: 'XcmVersionedMultiLocation',
        beneficiary: 'XcmVersionedMultiLocation',
        assets: 'XcmVersionedMultiAssets',
        feeAssetItem: 'u32',
      },
      reserve_transfer_assets: {
        dest: 'XcmVersionedMultiLocation',
        beneficiary: 'XcmVersionedMultiLocation',
        assets: 'XcmVersionedMultiAssets',
        feeAssetItem: 'u32',
      },
      execute: {
        message: 'XcmVersionedXcm',
        maxWeight: 'SpWeightsWeightV2Weight',
      },
      force_xcm_version: {
        location: 'XcmV3MultiLocation',
        xcmVersion: 'u32',
      },
      force_default_xcm_version: {
        maybeXcmVersion: 'Option<u32>',
      },
      force_subscribe_version_notify: {
        location: 'XcmVersionedMultiLocation',
      },
      force_unsubscribe_version_notify: {
        location: 'XcmVersionedMultiLocation',
      },
      limited_reserve_transfer_assets: {
        dest: 'XcmVersionedMultiLocation',
        beneficiary: 'XcmVersionedMultiLocation',
        assets: 'XcmVersionedMultiAssets',
        feeAssetItem: 'u32',
        weightLimit: 'XcmV3WeightLimit',
      },
      limited_teleport_assets: {
        dest: 'XcmVersionedMultiLocation',
        beneficiary: 'XcmVersionedMultiLocation',
        assets: 'XcmVersionedMultiAssets',
        feeAssetItem: 'u32',
        weightLimit: 'XcmV3WeightLimit',
      },
      force_suspension: {
        suspended: 'bool',
      },
    },
  },
  /**
   * Lookup265: xcm::VersionedXcm<RuntimeCall>
   **/
  XcmVersionedXcm: {
    _enum: {
      __Unused0: 'Null',
      __Unused1: 'Null',
      V2: 'XcmV2Xcm',
      V3: 'XcmV3Xcm',
    },
  },
  /**
   * Lookup266: xcm::v2::Xcm<RuntimeCall>
   **/
  XcmV2Xcm: 'Vec<XcmV2Instruction>',
  /**
   * Lookup268: xcm::v2::Instruction<RuntimeCall>
   **/
  XcmV2Instruction: {
    _enum: {
      WithdrawAsset: 'XcmV2MultiassetMultiAssets',
      ReserveAssetDeposited: 'XcmV2MultiassetMultiAssets',
      ReceiveTeleportedAsset: 'XcmV2MultiassetMultiAssets',
      QueryResponse: {
        queryId: 'Compact<u64>',
        response: 'XcmV2Response',
        maxWeight: 'Compact<u64>',
      },
      TransferAsset: {
        assets: 'XcmV2MultiassetMultiAssets',
        beneficiary: 'XcmV2MultiLocation',
      },
      TransferReserveAsset: {
        assets: 'XcmV2MultiassetMultiAssets',
        dest: 'XcmV2MultiLocation',
        xcm: 'XcmV2Xcm',
      },
      Transact: {
        originType: 'XcmV2OriginKind',
        requireWeightAtMost: 'Compact<u64>',
        call: 'XcmDoubleEncoded',
      },
      HrmpNewChannelOpenRequest: {
        sender: 'Compact<u32>',
        maxMessageSize: 'Compact<u32>',
        maxCapacity: 'Compact<u32>',
      },
      HrmpChannelAccepted: {
        recipient: 'Compact<u32>',
      },
      HrmpChannelClosing: {
        initiator: 'Compact<u32>',
        sender: 'Compact<u32>',
        recipient: 'Compact<u32>',
      },
      ClearOrigin: 'Null',
      DescendOrigin: 'XcmV2MultilocationJunctions',
      ReportError: {
        queryId: 'Compact<u64>',
        dest: 'XcmV2MultiLocation',
        maxResponseWeight: 'Compact<u64>',
      },
      DepositAsset: {
        assets: 'XcmV2MultiassetMultiAssetFilter',
        maxAssets: 'Compact<u32>',
        beneficiary: 'XcmV2MultiLocation',
      },
      DepositReserveAsset: {
        assets: 'XcmV2MultiassetMultiAssetFilter',
        maxAssets: 'Compact<u32>',
        dest: 'XcmV2MultiLocation',
        xcm: 'XcmV2Xcm',
      },
      ExchangeAsset: {
        give: 'XcmV2MultiassetMultiAssetFilter',
        receive: 'XcmV2MultiassetMultiAssets',
      },
      InitiateReserveWithdraw: {
        assets: 'XcmV2MultiassetMultiAssetFilter',
        reserve: 'XcmV2MultiLocation',
        xcm: 'XcmV2Xcm',
      },
      InitiateTeleport: {
        assets: 'XcmV2MultiassetMultiAssetFilter',
        dest: 'XcmV2MultiLocation',
        xcm: 'XcmV2Xcm',
      },
      QueryHolding: {
        queryId: 'Compact<u64>',
        dest: 'XcmV2MultiLocation',
        assets: 'XcmV2MultiassetMultiAssetFilter',
        maxResponseWeight: 'Compact<u64>',
      },
      BuyExecution: {
        fees: 'XcmV2MultiAsset',
        weightLimit: 'XcmV2WeightLimit',
      },
      RefundSurplus: 'Null',
      SetErrorHandler: 'XcmV2Xcm',
      SetAppendix: 'XcmV2Xcm',
      ClearError: 'Null',
      ClaimAsset: {
        assets: 'XcmV2MultiassetMultiAssets',
        ticket: 'XcmV2MultiLocation',
      },
      Trap: 'Compact<u64>',
      SubscribeVersion: {
        queryId: 'Compact<u64>',
        maxResponseWeight: 'Compact<u64>',
      },
      UnsubscribeVersion: 'Null',
    },
  },
  /**
   * Lookup269: xcm::v2::Response
   **/
  XcmV2Response: {
    _enum: {
      Null: 'Null',
      Assets: 'XcmV2MultiassetMultiAssets',
      ExecutionResult: 'Option<(u32,XcmV2TraitsError)>',
      Version: 'u32',
    },
  },
  /**
   * Lookup272: xcm::v2::traits::Error
   **/
  XcmV2TraitsError: {
    _enum: {
      Overflow: 'Null',
      Unimplemented: 'Null',
      UntrustedReserveLocation: 'Null',
      UntrustedTeleportLocation: 'Null',
      MultiLocationFull: 'Null',
      MultiLocationNotInvertible: 'Null',
      BadOrigin: 'Null',
      InvalidLocation: 'Null',
      AssetNotFound: 'Null',
      FailedToTransactAsset: 'Null',
      NotWithdrawable: 'Null',
      LocationCannotHold: 'Null',
      ExceedsMaxMessageSize: 'Null',
      DestinationUnsupported: 'Null',
      Transport: 'Null',
      Unroutable: 'Null',
      UnknownClaim: 'Null',
      FailedToDecode: 'Null',
      MaxWeightInvalid: 'Null',
      NotHoldingFees: 'Null',
      TooExpensive: 'Null',
      Trap: 'u64',
      UnhandledXcmVersion: 'Null',
      WeightLimitReached: 'u64',
      Barrier: 'Null',
      WeightNotComputable: 'Null',
    },
  },
  /**
   * Lookup273: xcm::v2::multiasset::MultiAssetFilter
   **/
  XcmV2MultiassetMultiAssetFilter: {
    _enum: {
      Definite: 'XcmV2MultiassetMultiAssets',
      Wild: 'XcmV2MultiassetWildMultiAsset',
    },
  },
  /**
   * Lookup274: xcm::v2::multiasset::WildMultiAsset
   **/
  XcmV2MultiassetWildMultiAsset: {
    _enum: {
      All: 'Null',
      AllOf: {
        id: 'XcmV2MultiassetAssetId',
        fun: 'XcmV2MultiassetWildFungibility',
      },
    },
  },
  /**
   * Lookup275: xcm::v2::multiasset::WildFungibility
   **/
  XcmV2MultiassetWildFungibility: {
    _enum: ['Fungible', 'NonFungible'],
  },
  /**
   * Lookup276: xcm::v2::WeightLimit
   **/
  XcmV2WeightLimit: {
    _enum: {
      Unlimited: 'Null',
      Limited: 'Compact<u64>',
    },
  },
  /**
   * Lookup286: cumulus_pallet_xcm::pallet::Call<T>
   **/
  CumulusPalletXcmCall: 'Null',
  /**
   * Lookup287: cumulus_pallet_dmp_queue::pallet::Call<T>
   **/
  CumulusPalletDmpQueueCall: {
    _enum: {
      service_overweight: {
        index: 'u64',
        weightLimit: 'SpWeightsWeightV2Weight',
      },
    },
  },
  /**
   * Lookup288: pallet_xc_asset_config::pallet::Call<T>
   **/
  PalletXcAssetConfigCall: {
    _enum: {
      register_asset_location: {
        assetLocation: 'XcmVersionedMultiLocation',
        assetId: 'Compact<u128>',
      },
      set_asset_units_per_second: {
        assetLocation: 'XcmVersionedMultiLocation',
        unitsPerSecond: 'Compact<u128>',
      },
      change_existing_asset_location: {
        newAssetLocation: 'XcmVersionedMultiLocation',
        assetId: 'Compact<u128>',
      },
      remove_payment_asset: {
        assetLocation: 'XcmVersionedMultiLocation',
      },
      remove_asset: {
        assetId: 'Compact<u128>',
      },
    },
  },
  /**
   * Lookup289: orml_xtokens::module::Call<T>
   **/
  OrmlXtokensModuleCall: {
    _enum: {
      transfer: {
        currencyId: 'u128',
        amount: 'u128',
        dest: 'XcmVersionedMultiLocation',
        destWeightLimit: 'XcmV3WeightLimit',
      },
      transfer_multiasset: {
        asset: 'XcmVersionedMultiAsset',
        dest: 'XcmVersionedMultiLocation',
        destWeightLimit: 'XcmV3WeightLimit',
      },
      transfer_with_fee: {
        currencyId: 'u128',
        amount: 'u128',
        fee: 'u128',
        dest: 'XcmVersionedMultiLocation',
        destWeightLimit: 'XcmV3WeightLimit',
      },
      transfer_multiasset_with_fee: {
        asset: 'XcmVersionedMultiAsset',
        fee: 'XcmVersionedMultiAsset',
        dest: 'XcmVersionedMultiLocation',
        destWeightLimit: 'XcmV3WeightLimit',
      },
      transfer_multicurrencies: {
        currencies: 'Vec<(u128,u128)>',
        feeItem: 'u32',
        dest: 'XcmVersionedMultiLocation',
        destWeightLimit: 'XcmV3WeightLimit',
      },
      transfer_multiassets: {
        assets: 'XcmVersionedMultiAssets',
        feeItem: 'u32',
        dest: 'XcmVersionedMultiLocation',
        destWeightLimit: 'XcmV3WeightLimit',
      },
    },
  },
  /**
   * Lookup290: xcm::VersionedMultiAsset
   **/
  XcmVersionedMultiAsset: {
    _enum: {
      __Unused0: 'Null',
      V2: 'XcmV2MultiAsset',
      __Unused2: 'Null',
      V3: 'XcmV3MultiAsset',
    },
  },
  /**
   * Lookup293: pallet_evm::pallet::Call<T>
   **/
  PalletEvmCall: {
    _enum: {
      withdraw: {
        address: 'H160',
        value: 'u128',
      },
      call: {
        source: 'H160',
        target: 'H160',
        input: 'Bytes',
        value: 'U256',
        gasLimit: 'u64',
        maxFeePerGas: 'U256',
        maxPriorityFeePerGas: 'Option<U256>',
        nonce: 'Option<U256>',
        accessList: 'Vec<(H160,Vec<H256>)>',
      },
      create: {
        source: 'H160',
        init: 'Bytes',
        value: 'U256',
        gasLimit: 'u64',
        maxFeePerGas: 'U256',
        maxPriorityFeePerGas: 'Option<U256>',
        nonce: 'Option<U256>',
        accessList: 'Vec<(H160,Vec<H256>)>',
      },
      create2: {
        source: 'H160',
        init: 'Bytes',
        salt: 'H256',
        value: 'U256',
        gasLimit: 'u64',
        maxFeePerGas: 'U256',
        maxPriorityFeePerGas: 'Option<U256>',
        nonce: 'Option<U256>',
        accessList: 'Vec<(H160,Vec<H256>)>',
      },
    },
  },
  /**
   * Lookup297: pallet_ethereum::pallet::Call<T>
   **/
  PalletEthereumCall: {
    _enum: {
      transact: {
        transaction: 'EthereumTransactionTransactionV2',
      },
    },
  },
  /**
   * Lookup298: ethereum::transaction::TransactionV2
   **/
  EthereumTransactionTransactionV2: {
    _enum: {
      Legacy: 'EthereumTransactionLegacyTransaction',
      EIP2930: 'EthereumTransactionEip2930Transaction',
      EIP1559: 'EthereumTransactionEip1559Transaction',
    },
  },
  /**
   * Lookup299: ethereum::transaction::LegacyTransaction
   **/
  EthereumTransactionLegacyTransaction: {
    nonce: 'U256',
    gasPrice: 'U256',
    gasLimit: 'U256',
    action: 'EthereumTransactionTransactionAction',
    value: 'U256',
    input: 'Bytes',
    signature: 'EthereumTransactionTransactionSignature',
  },
  /**
   * Lookup300: ethereum::transaction::TransactionAction
   **/
  EthereumTransactionTransactionAction: {
    _enum: {
      Call: 'H160',
      Create: 'Null',
    },
  },
  /**
   * Lookup301: ethereum::transaction::TransactionSignature
   **/
  EthereumTransactionTransactionSignature: {
    v: 'u64',
    r: 'H256',
    s: 'H256',
  },
  /**
   * Lookup303: ethereum::transaction::EIP2930Transaction
   **/
  EthereumTransactionEip2930Transaction: {
    chainId: 'u64',
    nonce: 'U256',
    gasPrice: 'U256',
    gasLimit: 'U256',
    action: 'EthereumTransactionTransactionAction',
    value: 'U256',
    input: 'Bytes',
    accessList: 'Vec<EthereumTransactionAccessListItem>',
    oddYParity: 'bool',
    r: 'H256',
    s: 'H256',
  },
  /**
   * Lookup305: ethereum::transaction::AccessListItem
   **/
  EthereumTransactionAccessListItem: {
    address: 'H160',
    storageKeys: 'Vec<H256>',
  },
  /**
   * Lookup306: ethereum::transaction::EIP1559Transaction
   **/
  EthereumTransactionEip1559Transaction: {
    chainId: 'u64',
    nonce: 'U256',
    maxPriorityFeePerGas: 'U256',
    maxFeePerGas: 'U256',
    gasLimit: 'U256',
    action: 'EthereumTransactionTransactionAction',
    value: 'U256',
    input: 'Bytes',
    accessList: 'Vec<EthereumTransactionAccessListItem>',
    oddYParity: 'bool',
    r: 'H256',
    s: 'H256',
  },
  /**
   * Lookup307: pallet_dynamic_evm_base_fee::pallet::Call<T>
   **/
  PalletDynamicEvmBaseFeeCall: {
    _enum: {
      set_base_fee_per_gas: {
        fee: 'U256',
      },
    },
  },
  /**
   * Lookup308: pallet_ethereum_checked::pallet::Call<T>
   **/
  PalletEthereumCheckedCall: {
    _enum: {
      transact: {
        tx: 'AstarPrimitivesEthereumCheckedCheckedEthereumTx',
      },
    },
  },
  /**
   * Lookup309: astar_primitives::ethereum_checked::CheckedEthereumTx
   **/
  AstarPrimitivesEthereumCheckedCheckedEthereumTx: {
    gasLimit: 'U256',
    target: 'H160',
    value: 'U256',
    input: 'Bytes',
    maybeAccessList: 'Option<Vec<(H160,Vec<H256>)>>',
  },
  /**
   * Lookup312: pallet_unified_accounts::pallet::Call<T>
   **/
  PalletUnifiedAccountsCall: {
    _enum: {
      claim_evm_address: {
        evmAddress: 'H160',
        signature: '[u8;65]',
      },
      claim_default_evm_address: 'Null',
    },
  },
  /**
   * Lookup314: pallet_contracts::pallet::Call<T>
   **/
  PalletContractsCall: {
    _enum: {
      call_old_weight: {
        dest: 'MultiAddress',
        value: 'Compact<u128>',
        gasLimit: 'Compact<u64>',
        storageDepositLimit: 'Option<Compact<u128>>',
        data: 'Bytes',
      },
      instantiate_with_code_old_weight: {
        value: 'Compact<u128>',
        gasLimit: 'Compact<u64>',
        storageDepositLimit: 'Option<Compact<u128>>',
        code: 'Bytes',
        data: 'Bytes',
        salt: 'Bytes',
      },
      instantiate_old_weight: {
        value: 'Compact<u128>',
        gasLimit: 'Compact<u64>',
        storageDepositLimit: 'Option<Compact<u128>>',
        codeHash: 'H256',
        data: 'Bytes',
        salt: 'Bytes',
      },
      upload_code: {
        code: 'Bytes',
        storageDepositLimit: 'Option<Compact<u128>>',
        determinism: 'PalletContractsWasmDeterminism',
      },
      remove_code: {
        codeHash: 'H256',
      },
      set_code: {
        dest: 'MultiAddress',
        codeHash: 'H256',
      },
      call: {
        dest: 'MultiAddress',
        value: 'Compact<u128>',
        gasLimit: 'SpWeightsWeightV2Weight',
        storageDepositLimit: 'Option<Compact<u128>>',
        data: 'Bytes',
      },
      instantiate_with_code: {
        value: 'Compact<u128>',
        gasLimit: 'SpWeightsWeightV2Weight',
        storageDepositLimit: 'Option<Compact<u128>>',
        code: 'Bytes',
        data: 'Bytes',
        salt: 'Bytes',
      },
      instantiate: {
        value: 'Compact<u128>',
        gasLimit: 'SpWeightsWeightV2Weight',
        storageDepositLimit: 'Option<Compact<u128>>',
        codeHash: 'H256',
        data: 'Bytes',
        salt: 'Bytes',
      },
      migrate: {
        weightLimit: 'SpWeightsWeightV2Weight',
      },
    },
  },
  /**
   * Lookup316: pallet_contracts::wasm::Determinism
   **/
  PalletContractsWasmDeterminism: {
    _enum: ['Enforced', 'Relaxed'],
  },
  /**
   * Lookup317: pallet_democracy::pallet::Call<T>
   **/
  PalletDemocracyCall: {
    _enum: {
      propose: {
        proposal: 'FrameSupportPreimagesBounded',
        value: 'Compact<u128>',
      },
      second: {
        proposal: 'Compact<u32>',
      },
      vote: {
        refIndex: 'Compact<u32>',
        vote: 'PalletDemocracyVoteAccountVote',
      },
      emergency_cancel: {
        refIndex: 'u32',
      },
      external_propose: {
        proposal: 'FrameSupportPreimagesBounded',
      },
      external_propose_majority: {
        proposal: 'FrameSupportPreimagesBounded',
      },
      external_propose_default: {
        proposal: 'FrameSupportPreimagesBounded',
      },
      fast_track: {
        proposalHash: 'H256',
        votingPeriod: 'u32',
        delay: 'u32',
      },
      veto_external: {
        proposalHash: 'H256',
      },
      cancel_referendum: {
        refIndex: 'Compact<u32>',
      },
      delegate: {
        to: 'MultiAddress',
        conviction: 'PalletDemocracyConviction',
        balance: 'u128',
      },
      undelegate: 'Null',
      clear_public_proposals: 'Null',
      unlock: {
        target: 'MultiAddress',
      },
      remove_vote: {
        index: 'u32',
      },
      remove_other_vote: {
        target: 'MultiAddress',
        index: 'u32',
      },
      blacklist: {
        proposalHash: 'H256',
        maybeRefIndex: 'Option<u32>',
      },
      cancel_proposal: {
        propIndex: 'Compact<u32>',
      },
      set_metadata: {
        owner: 'PalletDemocracyMetadataOwner',
        maybeHash: 'Option<H256>',
      },
    },
  },
  /**
   * Lookup318: frame_support::traits::preimages::Bounded<shibuya_runtime::RuntimeCall>
   **/
  FrameSupportPreimagesBounded: {
    _enum: {
      Legacy: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
      },
      Inline: 'Bytes',
      Lookup: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
        len: 'u32',
      },
    },
  },
  /**
   * Lookup320: pallet_democracy::conviction::Conviction
   **/
  PalletDemocracyConviction: {
    _enum: ['None', 'Locked1x', 'Locked2x', 'Locked3x', 'Locked4x', 'Locked5x', 'Locked6x'],
  },
  /**
   * Lookup322: pallet_collective::pallet::Call<T, I>
   **/
  PalletCollectiveCall: {
    _enum: {
      set_members: {
        newMembers: 'Vec<AccountId32>',
        prime: 'Option<AccountId32>',
        oldCount: 'u32',
      },
      execute: {
        proposal: 'Call',
        lengthBound: 'Compact<u32>',
      },
      propose: {
        threshold: 'Compact<u32>',
        proposal: 'Call',
        lengthBound: 'Compact<u32>',
      },
      vote: {
        proposal: 'H256',
        index: 'Compact<u32>',
        approve: 'bool',
      },
      __Unused4: 'Null',
      disapprove_proposal: {
        proposalHash: 'H256',
      },
      close: {
        proposalHash: 'H256',
        index: 'Compact<u32>',
        proposalWeightBound: 'SpWeightsWeightV2Weight',
        lengthBound: 'Compact<u32>',
      },
    },
  },
  /**
   * Lookup324: pallet_treasury::pallet::Call<T, I>
   **/
  PalletTreasuryCall: {
    _enum: {
      propose_spend: {
        value: 'Compact<u128>',
        beneficiary: 'MultiAddress',
      },
      reject_proposal: {
        proposalId: 'Compact<u32>',
      },
      approve_proposal: {
        proposalId: 'Compact<u32>',
      },
      spend: {
        amount: 'Compact<u128>',
        beneficiary: 'MultiAddress',
      },
      remove_approval: {
        proposalId: 'Compact<u32>',
      },
    },
  },
  /**
   * Lookup325: pallet_preimage::pallet::Call<T>
   **/
  PalletPreimageCall: {
    _enum: {
      note_preimage: {
        bytes: 'Bytes',
      },
      unnote_preimage: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
      },
      request_preimage: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
      },
      unrequest_preimage: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
      },
    },
  },
  /**
   * Lookup326: pallet_sudo::pallet::Call<T>
   **/
  PalletSudoCall: {
    _enum: {
      sudo: {
        call: 'Call',
      },
      sudo_unchecked_weight: {
        call: 'Call',
        weight: 'SpWeightsWeightV2Weight',
      },
      set_key: {
        _alias: {
          new_: 'new',
        },
        new_: 'MultiAddress',
      },
      sudo_as: {
        who: 'MultiAddress',
        call: 'Call',
      },
    },
  },
  /**
   * Lookup327: pallet_static_price_provider::pallet::Call<T>
   **/
  PalletStaticPriceProviderCall: {
    _enum: {
      force_set_price: {
        price: 'u64',
      },
    },
  },
  /**
   * Lookup328: shibuya_runtime::OriginCaller
   **/
  ShibuyaRuntimeOriginCaller: {
    _enum: {
      __Unused0: 'Null',
      __Unused1: 'Null',
      __Unused2: 'Null',
      __Unused3: 'Null',
      __Unused4: 'Null',
      __Unused5: 'Null',
      __Unused6: 'Null',
      Void: 'SpCoreVoid',
      __Unused8: 'Null',
      __Unused9: 'Null',
      system: 'FrameSupportDispatchRawOrigin',
      __Unused11: 'Null',
      __Unused12: 'Null',
      __Unused13: 'Null',
      __Unused14: 'Null',
      __Unused15: 'Null',
      __Unused16: 'Null',
      __Unused17: 'Null',
      __Unused18: 'Null',
      __Unused19: 'Null',
      __Unused20: 'Null',
      __Unused21: 'Null',
      __Unused22: 'Null',
      __Unused23: 'Null',
      __Unused24: 'Null',
      __Unused25: 'Null',
      __Unused26: 'Null',
      __Unused27: 'Null',
      __Unused28: 'Null',
      __Unused29: 'Null',
      __Unused30: 'Null',
      __Unused31: 'Null',
      __Unused32: 'Null',
      __Unused33: 'Null',
      __Unused34: 'Null',
      __Unused35: 'Null',
      __Unused36: 'Null',
      __Unused37: 'Null',
      __Unused38: 'Null',
      __Unused39: 'Null',
      __Unused40: 'Null',
      __Unused41: 'Null',
      __Unused42: 'Null',
      __Unused43: 'Null',
      __Unused44: 'Null',
      __Unused45: 'Null',
      __Unused46: 'Null',
      __Unused47: 'Null',
      __Unused48: 'Null',
      __Unused49: 'Null',
      __Unused50: 'Null',
      PolkadotXcm: 'PalletXcmOrigin',
      CumulusXcm: 'CumulusPalletXcmOrigin',
      __Unused53: 'Null',
      __Unused54: 'Null',
      __Unused55: 'Null',
      __Unused56: 'Null',
      __Unused57: 'Null',
      __Unused58: 'Null',
      __Unused59: 'Null',
      __Unused60: 'Null',
      Ethereum: 'PalletEthereumRawOrigin',
      __Unused62: 'Null',
      __Unused63: 'Null',
      EthereumChecked: 'PalletEthereumCheckedRawOrigin',
      __Unused65: 'Null',
      __Unused66: 'Null',
      __Unused67: 'Null',
      __Unused68: 'Null',
      __Unused69: 'Null',
      __Unused70: 'Null',
      __Unused71: 'Null',
      __Unused72: 'Null',
      __Unused73: 'Null',
      __Unused74: 'Null',
      __Unused75: 'Null',
      __Unused76: 'Null',
      __Unused77: 'Null',
      __Unused78: 'Null',
      __Unused79: 'Null',
      __Unused80: 'Null',
      Council: 'PalletCollectiveRawOrigin',
      TechnicalCommittee: 'PalletCollectiveRawOrigin',
    },
  },
  /**
   * Lookup329: frame_support::dispatch::RawOrigin<sp_core::crypto::AccountId32>
   **/
  FrameSupportDispatchRawOrigin: {
    _enum: {
      Root: 'Null',
      Signed: 'AccountId32',
      None: 'Null',
    },
  },
  /**
   * Lookup330: pallet_xcm::pallet::Origin
   **/
  PalletXcmOrigin: {
    _enum: {
      Xcm: 'XcmV3MultiLocation',
      Response: 'XcmV3MultiLocation',
    },
  },
  /**
   * Lookup331: cumulus_pallet_xcm::pallet::Origin
   **/
  CumulusPalletXcmOrigin: {
    _enum: {
      Relay: 'Null',
      SiblingParachain: 'u32',
    },
  },
  /**
   * Lookup332: pallet_ethereum::RawOrigin
   **/
  PalletEthereumRawOrigin: {
    _enum: {
      EthereumTransaction: 'H160',
    },
  },
  /**
   * Lookup333: pallet_ethereum_checked::RawOrigin<sp_core::crypto::AccountId32>
   **/
  PalletEthereumCheckedRawOrigin: {
    _enum: {
      XcmEthereumTx: 'AccountId32',
    },
  },
  /**
   * Lookup334: pallet_collective::RawOrigin<sp_core::crypto::AccountId32, I>
   **/
  PalletCollectiveRawOrigin: {
    _enum: {
      Members: '(u32,u32)',
      Member: 'AccountId32',
      _Phantom: 'Null',
    },
  },
  /**
   * Lookup336: sp_core::Void
   **/
  SpCoreVoid: 'Null',
  /**
   * Lookup337: pallet_utility::pallet::Error<T>
   **/
  PalletUtilityError: {
    _enum: ['TooManyCalls'],
  },
  /**
   * Lookup338: pallet_identity::types::Registration<Balance, MaxJudgements, MaxAdditionalFields>
   **/
  PalletIdentityRegistration: {
    judgements: 'Vec<(u32,PalletIdentityJudgement)>',
    deposit: 'u128',
    info: 'PalletIdentityIdentityInfo',
  },
  /**
   * Lookup346: pallet_identity::types::RegistrarInfo<Balance, sp_core::crypto::AccountId32>
   **/
  PalletIdentityRegistrarInfo: {
    account: 'AccountId32',
    fee: 'u128',
    fields: 'PalletIdentityBitFlags',
  },
  /**
   * Lookup348: pallet_identity::pallet::Error<T>
   **/
  PalletIdentityError: {
    _enum: [
      'TooManySubAccounts',
      'NotFound',
      'NotNamed',
      'EmptyIndex',
      'FeeChanged',
      'NoIdentity',
      'StickyJudgement',
      'JudgementGiven',
      'InvalidJudgement',
      'InvalidIndex',
      'InvalidTarget',
      'TooManyFields',
      'TooManyRegistrars',
      'AlreadyClaimed',
      'NotSub',
      'NotOwned',
      'JudgementForDifferentIdentity',
      'JudgementPaymentFailed',
    ],
  },
  /**
   * Lookup350: pallet_multisig::Multisig<BlockNumber, Balance, sp_core::crypto::AccountId32, MaxApprovals>
   **/
  PalletMultisigMultisig: {
    when: 'PalletMultisigTimepoint',
    deposit: 'u128',
    depositor: 'AccountId32',
    approvals: 'Vec<AccountId32>',
  },
  /**
   * Lookup352: pallet_multisig::pallet::Error<T>
   **/
  PalletMultisigError: {
    _enum: [
      'MinimumThreshold',
      'AlreadyApproved',
      'NoApprovalsNeeded',
      'TooFewSignatories',
      'TooManySignatories',
      'SignatoriesOutOfOrder',
      'SenderInSignatories',
      'NotFound',
      'NotOwner',
      'NoTimepoint',
      'WrongTimepoint',
      'UnexpectedTimepoint',
      'MaxWeightTooLow',
      'AlreadyStored',
    ],
  },
  /**
   * Lookup356: pallet_scheduler::Scheduled<Name, frame_support::traits::preimages::Bounded<shibuya_runtime::RuntimeCall>, BlockNumber, shibuya_runtime::OriginCaller, sp_core::crypto::AccountId32>
   **/
  PalletSchedulerScheduled: {
    maybeId: 'Option<[u8;32]>',
    priority: 'u8',
    call: 'FrameSupportPreimagesBounded',
    maybePeriodic: 'Option<(u32,u32)>',
    origin: 'ShibuyaRuntimeOriginCaller',
  },
  /**
   * Lookup358: pallet_scheduler::pallet::Error<T>
   **/
  PalletSchedulerError: {
    _enum: ['FailedToSchedule', 'NotFound', 'TargetBlockNumberInPast', 'RescheduleNoChange', 'Named'],
  },
  /**
   * Lookup361: pallet_proxy::ProxyDefinition<sp_core::crypto::AccountId32, shibuya_runtime::ProxyType, BlockNumber>
   **/
  PalletProxyProxyDefinition: {
    delegate: 'AccountId32',
    proxyType: 'ShibuyaRuntimeProxyType',
    delay: 'u32',
  },
  /**
   * Lookup365: pallet_proxy::Announcement<sp_core::crypto::AccountId32, primitive_types::H256, BlockNumber>
   **/
  PalletProxyAnnouncement: {
    real: 'AccountId32',
    callHash: 'H256',
    height: 'u32',
  },
  /**
   * Lookup367: pallet_proxy::pallet::Error<T>
   **/
  PalletProxyError: {
    _enum: [
      'TooMany',
      'NotFound',
      'NotProxy',
      'Unproxyable',
      'Duplicate',
      'NoPermission',
      'Unannounced',
      'NoSelfProxy',
    ],
  },
  /**
   * Lookup369: polkadot_primitives::v4::UpgradeRestriction
   **/
  PolkadotPrimitivesV4UpgradeRestriction: {
    _enum: ['Present'],
  },
  /**
   * Lookup370: cumulus_pallet_parachain_system::relay_state_snapshot::MessagingStateSnapshot
   **/
  CumulusPalletParachainSystemRelayStateSnapshotMessagingStateSnapshot: {
    dmqMqcHead: 'H256',
    relayDispatchQueueSize: 'CumulusPalletParachainSystemRelayStateSnapshotRelayDispachQueueSize',
    ingressChannels: 'Vec<(u32,PolkadotPrimitivesV4AbridgedHrmpChannel)>',
    egressChannels: 'Vec<(u32,PolkadotPrimitivesV4AbridgedHrmpChannel)>',
  },
  /**
   * Lookup371: cumulus_pallet_parachain_system::relay_state_snapshot::RelayDispachQueueSize
   **/
  CumulusPalletParachainSystemRelayStateSnapshotRelayDispachQueueSize: {
    remainingCount: 'u32',
    remainingSize: 'u32',
  },
  /**
   * Lookup374: polkadot_primitives::v4::AbridgedHrmpChannel
   **/
  PolkadotPrimitivesV4AbridgedHrmpChannel: {
    maxCapacity: 'u32',
    maxTotalSize: 'u32',
    maxMessageSize: 'u32',
    msgCount: 'u32',
    totalSize: 'u32',
    mqcHead: 'Option<H256>',
  },
  /**
   * Lookup375: polkadot_primitives::v4::AbridgedHostConfiguration
   **/
  PolkadotPrimitivesV4AbridgedHostConfiguration: {
    maxCodeSize: 'u32',
    maxHeadDataSize: 'u32',
    maxUpwardQueueCount: 'u32',
    maxUpwardQueueSize: 'u32',
    maxUpwardMessageSize: 'u32',
    maxUpwardMessageNumPerCandidate: 'u32',
    hrmpMaxMessageNumPerCandidate: 'u32',
    validationUpgradeCooldown: 'u32',
    validationUpgradeDelay: 'u32',
  },
  /**
   * Lookup381: polkadot_core_primitives::OutboundHrmpMessage<polkadot_parachain::primitives::Id>
   **/
  PolkadotCorePrimitivesOutboundHrmpMessage: {
    recipient: 'u32',
    data: 'Bytes',
  },
  /**
   * Lookup382: cumulus_pallet_parachain_system::CodeUpgradeAuthorization<T>
   **/
  CumulusPalletParachainSystemCodeUpgradeAuthorization: {
    codeHash: 'H256',
    checkVersion: 'bool',
  },
  /**
   * Lookup383: cumulus_pallet_parachain_system::pallet::Error<T>
   **/
  CumulusPalletParachainSystemError: {
    _enum: [
      'OverlappingUpgrades',
      'ProhibitedByPolkadot',
      'TooBig',
      'ValidationDataNotAvailable',
      'HostConfigurationNotAvailable',
      'NotScheduled',
      'NothingAuthorized',
      'Unauthorized',
    ],
  },
  /**
   * Lookup385: pallet_transaction_payment::Releases
   **/
  PalletTransactionPaymentReleases: {
    _enum: ['V1Ancient', 'V2'],
  },
  /**
   * Lookup387: pallet_balances::types::BalanceLock<Balance>
   **/
  PalletBalancesBalanceLock: {
    id: '[u8;8]',
    amount: 'u128',
    reasons: 'PalletBalancesReasons',
  },
  /**
   * Lookup388: pallet_balances::types::Reasons
   **/
  PalletBalancesReasons: {
    _enum: ['Fee', 'Misc', 'All'],
  },
  /**
   * Lookup391: pallet_balances::types::ReserveData<ReserveIdentifier, Balance>
   **/
  PalletBalancesReserveData: {
    id: '[u8;8]',
    amount: 'u128',
  },
  /**
   * Lookup397: pallet_balances::types::IdAmount<shibuya_runtime::RuntimeFreezeReason, Balance>
   **/
  PalletBalancesIdAmount: {
    id: 'ShibuyaRuntimeRuntimeFreezeReason',
    amount: 'u128',
  },
  /**
   * Lookup398: shibuya_runtime::RuntimeFreezeReason
   **/
  ShibuyaRuntimeRuntimeFreezeReason: {
    _enum: {
      __Unused0: 'Null',
      __Unused1: 'Null',
      __Unused2: 'Null',
      __Unused3: 'Null',
      __Unused4: 'Null',
      __Unused5: 'Null',
      __Unused6: 'Null',
      __Unused7: 'Null',
      __Unused8: 'Null',
      __Unused9: 'Null',
      __Unused10: 'Null',
      __Unused11: 'Null',
      __Unused12: 'Null',
      __Unused13: 'Null',
      __Unused14: 'Null',
      __Unused15: 'Null',
      __Unused16: 'Null',
      __Unused17: 'Null',
      __Unused18: 'Null',
      __Unused19: 'Null',
      __Unused20: 'Null',
      __Unused21: 'Null',
      __Unused22: 'Null',
      __Unused23: 'Null',
      __Unused24: 'Null',
      __Unused25: 'Null',
      __Unused26: 'Null',
      __Unused27: 'Null',
      __Unused28: 'Null',
      __Unused29: 'Null',
      __Unused30: 'Null',
      __Unused31: 'Null',
      __Unused32: 'Null',
      __Unused33: 'Null',
      DappStaking: 'PalletDappStakingV3FreezeReason',
    },
  },
  /**
   * Lookup399: pallet_dapp_staking_v3::pallet::FreezeReason
   **/
  PalletDappStakingV3FreezeReason: {
    _enum: ['DAppStaking'],
  },
  /**
   * Lookup401: pallet_balances::pallet::Error<T, I>
   **/
  PalletBalancesError: {
    _enum: [
      'VestingBalance',
      'LiquidityRestrictions',
      'InsufficientBalance',
      'ExistentialDeposit',
      'Expendability',
      'ExistingVestingSchedule',
      'DeadAccount',
      'TooManyReserves',
      'TooManyHolds',
      'TooManyFreezes',
    ],
  },
  /**
   * Lookup404: pallet_vesting::Releases
   **/
  PalletVestingReleases: {
    _enum: ['V0', 'V1'],
  },
  /**
   * Lookup405: pallet_vesting::pallet::Error<T>
   **/
  PalletVestingError: {
    _enum: ['NotVesting', 'AtMaxVestingSchedules', 'AmountLow', 'ScheduleIndexOutOfBounds', 'InvalidScheduleParams'],
  },
  /**
   * Lookup406: pallet_dapp_staking_v3::types::ProtocolState
   **/
  PalletDappStakingV3ProtocolState: {
    era: 'Compact<u32>',
    nextEraStart: 'Compact<u32>',
    periodInfo: 'PalletDappStakingV3PeriodInfo',
    maintenance: 'bool',
  },
  /**
   * Lookup407: pallet_dapp_staking_v3::types::PeriodInfo
   **/
  PalletDappStakingV3PeriodInfo: {
    number: 'Compact<u32>',
    subperiod: 'PalletDappStakingV3Subperiod',
    nextSubperiodStartEra: 'Compact<u32>',
  },
  /**
   * Lookup408: pallet_dapp_staking_v3::types::DAppInfo<sp_core::crypto::AccountId32>
   **/
  PalletDappStakingV3DAppInfo: {
    owner: 'AccountId32',
    id: 'Compact<u16>',
    state: 'PalletDappStakingV3DAppState',
    rewardBeneficiary: 'Option<AccountId32>',
  },
  /**
   * Lookup409: pallet_dapp_staking_v3::types::DAppState
   **/
  PalletDappStakingV3DAppState: {
    _enum: {
      Registered: 'Null',
      Unregistered: 'Compact<u32>',
    },
  },
  /**
   * Lookup410: pallet_dapp_staking_v3::types::AccountLedger<UnlockingLen>
   **/
  PalletDappStakingV3AccountLedger: {
    locked: 'Compact<u128>',
    unlocking: 'Vec<PalletDappStakingV3UnlockingChunk>',
    staked: 'PalletDappStakingV3StakeAmount',
    stakedFuture: 'Option<PalletDappStakingV3StakeAmount>',
    contractStakeCount: 'Compact<u32>',
  },
  /**
   * Lookup412: pallet_dapp_staking_v3::types::UnlockingChunk
   **/
  PalletDappStakingV3UnlockingChunk: {
    amount: 'Compact<u128>',
    unlockBlock: 'Compact<u32>',
  },
  /**
   * Lookup414: pallet_dapp_staking_v3::types::StakeAmount
   **/
  PalletDappStakingV3StakeAmount: {
    voting: 'Compact<u128>',
    buildAndEarn: 'Compact<u128>',
    era: 'Compact<u32>',
    period: 'Compact<u32>',
  },
  /**
   * Lookup417: pallet_dapp_staking_v3::types::SingularStakingInfo
   **/
  PalletDappStakingV3SingularStakingInfo: {
    staked: 'PalletDappStakingV3StakeAmount',
    loyalStaker: 'bool',
  },
  /**
   * Lookup418: pallet_dapp_staking_v3::types::ContractStakeAmount
   **/
  PalletDappStakingV3ContractStakeAmount: {
    staked: 'PalletDappStakingV3StakeAmount',
    stakedFuture: 'Option<PalletDappStakingV3StakeAmount>',
  },
  /**
   * Lookup419: pallet_dapp_staking_v3::types::EraInfo
   **/
  PalletDappStakingV3EraInfo: {
    totalLocked: 'Compact<u128>',
    unlocking: 'Compact<u128>',
    currentStakeAmount: 'PalletDappStakingV3StakeAmount',
    nextStakeAmount: 'PalletDappStakingV3StakeAmount',
  },
  /**
   * Lookup420: pallet_dapp_staking_v3::types::EraRewardSpan<SL>
   **/
  PalletDappStakingV3EraRewardSpan: {
    span: 'Vec<PalletDappStakingV3EraReward>',
    firstEra: 'Compact<u32>',
    lastEra: 'Compact<u32>',
  },
  /**
   * Lookup422: pallet_dapp_staking_v3::types::EraReward
   **/
  PalletDappStakingV3EraReward: {
    stakerRewardPool: 'Compact<u128>',
    staked: 'Compact<u128>',
    dappRewardPool: 'Compact<u128>',
  },
  /**
   * Lookup424: pallet_dapp_staking_v3::types::PeriodEndInfo
   **/
  PalletDappStakingV3PeriodEndInfo: {
    bonusRewardPool: 'Compact<u128>',
    totalVpStake: 'Compact<u128>',
    finalEra: 'Compact<u32>',
  },
  /**
   * Lookup425: pallet_dapp_staking_v3::types::DAppTierRewards<MD, NT>
   **/
  PalletDappStakingV3DAppTierRewards: {
    dapps: 'BTreeMap<u16, u8>',
    rewards: 'Vec<u128>',
    period: 'Compact<u32>',
  },
  /**
   * Lookup432: pallet_dapp_staking_v3::types::CleanupMarker
   **/
  PalletDappStakingV3CleanupMarker: {
    eraRewardIndex: 'Compact<u32>',
    dappTiersIndex: 'Compact<u32>',
    oldestValidEra: 'Compact<u32>',
  },
  /**
   * Lookup433: pallet_dapp_staking_v3::pallet::Error<T>
   **/
  PalletDappStakingV3Error: {
    _enum: [
      'Disabled',
      'ContractAlreadyExists',
      'ExceededMaxNumberOfContracts',
      'NewDAppIdUnavailable',
      'ContractNotFound',
      'OriginNotOwner',
      'NotOperatedDApp',
      'ZeroAmount',
      'LockedAmountBelowThreshold',
      'TooManyUnlockingChunks',
      'RemainingStakePreventsFullUnlock',
      'NoUnlockedChunksToClaim',
      'NoUnlockingChunks',
      'UnavailableStakeFunds',
      'UnclaimedRewards',
      'InternalStakeError',
      'InsufficientStakeAmount',
      'PeriodEndsInNextEra',
      'UnstakeFromPastPeriod',
      'UnstakeAmountTooLarge',
      'NoStakingInfo',
      'InternalUnstakeError',
      'RewardExpired',
      'RewardPayoutFailed',
      'NoClaimableRewards',
      'InternalClaimStakerError',
      'NotEligibleForBonusReward',
      'InternalClaimBonusError',
      'InvalidClaimEra',
      'NoDAppTierInfo',
      'InternalClaimDAppError',
      'ContractStillActive',
      'TooManyStakedContracts',
      'NoExpiredEntries',
      'InvalidTierParameters',
    ],
  },
  /**
   * Lookup434: pallet_inflation::pallet::Error<T>
   **/
  PalletInflationError: {
    _enum: ['InvalidInflationParameters'],
  },
  /**
   * Lookup435: pallet_assets::types::AssetDetails<Balance, sp_core::crypto::AccountId32, DepositBalance>
   **/
  PalletAssetsAssetDetails: {
    owner: 'AccountId32',
    issuer: 'AccountId32',
    admin: 'AccountId32',
    freezer: 'AccountId32',
    supply: 'u128',
    deposit: 'u128',
    minBalance: 'u128',
    isSufficient: 'bool',
    accounts: 'u32',
    sufficients: 'u32',
    approvals: 'u32',
    status: 'PalletAssetsAssetStatus',
  },
  /**
   * Lookup436: pallet_assets::types::AssetStatus
   **/
  PalletAssetsAssetStatus: {
    _enum: ['Live', 'Frozen', 'Destroying'],
  },
  /**
   * Lookup438: pallet_assets::types::AssetAccount<Balance, DepositBalance, Extra, sp_core::crypto::AccountId32>
   **/
  PalletAssetsAssetAccount: {
    balance: 'u128',
    status: 'PalletAssetsAccountStatus',
    reason: 'PalletAssetsExistenceReason',
    extra: 'Null',
  },
  /**
   * Lookup439: pallet_assets::types::AccountStatus
   **/
  PalletAssetsAccountStatus: {
    _enum: ['Liquid', 'Frozen', 'Blocked'],
  },
  /**
   * Lookup440: pallet_assets::types::ExistenceReason<Balance, sp_core::crypto::AccountId32>
   **/
  PalletAssetsExistenceReason: {
    _enum: {
      Consumer: 'Null',
      Sufficient: 'Null',
      DepositHeld: 'u128',
      DepositRefunded: 'Null',
      DepositFrom: '(AccountId32,u128)',
    },
  },
  /**
   * Lookup442: pallet_assets::types::Approval<Balance, DepositBalance>
   **/
  PalletAssetsApproval: {
    amount: 'u128',
    deposit: 'u128',
  },
  /**
   * Lookup443: pallet_assets::types::AssetMetadata<DepositBalance, bounded_collections::bounded_vec::BoundedVec<T, S>>
   **/
  PalletAssetsAssetMetadata: {
    deposit: 'u128',
    name: 'Bytes',
    symbol: 'Bytes',
    decimals: 'u8',
    isFrozen: 'bool',
  },
  /**
   * Lookup445: pallet_assets::pallet::Error<T, I>
   **/
  PalletAssetsError: {
    _enum: [
      'BalanceLow',
      'NoAccount',
      'NoPermission',
      'Unknown',
      'Frozen',
      'InUse',
      'BadWitness',
      'MinBalanceZero',
      'UnavailableConsumer',
      'BadMetadata',
      'Unapproved',
      'WouldDie',
      'AlreadyExists',
      'NoDeposit',
      'WouldBurn',
      'LiveAsset',
      'AssetNotLive',
      'IncorrectStatus',
      'NotFrozen',
      'CallbackFailed',
    ],
  },
  /**
   * Lookup447: pallet_collator_selection::pallet::CandidateInfo<sp_core::crypto::AccountId32, Balance>
   **/
  PalletCollatorSelectionCandidateInfo: {
    who: 'AccountId32',
    deposit: 'u128',
  },
  /**
   * Lookup448: pallet_collator_selection::pallet::Error<T>
   **/
  PalletCollatorSelectionError: {
    _enum: [
      'TooManyCandidates',
      'TooFewCandidates',
      'Unknown',
      'Permission',
      'AlreadyCandidate',
      'NotCandidate',
      'AlreadyInvulnerable',
      'NoAssociatedValidatorId',
      'ValidatorNotRegistered',
    ],
  },
  /**
   * Lookup453: sp_core::crypto::KeyTypeId
   **/
  SpCoreCryptoKeyTypeId: '[u8;4]',
  /**
   * Lookup454: pallet_session::pallet::Error<T>
   **/
  PalletSessionError: {
    _enum: ['InvalidProof', 'NoAssociatedValidatorId', 'DuplicatedKey', 'NoKeys', 'NoAccount'],
  },
  /**
   * Lookup459: cumulus_pallet_xcmp_queue::InboundChannelDetails
   **/
  CumulusPalletXcmpQueueInboundChannelDetails: {
    sender: 'u32',
    state: 'CumulusPalletXcmpQueueInboundState',
    messageMetadata: 'Vec<(u32,PolkadotParachainPrimitivesXcmpMessageFormat)>',
  },
  /**
   * Lookup460: cumulus_pallet_xcmp_queue::InboundState
   **/
  CumulusPalletXcmpQueueInboundState: {
    _enum: ['Ok', 'Suspended'],
  },
  /**
   * Lookup463: polkadot_parachain::primitives::XcmpMessageFormat
   **/
  PolkadotParachainPrimitivesXcmpMessageFormat: {
    _enum: ['ConcatenatedVersionedXcm', 'ConcatenatedEncodedBlob', 'Signals'],
  },
  /**
   * Lookup466: cumulus_pallet_xcmp_queue::OutboundChannelDetails
   **/
  CumulusPalletXcmpQueueOutboundChannelDetails: {
    recipient: 'u32',
    state: 'CumulusPalletXcmpQueueOutboundState',
    signalsExist: 'bool',
    firstIndex: 'u16',
    lastIndex: 'u16',
  },
  /**
   * Lookup467: cumulus_pallet_xcmp_queue::OutboundState
   **/
  CumulusPalletXcmpQueueOutboundState: {
    _enum: ['Ok', 'Suspended'],
  },
  /**
   * Lookup469: cumulus_pallet_xcmp_queue::QueueConfigData
   **/
  CumulusPalletXcmpQueueQueueConfigData: {
    suspendThreshold: 'u32',
    dropThreshold: 'u32',
    resumeThreshold: 'u32',
    thresholdWeight: 'SpWeightsWeightV2Weight',
    weightRestrictDecay: 'SpWeightsWeightV2Weight',
    xcmpMaxIndividualWeight: 'SpWeightsWeightV2Weight',
  },
  /**
   * Lookup471: cumulus_pallet_xcmp_queue::pallet::Error<T>
   **/
  CumulusPalletXcmpQueueError: {
    _enum: ['FailedToSend', 'BadXcmOrigin', 'BadXcm', 'BadOverweightIndex', 'WeightOverLimit'],
  },
  /**
   * Lookup472: pallet_xcm::pallet::QueryStatus<BlockNumber>
   **/
  PalletXcmQueryStatus: {
    _enum: {
      Pending: {
        responder: 'XcmVersionedMultiLocation',
        maybeMatchQuerier: 'Option<XcmVersionedMultiLocation>',
        maybeNotify: 'Option<(u8,u8)>',
        timeout: 'u32',
      },
      VersionNotifier: {
        origin: 'XcmVersionedMultiLocation',
        isActive: 'bool',
      },
      Ready: {
        response: 'XcmVersionedResponse',
        at: 'u32',
      },
    },
  },
  /**
   * Lookup476: xcm::VersionedResponse
   **/
  XcmVersionedResponse: {
    _enum: {
      __Unused0: 'Null',
      __Unused1: 'Null',
      V2: 'XcmV2Response',
      V3: 'XcmV3Response',
    },
  },
  /**
   * Lookup482: pallet_xcm::pallet::VersionMigrationStage
   **/
  PalletXcmVersionMigrationStage: {
    _enum: {
      MigrateSupportedVersion: 'Null',
      MigrateVersionNotifiers: 'Null',
      NotifyCurrentTargets: 'Option<Bytes>',
      MigrateAndNotifyOldTargets: 'Null',
    },
  },
  /**
   * Lookup485: xcm::VersionedAssetId
   **/
  XcmVersionedAssetId: {
    _enum: {
      __Unused0: 'Null',
      __Unused1: 'Null',
      __Unused2: 'Null',
      V3: 'XcmV3MultiassetAssetId',
    },
  },
  /**
   * Lookup486: pallet_xcm::pallet::RemoteLockedFungibleRecord<ConsumerIdentifier, MaxConsumers>
   **/
  PalletXcmRemoteLockedFungibleRecord: {
    amount: 'u128',
    owner: 'XcmVersionedMultiLocation',
    locker: 'XcmVersionedMultiLocation',
    consumers: 'Vec<(Null,u128)>',
  },
  /**
   * Lookup493: pallet_xcm::pallet::Error<T>
   **/
  PalletXcmError: {
    _enum: [
      'Unreachable',
      'SendFailure',
      'Filtered',
      'UnweighableMessage',
      'DestinationNotInvertible',
      'Empty',
      'CannotReanchor',
      'TooManyAssets',
      'InvalidOrigin',
      'BadVersion',
      'BadLocation',
      'NoSubscription',
      'AlreadySubscribed',
      'InvalidAsset',
      'LowBalance',
      'TooManyLocks',
      'AccountNotSovereign',
      'FeesNotMet',
      'LockNotFound',
      'InUse',
    ],
  },
  /**
   * Lookup494: cumulus_pallet_xcm::pallet::Error<T>
   **/
  CumulusPalletXcmError: 'Null',
  /**
   * Lookup495: cumulus_pallet_dmp_queue::ConfigData
   **/
  CumulusPalletDmpQueueConfigData: {
    maxIndividual: 'SpWeightsWeightV2Weight',
  },
  /**
   * Lookup496: cumulus_pallet_dmp_queue::PageIndexData
   **/
  CumulusPalletDmpQueuePageIndexData: {
    beginUsed: 'u32',
    endUsed: 'u32',
    overweightCount: 'u64',
  },
  /**
   * Lookup499: cumulus_pallet_dmp_queue::pallet::Error<T>
   **/
  CumulusPalletDmpQueueError: {
    _enum: ['Unknown', 'OverLimit'],
  },
  /**
   * Lookup500: pallet_xc_asset_config::pallet::Error<T>
   **/
  PalletXcAssetConfigError: {
    _enum: ['AssetAlreadyRegistered', 'AssetDoesNotExist', 'MultiLocationNotSupported'],
  },
  /**
   * Lookup501: orml_xtokens::module::Error<T>
   **/
  OrmlXtokensModuleError: {
    _enum: [
      'AssetHasNoReserve',
      'NotCrossChainTransfer',
      'InvalidDest',
      'NotCrossChainTransferableCurrency',
      'UnweighableMessage',
      'XcmExecutionFailed',
      'CannotReanchor',
      'InvalidAncestry',
      'InvalidAsset',
      'DestinationNotInvertible',
      'BadVersion',
      'DistinctReserveForAssetAndFee',
      'ZeroFee',
      'ZeroAmount',
      'TooManyAssetsBeingSent',
      'AssetIndexNonExistent',
      'FeeNotEnough',
      'NotSupportedMultiLocation',
      'MinXcmFeeNotDefined',
    ],
  },
  /**
   * Lookup502: pallet_evm::CodeMetadata
   **/
  PalletEvmCodeMetadata: {
    _alias: {
      size_: 'size',
      hash_: 'hash',
    },
    size_: 'u64',
    hash_: 'H256',
  },
  /**
   * Lookup504: pallet_evm::pallet::Error<T>
   **/
  PalletEvmError: {
    _enum: [
      'BalanceLow',
      'FeeOverflow',
      'PaymentOverflow',
      'WithdrawFailed',
      'GasPriceTooLow',
      'InvalidNonce',
      'GasLimitTooLow',
      'GasLimitTooHigh',
      'Undefined',
      'Reentrancy',
      'TransactionMustComeFromEOA',
    ],
  },
  /**
   * Lookup507: fp_rpc::TransactionStatus
   **/
  FpRpcTransactionStatus: {
    transactionHash: 'H256',
    transactionIndex: 'u32',
    from: 'H160',
    to: 'Option<H160>',
    contractAddress: 'Option<H160>',
    logs: 'Vec<EthereumLog>',
    logsBloom: 'EthbloomBloom',
  },
  /**
   * Lookup510: ethbloom::Bloom
   **/
  EthbloomBloom: '[u8;256]',
  /**
   * Lookup512: ethereum::receipt::ReceiptV3
   **/
  EthereumReceiptReceiptV3: {
    _enum: {
      Legacy: 'EthereumReceiptEip658ReceiptData',
      EIP2930: 'EthereumReceiptEip658ReceiptData',
      EIP1559: 'EthereumReceiptEip658ReceiptData',
    },
  },
  /**
   * Lookup513: ethereum::receipt::EIP658ReceiptData
   **/
  EthereumReceiptEip658ReceiptData: {
    statusCode: 'u8',
    usedGas: 'U256',
    logsBloom: 'EthbloomBloom',
    logs: 'Vec<EthereumLog>',
  },
  /**
   * Lookup514: ethereum::block::Block<ethereum::transaction::TransactionV2>
   **/
  EthereumBlock: {
    header: 'EthereumHeader',
    transactions: 'Vec<EthereumTransactionTransactionV2>',
    ommers: 'Vec<EthereumHeader>',
  },
  /**
   * Lookup515: ethereum::header::Header
   **/
  EthereumHeader: {
    parentHash: 'H256',
    ommersHash: 'H256',
    beneficiary: 'H160',
    stateRoot: 'H256',
    transactionsRoot: 'H256',
    receiptsRoot: 'H256',
    logsBloom: 'EthbloomBloom',
    difficulty: 'U256',
    number: 'U256',
    gasLimit: 'U256',
    gasUsed: 'U256',
    timestamp: 'u64',
    extraData: 'Bytes',
    mixHash: 'H256',
    nonce: 'EthereumTypesHashH64',
  },
  /**
   * Lookup516: ethereum_types::hash::H64
   **/
  EthereumTypesHashH64: '[u8;8]',
  /**
   * Lookup521: pallet_ethereum::pallet::Error<T>
   **/
  PalletEthereumError: {
    _enum: ['InvalidSignature', 'PreLogExists'],
  },
  /**
   * Lookup522: pallet_dynamic_evm_base_fee::pallet::Error<T>
   **/
  PalletDynamicEvmBaseFeeError: {
    _enum: ['ValueOutOfBounds'],
  },
  /**
   * Lookup523: pallet_unified_accounts::pallet::Error<T>
   **/
  PalletUnifiedAccountsError: {
    _enum: ['AlreadyMapped', 'UnexpectedSignatureFormat', 'InvalidSignature', 'FundsUnavailable'],
  },
  /**
   * Lookup525: pallet_contracts::wasm::PrefabWasmModule<T>
   **/
  PalletContractsWasmPrefabWasmModule: {
    instructionWeightsVersion: 'Compact<u32>',
    initial: 'Compact<u32>',
    maximum: 'Compact<u32>',
    code: 'Bytes',
    determinism: 'PalletContractsWasmDeterminism',
  },
  /**
   * Lookup527: pallet_contracts::wasm::OwnerInfo<T>
   **/
  PalletContractsWasmOwnerInfo: {
    owner: 'AccountId32',
    deposit: 'Compact<u128>',
    refcount: 'Compact<u64>',
  },
  /**
   * Lookup528: pallet_contracts::storage::ContractInfo<T>
   **/
  PalletContractsStorageContractInfo: {
    trieId: 'Bytes',
    depositAccount: 'AccountId32',
    codeHash: 'H256',
    storageBytes: 'u32',
    storageItems: 'u32',
    storageByteDeposit: 'u128',
    storageItemDeposit: 'u128',
    storageBaseDeposit: 'u128',
  },
  /**
   * Lookup530: pallet_contracts::storage::DeletionQueueManager<T>
   **/
  PalletContractsStorageDeletionQueueManager: {
    insertCounter: 'u32',
    deleteCounter: 'u32',
  },
  /**
   * Lookup532: pallet_contracts::schedule::Schedule<T>
   **/
  PalletContractsSchedule: {
    limits: 'PalletContractsScheduleLimits',
    instructionWeights: 'PalletContractsScheduleInstructionWeights',
    hostFnWeights: 'PalletContractsScheduleHostFnWeights',
  },
  /**
   * Lookup533: pallet_contracts::schedule::Limits
   **/
  PalletContractsScheduleLimits: {
    eventTopics: 'u32',
    globals: 'u32',
    locals: 'u32',
    parameters: 'u32',
    memoryPages: 'u32',
    tableSize: 'u32',
    brTableSize: 'u32',
    subjectLen: 'u32',
    payloadLen: 'u32',
    runtimeMemory: 'u32',
  },
  /**
   * Lookup534: pallet_contracts::schedule::InstructionWeights<T>
   **/
  PalletContractsScheduleInstructionWeights: {
    _alias: {
      r_if: 'r#if',
    },
    version: 'u32',
    fallback: 'u32',
    i64const: 'u32',
    i64load: 'u32',
    i64store: 'u32',
    select: 'u32',
    r_if: 'u32',
    br: 'u32',
    brIf: 'u32',
    brTable: 'u32',
    brTablePerEntry: 'u32',
    call: 'u32',
    callIndirect: 'u32',
    callPerLocal: 'u32',
    localGet: 'u32',
    localSet: 'u32',
    localTee: 'u32',
    globalGet: 'u32',
    globalSet: 'u32',
    memoryCurrent: 'u32',
    memoryGrow: 'u32',
    i64clz: 'u32',
    i64ctz: 'u32',
    i64popcnt: 'u32',
    i64eqz: 'u32',
    i64extendsi32: 'u32',
    i64extendui32: 'u32',
    i32wrapi64: 'u32',
    i64eq: 'u32',
    i64ne: 'u32',
    i64lts: 'u32',
    i64ltu: 'u32',
    i64gts: 'u32',
    i64gtu: 'u32',
    i64les: 'u32',
    i64leu: 'u32',
    i64ges: 'u32',
    i64geu: 'u32',
    i64add: 'u32',
    i64sub: 'u32',
    i64mul: 'u32',
    i64divs: 'u32',
    i64divu: 'u32',
    i64rems: 'u32',
    i64remu: 'u32',
    i64and: 'u32',
    i64or: 'u32',
    i64xor: 'u32',
    i64shl: 'u32',
    i64shrs: 'u32',
    i64shru: 'u32',
    i64rotl: 'u32',
    i64rotr: 'u32',
  },
  /**
   * Lookup535: pallet_contracts::schedule::HostFnWeights<T>
   **/
  PalletContractsScheduleHostFnWeights: {
    _alias: {
      r_return: 'r#return',
    },
    caller: 'SpWeightsWeightV2Weight',
    isContract: 'SpWeightsWeightV2Weight',
    codeHash: 'SpWeightsWeightV2Weight',
    ownCodeHash: 'SpWeightsWeightV2Weight',
    callerIsOrigin: 'SpWeightsWeightV2Weight',
    callerIsRoot: 'SpWeightsWeightV2Weight',
    address: 'SpWeightsWeightV2Weight',
    gasLeft: 'SpWeightsWeightV2Weight',
    balance: 'SpWeightsWeightV2Weight',
    valueTransferred: 'SpWeightsWeightV2Weight',
    minimumBalance: 'SpWeightsWeightV2Weight',
    blockNumber: 'SpWeightsWeightV2Weight',
    now: 'SpWeightsWeightV2Weight',
    weightToFee: 'SpWeightsWeightV2Weight',
    gas: 'SpWeightsWeightV2Weight',
    input: 'SpWeightsWeightV2Weight',
    inputPerByte: 'SpWeightsWeightV2Weight',
    r_return: 'SpWeightsWeightV2Weight',
    returnPerByte: 'SpWeightsWeightV2Weight',
    terminate: 'SpWeightsWeightV2Weight',
    random: 'SpWeightsWeightV2Weight',
    depositEvent: 'SpWeightsWeightV2Weight',
    depositEventPerTopic: 'SpWeightsWeightV2Weight',
    depositEventPerByte: 'SpWeightsWeightV2Weight',
    debugMessage: 'SpWeightsWeightV2Weight',
    debugMessagePerByte: 'SpWeightsWeightV2Weight',
    setStorage: 'SpWeightsWeightV2Weight',
    setStoragePerNewByte: 'SpWeightsWeightV2Weight',
    setStoragePerOldByte: 'SpWeightsWeightV2Weight',
    setCodeHash: 'SpWeightsWeightV2Weight',
    clearStorage: 'SpWeightsWeightV2Weight',
    clearStoragePerByte: 'SpWeightsWeightV2Weight',
    containsStorage: 'SpWeightsWeightV2Weight',
    containsStoragePerByte: 'SpWeightsWeightV2Weight',
    getStorage: 'SpWeightsWeightV2Weight',
    getStoragePerByte: 'SpWeightsWeightV2Weight',
    takeStorage: 'SpWeightsWeightV2Weight',
    takeStoragePerByte: 'SpWeightsWeightV2Weight',
    transfer: 'SpWeightsWeightV2Weight',
    call: 'SpWeightsWeightV2Weight',
    delegateCall: 'SpWeightsWeightV2Weight',
    callTransferSurcharge: 'SpWeightsWeightV2Weight',
    callPerClonedByte: 'SpWeightsWeightV2Weight',
    instantiate: 'SpWeightsWeightV2Weight',
    instantiateTransferSurcharge: 'SpWeightsWeightV2Weight',
    instantiatePerInputByte: 'SpWeightsWeightV2Weight',
    instantiatePerSaltByte: 'SpWeightsWeightV2Weight',
    hashSha2256: 'SpWeightsWeightV2Weight',
    hashSha2256PerByte: 'SpWeightsWeightV2Weight',
    hashKeccak256: 'SpWeightsWeightV2Weight',
    hashKeccak256PerByte: 'SpWeightsWeightV2Weight',
    hashBlake2256: 'SpWeightsWeightV2Weight',
    hashBlake2256PerByte: 'SpWeightsWeightV2Weight',
    hashBlake2128: 'SpWeightsWeightV2Weight',
    hashBlake2128PerByte: 'SpWeightsWeightV2Weight',
    ecdsaRecover: 'SpWeightsWeightV2Weight',
    ecdsaToEthAddress: 'SpWeightsWeightV2Weight',
    sr25519Verify: 'SpWeightsWeightV2Weight',
    sr25519VerifyPerByte: 'SpWeightsWeightV2Weight',
    reentranceCount: 'SpWeightsWeightV2Weight',
    accountReentranceCount: 'SpWeightsWeightV2Weight',
    instantiationNonce: 'SpWeightsWeightV2Weight',
  },
  /**
   * Lookup536: pallet_contracts::pallet::Error<T>
   **/
  PalletContractsError: {
    _enum: [
      'InvalidScheduleVersion',
      'InvalidCallFlags',
      'OutOfGas',
      'OutputBufferTooSmall',
      'TransferFailed',
      'MaxCallDepthReached',
      'ContractNotFound',
      'CodeTooLarge',
      'CodeNotFound',
      'OutOfBounds',
      'DecodingFailed',
      'ContractTrapped',
      'ValueTooLarge',
      'TerminatedWhileReentrant',
      'InputForwarded',
      'RandomSubjectTooLong',
      'TooManyTopics',
      'NoChainExtension',
      'DuplicateContract',
      'TerminatedInConstructor',
      'ReentranceDenied',
      'StorageDepositNotEnoughFunds',
      'StorageDepositLimitExhausted',
      'CodeInUse',
      'ContractReverted',
      'CodeRejected',
      'Indeterministic',
      'MigrationInProgress',
      'NoMigrationPerformed',
    ],
  },
  /**
   * Lookup541: pallet_democracy::types::ReferendumInfo<BlockNumber, frame_support::traits::preimages::Bounded<shibuya_runtime::RuntimeCall>, Balance>
   **/
  PalletDemocracyReferendumInfo: {
    _enum: {
      Ongoing: 'PalletDemocracyReferendumStatus',
      Finished: {
        approved: 'bool',
        end: 'u32',
      },
    },
  },
  /**
   * Lookup542: pallet_democracy::types::ReferendumStatus<BlockNumber, frame_support::traits::preimages::Bounded<shibuya_runtime::RuntimeCall>, Balance>
   **/
  PalletDemocracyReferendumStatus: {
    end: 'u32',
    proposal: 'FrameSupportPreimagesBounded',
    threshold: 'PalletDemocracyVoteThreshold',
    delay: 'u32',
    tally: 'PalletDemocracyTally',
  },
  /**
   * Lookup543: pallet_democracy::types::Tally<Balance>
   **/
  PalletDemocracyTally: {
    ayes: 'u128',
    nays: 'u128',
    turnout: 'u128',
  },
  /**
   * Lookup544: pallet_democracy::vote::Voting<Balance, sp_core::crypto::AccountId32, BlockNumber, MaxVotes>
   **/
  PalletDemocracyVoteVoting: {
    _enum: {
      Direct: {
        votes: 'Vec<(u32,PalletDemocracyVoteAccountVote)>',
        delegations: 'PalletDemocracyDelegations',
        prior: 'PalletDemocracyVotePriorLock',
      },
      Delegating: {
        balance: 'u128',
        target: 'AccountId32',
        conviction: 'PalletDemocracyConviction',
        delegations: 'PalletDemocracyDelegations',
        prior: 'PalletDemocracyVotePriorLock',
      },
    },
  },
  /**
   * Lookup548: pallet_democracy::types::Delegations<Balance>
   **/
  PalletDemocracyDelegations: {
    votes: 'u128',
    capital: 'u128',
  },
  /**
   * Lookup549: pallet_democracy::vote::PriorLock<BlockNumber, Balance>
   **/
  PalletDemocracyVotePriorLock: '(u32,u128)',
  /**
   * Lookup552: pallet_democracy::pallet::Error<T>
   **/
  PalletDemocracyError: {
    _enum: [
      'ValueLow',
      'ProposalMissing',
      'AlreadyCanceled',
      'DuplicateProposal',
      'ProposalBlacklisted',
      'NotSimpleMajority',
      'InvalidHash',
      'NoProposal',
      'AlreadyVetoed',
      'ReferendumInvalid',
      'NoneWaiting',
      'NotVoter',
      'NoPermission',
      'AlreadyDelegating',
      'InsufficientFunds',
      'NotDelegating',
      'VotesExist',
      'InstantNotAllowed',
      'Nonsense',
      'WrongUpperBound',
      'MaxVotesReached',
      'TooMany',
      'VotingPeriodLow',
      'PreimageNotExist',
    ],
  },
  /**
   * Lookup554: pallet_collective::Votes<sp_core::crypto::AccountId32, BlockNumber>
   **/
  PalletCollectiveVotes: {
    index: 'u32',
    threshold: 'u32',
    ayes: 'Vec<AccountId32>',
    nays: 'Vec<AccountId32>',
    end: 'u32',
  },
  /**
   * Lookup555: pallet_collective::pallet::Error<T, I>
   **/
  PalletCollectiveError: {
    _enum: [
      'NotMember',
      'DuplicateProposal',
      'ProposalMissing',
      'WrongIndex',
      'DuplicateVote',
      'AlreadyInitialized',
      'TooEarly',
      'TooManyProposals',
      'WrongProposalWeight',
      'WrongProposalLength',
    ],
  },
  /**
   * Lookup557: pallet_treasury::Proposal<sp_core::crypto::AccountId32, Balance>
   **/
  PalletTreasuryProposal: {
    proposer: 'AccountId32',
    value: 'u128',
    beneficiary: 'AccountId32',
    bond: 'u128',
  },
  /**
   * Lookup560: frame_support::PalletId
   **/
  FrameSupportPalletId: '[u8;8]',
  /**
   * Lookup561: pallet_treasury::pallet::Error<T, I>
   **/
  PalletTreasuryError: {
    _enum: [
      'InsufficientProposersBalance',
      'InvalidIndex',
      'TooManyApprovals',
      'InsufficientPermission',
      'ProposalNotApproved',
    ],
  },
  /**
   * Lookup562: pallet_preimage::RequestStatus<sp_core::crypto::AccountId32, Balance>
   **/
  PalletPreimageRequestStatus: {
    _enum: {
      Unrequested: {
        deposit: '(AccountId32,u128)',
        len: 'u32',
      },
      Requested: {
        deposit: 'Option<(AccountId32,u128)>',
        count: 'u32',
        len: 'Option<u32>',
      },
    },
  },
  /**
   * Lookup567: pallet_preimage::pallet::Error<T>
   **/
  PalletPreimageError: {
    _enum: ['TooBig', 'AlreadyNoted', 'NotAuthorized', 'NotNoted', 'Requested', 'NotRequested'],
  },
  /**
   * Lookup568: pallet_sudo::pallet::Error<T>
   **/
  PalletSudoError: {
    _enum: ['RequireSudo'],
  },
  /**
   * Lookup569: pallet_static_price_provider::pallet::Error<T>
   **/
  PalletStaticPriceProviderError: {
    _enum: ['ZeroPrice'],
  },
  /**
   * Lookup571: sp_runtime::MultiSignature
   **/
  SpRuntimeMultiSignature: {
    _enum: {
      Ed25519: 'SpCoreEd25519Signature',
      Sr25519: 'SpCoreSr25519Signature',
      Ecdsa: 'SpCoreEcdsaSignature',
    },
  },
  /**
   * Lookup572: sp_core::ed25519::Signature
   **/
  SpCoreEd25519Signature: '[u8;64]',
  /**
   * Lookup574: sp_core::sr25519::Signature
   **/
  SpCoreSr25519Signature: '[u8;64]',
  /**
   * Lookup575: sp_core::ecdsa::Signature
   **/
  SpCoreEcdsaSignature: '[u8;65]',
  /**
   * Lookup577: frame_system::extensions::check_spec_version::CheckSpecVersion<T>
   **/
  FrameSystemExtensionsCheckSpecVersion: 'Null',
  /**
   * Lookup578: frame_system::extensions::check_tx_version::CheckTxVersion<T>
   **/
  FrameSystemExtensionsCheckTxVersion: 'Null',
  /**
   * Lookup579: frame_system::extensions::check_genesis::CheckGenesis<T>
   **/
  FrameSystemExtensionsCheckGenesis: 'Null',
  /**
   * Lookup582: frame_system::extensions::check_nonce::CheckNonce<T>
   **/
  FrameSystemExtensionsCheckNonce: 'Compact<u32>',
  /**
   * Lookup583: frame_system::extensions::check_weight::CheckWeight<T>
   **/
  FrameSystemExtensionsCheckWeight: 'Null',
  /**
   * Lookup584: pallet_transaction_payment::ChargeTransactionPayment<T>
   **/
  PalletTransactionPaymentChargeTransactionPayment: 'Compact<u128>',
}
