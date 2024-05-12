import styled from '@emotion/styled'
import PauseCircle from '../../assets/icons/pause-circle.svg?react'
import PlayCircle from '../../assets/icons/play-circle.svg?react'
import { useAudio } from '../../util/useAudio'

export const SimplePlay = styled(({ className, src }: { className?: string; src: string }) => {
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
