import type { HomeProps } from '../../shared'
import { ClassResultPieChart, ResponsiveClassToppersBarChart } from './client'

export default async function ResultSummary(props: HomeProps) {
  return (
    <>
      <section className='gap-8 flex flex-col'>
        <h2 className='text-2xl font-bold text-center'>🎯 Class Result 🍕</h2>
        <ClassResultPieChart />
      </section>
      <section className='space-y-8'>
        <h2 className='text-2xl font-bold text-center'>🥇🥈🥉 Class Toppers 🏆</h2>
        <ResponsiveClassToppersBarChart />
      </section>
    </>
  )
}
