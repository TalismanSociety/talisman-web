export function useURLParams(params: string[]): string[] {
  const paramData: string[] = []

  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)

  params.forEach((param: string) => {
    const res = urlParams.get(param)
    if (res) {
      paramData.push(res)
    }
  })

  return paramData
}

// export function
