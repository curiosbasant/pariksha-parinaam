'use client'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
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

export function FilteredResultTable(props: { data: ResultOutput[] }) {
  const streamMap = Object.groupBy(props.data, (row) => row.stream)
  const streams = Object.entries(streamMap)
  const [filterStream, setFilterStream] = useState(streams[0][0])

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-4 justify-end'>
        <label className='' htmlFor=''>
          Filter by Stream:
        </label>
        <Select value={filterStream} onValueChange={setFilterStream}>
          <SelectTrigger className='capitalize min-w-32'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {streams.map(([stream, rows]) => (
              <SelectItem className='capitalize' value={stream} key={stream}>
                {stream.toLowerCase()} ({rows?.length})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ResultTable data={streamMap[filterStream]!} />
    </div>
  )
}
