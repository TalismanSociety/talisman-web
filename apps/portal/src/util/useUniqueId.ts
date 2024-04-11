import { useRef } from 'react'

const uniqueIds: Record<string, true> = {}

export default function useUniqueId(): string {
  const idRef = useRef<null | string>(null)
  if (idRef.current !== null) return idRef.current

  idRef.current = generateId()
  while (uniqueIds[idRef.current] !== undefined) {
    idRef.current = generateId()
  }
  uniqueIds[idRef.current] = true

  return idRef.current
}

function generateId() {
  return Math.trunc(Math.random() * Math.pow(10, 8)).toString(16)
}
