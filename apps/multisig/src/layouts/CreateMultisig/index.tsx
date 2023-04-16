import Logo from '@components/Logo'
import { css } from '@emotion/css'
import { device } from '@util/breakpoints'
import { useEffect, useMemo, useState } from 'react'
import { useRecoilState, useRecoilValueLoadable } from 'recoil'

import { ChainSummary, supportedChains, tokenByIdWithPrice } from '../../domain/chains'
import { accountsState } from '../../domain/extension'
import AddMembers from './AddMembers'
import Confirmation from './Confirmation'
import NameVault from './NameVault'
import NoVault from './NoVault'
import SelectFirstChain from './SelectFirstChain'
import SelectThreshold from './SelectThreshold'
import SignTransactions from './SignTransactions'

export type Step =
  | 'noVault'
  | 'nameVault'
  | 'addMembers'
  | 'selectThreshold'
  | 'selectFirstChain'
  | 'confirmation'
  | 'transactions'

export interface AugmentedAccount {
  address: string
  you?: boolean
  nickname?: string
  enabled?: boolean
}

function calcContentHeight(step: Step, nAccounts: number): { md: string; lg: string } {
  if (step === 'noVault') return { md: '557px', lg: '601px' }
  if (step === 'selectThreshold') return { md: '518px', lg: '518px' }
  if (step === 'nameVault') return { md: '429px', lg: '461px' }
  if (step === 'selectFirstChain') return { md: '400px', lg: '461px' }
  if (step === 'transactions') return { md: '420px', lg: '420px' }
  if (step === 'addMembers') return { md: 521 + nAccounts * 40 + 'px', lg: 521 + nAccounts * 40 + 'px' }
  return { md: 741 + nAccounts * 40 + 'px', lg: 721 + nAccounts * 40 + 'px' }
}

function calcContentMargin(step: Step): { md: string; lg: string } {
  if (step === 'noVault') return { md: '100px 0', lg: '84px 0' }
  if (step === 'nameVault') return { md: '100px 0', lg: '155px 0' }
  if (step === 'confirmation') return { md: '26px 0', lg: '26px 0' }
  return { md: '100px 0', lg: '63px 0' }
}

const CreateMultisig = () => {
  // Fade-in effect
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    setIsVisible(true)
  }, [])

  let firstChain = supportedChains[0]
  if (!firstChain) throw Error('no supported chains')

  const [step, setStep] = useState<Step>('noVault')
  const [name, setName] = useState<string>('')
  const [chain, setChain] = useState<ChainSummary>(firstChain)
  const [extensionAccounts] = useRecoilState(accountsState)
  const [externalAccounts, setExternalAccounts] = useState<string[]>([])
  const [threshold, setThreshold] = useState<number>(2)
  const [proxyCreated] = useState<boolean>(false)
  const [proxySetupCompleted] = useState<boolean>(false)
  const tokenWithPrice = useRecoilValueLoadable(tokenByIdWithPrice(chain.nativeToken.id))
  // TODO: replace this with a query once lib is avail
  const reserveAmount = 20.041
  const fee = 0.0125628761

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

  // TODO: if wallet has vaults already skip the no_vault and display an 'x'

  const contentHeight = calcContentHeight(step, augmentedAccounts.length)
  const contentMargin = calcContentMargin(step)
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
            display: ${step === 'confirmation' ? 'none' : 'block'};
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
            /* margin: ${contentMargin.lg}; */
            width: 863px;
          }
        `}
      >
        {step === 'noVault' ? (
          <NoVault setStep={setStep} />
        ) : step === 'nameVault' ? (
          <NameVault setStep={setStep} setName={setName} name={name} />
        ) : step === 'addMembers' ? (
          <AddMembers
            setStep={setStep}
            setExternalAccounts={setExternalAccounts}
            augmentedAccounts={augmentedAccounts}
            externalAccounts={externalAccounts}
          />
        ) : step === 'selectThreshold' ? (
          <SelectThreshold
            setStep={setStep}
            setThreshold={setThreshold}
            threshold={threshold}
            max={augmentedAccounts.length}
          />
        ) : step === 'selectFirstChain' ? (
          <SelectFirstChain setStep={setStep} setChain={setChain} chain={chain} chains={supportedChains} />
        ) : step === 'confirmation' ? (
          <Confirmation
            setStep={setStep}
            augmentedAccounts={augmentedAccounts}
            threshold={threshold}
            name={name}
            chain={chain}
            reserveAmount={reserveAmount}
            fee={fee}
            tokenWithPrice={tokenWithPrice}
          />
        ) : step === 'transactions' ? (
          <SignTransactions proxyCreated={proxyCreated} proxySetupCompleted={proxySetupCompleted} />
        ) : null}
      </div>
    </div>
  )
}

export default CreateMultisig
