import { SurfaceIconButton } from '@talismn/ui/atoms/IconButton'
import { SearchBar } from '@talismn/ui/molecules/SearchBar'
import { Search } from '@talismn/web-icons'
import { LayoutGroup, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'

import { lookupAccountAddressState } from '@/domains/accounts/recoils'
import { isNilOrWhitespace } from '@/util/nil'

const MotionSearch = motion(Search)

export const AddressSearch = () => {
  const searchBarRef = useRef<HTMLInputElement>(null)
  const [address, setAddress] = useRecoilState(lookupAccountAddressState)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!isNilOrWhitespace(address)) {
      setRevealed(true)
    }
  }, [address])

  useEffect(() => {
    if (
      searchBarRef.current !== null &&
      searchBarRef.current !== document.activeElement &&
      isNilOrWhitespace(address)
    ) {
      setRevealed(false)
    }
  }, [address])

  return (
    <LayoutGroup>
      {revealed ? (
        <motion.div layoutId="address-search">
          <SearchBar
            autoFocus
            ref={searchBarRef}
            placeholder="Look up any address"
            value={address ?? ''}
            onChange={event => setAddress(event.target.value)}
            onBlur={() => {
              if (isNilOrWhitespace(address)) {
                setRevealed(false)
              }
            }}
          />
        </motion.div>
      ) : (
        <motion.div layoutId="address-search">
          <SurfaceIconButton onClick={() => setRevealed(true)}>
            <MotionSearch layout />
          </SurfaceIconButton>
        </motion.div>
      )}
    </LayoutGroup>
  )
}
