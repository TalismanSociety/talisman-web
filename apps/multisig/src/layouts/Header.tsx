import Logo from '@components/Logo'
import { activeMultisigsState, useSelectedMultisig } from '@domains/multisig'
import { css } from '@emotion/css'
import { useRecoilValue } from 'recoil'
import { MultisigSelect } from '../components/MultisigSelect'

import { selectedAccountState } from '../domains/auth'
import { accountsState } from '../domains/extension'
import AccountSwitcher from '../components/AccountSwitcher'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()
  const [selectedMultisig, setSelectedMultisig] = useSelectedMultisig()
  const activeMultisigs = useRecoilValue(activeMultisigsState)
  const selectedAccount = useRecoilValue(selectedAccountState)
  const extensionAccounts = useRecoilValue(accountsState)

  return (
    <header
      className={css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 56px;
        gap: 16px;
        width: 100%;
      `}
    >
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Logo css={{ cursor: 'pointer', width: 106, marginRight: 16 }} onClick={() => navigate('/')} />
        {activeMultisigs.length === 0 ? null : (
          <>
            <MultisigSelect
              multisigs={activeMultisigs}
              selectedMultisig={selectedMultisig}
              onChange={setSelectedMultisig}
            />
            {/* <Button
              variant="secondary"
              css={{ height: 56, width: 'max-content' }}
              onClick={() => setCombinedView(!combinedView)}
            >
              <div>{combinedView ? 'Combined' : 'Selected'} Vault View</div>
            </Button> */}
          </>
        )}
      </div>

      <div>
        <AccountSwitcher selectedAccount={selectedAccount?.injected} accounts={extensionAccounts} />
      </div>
    </header>
  )
}

export default Header
