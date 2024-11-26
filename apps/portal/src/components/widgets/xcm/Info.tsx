import type { PropsWithChildren, ReactNode } from 'react'
import { useTheme } from '@talismn/ui'
import { FileSearch, HelpCircle } from '@talismn/web-icons'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import { DEX_FORM_WIDE_MEDIA_SELECTOR } from './constants'

export type InfoProps = {
  details: ReactNode
  footer: ReactNode
  faq: ReactNode
  focusedSection?: 'details' | 'faq'
  onChangeFocusedSection?: (section: 'details' | 'faq') => unknown
}

export function Info(props: InfoProps) {
  const [_activeSection, _setFocusedSection] = useState<'details' | 'faq'>('details')
  const focusedSection = 'focusedSection' in props ? props.focusedSection : _activeSection
  const onChangeFocusedSection = 'onChangeFocusedSection' in props ? props.onChangeFocusedSection : _setFocusedSection

  return (
    <Container
      header={
        <header className="flex items-center justify-end gap-[4px]">
          <InfoTabIcon
            selected={focusedSection === 'details'}
            icon={<FileSearch size={16} />}
            onClick={() => onChangeFocusedSection?.('details')}
          />
          <InfoTabIcon
            selected={focusedSection === 'faq'}
            icon={<HelpCircle size={16} />}
            onClick={() => onChangeFocusedSection?.('faq')}
          />
        </header>
      }
      footer={props.footer}
    >
      {focusedSection === 'details' ? props.details : focusedSection === 'faq' ? props.faq : null}
    </Container>
  )
}

const InfoTabIcon = ({ selected, icon, onClick }: { selected?: boolean; icon?: ReactNode; onClick?: () => void }) => (
  <div
    className={cn(
      'hover:text-primary cursor-pointer p-[8px] duration-150',
      selected ? 'text-primary' : 'text-gray-600'
    )}
    onClick={onClick}
  >
    {icon}
  </div>
)

type ContainerProps = PropsWithChildren<{ header: ReactNode; footer?: ReactNode }>

function Container(props: ContainerProps) {
  const theme = useTheme()

  return (
    <section
      css={{
        display: 'flex',
        flexDirection: 'column',
        border: `2px solid ${theme.color.outlineVariant}`,
        borderRadius: '1.2rem',
        padding: '1.6rem',
        [DEX_FORM_WIDE_MEDIA_SELECTOR]: {
          width: '34rem',
          borderLeft: `64px solid transparent`,
          borderRadius: '0 1.2rem 1.2rem 0',
          '> div': {
            marginLeft: '-64px',
          },
        },
      }}
    >
      <div css={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
        {props.header}
        <div
          css={{
            display: 'contents',
            flex: 1,
            overflow: 'auto',
            [DEX_FORM_WIDE_MEDIA_SELECTOR]: { display: 'revert' },
          }}
        >
          <div
            css={{
              display: 'contents',
              height: 0,
              minHeight: '100%',
              [DEX_FORM_WIDE_MEDIA_SELECTOR]: { display: 'revert' },
            }}
          >
            {props.children}
          </div>
        </div>
        {props.footer}
      </div>
    </section>
  )
}
