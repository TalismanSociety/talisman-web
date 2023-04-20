import { css } from '@emotion/css'
import { Button } from '@talismn/ui'

const VaultCreated = (props: { goToVault: () => void }) => {
  return (
    <div
      className={css`
        display: grid;
        justify-items: center;
        align-content: center;
      `}
    >
      <h1
        className={css`
          margin-top: 37px;
        `}
      >
        Vault Created!
      </h1>
      <p
        className={css`
          margin-top: 16px;
        `}
      >
        Launch a multi-signature wallet for your organisation
      </p>
      <div>
        <Button
          onClick={props.goToVault}
          className={css`
            margin-top: 48px;
            width: 240px;
            height: 56px;
          `}
          children={<h3>Create New Vault</h3>}
        />
      </div>
    </div>
  )
}

export default VaultCreated
