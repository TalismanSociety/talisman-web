import { Provider } from '../hooks/useProvidersData'
import Apr from './Apr'
import AvailableBalance from './AvailableBalance'
import PercentageBar from './PercentageBar'
import StakeButton from './StakeButton'
import StakePercentage from './StakePercentage'
import UnbondingPeriod from './UnbondingPeriod'
import AssetLogoWithChain from '@/components/recipes/AssetLogoWithChain'
import { cn } from '@/lib/utils'
import { CircularProgressIndicator, Text } from '@talismn/ui'
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
          <div
            css={{
              gridArea: 'asset',
              display: 'flex',
              alignItems: 'center',
              gap: '1.2rem',
            }}
          >
            <AssetLogoWithChain chainId={row.original.chainId} assetLogoUrl={row.original.logo} />
            <div className="truncate">
              <Text.Body as="div" alpha="high">
                {row.original.symbol}
              </Text.Body>
              <Text.BodySmall as="div">{row.original.chainName}</Text.BodySmall>
            </div>
          </div>
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
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'provider',
        header: 'Provider',
        cell: info => info.getValue(),
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
                nativeTokenAddress={row.original.nativeToken.address}
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
    <div className="pt-4 w-full flex flex-col flex-1">
      <div className="grid gap-[8px]">
        {/* Column Headers */}
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 font-semibold px-4">
          {table.getHeaderGroups().map(headerGroup =>
            headerGroup.headers.map(header => (
              <div
                className={cn('p-2 text-left last:text-right text-[14px]', {
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
                  asc: ' 🔼',
                  desc: ' 🔽',
                }[header.column.getIsSorted() as string] ?? null}
              </div>
            ))
          )}
        </div>

        {/* Rows */}
        {table.getRowModel().rows.map(row => (
          <div
            key={row.id}
            className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 bg-[#1B1B1B] rounded-[16px] py-4 px-4 items-center"
          >
            {row.getVisibleCells().map(cell => (
              <div key={cell.id} className="p-2 flex-grow truncate last:text-right">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default StakeProvidersTable
