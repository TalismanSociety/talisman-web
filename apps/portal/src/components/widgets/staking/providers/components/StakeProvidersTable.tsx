import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'
import { Surface } from '@talismn/ui/atoms/Surface'
import { Text } from '@talismn/ui/atoms/Text'
import { ChevronDown, ChevronUp } from '@talismn/web-icons'
import {
  CellContext,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { Suspense, useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { ErrorBoundary } from '@/components/widgets/ErrorBoundary'
import ErrorBoundaryFallback from '@/components/widgets/staking/ErrorBoundaryFallback'
import { cn } from '@/util/cn'

import { Provider } from '../hooks/types'
import useStakeValues, { StakeType } from '../hooks/useSetValues'
import Apr from './Apr'
import Asset from './Asset'
import AvailableBalance from './AvailableBalance'
import PercentageBar from './PercentageBar'
import StakeButton from './StakeButton'
import StakePercentage from './StakePercentage'
import UnbondingPeriod from './UnbondingPeriod'

type StakeProviderProps = {
  dataQuery: Provider[]
}

const StakeProvidersTable = ({ dataQuery }: StakeProviderProps) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const { getValuesForSortType, setValues } = useStakeValues()

  // Generic sorting function that sorts based on the provided sort type
  const sortingFn = useCallback(
    (sortType: StakeType) => (rowA: { id: string | number }, rowB: { id: string | number }) => {
      const values = getValuesForSortType(sortType)
      const valueA = values[rowA.id] || 0
      const valueB = values[rowB.id] || 0
      return valueA > valueB ? 1 : -1
    },
    [getValuesForSortType]
  )

  const defaultData = useMemo(() => [], [])

  const columns = useMemo<ColumnDef<Provider>[]>(
    () => [
      {
        accessorKey: 'symbol',
        header: 'Asset',
        cell: ({ row }) => (
          <Asset
            chainId={row.original.chainId}
            logo={row.original.logo}
            symbol={row.original.symbol}
            chainName={row.original.chainName}
          />
        ),
      },
      {
        accessorKey: 'apr',
        header: 'Est. return',
        cell: ({ row }) => {
          return (
            <Suspense fallback={<CircularProgressIndicator size="1em" />}>
              <Apr
                typeId={row.original.typeId}
                genesisHash={row.original.genesisHash ?? '0x'}
                setAprValues={value => setValues('apr', row.id, value)}
                symbol={row.original.nativeToken?.symbol}
                apiEndpoint={row.original.apiEndpoint}
              />
            </Suspense>
          )
        },
        sortingFn: sortingFn('apr'),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => (
          <Text.BodySmall as="div" alpha="high">
            {row.original.type}
          </Text.BodySmall>
        ),
      },
      {
        accessorKey: 'provider',
        header: 'Provider',
        cell: ({ row }) => (
          <Text.BodySmall as="div" alpha="high">
            {row.original.provider}
          </Text.BodySmall>
        ),
      },
      {
        accessorKey: 'unbondingPeriod',
        header: 'Unbonding period',
        cell: ({ row }) => (
          <Suspense fallback={<CircularProgressIndicator size="1em" />}>
            <UnbondingPeriod
              typeId={row.original.typeId}
              genesisHash={row.original.genesisHash}
              setUnbondingValues={value => setValues('unbondingPeriod', row.id, value)}
              apiEndpoint={row.original.apiEndpoint}
              tokenPair={row.original.tokenPair}
            />
          </Suspense>
        ),
        sortingFn: sortingFn('unbondingPeriod'),
      },
      {
        accessorKey: 'availableBalance',
        header: 'Available balance',
        cell: ({ row }) => {
          return (
            <Suspense fallback={<CircularProgressIndicator size="1em" />}>
              <AvailableBalance
                typeId={row.original.typeId}
                genesisHash={row.original.genesisHash}
                setAvailableBalanceValue={value => setValues('availableBalance', row.id, value)}
                apiEndpoint={row.original.apiEndpoint}
                tokenPair={row.original.tokenPair}
                symbol={row.original.nativeToken?.symbol}
              />
            </Suspense>
          )
        },
        sortingFn: sortingFn('availableBalance'),
      },
      {
        accessorKey: 'stakePercentage',
        header: 'Staked (%)',
        cell: ({ row }) => {
          return (
            <Suspense fallback={<PercentageBar isLoading />}>
              <StakePercentage
                typeId={row.original.typeId}
                genesisHash={row.original.genesisHash ?? '0x'}
                setStakePercentage={value => setValues('stakePercentage', row.id, value)}
                tokenPair={row.original.tokenPair}
                nativeTokenAddress={row.original.nativeToken?.address ?? '0x'}
                symbol={row.original.nativeToken?.symbol}
                chainId={row.original.chainId}
              />
            </Suspense>
          )
        },
        sortingFn: sortingFn('stakePercentage'),
      },
      {
        accessorKey: 'action',
        header: '',
        cell: ({ row }) => <StakeButton as={Link} to={row.original.actionLink} />,
        enableSorting: false,
      },
    ],
    [setValues, sortingFn]
  ).map(col => ({
    ...col,
    cell: (props: CellContext<Provider, unknown>) => (
      <ErrorBoundary renderFallback={() => <>--</>}>
        {typeof col.cell === 'function' ? col.cell(props) : null}
      </ErrorBoundary>
    ),
  }))

  const table = useReactTable({
    data: dataQuery ?? defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  return (
    <div className="flex w-full flex-1 flex-col gap-[0.8rem]">
      {/* Column Headers */}
      <div className="mb-[0.4rem] hidden grid-cols-8 px-[1.6rem] xl:grid">
        {table.getHeaderGroups().map(headerGroup =>
          headerGroup.headers.map(header => (
            <Text.BodySmall
              className={cn('flex items-center gap-2 text-left last:text-right', {
                'cursor-pointer select-none': header.column.getCanSort(),
              })}
              key={header.id}
              onClick={header.column.getToggleSortingHandler()}
              title={
                header.column.getCanSort()
                  ? header.column.getNextSortingOrder() === 'asc'
                    ? 'Sort ascending'
                    : header.column.getNextSortingOrder() === 'desc'
                    ? 'Sort descending'
                    : 'Clear sort'
                  : undefined
              }
            >
              {flexRender(header.column.columnDef.header, header.getContext())}{' '}
              {{
                asc: <ChevronUp size={'1.5rem'} />,
                desc: <ChevronDown size={'1.5rem'} />,
              }[header.column.getIsSorted() as string] ?? null}
            </Text.BodySmall>
          ))
        )}
      </div>

      {/* Rows */}
      {table.getRowModel().rows.map(row => {
        const { symbol, logo, provider } = row.original
        return (
          <ErrorBoundary
            key={row.id}
            orientation="horizontal"
            renderFallback={() => <ErrorBoundaryFallback logo={logo} symbol={symbol} provider={provider ?? ''} />}
          >
            {/* Render as table in xl > screens */}
            <Surface as="article" className="hidden grid-cols-8 items-center rounded-[16px] p-[1.6rem] xl:grid">
              {row.getVisibleCells().map(cell => (
                <ErrorBoundary renderFallback={() => <>--</>} key={cell.id}>
                  <div className="flex-grow last:text-right">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </ErrorBoundary>
              ))}
            </Surface>
            {/* Render as card in xl < screens */}
            <RenderCard row={row} />
          </ErrorBoundary>
        )
      })}
    </div>
  )
}

const RenderCard = ({ row }: { row: Row<Provider> }) => {
  const [symbol, apr, type, action] = row.getVisibleCells().filter(cell => {
    const { id } = cell.column
    return id === 'symbol' || id === 'apr' || id === 'type' || id === 'action'
  })

  return (
    <Surface as="article" className="flex flex-col space-y-2 rounded-[16px] p-[1.6rem] xl:hidden">
      <div className="flex justify-between">
        <div>{flexRender(symbol!.column.columnDef.cell, symbol!.getContext())}</div>
        <div>{flexRender(action!.column.columnDef.cell, action!.getContext())}</div>
      </div>
      <Surface className="h-[2px] divide-x divide-gray-200" />
      <div className="flex justify-between">
        <div>
          <Text.BodySmall as="div">Est. return</Text.BodySmall>
          <div>{flexRender(apr!.column.columnDef.cell, apr!.getContext())}</div>
        </div>
        <div>
          <Text.BodySmall as="div">Type</Text.BodySmall>
          <div>{flexRender(type!.column.columnDef.cell, type!.getContext())}</div>
        </div>
      </div>
    </Surface>
  )
}

export default StakeProvidersTable
