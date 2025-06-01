import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent } from '~/components/ui/chart'
import type { ResultOutput } from '~/lib/service'

export function ClassResultPieChart(props: { results: ResultOutput[] }) {
  const divisions = Object.entries(Object.groupBy(props.results, (row) => row.division))

  return (
    <section className='gap-8 flex flex-col'>
      <h2 className='text-2xl font-bold text-center'>🎯 Class Result 🍕</h2>
      <ChartContainer
        className='flex-1 w-full'
        config={divisions.reduce(
          (acc, [division], i) => (
            (acc[`division-${i + 1}`] = { label: division, color: `var(--chart-${i + 1})` }), acc
          ),
          {} as ChartConfig
        )}>
        <PieChart accessibilityLayer>
          <text
            className='text-foreground text-sm'
            fill='currentColor'
            textAnchor='middle'
            x='50%'
            dy='1em'>
            Total Students: <tspan className='font-bold text-base'>{props.results.length}</tspan>
          </text>
          <Pie data={divisions} nameKey='0' dataKey={(a) => a[1].length} outerRadius='90%'>
            <LabelList className='text-2xl fill-white' />
            {divisions.map(([division], i) => (
              <Cell
                name={`division-${i + 1}`}
                fill={`var(--color-division-${i + 1})`}
                key={division}
              />
            ))}
          </Pie>
          <ChartLegend iconType='square' content={<ChartLegendContent />} />
        </PieChart>
      </ChartContainer>
    </section>
  )
}

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
