import type { ComponentPropsWithRef, ElementType, JSXElementConstructor } from 'react'

type PropsOf<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> = JSX.LibraryManagedAttributes<
  T,
  ComponentPropsWithRef<T>
>

type Elevation = number | ((currentElevation: number) => number)

type MaterialSurfaceOwnProps<T extends ElementType = ElementType> = {
  as?: T
  elevation?: Elevation
}

export type MaterialSurfaceProps<T extends ElementType = 'div'> = MaterialSurfaceOwnProps<T> &
  Omit<PropsOf<T>, keyof MaterialSurfaceOwnProps>

const MaterialSurface = <T extends ElementType = 'div'>({ as = 'div' as T, ...props }: MaterialSurfaceProps<T>) => {
  const Element = as

  return (
    <Element
      {...(props as any)}
      css={{ backgroundColor: '#121212bf', backdropFilter: 'blur(33px)', boxShadow: '0 10px 15px rgb(0 0 0 / 20%)' }}
    />
  )
}

export default MaterialSurface
