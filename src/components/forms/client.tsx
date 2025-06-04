'use client'

import { Loader2Icon } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '../ui/button'

export function FormSubmitButton(props: PropsWithChildren) {
  const { pending } = useFormStatus()
  return (
    <Button className='grid place-items-center group' aria-disabled={pending} type='submit'>
      <Loader2Icon className='size-5 text-primary-foreground group-aria-disabled:animate-spin group-not-aria-disabled:opacity-0 transition-opacity row-start-1 col-start-1' />
      <span className='group-aria-disabled:opacity-0 transition-opacity row-start-1 col-start-1'>
        {props.children}
      </span>
    </Button>
  )
}
