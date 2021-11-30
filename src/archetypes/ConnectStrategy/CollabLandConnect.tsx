import { useFetchNFTs } from '@libs/spiritkey/spirit-key'
import { useExtensionAutoConnect } from '@libs/talisman'

export const CollabLandConnect = ({ referrer, urlParams }) => {
  useExtensionAutoConnect()
  const totalNFTs = useFetchNFTs()

  if (totalNFTs === undefined) {
    return <>Loading...</>
  }

  if (totalNFTs.length > 0) {
    const href = `${referrer}polkadotjs?${urlParams.toString()}&token=123`
    console.log(`>>> referrer`, referrer)
    return (
      <>
        <div>Haz {totalNFTs.length} Spirit Keyz</div>
        <div>
          URL: <a href={href}>Click here to finish setup</a>
        </div>
      </>
    )
  }

  return <>No Spiritz...</>
}
