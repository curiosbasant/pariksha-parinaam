import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

export function Table<T>(props: { rows: T[]; columns: ColumnDef<T, any>[] }) {
  const table = useReactTable({
    data: props.rows,
    columns: props.columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
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
  )
}
