import { NextRequest, NextResponse } from 'next/server'
import { getResult, type ResultInput } from '~/lib/service'

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const standard = params.get('standard')
  const roll = params.get('roll')

  if (!standard || !roll) return NextResponse.json({ success: false })

  const iterator = makeIterator({ standard, roll })
  const stream = iteratorToStream(iterator)

  return new Response(stream)
}

function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()
      if (done) {
        if (value === null) controller.error(new Error('Invalid data provided!'))
        controller.close()
      } else {
        controller.enqueue(JSON.stringify(value) + '<SPLIT>')
      }
    },
  })
}

async function* makeIterator(data: ResultInput) {
  const firstResult = await getResult({ board: 'rj', year: '2025', ...data })
  if (!firstResult.roll) return null
  yield firstResult

  const resultSequence = generateResultSequence(data)

  infiniteLoop: for (;;) {
    for await (const result of take(resultSequence, 5)) {
      if (firstResult.school === result.school) {
        yield result
      } else {
        break infiniteLoop
      }
    }
  }
}

function* generateResultSequence(data: ResultInput) {
  let currentRoll = Number.parseInt(data.roll) + 1
  for (;;) {
    yield getResult({ standard: data.standard, roll: currentRoll.toString() })
    currentRoll++
  }
}
function take<T>(iterator: Iterator<T>, limit: number): T[] {
  const result: T[] = []
  for (;;) {
    const { done, value } = iterator.next()
    if (done || result.push(value) >= limit) break
  }
  return result
}
