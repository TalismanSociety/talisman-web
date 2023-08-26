import { Member } from '@components/Member'
import { Chain, supportedChains } from '@domains/chains'
import { useAddressIsProxyDelegatee } from '@domains/chains/storage-getters'
import { accountsState, extensionAllowedState, extensionLoadingState } from '@domains/extension'
import { Multisig, multisigsState, selectedMultisigState } from '@domains/multisig'
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

const Import = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [multisigs, setMultisigs] = useRecoilState(multisigsState)
  const setSelectedMultisig = useSetRecoilState(selectedMultisigState)
  const [extensionAccounts] = useRecoilState(accountsState)
  const [extensionLoading] = useRecoilState(extensionLoadingState)
  const [extensionAllowed, setExtensionAllowed] = useRecoilState(extensionAllowedState)
  const [valid, setValid] = useState<boolean | undefined>(undefined)
  const { proxy, signers, threshold, chain_id, name } = queryString.parse(location.search, { arrayFormat: 'comma' })
  const chain = supportedChains.find(c => c.squidIds.chainData === chain_id) || (supportedChains[0] as Chain)
  const { addressIsProxyDelegatee, ready } = useAddressIsProxyDelegatee(chain)
  const thresholdNumber = Number(threshold)
  const signersArray = useMemo(() => {
    return Array.isArray(signers) ? signers : [signers]
  }, [signers])

  useEffect(() => {
    async function validate() {
      if (!ready || valid === false) return

      // Basic query param validation
      if (typeof proxy !== 'string' || Address.fromSs58(proxy) === false) {
        toast.error('Invalid or missing proxy')
        setValid(false)
        return
      }

      if (typeof name !== 'string') {
        toast.error('Invalid or missing name')
        setValid(false)
        return
      }

      if (supportedChains.every(c => c.squidIds.chainData !== chain_id)) {
        toast.error('Invalid or missing chain')
        setValid(false)
        return
      }

      if (
        !Array.isArray(signersArray) ||
        !signersArray.every(signer => typeof signer === 'string' && Address.fromSs58(signer) !== false)
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

      // We validated above that all signers are valid, so we can cast them here.
      const signerAddressesArray = signersArray.map(signer => Address.fromSs58(signer as string)) as Address[]
      const multisigAddress = toMultisigAddress(signerAddressesArray, thresholdNumber)

      // Get the actual on-chain address that controls the proxy, make sure it matches the multisig address
      const proxyAddress = Address.fromSs58(proxy)
      if (!proxyAddress) throw Error('Somehow proxy address is false when it was checked earlier.')
      const res = await addressIsProxyDelegatee(proxyAddress, multisigAddress)
      if (!res.isProxyDelegatee) {
        toast.error('Invalid multisig/proxy configuration. This link may be outdated, please ask for a new one.')
        return
      }

      setValid(true)

      // Check for overlap between the multisig signers and the connected wallet
      const overlap = arrayIntersection<string>(
        signerAddressesArray.map(a => a.toPubKey()),
        extensionAccounts.map(a => a.address.toPubKey())
      )
      if (overlap.length > 0) {
        if (!multisigs.every(({ proxyAddress: _proxyAddress }) => !_proxyAddress.isEqual(proxyAddress))) {
          toast.error('Import failed: Multisig already imported', { duration: 5000 })
          navigate('/overview')
          return
        }

        const multisig: Multisig = {
          name,
          chain,
          multisigAddress,
          proxyAddress,
          signers: signerAddressesArray,
          threshold: thresholdNumber,
        }
        setMultisigs([...multisigs, multisig])
        setSelectedMultisig(multisig)
        navigate('/overview')
        toast.success('Multisig imported successfully! 🥳', { duration: 5000 })
      }
    }

    validate()
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
