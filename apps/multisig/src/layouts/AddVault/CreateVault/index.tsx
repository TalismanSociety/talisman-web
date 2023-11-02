import {
  Chain,
  existentialDepositSelector,
  proxyDepositTotalSelector,
  supportedChains,
  tokenByIdWithPrice,
} from '@domains/chains'
import { useCreateProxy, useTransferProxyToMultisig } from '@domains/chains/extrinsics'
import { useAddressIsProxyDelegatee } from '@domains/chains/storage-getters'
import { accountsState } from '@domains/extension'
import { AugmentedAccount } from '@domains/multisig'
import { Address, toMultisigAddress } from '@util/addresses'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'

import Confirmation from '../common/Confirmation'
import NameVault from '../common/NameVault'
import SelectChain from '../common/SelectChain'
import SignTransactions from './SignTransactions'
import { selectedAccountState } from '@domains/auth'
import { useCreateTeamOnHasura } from '../../../domains/offchain-data'
import { MultisigConfig } from '../MultisigConfig'

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
  VaultCreated,
}

const CreateMultisig = () => {
  let firstChain = supportedChains[0]
  if (!firstChain) throw Error('no supported chains')
  const [createTransctionStatus, setCreateTransactionsStatus] = useState<CreateTransactionsStatus>(
    CreateTransactionsStatus.NotStarted
  )
  const [name, setName] = useState<string>('')
  const [chain, setChain] = useState<Chain>(firstChain)
  const [addedAccounts, setAddedAccounts] = useState<Address[]>([])
  const [extensionAccounts] = useRecoilState(accountsState)
  const selectedSigner = useRecoilValue(selectedAccountState)
  const {
    createProxy,
    ready: createProxyIsReady,
    estimatedFee,
  } = useCreateProxy(chain, selectedSigner?.injected.address)
  const { transferProxyToMultisig, ready: transferProxyToMultisigIsReady } = useTransferProxyToMultisig(chain)
  const [threshold, setThreshold] = useState<number>(2)
  const tokenWithPrice = useRecoilValueLoadable(tokenByIdWithPrice(chain.nativeToken.id))
  const existentialDepositLoadable = useRecoilValueLoadable(existentialDepositSelector(chain.squidIds.chainData))
  const proxyDepositTotalLoadable = useRecoilValueLoadable(proxyDepositTotalSelector(chain.squidIds.chainData))
  const { addressIsProxyDelegatee } = useAddressIsProxyDelegatee(chain)
  const { createTeam } = useCreateTeamOnHasura()

  const navigate = useNavigate()

  const [step, setStep] = useState(Step.NameVault)

  const augmentedAccounts: AugmentedAccount[] = useMemo(() => {
    const augmentedAddedAccounts = addedAccounts.map(a => {
      const extensionAccount = extensionAccounts.find(ea => ea.address.isEqual(a))
      if (!extensionAccount) return { address: a }
      return {
        address: a,
        nickname: extensionAccount.meta.name,
        you: true,
        injected: extensionAccount,
      }
    })

    return selectedSigner
      ? [
          {
            address: selectedSigner.injected.address,
            nickname: selectedSigner.injected.meta.name,
            you: true,
            injected: selectedSigner.injected,
          },
          ...augmentedAddedAccounts,
        ]
      : augmentedAddedAccounts
  }, [addedAccounts, extensionAccounts, selectedSigner])

  const includedAccounts = useMemo(() => augmentedAccounts.filter(a => !a.excluded), [augmentedAccounts])

  // Address as a byte array.
  const multisigAddress = useMemo(
    () =>
      toMultisigAddress(
        includedAccounts.map(a => a.address),
        threshold
      ),
    [includedAccounts, threshold]
  )

  // remove selected signer from addedAcounts list to prevent duplicate
  useEffect(() => {
    if (!selectedSigner) return

    const selectedSignerIndex = addedAccounts.findIndex(a => a.isEqual(selectedSigner.injected.address))
    if (selectedSignerIndex === -1) return

    setAddedAccounts(addedAccounts => {
      const newAddedAccounts = [...addedAccounts]
      newAddedAccounts.splice(selectedSignerIndex, 1)
      return newAddedAccounts
    })
  }, [addedAccounts, augmentedAccounts, selectedSigner])

  const handleCreateVault = () => {
    setStep(Step.Transactions)
    setCreateTransactionsStatus(CreateTransactionsStatus.CreatingProxy)
    createProxy({
      onSuccess: proxyAddress => {
        setCreateTransactionsStatus(CreateTransactionsStatus.TransferringProxy)
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
              multisigConfig: { signers: includedAccounts.map(a => a.address.toSs58()), threshold },
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
            setCreateTransactionsStatus(CreateTransactionsStatus.NotStarted)
          }
        )
      },
      onFailure: e => {
        console.error(e)
        toast.error(e)
        setStep(Step.Confirmation)
        setCreateTransactionsStatus(CreateTransactionsStatus.NotStarted)
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
          chains={supportedChains}
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
          onAlreadyHaveAnyProxy={async () => {
            const proxyAddressInput = prompt('Enter proxy address')
            if (!proxyAddressInput) return

            // validate the proxy address
            const proxyAddress = Address.fromSs58(proxyAddressInput)
            if (!proxyAddress) {
              toast.error('Please enter a valid SS58 address')
              return
            }

            // check if the multisig controls the proxy
            const res = await addressIsProxyDelegatee(proxyAddress, multisigAddress)
            if (!res.isProxyDelegatee) {
              toast.error("This multisig configuration is not an 'Any' delegatee for the entered address.")
              return
            }

            const { team, error } = await createTeam({
              name,
              chain: chain.squidIds.chainData,
              multisigConfig: { signers: includedAccounts.map(a => a.address.toSs58()), threshold },
              proxiedAddress: proxyAddress.toSs58(),
            })

            if (!team || error) {
              toast.error(error ?? 'Failed to import vault, please try again later.')
              return
            }
            navigate(`/overview`)
          }}
          selectedAccounts={includedAccounts}
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
        <SignTransactions status={createTransctionStatus} />
      ) : null}
    </>
  )
}

export default CreateMultisig
