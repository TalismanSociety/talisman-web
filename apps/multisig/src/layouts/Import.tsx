import { Member } from '@components/Member'
import { Chain, supportedChains } from '@domains/chains'
import { useAddressIsProxyDelegatee } from '@domains/chains/storage-getters'
import { accountsState, extensionAllowedState, extensionLoadingState } from '@domains/extension'
import { Multisig, multisigsState, selectedMultisigState } from '@domains/multisig'
import { css } from '@emotion/css'
import { createKeyMulti, encodeAddress, sortAddresses } from '@polkadot/util-crypto'
import { Loader } from '@talismn/icons'
import { Button, EyeOfSauronProgressIndicator } from '@talismn/ui'
import { toSs52Address } from '@util/addresses'
import { arrayIntersection } from '@util/misc'
import queryString from 'query-string'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRecoilState, useSetRecoilState } from 'recoil'

const Import = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [multisigs, setMultisigs] = useRecoilState(multisigsState)
  const setSelectedMultisig = useSetRecoilState(selectedMultisigState)
  const [extensionAccounts] = useRecoilState(accountsState)
  const [extensionLoading] = useRecoilState(extensionLoadingState)
  const [extensionAllowed, setExtensionAllowed] = useRecoilState(extensionAllowedState)
  const [valid, setValid] = useState<boolean | undefined>(true)
  const { proxy, signers, threshold, chain_id, name } = queryString.parse(location.search, { arrayFormat: 'comma' })
  const chain = supportedChains.find(c => c.id === chain_id) || (supportedChains[0] as Chain)
  const { addressIsProxyDelegatee, ready } = useAddressIsProxyDelegatee(chain)
  const thresholdNumber = Number(threshold)
  const signersArray = useMemo(() => {
    return Array.isArray(signers) ? signers : [signers]
  }, [signers])

  useEffect(() => {
    if (!ready || valid === false) return

    // Basic query param validation
    if (typeof proxy !== 'string' || toSs52Address(proxy, null) === false) {
      toast.error('Invalid or missing proxy')
      setValid(false)
      return
    }

    if (typeof name !== 'string') {
      toast.error('Invalid or missing name')
      setValid(false)
      return
    }

    if (supportedChains.every(c => c.id !== chain_id)) {
      toast.error('Invalid or missing chain')
      setValid(false)
      return
    }

    if (
      !Array.isArray(signersArray) ||
      !signersArray.every(signer => typeof signer === 'string' && toSs52Address(signer, chain) !== false)
    ) {
      toast.error('Invalid or missing signers')
      setValid(false)
      return
    }

    if (isNaN(thresholdNumber)) {
      toast.error('Invalid or missing threshold')
      setValid(false)
      return
    }

    // Derive the multisig address
    const multiAddressBytes = createKeyMulti(sortAddresses(signersArray as string[]), thresholdNumber)

    // Convert byte array to SS58 encoding.
    const multisigAddress = encodeAddress(multiAddressBytes)

    // Get the actual on-chain address that controls the proxy, make sure it matches the multisig address
    if (!addressIsProxyDelegatee(proxy as string, multisigAddress)) {
      toast.error('Invalid multisig/proxy configuration. This link may be outdated.')
      return
    }

    setValid(true)

    // Check for overlap between the multisig signers and the connected wallet
    const overlap = arrayIntersection<string>(
      signersArray as string[],
      extensionAccounts.map(a => a.address)
    )
    if (overlap.length > 0) {
      if (!multisigs.every(({ proxyAddress }) => proxyAddress !== proxy)) {
        toast.error('Import failed: Multisig already imported', { duration: 5000 })
        navigate('/overview')
        return
      }

      const multisig: Multisig = {
        name,
        chain,
        multisigAddress,
        proxyAddress: proxy,
        signers: signersArray as string[],
        threshold: thresholdNumber,
      }
      setMultisigs([...multisigs, multisig])
      setSelectedMultisig(multisig)
      navigate('/overview')
      toast.success('Multisig imported successfully! 🥳', { duration: 5000 })
    }
  }, [
    setMultisigs,
    setSelectedMultisig,
    multisigs,
    chain,
    name,
    proxy,
    signersArray,
    thresholdNumber,
    chain_id,
    addressIsProxyDelegatee,
    navigate,
    ready,
    valid,
    extensionAccounts,
  ])

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
          <p>Ask your team for a new import link.</p>
        </>
      ) : valid === undefined ? (
        <EyeOfSauronProgressIndicator />
      ) : (
        <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '700px', gap: '12px' }}>
          <h1>Connect a signer from this multisig to continue</h1>
          <br />
          {(signers as string[]).map((signer: string) => (
            <div css={{ width: '400px' }}>
              <Member m={{ address: signer }} chain={chain} />
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
              onClick={() => {
                setExtensionAllowed(true)
              }}
              disabled={extensionAllowed && !extensionLoading && extensionAccounts.length === 0}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default Import
