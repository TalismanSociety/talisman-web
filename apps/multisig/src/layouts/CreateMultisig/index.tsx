import Logo from '@components/Logo'
import {
  Chain,
  existentialDepositSelector,
  proxyDepositTotalSelector,
  supportedChains,
  tokenByIdWithPrice,
} from '@domains/chains'
import { useCreateProxy, useTransferProxyToMultisig } from '@domains/chains/extrinsics'
import { useAddressIsProxyDelegatee } from '@domains/chains/storage-getters'
import { InjectedAccount, accountsState } from '@domains/extension'
import {
  AugmentedAccount,
  Multisig,
  activeMultisigsState,
  createImportPath,
  multisigsState,
  selectedMultisigState,
} from '@domains/multisig'
import { css } from '@emotion/css'
import { Address, toMultisigAddress } from '@util/addresses'
import { device } from '@util/breakpoints'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil'

import AddMembers from './AddMembers'
import Confirmation from './Confirmation'
import NameVault from './NameVault'
import NoVault from './NoVault'
import SelectFirstChain from './SelectFirstChain'
import SelectThreshold from './SelectThreshold'
import SignTransactions from './SignTransactions'
import VaultCreated from './VaultCreated'

const useSelectedSigner = () => {
  const [extensionAccounts] = useRecoilState(accountsState)
  const [selectedSigner, setSelectedSigner] = useState<InjectedAccount | undefined>(extensionAccounts[0])

  // Ensure selected signer gets set if it is disconnected
  useEffect(() => {
    if (
      !extensionAccounts.map(a => a.address).some(a => selectedSigner?.address && a.isEqual(selectedSigner.address))
    ) {
      setSelectedSigner(extensionAccounts[0])
    }
  }, [selectedSigner, extensionAccounts])

  return [selectedSigner, setSelectedSigner] as const
}

export enum CreateTransactionsStatus {
  NotStarted,
  CreatingProxy,
  TransferringProxy,
}

export enum Step {
  NoVault,
  NameVault,
  AddMembers,
  SelectThreshold,
  SelectFirstChain,
  Confirmation,
  Transactions,
  VaultCreated,
}

function calcContentHeight(step: Step, nAccounts: number): { md: string; lg: string } {
  if (step === Step.NoVault) return { md: '557px', lg: '601px' }
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
  const [multisigs, setMultisigs] = useRecoilState(multisigsState)
  const setSelectedMultisig = useSetRecoilState(selectedMultisigState)
  const [extensionAccounts] = useRecoilState(accountsState)
  const [selectedSigner, setSelectedSigner] = useSelectedSigner()
  const [excludedExtensionAccounts, setExcludedExtensionAccounts] = useState<Record<string, boolean>>({})
  const { createProxy, ready: createProxyIsReady, estimatedFee } = useCreateProxy(chain, selectedSigner?.address)
  const { transferProxyToMultisig, ready: transferProxyToMultisigIsReady } = useTransferProxyToMultisig(chain)
  const [threshold, setThreshold] = useState<number>(2)
  const tokenWithPrice = useRecoilValueLoadable(tokenByIdWithPrice(chain.nativeToken.id))
  const [proxyAddress, setProxyAddress] = useState<Address | undefined>()
  const existentialDepositLoadable = useRecoilValueLoadable(existentialDepositSelector(chain.squidIds.chainData))
  const proxyDepositTotalLoadable = useRecoilValueLoadable(proxyDepositTotalSelector(chain.squidIds.chainData))
  const { addressIsProxyDelegatee } = useAddressIsProxyDelegatee(chain)
  const activeMultisigs = useRecoilValue(activeMultisigsState)

  const navigate = useNavigate()

  const hasVault = activeMultisigs.length > 0
  const [step, setStep] = useState<Step>(hasVault ? Step.NameVault : Step.NoVault)

  useEffect(() => {
    if (step === Step.NoVault && hasVault) {
      navigate('/overview')
    }
  }, [step, hasVault, navigate])

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
    if (step === Step.Transactions && createTransctionStatus === CreateTransactionsStatus.NotStarted) {
      createProxy({
        onSuccess: proxyAddress => {
          setProxyAddress(proxyAddress)
          setCreateTransactionsStatus(CreateTransactionsStatus.TransferringProxy)
          transferProxyToMultisig(
            selectedSigner?.address,
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

              // Woohoo!
              const multisig: Multisig = {
                name,
                chain,
                multisigAddress,
                proxyAddress,
                signers: includedAccounts.map(a => a.address),
                threshold,
              }
              setMultisigs([...multisigs, multisig])
              setSelectedMultisig(multisig)
              setStep(Step.VaultCreated)
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
      setCreateTransactionsStatus(CreateTransactionsStatus.CreatingProxy)
    }
  }, [
    addressIsProxyDelegatee,
    chain,
    createProxy,
    createTransctionStatus,
    existentialDepositLoadable.contents,
    includedAccounts,
    multisigAddress,
    multisigs,
    name,
    selectedSigner?.address,
    setMultisigs,
    setSelectedMultisig,
    step,
    threshold,
    transferProxyToMultisig,
  ])

  // TODO: if wallet has vaults already skip the no_vault and display an 'x'

  const contentHeight = calcContentHeight(step, augmentedAccounts.length)
  return (
    <div
      className={css`
        display: grid;
        justify-items: center;
        min-height: 100vh;
      `}
    >
      <header>
        <Logo
          className={css`
            display: ${step === Step.Confirmation ? 'none' : 'block'};
            margin-top: 25px;
            width: 133px;
          `}
        />
      </header>
      <div
        className={css`
          display: grid;
          justify-items: center;
          align-content: center;
          margin: 50px 0;
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
        {step === Step.NoVault ? (
          <NoVault onCreate={() => setStep(Step.NameVault)} />
        ) : step === Step.NameVault ? (
          <NameVault
            onBack={() => {
              if (activeMultisigs.length > 0 && !hasVault) {
                setStep(Step.NoVault)
              } else {
                navigate('/overview')
              }
            }}
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
            onCreateVault={() => setStep(Step.Transactions)}
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

              // we're good! import
              const path = createImportPath(
                name,
                includedAccounts.map(a => a.address),
                threshold,
                proxyAddress,
                chain
              )
              navigate(`/${path}`)
            }}
            selectedSigner={selectedSigner}
            setSelectedSigner={setSelectedSigner}
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
        ) : step === Step.VaultCreated ? (
          <VaultCreated
            goToVault={() => navigate('/overview')}
            proxy={proxyAddress as Address}
            name={name}
            threshold={threshold}
            signers={includedAccounts.map(a => a.address)}
            chain={chain}
          />
        ) : null}
      </div>
    </div>
  )
}

export default CreateMultisig
