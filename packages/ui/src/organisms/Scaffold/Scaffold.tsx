import { css } from '@emotion/react'
import { type PropsWithChildren, type ReactNode } from 'react'
import { Toaster } from '..'
import { useMediaQuery } from '../../utils'

type Breakpoint = 'narrow' | 'wide' | undefined

export type ScaffoldProps = PropsWithChildren<{
  topBar?: ReactNode
  bottomBar?: ReactNode
  sideBar?: ReactNode
  drawer?: ReactNode
  footer?: ReactNode
  breakpoints?: {
    topBar?: Breakpoint
    bottomBar?: Breakpoint
    sideBar?: Breakpoint
    drawer?: Breakpoint
    footer?: Breakpoint
  }
}>

export const SCAFFOLD_WIDE_VIEW_MEDIA_SELECTOR = '@media(min-width: 1024px)'

const breakpointToCss = (breakpoint: Breakpoint) =>
  css({
    display: breakpoint === 'narrow' ? 'revert' : breakpoint === 'wide' ? 'none' : undefined,
    [SCAFFOLD_WIDE_VIEW_MEDIA_SELECTOR]: {
      display: breakpoint === 'wide' ? 'revert' : breakpoint === 'narrow' ? 'none' : undefined,
    },
  })

const Scaffold = (props: ScaffoldProps) => (
  <div
    css={[
      css`
        min-height: 100vh;
        /* Avoid Chrome seeing the hack */
        @supports (-webkit-touch-callout: none) {
          body {
            /* The hack for Safari */
            height: -webkit-fill-available;
          }
        }
      `,
      {
        [SCAFFOLD_WIDE_VIEW_MEDIA_SELECTOR]: {
          display: 'grid',
          gap: '4.8rem',
          gridTemplateColumns: 'min-content 1fr',
          gridTemplateAreas: `
            'side   main'
            'side   main'
            'footer footer'
          `,
        },
      },
    ]}
  >
    <div
      css={[
        {
          position: 'sticky',
          top: 0,
          right: 0,
          left: 0,
          zIndex: 1,
        },
        breakpointToCss(props.breakpoints?.topBar),
      ]}
    >
      {props.topBar}
    </div>
    <div css={[{ gridArea: 'side' }, breakpointToCss(props.breakpoints?.sideBar)]}>
      <div css={{ position: 'sticky', top: '2.4rem', marginLeft: '2.4rem' }}>{props.sideBar}</div>
    </div>
    <main
      css={{
        gridArea: 'main',
        padding: '2.4rem 2.4rem 10rem 2.4rem',
        [SCAFFOLD_WIDE_VIEW_MEDIA_SELECTOR]: { paddingBottom: 0, paddingLeft: 0 },
      }}
    >
      {props.children}
    </main>
    <div css={[{ position: 'fixed', right: 0, bottom: 0, left: 0 }, breakpointToCss(props.breakpoints?.bottomBar)]}>
      {props.bottomBar}
    </div>
    <footer
      css={[
        {
          gridArea: 'footer',
          alignSelf: 'end',
        },
        breakpointToCss(props.breakpoints?.footer),
      ]}
    >
      {props.footer}
    </footer>
    <div css={breakpointToCss(props.breakpoints?.drawer)}>{props.drawer}</div>
    <Toaster
      position={useMediaQuery(SCAFFOLD_WIDE_VIEW_MEDIA_SELECTOR) ? 'top-right' : 'top-center'}
      css={{ zIndex: 2 }}
    />
  </div>
)

export default Scaffold
