'use client'

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import type { ResultOutput } from '~/lib/service'

export const helpers = createColumnHelper<ResultOutput>()

export function ResultTable(props: { data: ResultOutput[] }) {
  const columns = useMemo(
    () => [
      helpers.accessor('roll', {
        header: 'Roll Number',
        cell: (info) => info.getValue(),
      }),
      helpers.accessor('name', {
        header: 'Name',
        cell(props) {
          return props.getValue()
        },
      }),
      helpers.accessor('fName', {
        header: 'F Name',
        cell: (info) => info.getValue(),
      }),
      helpers.accessor('mName', {
        header: 'M Name',
        cell: (info) => info.getValue(),
      }),
      helpers.accessor('stream', {
        header: 'Stream',
        cell: (info) => info.getValue(),
      }),
      ...props.data[0].subjects.map((sub, i) =>
        // @ts-expect-error
        helpers.accessor(`subjects.${i}.totalMarks`, {
          header: sub.name,
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
      helpers.accessor('school', {
        header: 'School',
        cell: (info) => info.getValue(),
      }),
    ],
    []
  )
  const table = useReactTable({
    data: props.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className='flex -mx-(--page-padding) overflow-x-auto'>
      <div className='grow px-(--page-padding)'>
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
                  <tr className='hover:bg-secondary/75 transition-colors' key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td className='px-4 py-3' key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
