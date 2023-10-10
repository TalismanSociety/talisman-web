import { useAugmentedBalances } from '@domains/balances'
import { useAddressIsProxyDelegatee } from '@domains/chains/storage-getters'
import { getAllChangeAttempts } from '@domains/metadata-service/getAllChangeAttempts'
import { multisigsState, useSelectedMultisig } from '@domains/multisig'
import { toMultisigAddress } from '@util/addresses'
import { device } from '@util/breakpoints'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useRecoilState } from 'recoil'

import Assets, { TokenAugmented } from './Assets'
import Transactions from './Transactions'
import { Layout } from '../Layout'
import { css } from '@emotion/css'
import BetaNotice from './BetaNotice'

const Overview = () => {
  const [selectedMultisig, setSelectedMultisig] = useSelectedMultisig()
  const [multisigs, setMultisigs] = useRecoilState(multisigsState)
  const { addressIsProxyDelegatee, ready: addressIsProxyDelegateeReady } = useAddressIsProxyDelegatee(
    selectedMultisig.chain
  )

  // Check multisig configuration has not changed
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!addressIsProxyDelegateeReady) return

      // DUMMY MULTISIG, dont need to detect or check for changes
      if (selectedMultisig.signers.length === 0 && selectedMultisig.threshold === 0) return

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
    <Layout selected="Overview" requiresMultisig>
      <div
        className={css`
          display: grid;
          gap: 16px;
          grid-template-columns: 1fr;
          grid-template-areas:
            'transactions'
            'assets';
          width: 100%;
          @media ${device.md} {
            grid-template-columns: 45fr 55fr;
            grid-template-areas: 'assets transactions';
          }
          @media ${device.lg} {
            grid-template-columns: 38fr 62fr;
          }
        `}
      >
        <Assets augmentedTokens={augmentedTokens} />
        <Transactions />
      </div>
      <BetaNotice />
    </Layout>
  )
}

export default Overview
