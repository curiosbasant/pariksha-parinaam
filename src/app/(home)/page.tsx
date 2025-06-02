'use client'

import { use } from 'react'
import type { ResultInput } from '~/lib/service'
import { ClassResultPieChart, ResponsiveClassToppersBarChart } from '../charts'
import { useResultStream } from '../query'
import { FilteredResultTable, ResultTable } from '../result-table'
import { HomeProps } from './shared'

export default function HomePage(props: HomeProps) {
  const { standard, roll } = use(props.searchParams)
  if (!standard || !roll) return null

  return <ResultDisplay standard={standard} roll={roll} />
}

function ResultDisplay(props: ResultInput) {
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
