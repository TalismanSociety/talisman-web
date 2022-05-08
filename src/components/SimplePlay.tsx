import { ReactComponent as PauseCircle } from '@icons/pause-circle.svg'
import { ReactComponent as PlayCircle } from '@icons/play-circle.svg'
import { useAudio } from '@util/useAudio'
import styled from 'styled-components'

export const SimplePlay = styled(({ className, src }) => {
  const { isPlaying, togglePlay } = useAudio(src)
  return (
    <button className={className} onClick={togglePlay}>
      {isPlaying ? <PauseCircle /> : <PlayCircle />}
    </button>
  )
})`
  padding: 0;
  border: 0;
  background: inherit;
  cursor: pointer;
  display: flex;

  svg {
    width: 3rem;
    height: auto;
  }
`
