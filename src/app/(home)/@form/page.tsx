import Form from 'next/form'
import { FormField } from '~/components/forms'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import type { HomeProps } from '../shared'

export default async function FormSlot(props: HomeProps) {
  const searchParams = await props.searchParams

  return (
    <Form action='' className='grid sm:grid-cols-2 gap-4'>
      <FormField label='Standard'>
        <Select name='standard' defaultValue={searchParams?.standard}>
          <SelectTrigger className='w-full'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='10'>Class 10</SelectItem>
            <SelectItem value='12'>Class 12</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
      <FormField label='Starting Roll Number'>
        <Input name='roll' defaultValue={searchParams?.roll} />
      </FormField>
      <div className='flex col-span-full justify-end'>
        <Button type='submit'>Submit</Button>
      </div>
    </Form>
  )
}
