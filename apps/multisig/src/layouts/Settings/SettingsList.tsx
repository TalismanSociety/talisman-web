import { copyToClipboard } from '@domains/common'
import { createImportPath, multisigsState, selectedMultisigState } from '@domains/multisig'
import { css } from '@emotion/css'
import { Users } from '@talismn/icons'
// import { Globe } from '@talismn/icons'
import { Button, IconButton } from '@talismn/ui'
import { ReactElement } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'

const SettingOption = ({
  icon,
  title,
  description,
  onClick,
}: {
  icon: ReactElement
  title: string
  description: string
  onClick?: () => void
}) => {
  return (
    <div
      onClick={onClick}
      className={css`
        align-items: center;
        display: flex;
        height: 98px;
        border-radius: 16px;
        background-color: var(--color-backgroundSecondary);
        width: 100%;
        padding: 33px 24px;
        gap: 16px;
        * > path {
          stroke-width: 1.5px !important;
        }
        cursor: pointer;
        transition: all 150ms ease-in-out;
        :hover {
          h2,
          span,
          svg {
            color: black;
          }
          background: var(--color-offWhite);
        }
      `}
    >
      <IconButton size={32}>{icon}</IconButton>
      <div css={{ display: 'grid', gap: '4px' }}>
        <h2 css={{ color: 'var(--color-offWhite)' }}>{title}</h2>
        <span>{description}</span>
      </div>
    </div>
  )
}

const SettingsList = () => {
  const navigate = useNavigate()
  const multisig = useRecoilValue(selectedMultisigState)
  const [multisigState, setMultisigState] = useRecoilState(multisigsState)
  return (
    <div
      className={css`
        display: grid;
        flex-direction: column;
        gap: 26px;
        width: 100%;
        max-width: 624px;
        height: 100%;
        align-content: flex-start;
        padding-top: 32px;
        padding-left: 120px;
      `}
    >
      <SettingOption
        icon={<Users size={32} />}
        title={'Manage signer configuration'}
        description={'Change multisig members or approval threshold'}
        onClick={() => {
          navigate('/settings/signer-configuration')
        }}
      />
      <Button
        variant="outlined"
        onClick={() => {
          const url = `${window.location.origin}/${createImportPath(
            multisig.name,
            multisig.signers,
            multisig.threshold,
            multisig.proxyAddress,
            multisig.chain
          )}`
          copyToClipboard(url, 'Vault import link copied to clipboard')
        }}
      >
        Copy Vault Import Link 💫
      </Button>
      <Button
        variant="noop"
        onClick={() => {
          // eslint-disable-next-line no-restricted-globals
          const confirmed = confirm(`Are you sure you want to forget vault "${multisig.name}"?`)
          if (!confirmed) return
          if (confirmed) {
            const name = multisig.name
            setMultisigState(multisigState.filter(m => !m.proxyAddress.isEqual(multisig.proxyAddress)))
            toast.success(`Forgot ${name}`)
            navigate('/overview')
          }
        }}
      >
        Forget Vault
      </Button>
    </div>
  )
}

export default SettingsList
