import { gql } from 'graphql-request'
import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil'
import { SignedInAccount, selectedAccountState } from '../auth'
import { useCallback, useEffect, useState } from 'react'
import { requestSignetBackend } from './hasura'
import { Address, toMultisigAddress } from '@util/addresses'
import { Chain, supportedChains } from '../chains'
import toast from 'react-hot-toast'
import { Multisig, selectedMultisigIdState, useUpsertMultisig } from '../multisig'

type RawTeam = {
  id: string
  name: string
  multisig_config: any
  proxied_address: string
  chain: string
}

export class Team {
  constructor(
    public id: string,
    public name: string,
    public multisigConfig: {
      threshold: number
      signers: Address[]
    },
    public chain: Chain,
    public proxiedAddress: Address,
    public delegateeAddress: Address
  ) {}

  toMultisig(): Multisig {
    return {
      id: this.id,
      name: this.name,
      multisigAddress: toMultisigAddress(this.multisigConfig.signers, this.multisigConfig.threshold),
      proxyAddress: this.proxiedAddress,
      signers: this.multisigConfig.signers,
      threshold: this.multisigConfig.threshold,
      chain: this.chain,
    }
  }
}

export const teamsBySignerState = atom<Record<string, Team[]>>({
  key: 'teamsBySigner',
  default: {},
  dangerouslyAllowMutability: true,
})

export const activeTeamsState = selector({
  key: 'activeTeams',
  get: ({ get }) => {
    const selectedAccount = get(selectedAccountState)
    const teamsBySigner = get(teamsBySignerState)

    if (!selectedAccount) return []

    return teamsBySigner[selectedAccount.injected.address.toSs58()]
  },
})

const TEAM_BY_SIGNER_QUERY = gql`
  query TeamBySigner {
    team {
      id
      name
      chain
      multisig_config
      proxied_address
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

    // make sure proxied address is valid address
    const proxiedAddress = Address.fromSs58(rawTeam.proxied_address)
    if (!proxiedAddress) {
      return { error: `Invalid proxied address: ${rawTeam.proxied_address} in ${rawTeam.id}` }
    }

    const rawSigners = rawTeam.multisig_config.signers
    const rawThreshold = rawTeam.multisig_config.threshold

    const signers: Address[] = []
    let delegateeAddress: Address | undefined
    let threshold = 0

    // find the delegatee address (i.e. multisig)
    if (rawSigners && rawSigners.length > 0 && rawThreshold) {
      // validate all signers from multisig config
      for (const signer of rawTeam.multisig_config.signers) {
        const signerAddress = Address.fromSs58(signer)
        if (!signerAddress) {
          return { error: `Invalid  Multisig Config: ${signer} in ${rawTeam.id}` }
        }
        signers.push(signerAddress)
      }
      // validate threshold value
      if (typeof rawThreshold !== 'number' || rawThreshold > signers.length) {
        return { error: `Invalid Multisig Config: Invalid threshold in ${rawTeam.id}` }
      }
      threshold = rawTeam.multisig_config.threshold

      // derive delegatee address from multisig config
      delegateeAddress = toMultisigAddress(signers, threshold)
    }

    // not a valid vault if no delegateeAddress, a signet vault consists of 1 multisig that is proxy to another acc
    if (!delegateeAddress) return { error: `Missing multisig config / delegatee address in ${rawTeam.id}` }

    return {
      team: new Team(
        rawTeam.id,
        rawTeam.name,
        {
          threshold: rawTeam.multisig_config.threshold,
          signers,
        },
        chain,
        proxiedAddress,
        delegateeAddress
      ),
    }
  } catch (e) {
    console.error(e)
    return { error: 'Failed to parse team.' }
  }
}

export const TeamsWatcher: React.FC = () => {
  const selectedAccount = useRecoilValue(selectedAccountState)
  const setTeamsBySigner = useSetRecoilState(teamsBySignerState)
  const upsertMultisig = useUpsertMultisig()

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

          // sync teams from backend to multisigs list
          upsertMultisig(team.toMultisig())
        }

        setTeamsBySigner(teamsBySigner => ({
          ...teamsBySigner,
          [account.injected.address.toSs58()]: validTeams,
        }))
      } else {
        toast.error(error?.message || `Failed to fetch teams for ${account.injected.address.toSs58()}`)
      }
    },
    [setTeamsBySigner, upsertMultisig]
  )

  useEffect(() => {
    if (!selectedAccount) return
    // fetch teams for selected account for the first time
    fetchTeams(selectedAccount)

    // refresh every 15secs to update vaults in "real-time"
    const interval = setInterval(() => {
      fetchTeams(selectedAccount)
    }, 15_000)

    return () => clearInterval(interval)
  }, [fetchTeams, selectedAccount])

  return null
}

export const useCreateTeamOnHasura = () => {
  const signer = useRecoilValue(selectedAccountState)
  const [creatingTeam, setCreatingTeam] = useState(false)
  const setTeamsBySigner = useSetRecoilState(teamsBySignerState)
  const upsertMultisig = useUpsertMultisig()
  const setSelectedMultisigId = useSetRecoilState(selectedMultisigIdState)

  const createTeam = useCallback(
    async (teamInput: {
      name: string
      chain: string
      multisigConfig: { signers: string[]; threshold: number }
      proxiedAddress: string
    }): Promise<{ team?: Team; error?: string }> => {
      if (creatingTeam) return {}

      if (!signer) return { error: 'Not signed in yet.' }

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
            },
          },
          signer
        )

        if (res.data?.insertMultisigProxy?.error) return { error: res.data?.insertMultisigProxy?.error }
        const createdTeam = res.data?.insertMultisigProxy?.team
        const { team, error } = parseTeam(createdTeam)
        if (!team || error) return { error: error ?? 'Failed to store team data.' }

        upsertMultisig(team.toMultisig())
        setTeamsBySigner(teamsBySigner => {
          const newTeamsBySigner = { ...teamsBySigner }
          // update team for every signed in accounts
          team.multisigConfig.signers.forEach(signer => {
            const teams = newTeamsBySigner[signer.toSs58()]
            if (teams) newTeamsBySigner[signer.toSs58()] = [...teams, team]
          })
          return newTeamsBySigner
        })
        setSelectedMultisigId(team.id)
        return { team }
      } catch (e: any) {
        console.error(e)
        return { error: typeof e === 'string' ? e : e.message ?? 'Unknown error' }
      } finally {
        setCreatingTeam(false)
      }
    },
    [creatingTeam, setSelectedMultisigId, setTeamsBySigner, signer, upsertMultisig]
  )

  return { createTeam, creatingTeam }
}

export const changingMultisigConfigState = atom<boolean>({
  key: 'changingMultisigConfig',
  default: false,
})

export const useUpdateMultisigConfig = () => {
  const upsertMultisig = useUpsertMultisig()

  const updateMultisigConfig = useCallback(
    async (newMultisig: Multisig, signedInAs: SignedInAccount | null) => {
      if (signedInAs) {
        try {
          const res = await requestSignetBackend(
            gql`
              mutation UpdateMultisigConfig($teamId: String!, $changeConfigDetails: ChangeConfigDetailsInput!) {
                updateMultisigConfig(teamId: $teamId, changeConfigDetails: $changeConfigDetails) {
                  success
                  team {
                    id
                    name
                    multisig_config
                    proxied_address
                    chain
                  }
                  error
                }
              }
            `,
            {
              teamId: newMultisig.id,
              changeConfigDetails: {
                signers: newMultisig.signers.map(signer => signer.toSs58()),
                threshold: newMultisig.threshold,
              },
            },
            signedInAs
          )

          if (res.error) throw new Error(res.error)
        } catch (e) {
          console.error(e)
          toast.error('Failed to save multisig config change.')
        }
      }
      upsertMultisig(newMultisig)
    },
    [upsertMultisig]
  )

  return { updateMultisigConfig }
}
