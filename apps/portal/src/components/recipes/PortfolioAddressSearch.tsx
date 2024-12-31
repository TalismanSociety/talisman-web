import { SurfaceIconButton } from '@talismn/ui/atoms/IconButton'
import { SearchBar } from '@talismn/ui/molecules/SearchBar'
import { Search } from '@talismn/web-icons'
import { LayoutGroup } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'

import { lookupAccountAddressState } from '@/domains/accounts/recoils'
import { isNilOrWhitespace } from '@/util/nil'

export const PortfolioAddressSearch = ({ className }: { className?: string }) => {
  const searchBarRef = useRef<HTMLInputElement>(null)
  const [address, setAddress] = useRecoilState(lookupAccountAddressState)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (isNilOrWhitespace(address)) return
    setRevealed(true)
  }, [address])

  useEffect(() => {
    if (searchBarRef.current === null) return
    if (searchBarRef.current === document.activeElement) return
    if (!isNilOrWhitespace(address)) return
    setRevealed(false)
  }, [address])

  return (
    <LayoutGroup>
      {revealed ? (
        <div className={className}>
          <SearchBar
            autoFocus
            ref={searchBarRef}
            placeholder="Look up any address"
            value={address ?? ''}
            onChange={event => setAddress(event.target.value)}
            onBlur={() => isNilOrWhitespace(address) && setRevealed(false)}
          />
        </div>
      ) : (
        <div className={className}>
          <SurfaceIconButton onClick={() => setRevealed(true)}>
            <Search />
          </SurfaceIconButton>
        </div>
      )}
    </LayoutGroup>
  )
}
