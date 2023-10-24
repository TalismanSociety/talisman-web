import { useAugmentedBalances } from '@domains/balances'
import { useAddressIsProxyDelegatee } from '@domains/chains/storage-getters'
import { PendingTransactionsWatcher, multisigsState, useSelectedMultisig } from '@domains/multisig'
import { TxMetadataWatcher, getAllChangeAttempts } from '@domains/offchain-data/metadata'
import { toMultisigAddress } from '@util/addresses'
import { device } from '@util/breakpoints'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useRecoilState, useRecoilValue } from 'recoil'

import Assets, { TokenAugmented } from './Assets'
import Transactions from './Transactions'
import { Layout } from '../Layout'
import { css } from '@emotion/css'
import BetaNotice from './BetaNotice'
import { changingMultisigConfigState, useUpdateMultisigConfig } from '../../domains/offchain-data'
import { selectedAccountState } from '../../domains/auth'

const Overview = () => {
  const [selectedMultisig, setSelectedMultisig] = useSelectedMultisig()
  const signedInAccount = useRecoilValue(selectedAccountState)
  const [multisigs, setMultisigs] = useRecoilState(multisigsState)
  const changingMultisigConfig = useRecoilValue(changingMultisigConfigState)
  const { updateMultisigConfig } = useUpdateMultisigConfig()
  const { addressIsProxyDelegatee, ready: addressIsProxyDelegateeReady } = useAddressIsProxyDelegatee(
    selectedMultisig.chain
  )

  // Check multisig configuration has not changed
  useEffect(() => {
    const interval = setInterval(async () => {
      // dont need to check when changing multisig config since there will be a brief period where
      // the config doesn't match what's confirmed on chain
      if (!addressIsProxyDelegateeReady || changingMultisigConfig) return

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

      // TODO: the change detection logic below is unsafe and unreliable in 2 scenarios:
      // - it will only work if the multisig config was changed using Signet
      // - if a signer was added and then removed, but added to another multisig that is also delegatee of the proxy
      //   the logic below may save the outdated change of the signer being added as the new multisig config
      //   more detailed example:
      //   1. Vault A = stash + multisig A, which has signers [1, 2, 3]
      //   2. Vault B = stash + multisig B, which has signers [1, 2, 3, 4]
      //   3. both multisigs are delegatees of a stash (different department of an org)
      //   4. signer 4 is removed from multisig B and added to multisig A
      //   5. multisig B adds signer 5 as new signer, but change did not get save
      //   6. the logic below will pick up signers [1, 2, 3, 4] as the new multisig config for Vault B
      //   7. which is incorrect, the new multisig config should be [1, 2, 3, 5]
      // Solution should be to show users a settings page where they can manually resolve the change

      // Try to find the new multisig details in the metadata service.
      try {
        const allChangeAttempts = await getAllChangeAttempts(selectedMultisig, signedInAccount)
        for (const changeAttempt of allChangeAttempts) {
          const changeMultisigAddress = toMultisigAddress(changeAttempt.newMembers, changeAttempt.newThreshold)
          if (proxyDelegatees.some(delegatee => delegatee.isEqual(changeMultisigAddress))) {
            const newMultisig = {
              ...selectedMultisig,
              multisigAddress: changeMultisigAddress,
              threshold: changeAttempt.newThreshold,
              signers: changeAttempt.newMembers,
            }

            await updateMultisigConfig(newMultisig, signedInAccount)
            toast.success('Multisig signer configuration update detected and automatically applied.', {
              duration: 5000,
            })
            return
          }
        }
      } catch (error) {
        console.error('Failed to fetch new multisig configuration from metadata service:', error)
      }

      toast(
        `Multisig configuration for "${selectedMultisig.name}" was changed and signet was unable to automatically determine the new details.`,
        { duration: 30_000 }
      )
    }, 15_000)

    return () => clearInterval(interval)
  }, [
    addressIsProxyDelegatee,
    addressIsProxyDelegateeReady,
    selectedMultisig,
    setMultisigs,
    multisigs,
    setSelectedMultisig,
    changingMultisigConfig,
    signedInAccount,
    updateMultisigConfig,
  ])

  const augmentedTokens: TokenAugmented[] = useAugmentedBalances()
  return (
    <Layout selected="Overview" requiresMultisig>
      <div
        className={css`
          display: grid;
          flex: 1;
          gap: 16px;
          grid-template-columns: 1fr;
          grid-template-areas:
            'transactions'
            'assets';
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
      <PendingTransactionsWatcher />
      <TxMetadataWatcher />
    </Layout>
  )
}

export default Overview
