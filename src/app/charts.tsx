import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent } from '~/components/ui/chart'
import type { ResultOutput } from '~/lib/service'

export function ClassToppersBarChart(props: { results: ResultOutput[] }) {
  const top3 = props.results
    .toSorted((a, b) => b.percentage - a.percentage)
    .slice(0, 3)
    .map((r) => ({
      studentName: r.name,
      subjects: r.subjects.map((s) => ({
        name: s.name,
        percentage: Number.parseInt(s.totalMarks),
        marks: s.totalMarks,
      })),
    }))

  return (
    <section className='space-y-8'>
      <h2 className='text-2xl font-bold text-center'>🥇🥈🥉 Class Toppers 🏆</h2>
      <ChartContainer
        className='min-h-50 w-full'
        config={top3[0].subjects.reduce(
          (acc, s, i) => (
            (acc[`subject-${i + 1}`] = { label: s.name, color: `var(--chart-${i + 1})` }), acc
          ),
          {} as ChartConfig
        )}>
        <BarChart accessibilityLayer data={top3}>
          <CartesianGrid className='stroke-secondary' stroke='none' vertical={false} />
          <XAxis dataKey='studentName' tickMargin={10} />
          <YAxis tickMargin={10} tickCount={6} domain={[50, 100]} tickFormatter={(v) => `${v}%`} />
          {top3[0].subjects.map((_, i) => (
            <Bar
              name={`subject-${i + 1}`}
              fill={`var(--color-subject-${i + 1})`}
              dataKey={`subjects.${i}.percentage`}
              radius={[4, 4, 0, 0]}>
              <LabelList dataKey={`subjects.${i}.marks`} position='top' />
            </Bar>
          ))}
          <ChartLegend iconType='square' content={<ChartLegendContent />} />
        </BarChart>
      </ChartContainer>
    </section>
  )
}
