import { copyToClipboard } from '@domains/common'
import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import { Copy } from '@talismn/icons'
import { Button, IconButton } from '@talismn/ui'
import { device } from '@util/breakpoints'
import queryString from 'query-string'
import { useReward } from 'react-rewards'
import { useEffectOnce } from 'react-use'

const MagicLink = ({
  name,
  signers,
  threshold,
  proxy,
  chainId,
}: {
  proxy: string
  name: string
  signers: string[]
  threshold: number
  chainId: string
}) => {
  const theme = useTheme()
  const params = {
    name,
    signers: signers.join(','),
    threshold,
    proxy,
    chain_id: chainId,
  }
  const url = `${window.location.origin}/import?${queryString.stringify(params)}`
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
        max-width: 500px;
      `}
    >
      <p css={{ display: 'flex', flex: '1', overflow: 'scroll', whiteSpace: 'nowrap' }}>{url}</p>
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

const VaultCreated = (props: {
  goToVault: () => void
  proxy: string
  name: string
  signers: string[]
  threshold: number
  chainId: string
}) => {
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
        <MagicLink
          proxy={props.proxy}
          name={props.name}
          signers={props.signers}
          chainId={props.chainId}
          threshold={props.threshold}
        />
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
