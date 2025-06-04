export default function HomeLayout(props: LayoutProps<{ slots: 'form' | 'prefetchResults' }>) {
  return (
    <div className='space-y-16'>
      {props.form}
      {props.prefetchResults}
      {props.children}
    </div>
  )
}
