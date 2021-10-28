import { sortBy } from 'lodash'
import styled from 'styled-components'

const defaultColumns = 4

const defaultGap = '2.4rem'

const defaultBreakpoints = {
  1320: { columns: 3 },
  1020: { columns: 2 },
  700: { columns: 1 },
}

const Grid = styled(({ className, children }) => <div className={`grid ${className}`}>{children}</div>)`
  display: grid;
  grid-gap: 2.4rem;
  width: 100%;
  grid-template-columns: repeat(${({ columns = defaultColumns }) => columns}, 1fr);
  margin: ${({ gap = defaultGap }) => gap} 0;

  > * {
    ${({ itemHeight }) => !!itemHeight && `height: ${itemHeight}`}
  }

  ${({ breakpoints = defaultBreakpoints, columns = defaultColumns, itemHeight }) =>
    sortBy(Object.entries(breakpoints), bp => parseInt(bp))
      .reverse()
      .map(
        key =>
          `
            @media only screen and (max-width: ${key[0]}px) {
              grid-template-columns: repeat(${key[1]?.columns || columns}, 1fr);
              >*{
                height: ${key[1]?.itemHeight || itemHeight || 'inherit'};
              }
            };
          `
      )}
`

export default Grid
