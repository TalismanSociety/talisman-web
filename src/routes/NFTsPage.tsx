
import { useState } from 'react'
import { NFT, Account } from '@archetypes'
import styled from 'styled-components'
import { device } from '@util/breakpoints'

const NFTsPage = styled(({ className }: any) => {

  const [address, setAddress] = useState<string|undefined>()

  return (
    <section className={className}>
      <header>
        <h1>NFTs</h1>
        <Account.Picker 
          onChange={({address}: any) => setAddress(address)}
        />
      </header>
      <article>
        <NFT.List address={address}/>
      </article>
    </section>
  )
})`
  width: 100%;
  max-width: 1280px;
  margin: 3rem auto;
  @media ${device.xl} {
    margin: 6rem auto;
  }
  padding: 0 2.4rem;
`

export default NFTsPage

