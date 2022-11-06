import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client'
import { ChevronDown, SkipBack, SkipForward } from '@components/atoms/Icon'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'

const getClient = async () => {
  return new ApolloClient({
    link: createHttpLink({ uri: 'https://gql.rmrk.link/v1/graphql' }),
    cache: new InMemoryCache(),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}

const QUERY = gql`
  query ($address: String!) {
    nfts(where: { owner: { _eq: $address }, burned: { _eq: "" } }) {
      metadata_name
      resources {
        metadata_content_type
        src
      }
    }
  }
`

const PlayerBase = styled.div`
  // sticky box of 400x400 in the center top of the screen with a blue background
  position: fixed;
  top: 0;
  right: 50%;
  transform: translateX(50%);
  z-index: 10;
  width: 400px;
  background-color: var(--color-background);
  transition: height 0.5s ease-in-out;
  border-radius: 0 0 10px 10px;
`

const RamenStudio = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <PlayerBase
        css={{
          height: open ? '100px' : '0px',
          borderBottom: open ? '1px solid var(--color-primary)' : 'none',
          borderLeft: open ? '1px solid var(--color-primary)' : 'none',
          borderRight: open ? '1px solid var(--color-primary)' : 'none',
        }}
      >
        {open && <Player></Player>}
      </PlayerBase>
      <ChevronDown
        css={{
          'position': 'fixed',
          'top': '20px',
          'right': '50%',
          'transform': 'translateX(50%)',
          'cursor': 'pointer',
          'color': 'transparent',
          '&:hover': {
            color: 'var(--color-primary)',
          },
        }}
        onClick={() => {
          setOpen(true)
        }}
      />
    </>
  )
}

const Player = () => {
  const [song, setSong] = useState(undefined)
  const [songList, setSongList] = useState([])

  const address = 'ESMddXAAxypPjiRnFinnHWfmG5V4H2sZB5P6g3QFXjzUwYF'

  useEffect(() => {
    const fetchSongs = async () => {
      if (!address || address.startsWith('0x')) return

      const client = await getClient()
      console.log(client)

      await client.query({ query: QUERY, variables: { address: address } }).then(({ data }) => {
        data.nfts.forEach(async nft => {
          nft.resources.forEach(async resource => {
            if (!resource.metadata_content_type) return
            if (resource.metadata_content_type.startsWith('audio')) {
              // console.log(resource.src)
              setSongList(songList => [
                ...songList,
                {
                  name: nft.metadata_name,
                  src: resource.src.replace('ipfs://', 'https://talisman.mypinata.cloud/'),
                  index: songList.length,
                },
              ])
            }
          })
        })
      })
    }

    fetchSongs()

    if (songList.length > 0 && !song) {
      setSong(songList[0])
    }
  }, [songList])

  return (
    <div>
      {song && (
        <>
          <span
            css={{
              position: 'absolute',
              top: '20px',
              textAlign: 'center',
              width: '80%',
              left: '50%',
              transform: 'translateX(-50%)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: 'var(--color-primary)',
            }}
          >
            {song.name} {song.index}
          </span>
          <audio
            src={song.src}
            controls
            css={{
              width: '100%',
              position: 'absolute',
              bottom: 0,
              borderRadius: '0 0 10px 10px',
            }}
          />
          <SkipForward
            css={{
              position: 'absolute',
              top: '20px',
              right: '10px',
              cursor: 'pointer',
              color: 'var(--color-primary)',
            }}
            onClick={() => {
              setSong(songList[song.index + 1])
            }}
          />
          <SkipBack
            css={{
              position: 'absolute',
              top: '20px',
              left: '10px',
              cursor: 'pointer',
              color: 'var(--color-primary)',
            }}
            onClick={() => {
              setSong(songList[song.index - 1])
            }}
          />
        </>
      )}
    </div>
  )
}

export default RamenStudio
