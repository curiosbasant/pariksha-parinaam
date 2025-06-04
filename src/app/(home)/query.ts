'use client'

import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { getResultsOptions } from './shared'

export function useResultsQuery() {
  const searchParams = useSearchParams()
  const standard = searchParams.get('standard')
  const roll = searchParams.get('roll')

  return useQuery(getResultsOptions({ standard, roll }))
}

export function useResults() {
  return useResultsQuery().data!
}

export function useFilteredResults() {
  const results = useResultsQuery().data!
  const searchParams = useSearchParams()
  const stream = searchParams.get('stream')

  return stream && results.length > 0 ? results.filter((r) => r.stream === stream) : results
}
