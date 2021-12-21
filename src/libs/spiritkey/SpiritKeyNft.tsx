import miksySpiritKeysAudio from '@assets/miksy-spirit-keys.mp3'
import { SimplePlay } from '@components/SimplePlay'
import styled from 'styled-components'

const Attribution = styled(({ className }) => {
  return (
    <span className={className}>
      Music by{' '}
      <a
        href="https://soundcloud.com/miksyyy/spirit-keys?si=45ddd3a44b7c4ecc80ca1c31a1a846d9"
        target="_blank"
        rel="noreferrer noopener"
      >
        Miksy
      </a>
    </span>
  )
})`
  color: var(--color-dim);
  a {
    color: var(--color-mid);
    text-decoration: underline;
  }
`

// TODO: Deprecate
export const SpiritKeyNft = styled(({ className, src }) => {
  // NOTE: Reference usage
  // const baseImage = 'https://rmrk.mypinata.cloud/ipfs/bafybeicuuasrqnqndfw3k6rqacfpfil5sc5fhyjh63riqnd2imm5eucrk4'
  // <SpiritKeyNft src={hasNfts ? nft?.image?.replace('ipfs://', 'https://rmrk.mypinata.cloud/') : baseImage} />
  return (
    <div className={className}>
      <div className="floating-card__card">
        <div className="floating-card__card__inner-container">
          <img className="spirit-key-image" src={src} alt="Spirit Key" />

          <div className="floating-card__card__inner-container__shimmer"></div>
        </div>

        <div className="floating-card__card__background-scroller"></div>
      </div>
      <div className="spirit-keys-music-info">
        <SimplePlay src={miksySpiritKeysAudio} />
        <Attribution />
      </div>
    </div>
  )
})`
  .spirit-keys-music-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin: 1.5rem;
  }

  .spirit-key-image {
    width: 100%;
    object-fit: cover;
    &:hover {
      cursor: pointer;
      position: relative;

      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }

  .floating-card__card {
    width: 316px;
    height: 316px;
    background: #fff;
    position: relative;
    margin: 4rem auto 0;
    padding: 10px;
    text-align: center;
    box-shadow: 1px 1px 1px #000;
    overflow: hidden;
    animation: floating 10s ease-in-out infinite;
  }

  .floating-card__card__inner-container {
    width: 97%;
    height: 97%;
    background: #dbdbdb;
    margin: 0 auto;
    z-index: 2;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
  }

  .floating-card__card__inner-container__shimmer {
    width: 200%;
    height: 40px;
    background: #eee;
    position: absolute;
    top: -80%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    animation-name: slideBottomRightAndBack;
    animation-duration: 4s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  .floating-card__card__background-scroller {
    width: 1800px;
    height: 300px;
    background: orange;
    position: absolute;
    top: -800px;
    left: 20%;
    transform: translate(-50%, 0) rotate(-35deg);
    animation-name: slideBottomRight;
    animation-duration: 5s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  .floating-card__floor-shadow {
    width: 200px;
    height: 10px;
    background: #000;
    margin: 20px auto 0 auto;
    border-radius: 40%;
    animation: scalingShadow 10s ease-in-out infinite;
  }

  @keyframes floating {
    25% {
      transform: translateY(5px);
    }
    50% {
      transform: translateY(0px);
    }
    75% {
      transform: translateY(5px);
    }
    100% {
      transform: translateY(0px);
    }
  }

  @keyframes scalingShadow {
    25% {
      transform: scale(1.05);
    }
    50% {
      transform: scale(1);
    }
    75% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes slideBottomRight {
    0% {
      transform: translate(-50%, 0) rotate(-35deg);
    }
    100% {
      transform: translate(-50%, 2200px) rotate(-35deg);
    }
  }

  @keyframes slideBottomRightAndBack {
    0% {
      transform: translate(-50%, 0) rotate(-45deg);
    }
    90% {
      transform: translate(-50%, 0) rotate(-45deg);
    }
    100% {
      transform: translate(-50%, 900px) rotate(-45deg);
    }
  }
`
