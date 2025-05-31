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
  const encoder = new TextEncoder()
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()
      if (done) {
        controller.close()
      } else {
        controller.enqueue(encoder.encode(JSON.stringify(value) + '<SPLIT>'))
      }
    },
  })
}

async function* makeIterator(data: ResultInput) {
  const firstResult = await getResult({ board: 'rj', year: '2025', ...data })
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
  let currentRoll = Number.parseInt(data.roll)
  for (;;) {
    yield getResult({
      board: 'rj',
      year: '2025',
      standard: data.standard,
      roll: currentRoll.toString(),
    })
    currentRoll++
  }
}

function take<T>(iterator: Iterator<T>, limit: number): T[] {
  const result: T[] = []
  let count = 0
  let next = iterator.next()

  while (!next.done && count < limit) {
    result.push(next.value)
    count++
    next = iterator.next()
  }

  return result
}
