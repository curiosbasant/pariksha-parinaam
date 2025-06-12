'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Share2Icon } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import { Button } from '~/components/ui/button'
import { getQueryClient } from '~/lib/query'
import { useResults } from './(home)/query'

export function Providers(props: PropsWithChildren) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export function ShareResultButton() {
  const results = useResults()

  if (!results?.[0]) return null
  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={async () => {
        const search = new URLSearchParams(location.search)
        const year = search.get('year')
        const standard = search.get('standard')
        await navigator
          .share({
            title: `${results[0].school} ⸺ ${standard}th Result ${year}`,
            url: location.href,
          })
          .catch(() => {})
      }}
      title='Share Result'
      type='button'>
      <Share2Icon />
    </Button>
  )
}
