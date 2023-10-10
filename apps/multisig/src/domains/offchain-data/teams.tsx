import { gql } from 'graphql-request'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import { SignedInAccount, selectedAccountState } from '../auth'
import { useCallback, useEffect, useState } from 'react'
import { requestSignetBackend } from './hasura'
import { Address } from '@util/addresses'
import { Chain, supportedChains } from '../chains'
import toast from 'react-hot-toast'
import persistAtom from '../persist'

type RawTeam = {
  id: string
  name: string
  multisig_config: any
  proxied_address: string
  delegatee_address: string
  chain: string
}

// In the future, a Team can represent a few different setups:
// - multisig -> pure proxy: requires chain, multisigConfig, proxiedAddress and delegateeAddress to be defined
// - pure proxy -> pure proxy: leave out multisigConfig, check proxiedAddress and delegateeAddress on chain
// - just multisig -> leave out proxiedAddress
// - and etc
// For now, we only support multisig -> pure proxy
export type Team = {
  id: string
  name: string
  multisigConfig: {
    threshold: number
    signers: Address[]
  }
  chain: Chain
  proxiedAddress: Address
  delegateeAddress: Address
}

export const selectedTeamIdState = atom<string | undefined>({
  key: 'selectedTeamId',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
})

export const teamsBySignerState = atom<Record<string, Team[]>>({
  key: 'teamsBySigner',
  default: {},
})

const TEAM_BY_SIGNER_QUERY = gql`
  query TeamBySigner {
    team {
      id
      name
      chain
      multisig_config
      proxied_address
      delegatee_address
    }
  }
`

const parseTeam = (rawTeam: RawTeam): { team?: Team; error?: string } => {
  try {
    // make sure chain is supported chain
    const chain = supportedChains.find(chain => chain.squidIds.chainData === rawTeam.chain)
    if (!chain) {
      return { error: `Invalid chain: ${rawTeam.chain} not supported in ${rawTeam.id}` }
    }

    // make sure delegatee address is valid address
    const delegateeAddress = Address.fromSs58(rawTeam.delegatee_address)
    if (!delegateeAddress) {
      return { error: `Invalid delegatee address: ${rawTeam.delegatee_address} in ${rawTeam.id}` }
    }

    // make sure proxied address is valid address
    const proxiedAddress = Address.fromSs58(rawTeam.proxied_address)
    if (!proxiedAddress) {
      return { error: `Invalid proxied address: ${rawTeam.proxied_address} in ${rawTeam.id}` }
    }

    const signers: Address[] = []
    // make sure all signers from multisig are valid addresses
    for (const signer of rawTeam.multisig_config.signers) {
      const signerAddress = Address.fromSs58(signer)
      if (!signerAddress) {
        return { error: `Invalid  Multisig Config: ${signer} in ${rawTeam.id}` }
      }
      signers.push(signerAddress)
    }
    // make sure threshold is valid number
    if (typeof rawTeam.multisig_config.threshold !== 'number') {
      return { error: `Invalid Multisig Config: Invalid threshold in ${rawTeam.id}` }
    }
    return {
      team: {
        id: rawTeam.id,
        name: rawTeam.name,
        multisigConfig: {
          threshold: rawTeam.multisig_config.threshold,
          signers,
        },
        chain,
        delegateeAddress,
        proxiedAddress,
      },
    }
  } catch (e) {
    console.error(e)
    return { error: 'Failed to parse team.' }
  }
}

export const TeamsWatcher: React.FC = () => {
  const selectedAccount = useRecoilValue(selectedAccountState)
  const setTeamsBySigner = useSetRecoilState(teamsBySignerState)

  const fetchTeams = useCallback(
    async (account: SignedInAccount) => {
      const { data, error } = await requestSignetBackend<{ team: RawTeam[] }>(TEAM_BY_SIGNER_QUERY, {}, account)

      if (data?.team) {
        const validTeams: Team[] = []
        // parse and validate each team from raw json to Team
        for (const rawTeam of data.team) {
          const { team, error } = parseTeam(rawTeam)
          if (!team || error) {
            console.error(error ?? 'Failed to parse team')
            continue
          }
          validTeams.push(team)
        }

        setTeamsBySigner(teamsBySigner => {
          return {
            ...teamsBySigner,
            [account.injected.address.toSs58()]: validTeams,
          }
        })
      } else {
        toast.error(error?.message || `Failed to fetch teams for ${account.injected.address.toSs58()}`)
      }
    },
    [setTeamsBySigner]
  )

  useEffect(() => {
    if (!selectedAccount) return

    fetchTeams(selectedAccount)
    // refresh every 15secs to update vaults in "real-time"
    const interval = setInterval(() => {
      fetchTeams(selectedAccount)
    }, 15_000)

    return () => {
      clearInterval(interval)
    }
  }, [fetchTeams, selectedAccount])

  return null
}

export const useTeamsBySigner = (): Team[] | undefined => {
  const selectedAccount = useRecoilValue(selectedAccountState)
  const teamsBySigner = useRecoilValue(teamsBySignerState)

  if (!selectedAccount) return []

  return teamsBySigner[selectedAccount.injected.address.toSs58()]
}

export const useSelectedTeam = (): Team | undefined => {
  const teams = useTeamsBySigner()
  const selectedTeamId = useRecoilValue(selectedTeamIdState)
  const selectedTeam = teams?.find(team => team.id === selectedTeamId)

  return selectedTeam ?? teams?.[0]
}

export const useCreateTeamOnHasura = () => {
  const signer = useRecoilValue(selectedAccountState)
  const [creatingTeam, setCreatingTeam] = useState(false)
  const setTeamsBySigner = useSetRecoilState(teamsBySignerState)
  const setSelectedTeamId = useSetRecoilState(selectedTeamIdState)

  const createTeam = useCallback(
    async (teamInput: {
      name: string
      chain: string
      multisigConfig: { signers: string[]; threshold: number }
      proxiedAddress: string
      delegateeAddress: string
    }): Promise<{ team?: Team; error?: string }> => {
      if (creatingTeam) return {}

      if (!signer) {
        return { error: 'Not signed in yet.' }
      }

      try {
        const res = await requestSignetBackend(
          gql`
            mutation CreateMultisigProxyTeam($team: InsertMultisigProxyInput!) {
              insertMultisigProxy(team: $team) {
                success
                team {
                  id
                  name
                  multisig_config
                  proxied_address
                  delegatee_address
                  chain
                }
                error
              }
            }
          `,
          {
            team: {
              name: teamInput.name,
              chain: teamInput.chain,
              multisig_config: teamInput.multisigConfig,
              proxied_address: teamInput.proxiedAddress,
              delegatee_address: teamInput.delegateeAddress,
            },
          },
          signer
        )

        const createdTeam = res.data?.insertMultisigproxy?.team
        const { team, error } = parseTeam(createdTeam)
        if (!team || error) return { error: error ?? 'Failed to store team data.' }

        setTeamsBySigner(teamsBySigner => {
          const newTeamsBySigner = { ...teamsBySigner }
          // update team for every signed in accounts
          createdTeam.multisigConfig.signers.forEach((signer: string) => {
            const teams = newTeamsBySigner[signer]
            if (teams) newTeamsBySigner[signer] = [...teams, createdTeam]
          })
          return newTeamsBySigner
        })
        setSelectedTeamId(team.id)
        return { team }
      } catch (e: any) {
        console.error(e)
        return { error: typeof e === 'string' ? e : e.message ?? 'Unknown error' }
      } finally {
        setCreatingTeam(false)
      }
    },
    [creatingTeam, setSelectedTeamId, setTeamsBySigner, signer]
  )

  return { createTeam, creatingTeam }
}
