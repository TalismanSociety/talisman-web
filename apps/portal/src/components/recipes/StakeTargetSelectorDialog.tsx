import type { ReactElement, ReactNode } from 'react'
import { Button } from '@talismn/ui/atoms/Button'
import { Text } from '@talismn/ui/atoms/Text'
import { AlertDialog } from '@talismn/ui/molecules/AlertDialog'
import { Select } from '@talismn/ui/molecules/Select'
import { ChevronLeft, ChevronRight } from '@talismn/web-icons'
import { motion } from 'framer-motion'
import React, { useState } from 'react'

import type { StakeTargetSelectorItemProps } from './StakeTargetSelectorItem'
import { DappSelectorItem, PoolSelectorItem, StakeTargetSelectorItem } from './StakeTargetSelectorItem'

export type StakeTargetSelectorDialogProps<T> = {
  open?: boolean
  title: ReactNode
  currentSelectionLabel: ReactNode
  selectionLabel: ReactNode
  confirmButtonContent: ReactNode
  children: ReactElement<T> | Array<ReactElement<T>>
  isSortDisabled?: boolean
  sortMethods?: {
    [key: string]: (a: ReactElement<T>, b: ReactElement<T>) => number
  }
  onRequestDismiss: () => unknown
  onConfirm: () => unknown
}

const ITEMS_PER_PAGE = 9

export const StakeTargetSelectorDialog = Object.assign(
  <T extends { highlighted?: boolean; selected?: boolean }>(props: StakeTargetSelectorDialogProps<T>) => {
    const items = React.Children.toArray(props.children) as Array<ReactElement<T>>
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
                  isDisabled={props.isSortDisabled}
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
  <T extends StakeTargetSelectorItemProps>(
    props: Omit<
      StakeTargetSelectorDialogProps<T>,
      'title' | 'currentSelectionLabel' | 'selectionLabel' | 'confirmButtonContent'
    >
  ) => (
    <StakeTargetSelectorDialog<T>
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
  <T extends StakeTargetSelectorItemProps>(
    props: Omit<
      StakeTargetSelectorDialogProps<T>,
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
