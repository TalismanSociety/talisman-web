import { css } from '@emotion/css'
import { Globe, Users } from '@talismn/icons'
import { IconButton } from '@talismn/ui'
import { ReactElement } from 'react'

const SettingOption = ({ icon, title, description }: { icon: ReactElement; title: string; description: string }) => {
  return (
    <div
      className={css`
        align-items: center;
        display: flex;
        height: 98px;
        border-radius: 16px;
        background-color: var(--color-backgroundSecondary);
        max-width: 624px;
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
  return (
    <div
      className={css`
        display: grid;
        flex-direction: column;
        gap: 26px;
        width: 100%;
        height: 100%;
        align-content: flex-start;
        padding-top: 32px;
        padding-left: 120px;
      `}
    >
      <SettingOption
        icon={<Globe size={32} />}
        title={'Add network'}
        description={'Add another network to your multisig'}
      />
      <SettingOption
        icon={<Users size={32} />}
        title={'Manage members'}
        description={'Change multisig members or approval threshold'}
      />
    </div>
  )
}

export default SettingsList
