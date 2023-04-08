import Logo from '@components/Logo'
import { css } from '@emotion/css'
import { device } from '@util/breakpoints'
import { useEffect, useState } from 'react'

import NameVault from './NameVault'
import NoVault from './NoVault'

export type Step = 'noVault' | 'nameVault' | 'addMembers' | 'confirmation' | 'transactions'

const CreateMultisig = () => {
  // Fade-in effect
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const [step, setStep] = useState<Step>('noVault')
  const [name, setName] = useState<string>('')

  // TODO: if wallet has vaults already skip the no_vault and display an 'x'

  const contentHeight = step === 'noVault' ? { md: '557px', lg: '601px' } : { md: '429px', lg: '461px' }
  const contentMarginTop = step === 'noVault' ? '100px' : '155px'
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
          margin-top: ${contentMarginTop};
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
        {step === 'noVault' ? (
          <NoVault setStep={setStep} />
        ) : step === 'nameVault' ? (
          <NameVault setStep={setStep} setName={setName} name={name} />
        ) : null}
      </div>
    </div>
  )
}

export default CreateMultisig
