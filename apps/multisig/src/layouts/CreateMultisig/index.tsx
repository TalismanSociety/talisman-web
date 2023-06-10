import Logo from '@components/Logo'
import { Chain, supportedChains, tokenByIdWithPrice } from '@domains/chains'
import { InjectedAccount, accountsState } from '@domains/extension'
import { createProxy, transferProxyToMultisig } from '@domains/extension/extrinsics'
import { AugmentedAccount, activeMultisigsState } from '@domains/multisig'
import { css } from '@emotion/css'
import { createKeyMulti, encodeAddress, sortAddresses } from '@polkadot/util-crypto'
import { device } from '@util/breakpoints'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'

import AddMembers from './AddMembers'
import Confirmation from './Confirmation'
import NameVault from './NameVault'
import NoVault from './NoVault'
import SelectFirstChain from './SelectFirstChain'
import SelectThreshold from './SelectThreshold'
import SignTransactions from './SignTransactions'
import VaultCreated from './VaultCreated'

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
  return { md: 741 + nAccounts * 40 + 'px', lg: 721 + nAccounts * 40 + 'px' }
}

const CreateMultisig = () => {
  let firstChain = supportedChains[0]
  if (!firstChain) throw Error('no supported chains')
  const [createTransctionStatus, setCreateTransactionsStatus] = useState<CreateTransactionsStatus>(
    CreateTransactionsStatus.NotStarted
  )
  const [name, setName] = useState<string>('')
  const [chain, setChain] = useState<Chain>(firstChain)
  const [externalAccounts, setExternalAccounts] = useState<string[]>([])
  const [extensionAccounts] = useRecoilState(accountsState)
  const [selectedSigner, setSelectedSigner] = useState<InjectedAccount>(extensionAccounts[0] as InjectedAccount)
  const [threshold, setThreshold] = useState<number>(2)
  const tokenWithPrice = useRecoilValueLoadable(tokenByIdWithPrice(chain.nativeToken.id))
  const [proxyAddress, setProxyAddress] = useState<string | undefined>()
  // TODO: replace this with a query once lib is avail
  const reserveAmount = '20041000000000'
  const reserveAmountNumber = 20.041
  const fee = 0.0125628761

  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(Step.NoVault)
  const skipNoVault = window.location.href.includes('skipNoVault')

  // Redirect to landing if user disconnects all accounts
  useEffect(() => {
    if (extensionAccounts.length === 0) {
      navigate('/')
    }
  })

  const activeMultisigs = useRecoilValue(activeMultisigsState)
  useEffect(() => {
    if (step === Step.NoVault) {
      // If there is skipNoVault in the url, skip the NoVault page
      if (skipNoVault) {
        setStep(Step.NameVault)
        return
      }

      // If user connects an active multisig, redirect to overview
      if (activeMultisigs.length > 0) {
        navigate('/overview')
      }
    }
  }, [activeMultisigs, navigate, step, skipNoVault])

  // Fade-in effect
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const augmentedAccounts: AugmentedAccount[] = useMemo(() => {
    // TODO allow 'deselecting' extension accounts in the creation phase
    return [
      ...extensionAccounts.map(a => ({
        address: a.address,
        nickname: a.name,
        you: true,
      })),
      ...externalAccounts.map(a => ({ address: a })),
    ]
  }, [extensionAccounts, externalAccounts])

  useEffect(() => {
    if (step === Step.Transactions && createTransctionStatus === CreateTransactionsStatus.NotStarted) {
      createProxy(
        selectedSigner.address,
        chain,
        proxyAddress => {
          setProxyAddress(proxyAddress)
          setCreateTransactionsStatus(CreateTransactionsStatus.TransferringProxy)
          // Address as a byte array.
          const multiAddressBytes = createKeyMulti(sortAddresses(augmentedAccounts.map(a => a.address)), threshold)
          // Convert byte array to SS58 encoding.
          const multiAddress = encodeAddress(multiAddressBytes, 0)
          console.log({ multiAddress })
          transferProxyToMultisig(
            selectedSigner.address,
            chain,
            proxyAddress,
            multiAddress,
            reserveAmount,
            success => {
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
        e => {
          console.error(e)
          toast.error(e)
          setStep(Step.Confirmation)
          setCreateTransactionsStatus(CreateTransactionsStatus.NotStarted)
        }
      )
      setCreateTransactionsStatus(CreateTransactionsStatus.CreatingProxy)
    }
  }, [createTransctionStatus, step, selectedSigner?.address, chain, augmentedAccounts, threshold])

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
            onBack={activeMultisigs.length === 0 && !skipNoVault ? () => setStep(Step.NoVault) : undefined}
            onNext={() => setStep(Step.AddMembers)}
            setName={setName}
            name={name}
          />
        ) : step === Step.AddMembers ? (
          <AddMembers
            onBack={() => setStep(Step.NameVault)}
            onNext={() => setStep(Step.SelectThreshold)}
            setExternalAccounts={setExternalAccounts}
            augmentedAccounts={augmentedAccounts}
            externalAccounts={externalAccounts}
          />
        ) : step === Step.SelectThreshold ? (
          <SelectThreshold
            onBack={() => setStep(Step.AddMembers)}
            onNext={() => setStep(Step.SelectFirstChain)}
            setThreshold={setThreshold}
            threshold={threshold}
            max={augmentedAccounts.length}
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
            selectedSigner={selectedSigner}
            setSelectedSigner={setSelectedSigner}
            augmentedAccounts={augmentedAccounts}
            threshold={threshold}
            name={name}
            chain={chain}
            reserveAmount={reserveAmountNumber}
            fee={fee}
            tokenWithPrice={tokenWithPrice}
          />
        ) : step === Step.Transactions ? (
          <SignTransactions status={createTransctionStatus} />
        ) : step === Step.VaultCreated ? (
          <VaultCreated goToVault={() => navigate('/overview')} proxyAccount={proxyAddress as string} name={name} />
        ) : null}
      </div>
    </div>
  )
}

export default CreateMultisig
