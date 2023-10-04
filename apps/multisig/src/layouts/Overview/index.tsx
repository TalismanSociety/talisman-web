import { useAugmentedBalances } from '@domains/balances'
import { useAddressIsProxyDelegatee } from '@domains/chains/storage-getters'
import { getAllChangeAttempts } from '@domains/metadata-service/getAllChangeAttempts'
import { multisigsState, selectedMultisigState } from '@domains/multisig'
import { css } from '@emotion/css'
import { Eye, Settings } from '@talismn/icons'
import { toMultisigAddress } from '@util/addresses'
import { device } from '@util/breakpoints'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'

import Assets, { TokenAugmented } from './Assets'
import BetaNotice from './BetaNotice'
import Footer from './Footer'
import Header from './Header'
import NewTransactionModal from './NewTransactionModal'
import Sidebar from './Sidebar'
import Transactions from './Transactions'

const Overview = () => {
  const navigate = useNavigate()
  const [selectedMultisig, setSelectedMultisig] = useRecoilState(selectedMultisigState)
  const [multisigs, setMultisigs] = useRecoilState(multisigsState)
  const { addressIsProxyDelegatee, ready: addressIsProxyDelegateeReady } = useAddressIsProxyDelegatee(
    selectedMultisig.chain
  )

  // Check multisig configuration has not changed
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!addressIsProxyDelegateeReady) return
      const { isProxyDelegatee, proxyDelegatees } = await addressIsProxyDelegatee(
        selectedMultisig.proxyAddress,
        selectedMultisig.multisigAddress
      )

      // All good, nothing has changed.
      if (isProxyDelegatee) return

      console.log(
        `Detected change in multisig configuration. Outdated multisig address ${selectedMultisig.multisigAddress.toSs58(
          selectedMultisig.chain
        )}, current delegatees: ${proxyDelegatees.map(d => d.toSs58(selectedMultisig.chain))}`
      )

      // Try to find the new multisig details in the metadata service.
      try {
        const allChangeAttempts = await getAllChangeAttempts(selectedMultisig.multisigAddress, selectedMultisig.chain)
        for (const changeAttempt of allChangeAttempts) {
          const changeMultisigAddress = toMultisigAddress(changeAttempt.newMembers, changeAttempt.newThreshold)
          if (proxyDelegatees.some(delegatee => delegatee.isEqual(changeMultisigAddress))) {
            toast.success('Multisig signer configuration update detected and automatically applied.', {
              duration: 5000,
            })
            const otherMultisigs = multisigs.filter(m => !m.multisigAddress.isEqual(selectedMultisig.multisigAddress))
            const newMultisig = {
              ...selectedMultisig,
              multisigAddress: changeMultisigAddress,
              threshold: changeAttempt.newThreshold,
              signers: changeAttempt.newMembers,
            }
            setMultisigs([...otherMultisigs, newMultisig])
            setSelectedMultisig(newMultisig)
            return
          }
        }
      } catch (error) {
        console.error('Failed to fetch new multisig configuration from metadata service:', error)
      }

      toast(
        `Multisig configuration for "${selectedMultisig.name}" was changed and signet was unable to automatically determine the new details. Please re-import the multisig using an updated link.`,
        { duration: 30_000 }
      )
      setMultisigs(multisigs => multisigs.filter(m => !m.multisigAddress.isEqual(selectedMultisig.multisigAddress)))
    }, 10_000)

    return () => clearInterval(interval)
  }, [
    addressIsProxyDelegatee,
    addressIsProxyDelegateeReady,
    selectedMultisig,
    setMultisigs,
    multisigs,
    setSelectedMultisig,
  ])

  const augmentedTokens: TokenAugmented[] = useAugmentedBalances()
  return (
    <div
      className={css`
        display: grid;
        grid-template-columns: 70px 1fr;
        grid-template-rows: 84px auto auto 84px;
        height: 100%;
        width: 100%;
        gap: 16px;
        padding: 28px 28px 0 28px;
        grid-template-areas:
          'header header'
          'sidebar transactions'
          'sidebar assets'
          'footer footer';
        @media ${device.md} {
          grid-template-columns: 177px 45fr 55fr;
          grid-template-rows: 84px auto 84px;
          grid-template-areas:
            'header header header'
            'sidebar assets transactions'
            'footer footer footer';
        }
        @media ${device.lg} {
          margin: auto;
          max-width: 1600px;
          grid-template-columns: 248px 38fr 62fr;
          grid-template-rows: 84px auto 84px;
          grid-template-areas:
            'header header header'
            'sidebar assets transactions'
            'footer footer footer';
        }
      `}
    >
      <Header />
      <Sidebar
        selected="Overview"
        options={[
          {
            name: 'Overview',
            icon: <Eye />,
          },
          {
            name: 'Settings',
            icon: <Settings />,
            onClick: () => navigate('/settings'),
          },
        ]}
      />
      <Assets augmentedTokens={augmentedTokens} />
      <Transactions />
      <Footer />
      <NewTransactionModal />
      <BetaNotice />
    </div>
  )
}

export default Overview
