import { useCallback, useMemo, useState } from 'react'
import { Address } from '../../../util/addresses'
import { Chain, supportedChains } from '../../../domains/chains'
import { useRecoilState, useRecoilValue } from 'recoil'
import { selectedAccountState } from '../../../domains/auth'
import { accountsState } from '../../../domains/extension'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useCreateTeamOnHasura } from '../../../domains/offchain-data'
import { AugmentedAccount } from '../../../domains/multisig'
import NameVault from '../common/NameVault'
import SelectChain from '../common/SelectChain'
import { MultisigConfig } from '../MultisigConfig'
import Confirmation from '../common/Confirmation'
import { ProxiedAccountSettings } from './ProxiedAccountSettings'

export enum Step {
  NameVault,
  SelectFirstChain,
  ProxiedAccountAddress,
  MultisigConfig,
  Confirmation,
  Transactions,
}

export const ImportVault: React.FC = () => {
  let firstChain = supportedChains[0]
  if (!firstChain) throw Error('no supported chains')

  const navigate = useNavigate()
  const [step, setStep] = useState(Step.NameVault)

  const [name, setName] = useState<string>('')
  const [chain, setChain] = useState<Chain>(firstChain)
  const [addedAccounts, setAddedAccounts] = useState<Address[]>([])
  const [threshold, setThreshold] = useState<number>(2)
  const [proxiedAddress, setProxiedAddress] = useState<Address | undefined>()

  const [extensionAccounts] = useRecoilState(accountsState)
  const selectedSigner = useRecoilValue(selectedAccountState)

  const { createTeam } = useCreateTeamOnHasura()

  // TODO: refactor this to a hook
  const augmentedAccounts: AugmentedAccount[] = useMemo(() => {
    const augmentedAddedAccounts = addedAccounts.map(a => {
      const extensionAccount = extensionAccounts.find(ea => ea.address.isEqual(a))
      if (!extensionAccount) return { address: a }
      return {
        address: a,
        nickname: extensionAccount.meta.name,
        you: true,
        injected: extensionAccount,
      }
    })

    return selectedSigner
      ? [
          {
            address: selectedSigner.injected.address,
            nickname: selectedSigner.injected.meta.name,
            you: true,
            injected: selectedSigner.injected,
          },
          ...augmentedAddedAccounts,
        ]
      : augmentedAddedAccounts
  }, [addedAccounts, extensionAccounts, selectedSigner])

  const handleImport = useCallback(async () => {
    if (!proxiedAddress) return

    // TODO: make sure multisig controls proxied account

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
    navigate(`/overview`)
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
          chains={supportedChains}
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
        />
      ) : null}
    </>
  )
}
