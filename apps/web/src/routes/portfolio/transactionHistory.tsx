import { List } from '@archetypes/Transaction'
import { selectedAccountsState } from '@domains/accounts/recoils'
import styled from '@emotion/styled'
import { Info } from '@talismn/icons'
import { Surface, Text } from '@talismn/ui'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

// type ExtensionUnavailableProps = {
//   props?: any
// }

// const ExtensionUnavailable = styled((props: ExtensionUnavailableProps) => {
//   const { t } = useTranslation()
//   return (
//     <PanelSection comingSoon {...props}>
//       <p>{t('extensionUnavailable.subtitle')}</p>
//       <p>{t('extensionUnavailable.text')}</p>
//     </PanelSection>
//   )
// })`
//   text-align: center;

//   > *:not(:last-child) {
//     margin-bottom: 2rem;
//   }
//   > *:last-child {
//     margin-bottom: 0;
//   }

//   > h2 {
//     color: var(--color-text);
//     font-weight: 600;
//     font-size: 1.8rem;
//   }
//   p {
//     color: #999;
//     font-size: 1.6rem;
//   }
// `

const TransactionHistory = styled(({ className }: { className?: string }) => {
  const addresses = useRecoilValue(selectedAccountsState)

  return (
    <section className={className}>
      <Surface css={{ textAlign: 'center', marginBottom: '2.6rem', padding: '1.6rem', borderRadius: '0.8rem' }}>
        <Text.BodyLarge
          as="div"
          alpha="disabled"
          css={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem' }}
        >
          <Info />
          <div>
            Transaction history is currently being re-indexed. Please be aware that until this process is complete, some
            transactions may not be visible.
          </div>
        </Text.BodyLarge>
      </Surface>
      <List addresses={useMemo(() => addresses.map(x => x.address), [addresses])} />
    </section>
  )
})`
  color: var(--color-text);
  width: 100%;

  .all-nft-grids > * + * {
    margin-top: 4rem;
  }
`

export default TransactionHistory
