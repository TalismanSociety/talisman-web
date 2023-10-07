import Logo from '@components/Logo'
import { activeMultisigsState, combinedViewState, selectedMultisigState } from '@domains/multisig'
import { css } from '@emotion/css'
import { Button } from '@talismn/ui'
import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { MultisigSelect } from '../components/MultisigSelect'

import { selectedAccountState } from '../domains/auth'
import { accountsState } from '../domains/extension'
import AccountComboBox from '../components/AccountComboBox'

const Header = () => {
  // Manage switching to active multisig if the selected one becomes inactive
  const [selectedMultisig, setSelectedMultisig] = useRecoilState(selectedMultisigState)
  const activeMultisigs = useRecoilValue(activeMultisigsState)
  const [combinedView, setCombinedView] = useRecoilState(combinedViewState)
  const selectedAccount = useRecoilValue(selectedAccountState)
  const extensionAccounts = useRecoilValue(accountsState)

  useEffect(() => {
    if (
      activeMultisigs[0] &&
      !activeMultisigs.find(multisig => multisig.proxyAddress.isEqual(selectedMultisig?.proxyAddress))
    ) {
      setSelectedMultisig(activeMultisigs[0])
    }
  })

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
        <Logo css={{ width: 106, marginRight: 16 }} />
        <MultisigSelect
          multisigs={activeMultisigs}
          selectedMultisig={selectedMultisig}
          onChange={setSelectedMultisig}
        />
        <Button
          variant="secondary"
          css={{ height: 56, width: 'max-content' }}
          onClick={() => setCombinedView(!combinedView)}
        >
          <div>{combinedView ? 'Combined' : 'Selected'} Vault View</div>
        </Button>
      </div>

      <div>
        <AccountComboBox selectedAccount={selectedAccount?.injected} accounts={extensionAccounts} />
      </div>
    </header>
  )
}

export default Header
