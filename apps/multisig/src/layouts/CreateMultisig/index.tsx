import Logo from '@components/Logo'
import { css } from '@emotion/css'
import { device } from '@util/breakpoints'
import { useEffect, useMemo, useState } from 'react'
import { useRecoilState } from 'recoil'

import { accountsState } from '../../domain/extension'
import AddMembers from './AddMembers'
import NameVault from './NameVault'
import NoVault from './NoVault'

export type Step = 'noVault' | 'nameVault' | 'addMembers' | 'confirmation' | 'transactions'

export interface AugmentedAccount {
  address: string
  you?: boolean
  nickname?: string
  enabled?: boolean
}

function calcContentHeight(step: Step, nAccounts: number): { md: string; lg: string } {
  if (step === 'noVault') return { md: '557px', lg: '601px' }
  if (step === 'nameVault') return { md: '429px', lg: '461px' }
  return { md: 541 + nAccounts * 40 + 'px', lg: 541 + nAccounts * 40 + 'px' }
}

function calcContentMargin(step: Step): { md: string; lg: string } {
  if (step === 'noVault') return { md: '100px 0', lg: '84px 0' }
  if (step === 'nameVault') return { md: '100px 0', lg: '155px 0' }
  return { md: '100px 0', lg: '63px 0' }
}

const CreateMultisig = () => {
  // Fade-in effect
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const [step, setStep] = useState<Step>('noVault')
  const [name, setName] = useState<string>('')
  const [extensionAccounts] = useRecoilState(accountsState)
  const [externalAccounts, setExternalAccounts] = useState<string[]>([])
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
      `}
    >
      <header>
        <Logo
          className={css`
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
          margin: ${contentMargin.md};
          height: ${contentHeight.md};
          width: 586px;
          background: var(--color-backgroundSecondary);
          border-radius: 24px;
          transition: height 0.3s ease-in-out, margin-top 0.3s ease-in-out, opacity 0.3s ease-in-out;
          opacity: ${isVisible ? 1 : 0};
          @media ${device.lg} {
            height: ${contentHeight.lg};
            margin: ${contentMargin.lg};
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
        ) : null}
      </div>
    </div>
  )
}

export default CreateMultisig
