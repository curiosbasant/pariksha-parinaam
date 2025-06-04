'use client'

import {
  type ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area'
import type { ResultOutput } from '~/lib/service'
import { useFilteredResults } from '../../query'

export const helpers = createColumnHelper<ResultOutput>()

export default function ResultTableSlot() {
  const results = useFilteredResults()

  const subjects = results[0]?.subjects ?? []
  const columns = [
    helpers.accessor('roll', {
      header: 'Roll Number',
      cell: (info) => info.getValue(),
    }),
    helpers.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue(),
    }),
    helpers.accessor('fName', {
      header: 'F Name',
      cell: (info) => info.getValue(),
    }),
    helpers.accessor('mName', {
      header: 'M Name',
      cell: (info) => info.getValue(),
    }),
    ...subjects.map((sub, i) =>
      // @ts-expect-error
      helpers.accessor(`subjects.${i}.totalMarks`, {
        // Add a space before (, and after .
        header: sub.name.replace(/\b\(/, ' (').replace(/\.\b/, '. '),
        cell: (info) => info.getValue(),
      })
    ),
    helpers.accessor('marksObtained', {
      header: 'Marks Obtained',
      cell: (info) => info.getValue(),
    }),
    helpers.accessor('percentage', {
      header: 'Percentage',
      cell: (info) => `${info.getValue()}%`,
    }),
    helpers.accessor('division', {
      header: 'Result',
      cell: (info) => info.getValue(),
    }),
  ]

  return <ResultTable results={results} columns={columns} />
}

function ResultTable(props: { results: ResultOutput[]; columns: ColumnDef<ResultOutput, any>[] }) {
  const table = useReactTable({
    data: props.results,
    columns: props.columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className='flex -mx-(--page-padding)'>
      <div className='flex-1 w-0'>
        <ScrollArea className='pb-3 -mb-3'>
          <div className='px-(--page-padding)'>
            <div className='rounded-md border overflow-clip'>
              <table className='w-full text-sm divide-y-2'>
                <thead className='bg-secondary text-secondary-foreground *:center'>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} colSpan={header.colSpan} className='px-4 py-3'>
                          {header.isPlaceholder ? null : (
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? 'cursor-pointer select-none hover:text-blue-400 transition-colors'
                                  : '',
                                onClick: header.column.getToggleSortingHandler(),
                              }}>
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {{
                                asc: ' 🔼',
                                desc: ' 🔽',
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className='divide-y divide-border'>
                  {table.getRowModel().rows.map((row) => {
                    return (
                      <tr
                        className='hover:bg-secondary/75 even:bg-secondary/40 transition-colors'
                        key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <td className='px-4 py-3' key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </div>
    </div>
  )
}
