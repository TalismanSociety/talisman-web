/* eslint-disable @typescript-eslint/restrict-template-expressions */
import styled from '@emotion/styled'
import { sortBy } from 'lodash'

const defaultColumns = 4

const defaultGap = '2.4rem'

const defaultBreakpoints = {
  1320: { columns: 3 },
  1020: { columns: 2 },
  700: { columns: 1 },
}

type GridProps = {
  children: React.ReactNode
  className?: string
  columns?: number
  gap?: any
  breakpoints?: any
}

const Grid = styled(({ className, children }: GridProps) => (
  <div className={`grid ${className ?? ''}`}>{children}</div>
))`
  display: grid;
  grid-gap: 2.4rem;
  width: 100%;
  grid-template-columns: repeat(${({ columns = defaultColumns }) => columns}, 1fr);
  margin: ${({ gap = defaultGap }) => gap} 0;

  > * {
    ${({ itemHeight }: { itemHeight?: any }) => !!itemHeight && `height: ${itemHeight as number}`}
  }

  ${({ breakpoints = defaultBreakpoints, columns = defaultColumns, itemHeight }) =>
    sortBy(Object.entries(breakpoints), (bp: any) => parseInt(bp))
      .reverse()
      .map(
        (key: any) =>
          `
            @media only screen and (max-width: ${key[0] as string}px) {
              grid-template-columns: repeat(${key[1]?.columns || columns}, 1fr);
              >*{
                height: ${key[1]?.itemHeight || itemHeight || 'inherit'};
              }
            };
          `
      )}
`

export default Grid
