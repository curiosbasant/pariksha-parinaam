export default function ResultTableSlotLayout(props: LayoutProps<{ slots: 'subjectWise' }>) {
  return (
    <div>
      {props.children}
      <h2 className='text-2xl font-bold text-center mt-16 mb-8'>📚 Subject wise Result</h2>
      {props.subjectWise}
    </div>
  )
}
