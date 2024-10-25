import { Provider } from '../hooks/useProvidersData'
import useStakeValues, { StakeType } from '../hooks/useSetValues'
import Apr from './Apr'
import Asset from './Asset'
import AvailableBalance from './AvailableBalance'
import PercentageBar from './PercentageBar'
import StakeButton from './StakeButton'
import StakePercentage from './StakePercentage'
import UnbondingPeriod from './UnbondingPeriod'
import ErrorBoundary from '@/components/widgets/ErrorBoundary'
import ErrorBoundaryFallback from '@/components/widgets/staking/ErrorBoundaryFallback'
import { cn } from '@/lib/utils'
import { CircularProgressIndicator, Surface, Text } from '@talismn/ui'
import { ChevronUp, ChevronDown } from '@talismn/web-icons'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  ColumnDef,
  Row,
} from '@tanstack/react-table'
import { useState, useMemo, Suspense, useCallback } from 'react'
import { Link } from 'react-router-dom'

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
      console.log({ values })
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
  )

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
    <div className="w-full flex flex-col flex-1 gap-[0.8rem]">
      {/* Column Headers */}
      <div className="hidden xl:grid grid-cols-8 px-[1.6rem] mb-[0.4rem]">
        {table.getHeaderGroups().map(headerGroup =>
          headerGroup.headers.map(header => (
            <Text.BodySmall
              className={cn('text-left last:text-right flex gap-2', {
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
            <Surface as="article" className="hidden xl:grid grid-cols-8 rounded-[16px] p-[1.6rem] items-center">
              {row.getVisibleCells().map(cell => (
                <div key={cell.id} className="flex-grow last:text-right">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </Surface>
            {/* Render as card in xl > screens */}
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
    <Surface as="article" className="flex flex-col space-y-2 xl:hidden rounded-[16px] p-[1.6rem]">
      <div className="flex justify-between">
        <div>{flexRender(symbol!.column.columnDef.cell, symbol!.getContext())}</div>
        <div>{flexRender(action!.column.columnDef.cell, action!.getContext())}</div>
      </div>
      <Surface className="divide-x divide-gray-200 h-[2px]" />
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
