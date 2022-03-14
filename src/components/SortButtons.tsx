import styled from 'styled-components'
import Button from '@components/Button'

const GroupSortsButton = styled.div`
  display: flex;
  padding: 0px 20px;
  align-items: center;
  margin-button: 40px;
  justify-content: center;
  gap: 10px;
  color: black;
`

const SortButton = styled(Button)`
  color: white;

  ${({ isSelected, theme }) =>
    !!isSelected &&
    `
      background: rgb(${theme?.primary});
      color: rgb(${theme?.background});
    `
  }
`

const SortButtons = ({ setSortByAccount, setSortByCollection, sortBy }: any) => {
  return (
    <GroupSortsButton>
      <SortButton isSelected={sortBy === 'account'} onClick={setSortByAccount}>Account</SortButton>
      <SortButton isSelected={sortBy === 'collection'} onClick={setSortByCollection}>Collection</SortButton>
    </GroupSortsButton>
  )
}

export default SortButtons
