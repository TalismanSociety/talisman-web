import Button from '@components/atoms/Button'
import Text from '@components/atoms/Text'
import AlertDialog from '@components/molecules/AlertDialog'
import React, { ReactElement } from 'react'

import PoolSelectorItem, { PoolSelectorItemProps } from '../PoolSelectorItem/PoolSelectorItem'

export type PoolSelectorProps = {
  children: ReactElement<PoolSelectorItemProps> | ReactElement<PoolSelectorItemProps>[]
}

const PoolSelector = Object.assign(
  (props: PoolSelectorProps) => {
    const selectedItem = React.Children.toArray(props.children) as ReactElement<PoolSelectorItemProps>[]
    const selectedItems = selectedItem.filter(item => item.props.selected)
    const nonSelectedItems = selectedItem.filter(item => !item.props.selected)

    return (
      <AlertDialog
        open
        title="Select a pool"
        content={
          <div>
            <Text.Body as="h3">Current pool</Text.Body>
            <div
              css={{
                'display': 'grid',
                'gap': '1.6rem',
                '@media (min-width: 768px)': { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.6rem 0.8rem' },
              }}
            >
              {selectedItems[0]}
            </div>
            <Text.Body as="h3" css={{ marginTop: '1.6rem' }}>
              New pool
            </Text.Body>
            <div
              css={{
                'display': 'grid',
                'gap': '1.6rem',
                '@media (min-width: 768px)': { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.6rem 0.8rem' },
              }}
            >
              {nonSelectedItems.slice(0, 3)}
            </div>
          </div>
        }
        confirmButton={<Button>Swap pool</Button>}
        onRequestDismiss={() => {}}
        css={{ maxWidth: '54rem', padding: '3.2rem' }}
      />
    )
  },
  { Item: PoolSelectorItem }
)

export default PoolSelector
