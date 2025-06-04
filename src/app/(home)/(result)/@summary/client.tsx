'use client'

import type { Ref } from 'react'
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
import type { LabelPosition } from 'recharts/types/component/Label'
import type { BaseAxisProps } from 'recharts/types/util/types'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart'
import { useElementSize } from '~/hooks/use-element-size'
import { useFilteredResults } from '../../query'

export function ClassResultPieChart() {
  const results = useFilteredResults()
  const divisions = Object.entries(Object.groupBy(results, (row) => row.division))

  return (
    <ChartContainer
      className='flex-1 aspect-square'
      config={divisions.reduce(
        (acc, [division], i) => (
          (acc[`division-${i + 1}`] = { label: division, color: `var(--chart-${i + 1})` }), acc
        ),
        {} as ChartConfig
      )}>
      <PieChart accessibilityLayer>
        <text
          className='text-foreground text-base'
          fill='currentColor'
          textAnchor='middle'
          x='50%'
          dy='1em'>
          Total Students: <tspan className='font-bold text-lg'>{results.length}</tspan>
        </text>
        <Pie data={divisions} nameKey='0' dataKey={(a) => a[1].length} cy='52.5%' outerRadius='90%'>
          <LabelList className='text-2xl fill-white pointer-events-none' />
          {divisions.map(([division], i) => (
            <Cell
              name={`division-${i + 1}`}
              fill={`var(--color-division-${i + 1})`}
              key={division}
            />
          ))}
        </Pie>
        <ChartLegend iconType='square' content={<ChartLegendContent />} />
        <ChartTooltip content={<ChartTooltipContent />} />
      </PieChart>
    </ChartContainer>
  )
}

export function ResponsiveClassToppersBarChart() {
  const [ref, size] = useElementSize()
  return <ClassToppersBarChart ref={ref} layout={size < 576 ? 'vertical' : 'horizontal'} />
}

export function ClassToppersBarChart(props: {
  ref?: Ref<HTMLDivElement>
  /** @default 'horizontal' */
  layout?: 'vertical' | 'horizontal'
}) {
  const results = useFilteredResults()
  const top3 = results
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
  const numberProps: BaseAxisProps = {
    type: 'number',
    tickCount: 6,
    domain: [50, 100],
    tickFormatter: (v: number) => `${v}%`,
  }
  const categoryProps: BaseAxisProps = {
    type: 'category',
    dataKey: 'studentName',
  }

  const [xAxisProps, yAxisProps] = isVertical
    ? [numberProps, categoryProps]
    : [categoryProps, numberProps]
  const [barRadius, labelPosition, aspectRatio]: [
    [number, number, number, number],
    LabelPosition,
    string
  ] = isVertical ? [[0, 4, 4, 0], 'right', '9/16'] : [[4, 4, 0, 0], 'top', '16/9']

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
        <YAxis {...yAxisProps} tickMargin={10} />
        <XAxis {...xAxisProps} tickMargin={10} />
        {top3[0].subjects.map((_, i) => (
          <Bar
            name={`subject-${i + 1}`}
            fill={`var(--color-subject-${i + 1})`}
            dataKey={`subjects.${i}.percentage`}
            radius={barRadius}>
            <LabelList dataKey={`subjects.${i}.marks`} position={labelPosition} />
          </Bar>
        ))}
        <ChartLegend className='pt-5' iconType='square' content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  )
}
