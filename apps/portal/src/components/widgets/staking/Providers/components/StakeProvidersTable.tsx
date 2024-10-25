import { Provider } from '../hooks/useProvidersData'
import Apr from './Apr'
import Asset from './Asset'
import AvailableBalance from './AvailableBalance'
import PercentageBar from './PercentageBar'
import StakeButton from './StakeButton'
import StakePercentage from './StakePercentage'
import UnbondingPeriod from './UnbondingPeriod'
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
} from '@tanstack/react-table'
import { useState, useMemo, Suspense } from 'react'
import { Link } from 'react-router-dom'

type StakeProviderProps = {
  dataQuery: Provider[]
}

const StakeProvidersTable = ({ dataQuery }: StakeProviderProps) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [aprValues, setAprValues] = useState<{ [key: string]: number }>({})
  const [unbondingValues, setUnbondingValues] = useState<{ [key: string]: number }>({})
  const [availableBalanceValues, setAvailableBalanceValue] = useState<{ [key: string]: number }>({})
  const [stakePercentageValues, setStakePercentage] = useState<{ [key: string]: number }>({})

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
                rowId={row.id}
                apr={aprValues[row.id]}
                setAprValues={setAprValues}
                symbol={row.original.nativeToken?.symbol}
                apiEndpoint={row.original.apiEndpoint}
              />
            </Suspense>
          )
        },
        sortingFn: (rowA, rowB) => {
          const aprA = aprValues[rowA.id]
          const aprB = aprValues[rowB.id]
          if (aprA === undefined || aprB === undefined) return 0
          return aprA > aprB ? 1 : -1
        },
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
              genesisHash={row.original.genesisHash ?? '0x'}
              rowId={row.id}
              unbonding={unbondingValues[row.id]}
              setUnbondingValues={setUnbondingValues}
              apiEndpoint={row.original.apiEndpoint}
              tokenPair={row.original.tokenPair}
            />
          </Suspense>
        ),
        sortingFn: (rowA, rowB) => {
          const unbondingA = unbondingValues[rowA.id]
          const unbondingB = unbondingValues[rowB.id]
          if (unbondingA === undefined || unbondingB === undefined) return 0
          return unbondingA > unbondingB ? 1 : -1
        },
      },
      {
        accessorKey: 'availableBalance',
        header: 'Available balance',
        cell: ({ row }) => {
          return (
            <Suspense fallback={<CircularProgressIndicator size="1em" />}>
              <AvailableBalance
                typeId={row.original.typeId}
                genesisHash={row.original.genesisHash ?? '0x'}
                rowId={row.id}
                availableBalance={availableBalanceValues[row.id]}
                setAvailableBalanceValue={setAvailableBalanceValue}
                apiEndpoint={row.original.apiEndpoint}
                tokenPair={row.original.tokenPair}
                symbol={row.original.nativeToken?.symbol}
              />
            </Suspense>
          )
        },
        sortingFn: (rowA, rowB) => {
          const availableBalanceA = availableBalanceValues[rowA.id]
          const availableBalanceB = availableBalanceValues[rowB.id]
          if (availableBalanceA === undefined || availableBalanceB === undefined) return 0
          return availableBalanceA > availableBalanceB ? 1 : -1
        },
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
                rowId={row.id}
                stakePercentage={stakePercentageValues[row.id]}
                setStakePercentage={setStakePercentage}
                tokenPair={row.original.tokenPair}
                nativeTokenAddress={row.original.nativeToken?.address ?? '0x'}
                symbol={row.original.nativeToken?.symbol}
                chainId={row.original.chainId}
              />
            </Suspense>
          )
        },
        sortingFn: (rowA, rowB) => {
          const stakePercentageA = stakePercentageValues[rowA.id]
          const stakePercentageB = stakePercentageValues[rowB.id]
          if (stakePercentageA === undefined || stakePercentageB === undefined) return 0
          return stakePercentageA > stakePercentageB ? 1 : -1
        },
      },
      {
        accessorKey: 'action',
        header: '',
        cell: ({ row }) => <StakeButton as={Link} to={row.original.actionLink} />,
        enableSorting: false,
      },
    ],
    [aprValues, availableBalanceValues, stakePercentageValues, unbondingValues]
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
      <div className="grid grid-cols-8 px-[1.6rem] mb-[0.4rem]">
        {table.getHeaderGroups().map(headerGroup =>
          headerGroup.headers.map(header => (
            <Text.BodySmall
              className={cn('text-left last:text-right', {
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
      {table.getRowModel().rows.map(row => (
        <Surface as="article" key={row.id} className="grid grid-cols-8 rounded-[16px] p-[1.6rem] items-center">
          {row.getVisibleCells().map(cell => (
            <div key={cell.id} className="flex-grow truncate last:text-right">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          ))}
        </Surface>
      ))}
    </div>
  )
}

export default StakeProvidersTable
