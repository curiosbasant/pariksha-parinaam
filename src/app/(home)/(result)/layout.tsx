'use client'

import type { PropsWithChildren } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { useNativeSearchParam } from '~/hooks/use-search-params'
import { useResults, useResultsQuery } from '../query'

export default function ResultLayout(props: LayoutProps<{ slots: 'table' | 'summary' }>) {
  const { isLoading, data, error } = useResultsQuery()

  if (isLoading) {
    return (
      <div className='flex h-96'>
        <div className='rounded-full m-auto border-4 p-4 border-blue-500 border-s-transparent animate-spin' />
      </div>
    )
  }

  if (data && data.length > 0) {
    return (
      <>
        <h2 className='text-2xl font-bold text-center text-balance px-8'>{data[0].school}</h2>
        <ResultTabs>
          <div className='flex items-center gap-4 justify-between'>
            <TabsList>
              <TabsTrigger value='table'>Table</TabsTrigger>
              <TabsTrigger value='summary'>Summary</TabsTrigger>
            </TabsList>
            {data[0].stream && (
              <>
                <label className='ms-auto'>Stream:</label>
                <SelectStreamFilter />
              </>
            )}
          </div>
          <TabsContent value='table' asChild>
            {props.table}
          </TabsContent>
          <TabsContent value='summary' className='grid lg:grid-cols-[1fr_2fr] items-start gap-y-16'>
            {props.summary}
          </TabsContent>
        </ResultTabs>
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

  return null
}

function ResultTabs(props: PropsWithChildren) {
  const [tab, setTab] = useNativeSearchParam('tab', 'table')
  return (
    <Tabs className='gap-8' value={tab} onValueChange={(v) => setTab(v)}>
      {props.children}
    </Tabs>
  )
}

function SelectStreamFilter() {
  const results = useResults()
  const [param, setParam] = useNativeSearchParam('stream')

  const streamMap = Object.groupBy(results, (row) => row.stream)
  const allStreams = Object.entries(streamMap)

  return (
    <Select value={param ?? results[0].stream} onValueChange={setParam}>
      <SelectTrigger className='capitalize min-w-32'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {allStreams.map(([stream, rows]) => (
          <SelectItem className='capitalize' value={stream} key={stream}>
            {stream.toLowerCase()} ({rows?.length})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
