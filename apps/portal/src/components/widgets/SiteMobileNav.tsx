import type { ReactNode } from 'react'
import { keyframes, useTheme } from '@emotion/react'
import { Dialog } from '@talismn/ui/atoms/Dialog'
import { useSurfaceColorAtElevation } from '@talismn/ui/atoms/Surface'
import { Text } from '@talismn/ui/atoms/Text'
import { X } from '@talismn/web-icons'
import { IconContext } from '@talismn/web-icons/utils'
import { createContext, useCallback, useContext } from 'react'

export type SiteMobileNavProps = {
  open?: boolean
  onRequestDismiss?: () => unknown
  headerIcon?: ReactNode
  footer?: ReactNode
  children?: ReactNode
}

const Context = createContext<Pick<SiteMobileNavProps, 'open' | 'onRequestDismiss'>>({})

const backdropKeyframes = keyframes`
  from {
    background: rgba(18,18,18,0);
    backdrop-filter: blur(0);
  }
  to {
    background: rgba(18,18,18,0.9);
    backdrop-filter: blur(32px);
  }
`

export const SiteMobileNav = Object.assign(
  ({ open, onRequestDismiss, headerIcon, children, footer }: SiteMobileNavProps) => (
    <Dialog
      open={open}
      onClickBackdrop={onRequestDismiss}
      css={{
        width: '100%',
        maxWidth: '100%',
        height: '100%',
        maxHeight: '100%',
        border: 'none',
        margin: 0,
        padding: 0,
        backgroundColor: 'transparent',
        '&[open]': {
          '::backdrop': {
            background: 'rgba(18,18,18,0.9)',
            backdropFilter: 'blur(32px)',
            animation: `${backdropKeyframes} .5s ease forwards`,
          },
        },
      }}
    >
      <Context.Provider value={{ open, onRequestDismiss }}>
        <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col gap-8 overflow-auto px-8">
          <header className="flex h-32 shrink-0 items-center justify-between gap-8">
            {headerIcon}
            <button className="block p-4" type="button" onClick={onRequestDismiss}>
              <X />
            </button>
          </header>
          <ul className="flex flex-grow list-none flex-col gap-4 px-16">{children}</ul>
          {footer}
        </div>
      </Context.Provider>
    </Dialog>
  ),
  { Item: SiteMobileNavItem }
)

function SiteMobileNavItem({ icon, label, onClick }: { icon: ReactNode; label: ReactNode; onClick?: () => void }) {
  const theme = useTheme()
  const context = useContext(Context)

  return (
    <button
      onClick={useCallback(() => {
        onClick?.()
        context.onRequestDismiss?.()
      }, [context, onClick])}
      css={{
        border: 'none',
        borderRadius: theme.shape.extraLarge,
        boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.25)',
        width: '100%',
        padding: '2.4rem 4rem',
        backgroundColor: `color-mix(in srgb, ${useSurfaceColorAtElevation(x => x + 1)}, transparent 60%)`,
        cursor: 'pointer',
        ':hover': { filter: 'brightness(1.2)' },
      }}
    >
      <Text.BodyLarge
        alpha="high"
        css={{
          display: 'flex',
          alignItems: 'center',
          gap: '3.7rem',
          '@media(min-width: 375px)': { fontSize: '2.4rem' },
        }}
      >
        <IconContext.Provider value={{ size: '1em' }}>{icon}</IconContext.Provider>
        {label}
      </Text.BodyLarge>
    </button>
  )
}
