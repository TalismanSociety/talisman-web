import { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'

import { selectedAccountState } from '@domains/auth'
import {
  Chain,
  existentialDepositSelector,
  filteredSupportedChains,
  proxyDepositTotalSelector,
  tokenByIdWithPrice,
} from '@domains/chains'
import { useCreateProxy, useTransferProxyToMultisig } from '@domains/chains/extrinsics'
import { useCreateTeamOnHasura } from '@domains/offchain-data'
import { useAddressIsProxyDelegatee } from '@domains/chains/storage-getters'
import { toMultisigAddress } from '@util/addresses'

import Confirmation from '../common/Confirmation'
import NameVault from '../common/NameVault'
import SelectChain from '../common/SelectChain'
import SignTransactions from './SignTransactions'
import { MultisigConfig } from '../MultisigConfig'
import { useAugmentedAccounts } from '../common/useAugmentedAccounts'

export enum CreateTransactionsStatus {
  NotStarted,
  CreatingProxy,
  TransferringProxy,
}

export enum Step {
  NameVault,
  SelectFirstChain,
  MultisigConfig,
  Confirmation,
  Transactions,
}

const CreateMultisig = () => {
  let firstChain = filteredSupportedChains[0]
  if (!firstChain) throw Error('no supported chains')

  const navigate = useNavigate()
  const [step, setStep] = useState(Step.NameVault)
  const [status, setStatus] = useState(CreateTransactionsStatus.NotStarted)
  const [name, setName] = useState<string>('')
  const [chain, setChain] = useState<Chain>(firstChain)
  const [threshold, setThreshold] = useState<number>(2)

  const selectedSigner = useRecoilValue(selectedAccountState)
  const tokenWithPrice = useRecoilValueLoadable(tokenByIdWithPrice(chain.nativeToken.id))
  const existentialDepositLoadable = useRecoilValueLoadable(existentialDepositSelector(chain.squidIds.chainData))
  const proxyDepositTotalLoadable = useRecoilValueLoadable(proxyDepositTotalSelector(chain.squidIds.chainData))

  const { addressIsProxyDelegatee } = useAddressIsProxyDelegatee(chain)
  const { augmentedAccounts, setAddedAccounts } = useAugmentedAccounts()
  const {
    createProxy,
    ready: createProxyIsReady,
    estimatedFee,
  } = useCreateProxy(chain, selectedSigner?.injected.address)
  const { createTeam } = useCreateTeamOnHasura()
  const { transferProxyToMultisig, ready: transferProxyToMultisigIsReady } = useTransferProxyToMultisig(chain)

  // Address as a byte array.
  const multisigAddress = useMemo(
    () =>
      toMultisigAddress(
        augmentedAccounts.map(a => a.address),
        threshold
      ),
    [augmentedAccounts, threshold]
  )

  const handleCreateVault = () => {
    setStep(Step.Transactions)
    setStatus(CreateTransactionsStatus.CreatingProxy)
    createProxy({
      onSuccess: proxyAddress => {
        setStatus(CreateTransactionsStatus.TransferringProxy)
        transferProxyToMultisig(
          selectedSigner?.injected.address,
          proxyAddress,
          multisigAddress,
          existentialDepositLoadable.contents,
          async _ => {
            const { isProxyDelegatee } = await addressIsProxyDelegatee(proxyAddress, multisigAddress)

            if (!isProxyDelegatee) {
              const msg =
                'There was an issue configuring your proxy. Please submit a bug report with your signer address and any relevant transaction hashes.'
              console.error(msg)
              toast.error(msg)
              setStep(Step.Confirmation)
              return
            }

            const { team, error } = await createTeam({
              name,
              chain: chain.squidIds.chainData,
              multisigConfig: { signers: augmentedAccounts.map(a => a.address.toSs58()), threshold },
              proxiedAddress: proxyAddress.toSs58(),
            })

            if (!team || error) throw Error(error)
            // vault created! `createTeam` will handle adding the team to the cache
            // go to overview to check the newly created vault
            navigate('/overview')
          },
          e => {
            console.error(e)
            toast.error(e)
            setStep(Step.Confirmation)
            setStatus(CreateTransactionsStatus.NotStarted)
          }
        )
      },
      onFailure: e => {
        console.error(e)
        toast.error(e)
        setStep(Step.Confirmation)
        setStatus(CreateTransactionsStatus.NotStarted)
      },
    })
  }

  return (
    <>
      {step === Step.NameVault ? (
        <NameVault
          onBack={() => navigate('/add-vault')}
          onNext={() => setStep(Step.SelectFirstChain)}
          setName={setName}
          name={name}
        />
      ) : step === Step.SelectFirstChain ? (
        <SelectChain
          onBack={() => setStep(Step.NameVault)}
          onNext={() => setStep(Step.MultisigConfig)}
          setChain={setChain}
          chain={chain}
          chains={filteredSupportedChains}
        />
      ) : step === Step.MultisigConfig ? (
        <MultisigConfig
          chain={chain}
          threshold={threshold}
          onThresholdChange={setThreshold}
          onBack={() => setStep(Step.SelectFirstChain)}
          onNext={() => setStep(Step.Confirmation)}
          members={augmentedAccounts}
          onMembersChange={setAddedAccounts}
        />
      ) : step === Step.Confirmation ? (
        <Confirmation
          onBack={() => setStep(Step.MultisigConfig)}
          onCreateVault={handleCreateVault}
          selectedAccounts={augmentedAccounts}
          threshold={threshold}
          name={name}
          chain={chain}
          reserveAmount={proxyDepositTotalLoadable}
          estimatedFee={estimatedFee}
          tokenWithPrice={tokenWithPrice}
          extrinsicsReady={transferProxyToMultisigIsReady && createProxyIsReady}
          existentialDeposit={existentialDepositLoadable}
        />
      ) : step === Step.Transactions ? (
        <SignTransactions status={status} />
      ) : null}
    </>
  )
}

export default CreateMultisig
