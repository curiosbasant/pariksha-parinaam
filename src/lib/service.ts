export type ResultInput = {
  board?: 'rj'
  year?: string
  standard: string
  roll: string
}

export async function getResult(payload: ResultInput) {
  const searchParams = new URLSearchParams({
    board: payload.board || 'rj',
    year: payload.year || new Date().getFullYear().toString(),
    std: payload.standard,
    roll_no: payload.roll,
  })
  const data = await fetch(
    `https://boardresultapi${payload.standard}.amarujala.com/result?${searchParams}`
  ).then((res) => res.json())
  const subjects = []

  for (let i = 1; i < 6; i++) {
    const subjectName = data[`SC${i}`]
    if (!subjectName) continue
    subjects.push({
      name: subjectName,
      theoryMarks: data[`SC${i}P1`],
      sessionalMarks: data[`SC${i}P3`],
      totalMarks: data[`TOT${i}`],
    })
  }

  return {
    roll: data.ROLL_NO,
    name: data.CAN_NAME,
    fName: data.FNAME,
    mName: data.MNAME,
    school: data.CENT_NAME,
    stream: data.GROUP,
    division: data.RESULT,
    percentage: Number.parseFloat(data.PER),
    marksObtained: data.TOT_MARKS,
    subjects,
  }
}

export type ResultOutput = Awaited<ReturnType<typeof getResult>>
