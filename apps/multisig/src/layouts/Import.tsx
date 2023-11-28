import { Member } from '@components/Member'
import { Chain, filteredSupportedChains } from '@domains/chains'
import { useAddressIsProxyDelegatee } from '@domains/chains/storage-getters'
import { accountsState, extensionAllowedState, extensionLoadingState } from '@domains/extension'
import { Multisig, multisigsState, selectedMultisigIdState } from '@domains/multisig'
import { css } from '@emotion/css'
import { Loader } from '@talismn/icons'
import { Button, EyeOfSauronProgressIndicator } from '@talismn/ui'
import { Address, toMultisigAddress } from '@util/addresses'
import { arrayIntersection } from '@util/misc'
import queryString from 'query-string'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRecoilState, useSetRecoilState } from 'recoil'

/** @deprecated since the intro of a backend, vaults are automatically imported and you don't have to import via link */
const Import = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [multisigs, setMultisigs] = useRecoilState(multisigsState)
  const setSelectedMultisigId = useSetRecoilState(selectedMultisigIdState)
  const [extensionAccounts] = useRecoilState(accountsState)
  const [extensionLoading] = useRecoilState(extensionLoadingState)
  const [extensionAllowed, setExtensionAllowed] = useRecoilState(extensionAllowedState)
  const [valid, setValid] = useState<boolean | undefined>(undefined)
  const { proxy, signers, threshold, chain_id, name } = queryString.parse(location.search, { arrayFormat: 'comma' })
  const chain =
    filteredSupportedChains.find(c => c.squidIds.chainData === chain_id) || (filteredSupportedChains[0] as Chain)
  const { addressIsProxyDelegatee, ready } = useAddressIsProxyDelegatee(chain)
  const thresholdNumber = Number(threshold)
  const signersArray = useMemo(() => {
    return Array.isArray(signers) ? signers : [signers]
  }, [signers])

  useEffect(() => {
    async function validate() {
      if (!ready || valid === false) return

      // Basic query param validation
      const proxyAddress = typeof proxy === 'string' ? Address.fromSs58(proxy) : false
      if (!proxyAddress) {
        toast.error('Invalid or missing proxy')
        setValid(false)
        return
      }

      if (typeof name !== 'string') {
        toast.error('Invalid or missing name')
        setValid(false)
        return
      }

      if (filteredSupportedChains.every(c => c.squidIds.chainData !== chain_id)) {
        toast.error('Invalid or missing chain')
        setValid(false)
        return
      }

      // check that every signer is valid address
      const signers: Address[] = []
      for (const addrString of signersArray) {
        const signer = typeof addrString === 'string' ? Address.fromSs58(addrString) : false
        if (!signer) {
          toast.error('Invalid or missing signer')
          setValid(false)
          return
        }
        signers.push(signer)
      }

      if (isNaN(thresholdNumber)) {
        toast.error('Invalid or missing threshold')
        setValid(false)
        return
      }

      // We validated above that all signers are valid, so we can cast them here.
      const multisigAddress = toMultisigAddress(signers, thresholdNumber)

      // Get the actual on-chain address that controls the proxy, make sure it matches the multisig address
      const res = await addressIsProxyDelegatee(proxyAddress, multisigAddress)
      if (!res.isProxyDelegatee) {
        toast.error('Invalid multisig/proxy configuration. This link may be outdated, please ask for a new one.')
        setValid(false)
        return
      }

      setValid(true)

      // Check for overlap between the multisig signers and the connected wallet
      const overlap = arrayIntersection<string>(
        signers.map(a => a.toPubKey()),
        extensionAccounts.map(a => a.address.toPubKey())
      )
      if (overlap.length > 0) {
        if (!multisigs.every(({ proxyAddress: _proxyAddress }) => !_proxyAddress.isEqual(proxyAddress))) {
          toast.error('Import failed: Multisig already imported', { duration: 5000 })
          navigate('/overview')
          return
        }

        const multisig: Multisig = {
          id: `${multisigAddress.toSs58()}-${proxyAddress.toSs58()}-${chain.squidIds.chainData}`,
          name,
          chain,
          multisigAddress,
          proxyAddress,
          signers,
          threshold: thresholdNumber,
        }
        setMultisigs([...multisigs, multisig])
        setSelectedMultisigId(multisig.id)
        navigate('/overview')
        toast.success('Multisig imported successfully! 🥳', { duration: 5000 })
      }
    }

    validate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, valid])

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
      `}
    >
      {valid === false ? (
        <>
          <h1>🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨</h1>
          <br />
          <div css={{ display: 'flex' }}>
            <h1>🚨</h1>&nbsp;
            <h1>😱 Invalid import link 😱</h1>
            &nbsp;&nbsp;<h1>🚨</h1>
          </div>
          <br />
          <h1>🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨</h1>
          <br />
          <p>Ask your team for a new import link or try again.</p>
        </>
      ) : valid === undefined ? (
        <EyeOfSauronProgressIndicator />
      ) : (
        <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '700px', gap: '12px' }}>
          <h1>Connect a signer from this multisig to continue</h1>
          <br />
          {(signers as string[]).map((signer: string) => (
            <div key={signer} css={{ width: '400px' }}>
              <Member m={{ address: Address.fromSs58(signer) as Address }} chain={chain} />
            </div>
          ))}
          <br />
          {extensionAccounts.length === 0 && (
            <Button
              className={css`
                width: 400px;
                height: 56px;
              `}
              children={
                !extensionAllowed ? <h3>Connect</h3> : extensionLoading ? <Loader /> : <h3>No Accounts Connected</h3>
              }
              onClick={() => setExtensionAllowed(true)}
              disabled={extensionAllowed && !extensionLoading && extensionAccounts.length === 0}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default Import
