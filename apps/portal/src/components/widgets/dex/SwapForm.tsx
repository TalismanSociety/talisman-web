import DexForm from '@components/recipes/DexForm/DexForm'
import { writeableAccountsState } from '@domains/accounts'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import AccountSelector from '../AccountSelector'
import TokenSelectorButton from '../TokenSelectorButton'

const SwapForm = () => {
  const [account, setAccount] = useState(useRecoilValue(writeableAccountsState).at(0))

  return (
    <DexForm
      swapLink={<DexForm.SwapTab as={Link} to="/dex/swap" selected />}
      transportLink={<DexForm.TransportTab as={Link} to="/dex/transport" />}
      form={
        // @ts-expect-error
        <DexForm.Swap
          accountSelector={
            <AccountSelector
              accounts={useRecoilValue(writeableAccountsState)}
              selectedAccount={account}
              onChangeSelectedAccount={setAccount}
            />
          }
          // @ts-expect-error
          fromTokenSelector={<TokenSelectorButton tokens={[]} />}
          // @ts-expect-error
          toTokenSelector={<TokenSelectorButton tokens={[]} />}
        />
      }
      fees={[undefined, undefined]}
      submitButton={<DexForm.Swap.SubmitButton />}
    />
  )
}

export default SwapForm
