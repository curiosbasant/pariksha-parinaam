'use client'

import { useState } from 'react'
import { FormField } from '~/components/forms'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import type { ResultInput } from '~/lib/service'
import { ClassResultPieChart, ResponsiveClassToppersBarChart } from './charts'
import { useResultStream } from './query'
import { FilteredResultTable, ResultTable } from './result-table'

export default function HomePage() {
  const [data, setData] = useState<ResultInput | null>(null)

  return (
    <div className='space-y-16'>
      <form
        className='grid sm:grid-cols-2 gap-4'
        action={(fd) => {
          setData({
            standard: fd.get('standard') as string,
            roll: fd.get('roll') as string,
          })
        }}>
        <FormField label='Standard'>
          <Select name='standard'>
            <SelectTrigger className='w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='10'>Class 10</SelectItem>
              <SelectItem value='12'>Class 12</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label='Starting Roll Number'>
          <Input name='roll' />
        </FormField>
        <div className='flex col-span-full justify-end'>
          <Button type='submit'>Submit</Button>
        </div>
      </form>
      {data && <ResultDisplay data={data} />}
    </div>
  )
}

function ResultDisplay(props: { data: ResultInput }) {
  const { data, error } = useResultStream(props)
  if (data) {
    return (
      <>
        <section className='space-y-6'>
          <h2 className='text-2xl font-bold text-center text-balance'>{data[0].school}</h2>
          {data[0].stream ? <FilteredResultTable data={data} /> : <ResultTable data={data} />}
        </section>
        <div className='grid lg:grid-cols-[1fr_2fr] gap-y-16'>
          <section className='gap-8 flex flex-col'>
            <h2 className='text-2xl font-bold text-center'>🎯 Class Result 🍕</h2>
            <ClassResultPieChart results={data} />
          </section>
          <section className='space-y-8'>
            <h2 className='text-2xl font-bold text-center'>🥇🥈🥉 Class Toppers 🏆</h2>
            <ResponsiveClassToppersBarChart results={data} />
          </section>
        </div>
      </>
    )
  }

  if (error)
    return (
      <div className='p-6 bg-red-200 border rounded-sm border-red-300 border-s-4 border-s-red-500'>
        <p className='text-red-500'>
          There seems to be some problem. Please check your provided details and try again!
        </p>
      </div>
    )

  return (
    <div className='flex h-96'>
      <div className='rounded-full m-auto border-4 p-4 border-blue-500 border-s-transparent animate-spin' />
    </div>
  )
}
