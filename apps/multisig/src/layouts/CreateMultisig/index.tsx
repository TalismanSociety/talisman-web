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
import { css } from '@emotion/css'
import { Address, toMultisigAddress } from '@util/addresses'
import { device } from '@util/breakpoints'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'

import AddMembers from './AddMembers'
import Confirmation from './Confirmation'
import NameVault from './NameVault'
import SelectFirstChain from './SelectFirstChain'
import SelectThreshold from './SelectThreshold'
import SignTransactions from './SignTransactions'
import { Layout } from '../Layout'
import { selectedAccountState } from '@domains/auth'
import { useCreateTeamOnHasura } from '../../domains/offchain-data'

export enum CreateTransactionsStatus {
  NotStarted,
  CreatingProxy,
  TransferringProxy,
}

export enum Step {
  NameVault,
  AddMembers,
  SelectThreshold,
  SelectFirstChain,
  Confirmation,
  Transactions,
  VaultCreated,
}

function calcContentHeight(step: Step, nAccounts: number): { md: string; lg: string } {
  if (step === Step.SelectThreshold) return { md: '518px', lg: '518px' }
  if (step === Step.NameVault) return { md: '429px', lg: '461px' }
  if (step === Step.SelectFirstChain) return { md: '400px', lg: '461px' }
  if (step === Step.Transactions) return { md: '420px', lg: '420px' }
  if (step === Step.VaultCreated) return { md: '485px', lg: '485px' }
  if (step === Step.AddMembers) return { md: 521 + nAccounts * 40 + 'px', lg: 521 + nAccounts * 40 + 'px' }
  return { md: 787 + nAccounts * 40 + 'px', lg: 767 + nAccounts * 40 + 'px' }
}

const CreateMultisig = () => {
  let firstChain = supportedChains[0]
  if (!firstChain) throw Error('no supported chains')
  const [createTransctionStatus, setCreateTransactionsStatus] = useState<CreateTransactionsStatus>(
    CreateTransactionsStatus.NotStarted
  )
  const [name, setName] = useState<string>('')
  const [chain, setChain] = useState<Chain>(firstChain)
  const [externalAccounts, setExternalAccounts] = useState<Address[]>([])
  const [extensionAccounts] = useRecoilState(accountsState)
  const selectedSigner = useRecoilValue(selectedAccountState)
  const [excludedExtensionAccounts, setExcludedExtensionAccounts] = useState<Record<string, boolean>>({})
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

  // Fade-in effect
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const augmentedAccounts: AugmentedAccount[] = useMemo(
    () => [
      ...extensionAccounts.map(a => ({
        address: a.address,
        nickname: a.meta.name,
        you: true,
        excluded: excludedExtensionAccounts[a.address.toPubKey()],
        injected: a,
      })),
      ...externalAccounts.map(a => ({ address: a })),
    ],
    [excludedExtensionAccounts, extensionAccounts, externalAccounts]
  )

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

  useEffect(() => {
    if (!selectedSigner) return

    const selectedAugmentedAccount = selectedSigner
      ? augmentedAccounts.find(a => a.address.isEqual(selectedSigner.injected.address))
      : undefined

    if (selectedAugmentedAccount?.excluded) {
      setExcludedExtensionAccounts(prev => ({
        ...prev,
        [selectedSigner.injected.address.toPubKey()]: false,
      }))
    }
  }, [augmentedAccounts, selectedSigner])

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

  const contentHeight = calcContentHeight(step, augmentedAccounts.length)
  return (
    <Layout hideSideBar>
      <div
        className={css`
          display: grid;
          justify-items: center;
          align-content: center;
          margin: 50px auto;
          height: ${contentHeight.md};
          width: 586px;
          background: var(--color-backgroundSecondary);
          border-radius: 24px;
          transition: height 0.3s ease-in-out, margin-top 0.3s ease-in-out, opacity 0.3s ease-in-out;
          opacity: ${isVisible ? 1 : 0};
          @media ${device.lg} {
            height: ${contentHeight.lg};
            width: 863px;
          }
        `}
      >
        {step === Step.NameVault ? (
          <NameVault
            onBack={() => navigate('/overview')}
            onNext={() => setStep(Step.AddMembers)}
            setName={setName}
            name={name}
          />
        ) : step === Step.AddMembers ? (
          <AddMembers
            onBack={() => setStep(Step.NameVault)}
            onNext={() => setStep(Step.SelectThreshold)}
            setExternalAccounts={setExternalAccounts}
            setExcludeExtensionAccounts={setExcludedExtensionAccounts}
            augmentedAccounts={augmentedAccounts}
            externalAccounts={externalAccounts}
            chain={chain}
          />
        ) : step === Step.SelectThreshold ? (
          <SelectThreshold
            onBack={() => setStep(Step.AddMembers)}
            onNext={() => setStep(Step.SelectFirstChain)}
            setThreshold={setThreshold}
            threshold={threshold}
            max={includedAccounts.length}
          />
        ) : step === Step.SelectFirstChain ? (
          <SelectFirstChain
            onBack={() => setStep(Step.SelectThreshold)}
            onNext={() => setStep(Step.Confirmation)}
            setChain={setChain}
            chain={chain}
            chains={supportedChains}
          />
        ) : step === Step.Confirmation ? (
          <Confirmation
            onBack={() => setStep(Step.SelectFirstChain)}
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
      </div>
    </Layout>
  )
}

export default CreateMultisig
