// To be worked on further to implement composable NFTs attributes.

export async function useComposableProperties(url: string) {
  const res = await fetch(url)
  const parsed = await res.json()

  // Return the parsed Values
}
