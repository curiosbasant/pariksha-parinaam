'use client'

import {
  queryOptions,
  experimental_streamedQuery as streamedQuery,
  useQuery,
} from '@tanstack/react-query'
import type { ResultOutput, ResultInput } from '~/lib/service'

const getOptions = (data: ResultInput) =>
  queryOptions({
    queryKey: ['result', data],
    queryFn: streamedQuery<ResultOutput>({
      async queryFn({ queryKey }) {
        const response = await fetch('/parinaam?' + new URLSearchParams(queryKey[1] as string))
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        return {
          async *[Symbol.asyncIterator]() {
            if (!reader) return null
            try {
              for (;;) {
                const { value, done } = await reader.read()
                if (done) break
                const result = decoder.decode(value).split('<SPLIT>')
                for (const seg of result) {
                  if (seg) yield JSON.parse(seg)
                }
              }
            } finally {
              reader.releaseLock()
            }
          },
        }
      },
    }),
    staleTime: Number.POSITIVE_INFINITY,
  })

export function useResultStream(props: { data: ResultInput }) {
  return useQuery(getOptions(props.data))
}
