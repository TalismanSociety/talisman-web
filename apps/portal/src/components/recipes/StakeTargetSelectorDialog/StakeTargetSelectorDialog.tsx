import StakeTargetSelectorItem, {
  DappSelectorItem,
  PoolSelectorItem,
  type StakeTargetSelectorItemProps,
} from './StakeTargetSelectorItem'
import { AlertDialog, Button, Text, Select } from '@talismn/ui'
import { ChevronLeft, ChevronRight } from '@talismn/web-icons'
import { motion } from 'framer-motion'
import React, { useState, type ReactElement, type ReactNode } from 'react'

export type StakeTargetSelectorDialogProps = {
  open?: boolean
  title: ReactNode
  currentSelectionLabel: ReactNode
  selectionLabel: ReactNode
  onRequestDismiss: () => unknown
  confirmButtonContent: ReactNode
  onConfirm: () => unknown
  sortMethods?: {
    [key: string]: (
      a: ReactElement<StakeTargetSelectorItemProps>,
      b: ReactElement<StakeTargetSelectorItemProps>
    ) => number
  }
  children: ReactElement<StakeTargetSelectorItemProps> | Array<ReactElement<StakeTargetSelectorItemProps>>
}

const ITEMS_PER_PAGE = 9

const StakeTargetSelectorDialog = Object.assign(
  (props: StakeTargetSelectorDialogProps) => {
    const items = React.Children.toArray(props.children) as Array<ReactElement<StakeTargetSelectorItemProps>>
    const [sortMethod, setSortMethod] = useState(
      (props.sortMethods ? Object.keys(props.sortMethods)[0] : undefined) ?? 'Default'
    )
    const selectedItems = items.filter(item => item.props.selected)
    const nonSelectedItems = items
      .filter(item => !item.props.selected)
      .sort((sortMethod === 'Default' ? undefined : props.sortMethods?.[sortMethod]) ?? (() => 0))
    const highlightedItems = items.filter(item => item.props.highlighted)

    const [page, setPage] = useState(0)
    const hasNextPage = page * ITEMS_PER_PAGE + ITEMS_PER_PAGE < nonSelectedItems.length
    const hasPreviousPage = page !== 0

    return (
      <AlertDialog
        open={props.open}
        title={props.title}
        targetWidth="83rem"
        content={
          <div>
            <Text.Body as="h3" css={{ marginBottom: '0.6rem' }}>
              {props.currentSelectionLabel}
            </Text.Body>
            <div
              css={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr)',
                gap: '1.6rem',
                '@media (min-width: 768px)': {
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)',
                  gap: '1.6rem 0.8rem',
                },
              }}
            >
              {selectedItems[0]}
            </div>
            <div
              css={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '1.6rem',
                marginBottom: '0.6rem',
              }}
            >
              <Text.Body as="h3" css={{ marginTop: '1.6rem', marginBottom: '0.6rem' }}>
                {props.selectionLabel}
              </Text.Body>
              {props.sortMethods ? (
                <Select
                  placeholder="Sort delegates"
                  renderSelected={value => `Sort by: ${value}`}
                  value={sortMethod}
                  onChangeValue={setSortMethod}
                  css={{ minWidth: '22rem' }}
                >
                  {Object.keys(props.sortMethods).length === 0 ? (
                    <Select.Option headlineContent="Default" value="Default" />
                  ) : null}
                  {Object.keys(props.sortMethods).map(option => (
                    <Select.Option key={option} headlineContent={option} value={option} />
                  ))}
                </Select>
              ) : null}
            </div>
            <motion.div
              css={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr)',
                gap: '1.6rem',
                '@media (min-width: 768px)': {
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)',
                  gap: '1.6rem 0.8rem',
                },
              }}
            >
              {nonSelectedItems
                .slice(page * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE + ITEMS_PER_PAGE)
                .flatMap((item, index, array) => [
                  <motion.div
                    key={item.key}
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.0125 }}
                  >
                    {item}
                  </motion.div>,
                  // Pad dummy hidden elements at the end to keep the last page height same as the first page
                  ...(array.length < ITEMS_PER_PAGE &&
                  array.length < nonSelectedItems.length &&
                  index === array.length - 1
                    ? Array.from({ length: ITEMS_PER_PAGE - array.length }, (_, index) => (
                        <div key={'dummy' + String(index)} css={{ opacity: 0, pointerEvents: 'none' }}>
                          {item}
                        </div>
                      ))
                    : []),
                ])}
            </motion.div>
            <div css={{ display: 'flex', justifyContent: 'end', marginTop: '0.6rem', gap: '1rem' }}>
              <Button variant="noop" onClick={() => setPage(page => page - 1)} hidden={!hasPreviousPage}>
                <div css={{ display: 'flex', alignItems: 'center', userSelect: 'none' }}>
                  <ChevronLeft />
                  <div>Previous Page</div>
                </div>
              </Button>
              <Button variant="noop" onClick={() => setPage(page => page + 1)} hidden={!hasNextPage}>
                <div css={{ display: 'flex', alignItems: 'center', userSelect: 'none' }}>
                  <div>Next Page</div>
                  <ChevronRight />
                </div>
              </Button>
            </div>
          </div>
        }
        dismissButton={
          <Button variant="outlined" onClick={props.onRequestDismiss}>
            Cancel
          </Button>
        }
        confirmButton={
          <Button
            onClick={() => {
              props.onConfirm()
              props.onRequestDismiss()
            }}
            disabled={highlightedItems.length === 0}
          >
            {props.confirmButtonContent}
          </Button>
        }
        onRequestDismiss={props.onRequestDismiss}
        css={{ padding: '3.2rem' }}
      />
    )
  },
  { Item: StakeTargetSelectorItem }
)

export const PoolSelectorDialog = Object.assign(
  (
    props: Omit<
      StakeTargetSelectorDialogProps,
      'title' | 'currentSelectionLabel' | 'selectionLabel' | 'confirmButtonContent'
    >
  ) => (
    <StakeTargetSelectorDialog
      {...props}
      title="Select a pool"
      currentSelectionLabel="Current pool"
      selectionLabel="New pool"
      confirmButtonContent="Swap pool"
    />
  ),
  { Item: PoolSelectorItem }
)

export const DappSelectorDialog = Object.assign(
  (
    props: Omit<
      StakeTargetSelectorDialogProps,
      'title' | 'currentSelectionLabel' | 'selectionLabel' | 'confirmButtonContent'
    >
  ) => (
    <StakeTargetSelectorDialog
      {...props}
      title="Select a DApp"
      currentSelectionLabel="Selected DApp"
      selectionLabel="New DApp"
      confirmButtonContent="Swap DApp"
    />
  ),
  { Item: DappSelectorItem }
)

export default StakeTargetSelectorDialog
