import { useLocation } from 'react-router'

export function useUrlParams(params: string[]): string[] {
  const paramData: string[] = []

  const { search } = useLocation()
  const urlParams = new URLSearchParams(search)

  params.forEach((param: string) => {
    const res = urlParams.get(param)
    if (res) {
      paramData.push(res)
    }
  })

  return paramData
}
