export default function HomeLayout(props: LayoutProps<{ slots: 'form' }>) {
  return (
    <div className='space-y-16'>
      {props.form}
      {props.children}
    </div>
  )
}
