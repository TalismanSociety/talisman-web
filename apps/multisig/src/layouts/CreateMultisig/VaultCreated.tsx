import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import { Copy } from '@talismn/icons'
import { Button, IconButton } from '@talismn/ui'
import { device, size } from '@util/breakpoints'
import { useReward } from 'react-rewards'
import { useEffectOnce, useWindowSize } from 'react-use'
import truncateMiddle from 'truncate-middle'

import { copyToClipboard } from '../../domain/common'

const MagicLink = ({ proxyAccount, name }: { proxyAccount: string; name: string }) => {
  const width = useWindowSize().width
  const urlChars = width > size.lg ? 60 : 47
  const theme = useTheme()
  const url = `https://signet.talisman.xyz/import?proxyAccount=${proxyAccount}&name=${name}`
  return (
    <div
      className={css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        grid-template-rows: 1fr;
        padding: 8px 24px;
        background: var(--color-controlBackground);
        color: var(--color-offWhite);
        border-radius: 8px;
        width: 100%;
      `}
    >
      <p>{truncateMiddle(url, urlChars, 0, '...')}</p>
      <IconButton
        contentColor={`rgb(${theme.primary})`}
        onClick={() => copyToClipboard(url, 'Magic link copied to clipboard ✨')}
      >
        <Copy />
      </IconButton>
    </div>
  )
}

const rewardConfig = {
  lifetime: 1000,
  angle: 90,
  spread: 180,
  startVelocity: 45,
  elementCount: 100,
  decay: 0.9,
}

const VaultCreated = (props: { goToVault: () => void; proxyAccount: string; name: string }) => {
  const { reward } = useReward('rewardId', 'confetti', rewardConfig)
  useEffectOnce(() => {
    reward()
  })

  return (
    <div
      id="rewardId"
      className={css`
        display: grid;
        justify-items: center;
        align-content: center;
        padding: 48px;
        text-align: center;
        @media ${device.lg} {
          padding: 80px 120px;
        }
      `}
    >
      <h1
        className={css`
          margin-bottom: 24px;
        `}
      >
        Vault Created 🎉
      </h1>
      <p>
        You did it! Your multisig Vault is set up and ready to go. Share this magic link with other members to start
        managing your assets together.
      </p>
      <div
        className={css`
          margin: 48px 0;
          width: 100%;
        `}
      >
        <MagicLink proxyAccount={props.proxyAccount} name={props.name} />
      </div>
      <div>
        <Button
          onClick={props.goToVault}
          className={css`
            width: 240px;
            height: 56px;
          `}
          children={<h3>Go to my Vault</h3>}
        />
      </div>
    </div>
  )
}

export default VaultCreated
export {}
