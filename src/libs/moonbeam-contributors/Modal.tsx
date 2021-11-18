import { MaterialLoader } from '@components'
import { useExtension } from '@libs/talisman'
import { encodeAnyAddress } from '@talismn/util'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { AccountModal } from './AccountModal'
import { AccountsModal } from './AccountsModal'
import { ContributorWithName, moonbeamRelaychain, useMoonbeamContributors } from '.'

type ModalState = { type: 'allAccounts' } | { type: 'selectedAccount'; contributor: ContributorWithName }

export default function MoonbeamContributionModal() {
  const { accounts } = useExtension()
  const { contributors, loading, refetch } = useMoonbeamContributors(accounts.map(({ address }) => address))
  const contributorsWithNames: ContributorWithName[] = useMemo(
    () =>
      contributors.map(contributor => ({
        ...contributor,
        name: accounts.find(({ address }) => encodeAnyAddress(address, moonbeamRelaychain.id) === contributor.id)?.name,
      })),
    [contributors, accounts]
  )

  const [state, setState] = useState<ModalState>({ type: 'allAccounts' })
  const selectAccount = useCallback(
    (contributor?: ContributorWithName) =>
      setState(contributor ? { type: 'selectedAccount', contributor } : { type: 'allAccounts' }),
    []
  )

  if (loading) return <Loading />
  if (state.type === 'allAccounts')
    return <AccountsModal contributors={contributorsWithNames} selectAccount={selectAccount} />
  if (state.type === 'selectedAccount')
    return <AccountModal account={state.contributor} selectAccount={selectAccount} refetch={refetch} />

  return null
}

const Loading = styled(MaterialLoader)`
  font-size: 6.4rem;
  margin: 4rem auto;
  color: var(--color-primary);
  user-select: none;
`
