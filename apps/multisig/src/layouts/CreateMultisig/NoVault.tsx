import Plant from '@components/Plant'
import { css } from '@emotion/css'
import { Button } from '@talismn/ui'
import { useNavigate } from 'react-router-dom'

const NoVault = () => {
  const navigate = useNavigate()
  return (
    <div
      css={({ color }) => ({ background: color.surface, padding: 64, borderRadius: 24, maxWidth: 863, width: '100%' })}
    >
      <div
        className={css`
          display: grid;
          justify-items: center;
          align-content: center;
        `}
      >
        <Plant />
        <h1
          css={{
            marginTop: 36,
            textAlign: 'center',
          }}
        >
          You don't have a vault yet
        </h1>
        <p
          className={css`
            margin-top: 16px;
            padding: 0 64px;
            text-align: center;
          `}
        >
          Launch a new multi-signature wallet for your organisation, or connect an account that is already part of a
          multisig.
        </p>
        <div>
          <Button
            onClick={() => navigate('/create')}
            className={css`
              margin-top: 48px;
              width: 240px;
              height: 56px;
            `}
            children={<h3>Create New Vault</h3>}
          />
        </div>
      </div>
    </div>
  )
}

export default NoVault
