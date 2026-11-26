import type { Answer, ModelAnswer } from '../types/extract.ts'

export function mapAnswers(questions: string[], modelAnswers: ModelAnswer[]): Answer[] {
  return questions.map((question, index) => {
    const match = modelAnswers.find((answer) => answer.index === index)
    return {
      question,
      response: match ? match.response : null,
    }
  })
}
