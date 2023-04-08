import { css } from '@emotion/css'
import { AnimatePresence } from 'framer-motion'
import React from 'react'
import { useKeyPress } from 'react-use'
import { atom, useRecoilState } from 'recoil'

export const createMultisigModalOpenState = atom<boolean>({
  key: 'CreateMultisigModalOpen',
  default: false,
})

const wrapperStyles = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  z-index: 998;
`

const contentStyles = css`
  max-width: 1092px;
  margin: 2rem;
  overflow-y: auto;
  background: red;
  border-radius: 1.6rem;
  padding: 5.4rem 3.6rem 3.6rem 3.6rem;
  z-index: 1000;
  position: relative;
`

export const CreateMultisigModal = () => {
  const [escPressed] = useKeyPress('Escape')
  const [isOpen, setIsOpen] = useRecoilState(createMultisigModalOpenState)
  console.log({ escPressed, isOpen })
  if (!isOpen) return null
  if (escPressed) setIsOpen(false)

  return (
    <AnimatePresence>
      <div
        className={wrapperStyles}
        onClick={() => {
          setIsOpen(false)
        }}
      >
        <div
          className={contentStyles}
          onClick={event => {
            event.stopPropagation()
          }}
        >
          hello this is content
        </div>
      </div>
    </AnimatePresence>
  )
}
