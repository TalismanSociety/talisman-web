import { SignedInAccount } from '../auth'
import { Variables, request } from 'graphql-request'

const HASURA_ENDPOINT = process.env.REACT_APP_HASURA_ENDPOINT ?? ''

type Response<TData = any> = {
  data?: TData
  error?: any
}

export const requestSignetBackend = async <TData = any, TVariables extends Variables = any>(
  query: string,
  variables?: TVariables,
  signer?: SignedInAccount
): Promise<Response<TData>> => {
  const headers = new Headers()
  if (signer?.jwtToken) headers.append('Authorization', `Bearer ${signer.jwtToken}`)

  try {
    const data = await request<TData>(`${HASURA_ENDPOINT}/v1/graphql`, query, variables, headers)
    return { data }
  } catch (error) {
    return { error }
  }
}
