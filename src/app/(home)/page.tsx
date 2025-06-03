import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '~/lib/query'
import { getOptions } from '../query'
import { ResultDisplay } from './result-display'
import type { HomeProps } from './shared'

export default async function HomePage(props: HomeProps) {
  const { standard, roll } = await props.searchParams
  if (!standard || !roll) return null
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(getOptions({ standard, roll }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ResultDisplay standard={standard} roll={roll} />
    </HydrationBoundary>
  )
}
