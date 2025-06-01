import type { ComponentClass, Ref } from 'react'
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
  YAxisProps,
} from 'recharts'
import { LabelPosition } from 'recharts/types/component/Label'
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent } from '~/components/ui/chart'
import { useElementSize } from '~/hooks/use-element-size'
import type { ResultOutput } from '~/lib/service'

export function ClassResultPieChart(props: { results: ResultOutput[] }) {
  const divisions = Object.entries(Object.groupBy(props.results, (row) => row.division))

  return (
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
  )
}

export function ResponsiveClassToppersBarChart(props: { results: ResultOutput[] }) {
  const [ref, size] = useElementSize()
  return (
    <ClassToppersBarChart ref={ref} layout={size < 576 ? 'vertical' : 'horizontal'} {...props} />
  )
}

export function ClassToppersBarChart(props: {
  ref?: Ref<HTMLDivElement>
  results: ResultOutput[]
  /** @default 'horizontal' */
  layout?: 'vertical' | 'horizontal'
}) {
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

  const isVertical = props.layout === 'vertical'
  // @ts-expect-error
  const [HorizontalAxis, VerticalAxis, barRadius, labelPosition, aspectRatio]: [
    ComponentClass<XAxis | YAxisProps>,
    ComponentClass<XAxis | YAxisProps>,
    [number, number, number, number],
    LabelPosition,
    string
  ] = isVertical
    ? [YAxis, XAxis, [0, 4, 4, 0], 'right', '9/16']
    : [XAxis, YAxis, [4, 4, 0, 0], 'top', '16/9']

  return (
    <ChartContainer
      ref={props.ref}
      className='min-h-50 w-full'
      style={{ aspectRatio }}
      config={top3[0].subjects.reduce(
        (acc, s, i) => (
          (acc[`subject-${i + 1}`] = { label: s.name, color: `var(--chart-${i + 1})` }), acc
        ),
        {} as ChartConfig
      )}>
      <BarChart data={top3} layout={props.layout} accessibilityLayer>
        <CartesianGrid
          className='stroke-secondary'
          stroke='none'
          horizontal={!isVertical}
          vertical={isVertical}
        />
        <HorizontalAxis type='category' dataKey='studentName' tickMargin={10} />
        <VerticalAxis
          type='number'
          tickMargin={10}
          tickCount={6}
          domain={[50, 100]}
          tickFormatter={(v) => `${v}%`}
        />
        {top3[0].subjects.map((_, i) => (
          <Bar
            name={`subject-${i + 1}`}
            fill={`var(--color-subject-${i + 1})`}
            dataKey={`subjects.${i}.percentage`}
            radius={barRadius}>
            <LabelList dataKey={`subjects.${i}.marks`} position={labelPosition} />
          </Bar>
        ))}
        <ChartLegend iconType='square' content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  )
}
