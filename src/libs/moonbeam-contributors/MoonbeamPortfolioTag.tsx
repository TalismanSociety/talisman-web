import { ReactComponent as AlertCircle } from '@assets/icons/alert-circle-bg.svg'
import { ReactComponent as LinkCircle } from '@assets/icons/link-circle-bg.svg'
import { useModal } from '@components'
import { useExtension } from '@libs/talisman'
import styled from 'styled-components'

import MoonbeamContributionModal from './Modal'
import { useMoonbeamContributors } from '.'

export const MoonbeamPortfolioTag = styled(({ className }) => {
  const { openModal } = useModal()
  const { accounts } = useExtension()
  const { contributors, loading } = useMoonbeamContributors(accounts.map(({ address }) => address))
  const hasUnlinked = contributors.some(contributor => contributor.rewardsAddress === null)

  if (loading) return null
  return (
    <div
      className={className + (hasUnlinked ? ' hasUnlinked' : '')}
      onClick={event => {
        event.preventDefault()
        openModal(<MoonbeamContributionModal />)
      }}
    >
      {hasUnlinked ? (
        <div>
          <AlertCircle />
          You have unlinked addresses
        </div>
      ) : (
        <div>
          <LinkCircle />
          View linked addresses
        </div>
      )}
    </div>
  )
})`
  font-size: 1.4rem;
  color: #5a5a5a;

  &.hasUnlinked {
    color: var(--color-primary);
  }

  > div {
    margin: 1rem 2rem;
    display: flex;
    justify-content: center;
    align-items: center;

    > svg {
      font-size: 2.4rem;
      margin-right: 0.5rem;
    }
  }
`
