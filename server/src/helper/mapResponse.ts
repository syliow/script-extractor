import type { Answer, ModelAnswer } from '../types/extract.ts'

// The model returns an answer index and the essay text.
// This attaches the original question text, so the model cannot rephrase the question.
// A question the model skipped becomes null.
export function mapAnswers(questions: string[], modelAnswers: ModelAnswer[]): Answer[] {
  return questions.map((question, questionIndex) => {
    const modelAnswer = modelAnswers.find((answer) => answer.index === questionIndex)

    if (!modelAnswer) {
      return { question, response: null }
    }

    return { question, response: modelAnswer.response }
  })
}
