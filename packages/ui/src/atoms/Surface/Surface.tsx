import { useTheme } from '@emotion/react'
import {
  createContext,
  useContext,
  type ComponentPropsWithRef,
  type ElementType,
  type JSXElementConstructor,
  forwardRef,
  type Ref,
} from 'react'

type PropsOf<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> = JSX.LibraryManagedAttributes<
  T,
  ComponentPropsWithRef<T>
>

type Elevation = number | ((currentElevation: number) => number)

type SurfaceOwnProps<T extends ElementType = ElementType> = {
  as?: T
  elevation?: Elevation
}

export type SurfaceProps<T extends ElementType = 'div'> = SurfaceOwnProps<T> & Omit<PropsOf<T>, keyof SurfaceOwnProps>

const SurfaceElevationContext = createContext(0)

export const useSurfaceColorAtElevation = (elevation: Elevation) => {
  const theme = useTheme()
  const currentElevation = useContext(SurfaceElevationContext)
  const elevationValue = typeof elevation === 'function' ? elevation(currentElevation) : elevation
  return `color-mix(in srgb, ${theme.color.surface}, ${theme.color.surfaceTint} calc(4.75% * ${elevationValue}))`
}

export const useSurfaceColor = () => useSurfaceColorAtElevation(useContext(SurfaceElevationContext))

const Surface = forwardRef(
  <T extends ElementType = 'div'>(
    { as = 'div' as T, elevation: propsElevation, ...props }: SurfaceProps<T>,
    ref: Ref<T>
  ) => {
    const Element = as
    const currentElevation = useContext(SurfaceElevationContext)

    const elevation =
      typeof propsElevation === 'function' ? propsElevation(currentElevation) : propsElevation ?? currentElevation

    const backgroundColor = useSurfaceColorAtElevation(elevation)

    return (
      <Element ref={ref} {...(props as any)} css={{ backgroundColor }}>
        {props['children'] && (
          <SurfaceElevationContext.Provider value={elevation + 1}>{props['children']}</SurfaceElevationContext.Provider>
        )}
      </Element>
    )
  }
) as <T extends ElementType = 'div'>(props: SurfaceProps<T>) => JSX.Element

export default Surface
