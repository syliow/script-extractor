import type { Answer, ModelAnswer, ScriptResult } from '../types/extract.ts'

export function mapAnswers(questions: string[], modelAnswers: ModelAnswer[]): Answer[] {
  return questions.map((question, index) => {
    const match = modelAnswers.find((answer) => answer.index === index)
    return {
      question,
      response: match ? match.response : null,
    }
  })
}

export function failedScript(filename: string, questions: string[], error: string): ScriptResult {
  return {
    filename,
    error,
    responses: questions.map((question) => ({ question, response: null })),
  }
}

export async function extractScripts<T extends { filename: string }>(
  files: T[],
  questions: string[],
  extractFile: (file: T) => Promise<ModelAnswer[]>,
): Promise<ScriptResult[]> {
  return Promise.all(
    files.map(async (file) => {
      try {
        const answers = await extractFile(file)
        return {
          filename: file.filename,
          responses: mapAnswers(questions, answers),
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Extraction failed.'
        return failedScript(file.filename, questions, message)
      }
    }),
  )
}
