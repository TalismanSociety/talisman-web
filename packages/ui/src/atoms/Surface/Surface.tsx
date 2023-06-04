import type { Theme } from '@emotion/react'
import { createContext, type ComponentPropsWithRef, type ElementType, type JSXElementConstructor } from 'react'

type PropsOf<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> = JSX.LibraryManagedAttributes<
  T,
  ComponentPropsWithRef<T>
>

type SurfaceOwnProps<T extends ElementType = ElementType> = {
  as?: T
}

export type SurfaceProps<T extends ElementType = 'div'> = SurfaceOwnProps<T> & Omit<PropsOf<T>, keyof SurfaceOwnProps>

const SurfaceLayerContext = createContext(0)

const Surface = <T extends ElementType = 'div'>({ as = 'div' as T, ...props }: SurfaceProps<T>) => {
  const Element = as
  return (
    <SurfaceLayerContext.Consumer>
      {layer => (
        <Element
          {...(props as any)}
          css={(theme: Theme) => ({
            background: `color-mix(in srgb, ${theme.color.surface}, ${theme.color.surfaceTint} calc(4.75% * ${layer}))`,
          })}
        >
          {props['children'] && (
            <SurfaceLayerContext.Provider value={layer + 1}>{props['children']}</SurfaceLayerContext.Provider>
          )}
        </Element>
      )}
    </SurfaceLayerContext.Consumer>
  )
}

export default Surface
