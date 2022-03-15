import { Field } from '@components'
import styled from 'styled-components'

const SortButtonsWrapper = styled.div`
  display: flex;
  padding: 0px 20px;
  justify-content: center;
  gap: 10px;
  color: var(--color-primary);
`

const sortOptions = [
  {
    key: 'account',
    value: 'Account',
  },
  {
    key: 'collection',
    value: 'Collection',
  },
]

const SortButtons = ({ sortValue, setSortBy, setSortTrigger }: any) => {
  return (
    <SortButtonsWrapper>
      <Field.RadioGroup
        value={sortValue}
        onChange={(value: any) => {
          setSortBy(value)
          setSortTrigger(true)
        }}
        options={sortOptions}
      />
    </SortButtonsWrapper>
  )
}

export default SortButtons
