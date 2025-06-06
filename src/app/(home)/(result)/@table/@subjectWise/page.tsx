'use client'

import { createColumnHelper } from '@tanstack/react-table'
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area'
import { Table } from '~/components/ui/table'
import { useFilteredResults } from '../../../query'

type RowType = {
  subjectName: string
  totalStudents: number
  distinctionCount: number
  firstDivisionCount: number
  secondDivisionCount: number
  thirdDivisionCount: number
  passCount: number
  failCount: number
}

const helpers = createColumnHelper<RowType>()

const columns = [
  helpers.accessor('subjectName', { header: 'Subject Name' }),
  helpers.accessor('totalStudents', { header: 'Total Students' }),
  helpers.accessor('distinctionCount', { header: 'Distinction' }),
  helpers.accessor('firstDivisionCount', { header: 'First Division' }),
  helpers.accessor('secondDivisionCount', { header: 'Second Division' }),
  helpers.accessor('thirdDivisionCount', { header: 'Third Division' }),
  helpers.accessor('passCount', { header: 'Pass' }),
  helpers.accessor('failCount', { header: 'Fail' }),
  helpers.display({
    header: 'Pass Percentage',
    cell: ({ row }) => {
      const passCount =
        row.original.distinctionCount +
        row.original.firstDivisionCount +
        row.original.secondDivisionCount +
        row.original.thirdDivisionCount +
        row.original.passCount
      return `${((passCount / row.original.totalStudents) * 100).toFixed(2)}%`
    },
  }),
]

export default function SubjectWiseTable() {
  const results = useFilteredResults()
  const rowsObj = results.reduce((arr, row) => {
    for (const sub of row.subjects) {
      arr[sub.name] ??= {
        subjectName: sub.name,
        totalStudents: 0,
        distinctionCount: 0,
        firstDivisionCount: 0,
        secondDivisionCount: 0,
        thirdDivisionCount: 0,
        failCount: 0,
        passCount: 0,
      }
      arr[sub.name].totalStudents++

      if (sub.totalMarks < 33) arr[sub.name].failCount++
      else if (sub.totalMarks < 40) arr[sub.name].passCount++
      else if (sub.totalMarks < 50) arr[sub.name].thirdDivisionCount++
      else if (sub.totalMarks < 60) arr[sub.name].secondDivisionCount++
      else if (sub.totalMarks < 75) arr[sub.name].firstDivisionCount++
      else arr[sub.name].distinctionCount++
    }
    return arr
  }, {} as Record<string, RowType>)

  return (
    <div className='flex -mx-(--page-padding)'>
      <div className='flex-1 w-0'>
        <ScrollArea className='pb-3 -mb-3'>
          <div className='px-(--page-padding)'>
            <div className='rounded-md border overflow-clip'>
              <Table rows={Object.values(rowsObj)} columns={columns} />
            </div>
          </div>
          <ScrollBar orientation='horizontal' />{' '}
        </ScrollArea>
      </div>
    </div>
  )
}
