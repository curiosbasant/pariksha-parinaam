import { queryOptions, experimental_streamedQuery as streamedQuery } from '@tanstack/react-query'
import { ResultOutput } from '~/lib/service'

export type HomeProps = PageProps<{ searchParams: 'standard' | 'roll' | 'tab' | 'stream' }>

export type ResultQueryInput = { standard?: string | null; roll?: string | null }

export const getResultsOptions = (data: ResultQueryInput) =>
  queryOptions({
    queryKey: ['results', data],
    enabled: !!(data.standard && data.roll),
    queryFn: streamedQuery<ResultOutput, [string, ResultQueryInput]>({
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
                console.log({ value })
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
