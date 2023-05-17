import { useEffect, useRef, useState } from 'react'

export function useAudio(src: string, play?: boolean) {
  const audioRef = useRef(new Audio(src))
  const [isPlaying, setPlaying] = useState(false)

  useEffect(() => {
    if (isPlaying) {
      void audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
    const ref = audioRef.current
    return () => {
      ref.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    if (play !== undefined) {
      setPlaying(play)
    }
  }, [play])

  function togglePlay() {
    setPlaying(!isPlaying)
  }

  return {
    isPlaying,
    setPlaying,
    togglePlay,
  }
}
