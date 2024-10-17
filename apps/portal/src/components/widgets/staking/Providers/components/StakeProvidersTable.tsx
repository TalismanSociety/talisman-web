import { Provider } from '../hooks/useProvidersData'
import { cn } from '@/lib/utils'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  ColumnDef,
} from '@tanstack/react-table'
import { useState, useMemo } from 'react'

type StakeProviderProps = {
  dataQuery: any[]
}

const StakeProvidersTable = ({ dataQuery }: StakeProviderProps) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const defaultData = useMemo(() => [], [])

  const columns = useMemo<ColumnDef<Provider>[]>(
    () => [
      {
        accessorKey: 'assetName',
        header: 'Asset',
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'apr',
        header: 'Est. return',
        cell: info => info.getValue(),
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
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'availableBalance',
        header: 'Available balance',
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'action',
        header: '',
        cell: () => <button>Stake</button>,
        enableSorting: false,
      },
    ],
    []
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
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 font-semibold px-4">
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
            className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 bg-[#1B1B1B] rounded-[16px] py-4 px-4 items-center"
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
