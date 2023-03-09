import { css } from '@emotion/react'
import { PropsWithChildren, ReactNode } from 'react'

export type ScaffoldProps = PropsWithChildren<{
  topBar: ReactNode
  bottomBar: ReactNode
  sideBar: ReactNode
  footer?: ReactNode
}>

const WIDE_VIEW_MEDIA_SELECTOR = '@media(min-width: 1024px)'

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
        [WIDE_VIEW_MEDIA_SELECTOR]: {
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
      css={{
        position: 'sticky',
        top: 0,
        right: 0,
        left: 0,
        zIndex: 1,
        [WIDE_VIEW_MEDIA_SELECTOR]: { display: 'none' },
      }}
    >
      {props.topBar}
    </div>
    <div css={{ display: 'none', gridArea: 'side', [WIDE_VIEW_MEDIA_SELECTOR]: { display: 'initial' } }}>
      <div css={{ position: 'sticky', top: '2.4rem', marginLeft: '2.4rem' }}>{props.sideBar}</div>
    </div>
    <main
      css={{
        gridArea: 'main',
        padding: '2.4rem 2.4rem 10rem 2.4rem',
        [WIDE_VIEW_MEDIA_SELECTOR]: { paddingBottom: 0, paddingLeft: 0 },
      }}
    >
      {props.children}
    </main>
    <div css={{ position: 'fixed', right: 0, bottom: 0, left: 0, [WIDE_VIEW_MEDIA_SELECTOR]: { display: 'none' } }}>
      {props.bottomBar}
    </div>
    <footer
      css={{
        gridArea: 'footer',
        display: 'none',
        alignSelf: 'end',
        [WIDE_VIEW_MEDIA_SELECTOR]: { display: 'initial' },
      }}
    >
      {props.footer}
    </footer>
  </div>
)

export default Scaffold
