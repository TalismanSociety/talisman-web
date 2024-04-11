import { useEffect, useState } from 'react'

const useImageWithFallback = (original: string | undefined, fallback: string | undefined) => {
  const [src, setSrc] = useState(original ?? fallback)

  useEffect(() => {
    if (fallback === undefined) {
      setSrc(original)
    }

    if (original === undefined) {
      setSrc(fallback)
      return
    }

    const image = new Image()

    image.onload = () => setSrc(original)
    image.onerror = () => setSrc(fallback)
    image.src = original
  }, [fallback, original])

  return src
}

export default useImageWithFallback
