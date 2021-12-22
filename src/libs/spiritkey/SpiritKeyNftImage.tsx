import spiritKeyNftImage from '@assets/spirit-key-nft.png'
import styled from 'styled-components'

export const SpiritKeyNftImage = styled(({ className, border }) => {
  return (
    <div className={className}>
      <img src={spiritKeyNftImage} alt="Spirit Key NFT" />
    </div>
  )
})`
  ${props =>
    props.border &&
    `
    border: 1px solid var(--color-mid);
    border-radius: 3rem;
  `}
  padding: 1.2rem;
  height: 23.5rem;
  width: 23.5rem;
  margin: auto;

  img {
    height: 100%;
    width: auto;
    border-radius: 2rem;
    transition: all 0.15s ease-out;

    &:hover {
      box-shadow: 0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0, 0, 0, 0);
      margin-top: -0.25rem;
    }
  }

  :hover {
    transition: all 0.15s ease-in;
    padding: 0.8rem;
  }
`
