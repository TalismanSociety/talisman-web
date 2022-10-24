import Button from '@components/atoms/Button'
import Text from '@components/atoms/Text'
import AlertDialog from '@components/molecules/AlertDialog'
import React, { ReactElement } from 'react'

import PoolSelectorItem, { PoolSelectorItemProps } from '../PoolSelectorItem/PoolSelectorItem'

export type PoolSelectorDialogProps = {
  open: boolean
  onRequestDismiss: () => unknown
  onConfirm: () => unknown
  children: ReactElement<PoolSelectorItemProps> | ReactElement<PoolSelectorItemProps>[]
}

const PoolSelectorDialog = Object.assign(
  (props: PoolSelectorDialogProps) => {
    const items = React.Children.toArray(props.children) as ReactElement<PoolSelectorItemProps>[]
    const selectedItems = items.filter(item => item.props.selected)
    const nonSelectedItems = items.filter(item => !item.props.selected)
    const highlightedItems = items.filter(item => item.props.highlighted)

    return (
      <AlertDialog
        open={props.open}
        title="Select a pool"
        content={
          <div>
            <Text.Body as="h3">Current pool</Text.Body>
            <div
              css={{
                'display': 'grid',
                'gap': '1.6rem',
                '@media (min-width: 768px)': {
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '1.6rem 0.8rem',
                },
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
                '@media (min-width: 768px)': {
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '1.6rem 0.8rem',
                },
              }}
            >
              {nonSelectedItems.slice(0, 9)}
            </div>
          </div>
        }
        dismissButton={
          <Button variant="outlined" onClick={props.onRequestDismiss}>
            Cancel
          </Button>
        }
        confirmButton={
          <Button onClick={props.onConfirm} disabled={highlightedItems.length === 0}>
            Swap pool
          </Button>
        }
        onRequestDismiss={props.onRequestDismiss}
        css={{ maxWidth: '83rem', padding: '3.2rem' }}
      />
    )
  },
  { Item: PoolSelectorItem }
)

export default PoolSelectorDialog
