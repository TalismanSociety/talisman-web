import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import { Address } from '@util/addresses'
import { Chain, filteredSupportedChains } from '@domains/chains'
import { useCreateTeamOnHasura } from '@domains/offchain-data'

import NameVault from '../common/NameVault'
import SelectChain from '../common/SelectChain'
import { MultisigConfig } from '../MultisigConfig'
import Confirmation from '../common/Confirmation'
import { ProxiedAccountSettings } from './ProxiedAccountSettings'
import { useAugmentedAccounts } from '../common/useAugmentedAccounts'

export enum Step {
  NameVault,
  SelectFirstChain,
  ProxiedAccountAddress,
  MultisigConfig,
  Confirmation,
  Transactions,
}

export const ImportVault: React.FC = () => {
  let firstChain = filteredSupportedChains[0]
  if (!firstChain) throw Error('no supported chains')

  const navigate = useNavigate()
  const [step, setStep] = useState(Step.NameVault)
  const [name, setName] = useState<string>('')
  const [chain, setChain] = useState<Chain>(firstChain)
  const [threshold, setThreshold] = useState<number>(2)
  const [proxiedAddress, setProxiedAddress] = useState<Address | undefined>()
  const [importing, setImporting] = useState(false)

  const { augmentedAccounts, setAddedAccounts } = useAugmentedAccounts()
  const { createTeam } = useCreateTeamOnHasura()

  const handleImport = useCallback(async () => {
    if (!proxiedAddress) return
    setImporting(true)
    try {
      const { team, error } = await createTeam({
        name,
        chain: chain.squidIds.chainData,
        multisigConfig: { signers: augmentedAccounts.map(a => a.address.toSs58()), threshold },
        proxiedAddress: proxiedAddress.toSs58(),
      })

      if (!team || error) {
        toast.error(error ?? 'Failed to import vault, please try again later.')
        return
      }

      toast.success('Vault imported successfully!')
      navigate(`/overview`)
    } catch (e) {
      console.error(e)
      toast.error('Failed to import vault, please try again later.')
    } finally {
      setImporting(false)
    }
  }, [augmentedAccounts, chain.squidIds.chainData, createTeam, name, navigate, proxiedAddress, threshold])

  return (
    <>
      {step === Step.NameVault ? (
        <NameVault
          onBack={() => navigate('/add-vault')}
          onNext={() => setStep(Step.SelectFirstChain)}
          setName={setName}
          name={name}
        />
      ) : step === Step.SelectFirstChain ? (
        <SelectChain
          onBack={() => setStep(Step.NameVault)}
          onNext={() => setStep(Step.ProxiedAccountAddress)}
          setChain={setChain}
          chain={chain}
          chains={filteredSupportedChains}
        />
      ) : step === Step.ProxiedAccountAddress || !proxiedAddress ? (
        <ProxiedAccountSettings
          address={proxiedAddress}
          chain={chain}
          onBack={() => setStep(Step.SelectFirstChain)}
          onChange={setProxiedAddress}
          onNext={() => setStep(Step.MultisigConfig)}
        />
      ) : step === Step.MultisigConfig ? (
        <MultisigConfig
          chain={chain}
          threshold={threshold}
          onThresholdChange={setThreshold}
          onBack={() => setStep(Step.ProxiedAccountAddress)}
          onNext={() => setStep(Step.Confirmation)}
          members={augmentedAccounts}
          onMembersChange={setAddedAccounts}
        />
      ) : step === Step.Confirmation ? (
        <Confirmation
          onBack={() => setStep(Step.MultisigConfig)}
          onCreateVault={handleImport}
          proxiedAccount={proxiedAddress}
          selectedAccounts={augmentedAccounts}
          threshold={threshold}
          name={name}
          chain={chain}
          importing={importing}
        />
      ) : null}
    </>
  )
}
