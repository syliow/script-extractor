import { MAX_FILE_BYTES, MAX_FILES } from '../constant/limits.ts'

// Checks the upload before any model call.
// Returns the exam questions when the upload is allowed.
export async function validateExtractRequest(files: File[], questionsField: string | null): Promise<string[]> {
  if (files.length === 0) {
    throw new Error('Upload at least one PDF.')
  }

  if (files.length > MAX_FILES) {
    throw new Error('Upload at most 10 PDFs.')
  }

  const filenames = files.map((file) => file.name)
  if (new Set(filenames).size !== filenames.length) {
    throw new Error('Each PDF needs its own filename.')
  }

  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) {
      throw new Error(`${file.name} is larger than 25 MB.`)
    }

    // Every PDF starts with the characters %PDF.
    const header = await file.slice(0, 4).text()
    if (header !== '%PDF') {
      throw new Error(`${file.name} is not a PDF.`)
    }
  }

  return readQuestions(questionsField)
}

// The form sends questions as one text field, for example ["Q1. ..."].
function readQuestions(questionsField: string | null): string[] {
  if (!questionsField || questionsField.trim() === '') {
    throw new Error('Add at least one question.')
  }

  let questions: unknown
  try {
    questions = JSON.parse(questionsField)
  } catch {
    throw new Error('Questions must be a list of strings.')
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('Questions must be a list of strings.')
  }

  const list: string[] = []
  for (const question of questions) {
    if (typeof question !== 'string' || question.trim() === '') {
      throw new Error('Questions must be a list of strings.')
    }
    list.push(question)
  }

  return list
}
