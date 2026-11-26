import { MAX_FILE_BYTES, MAX_FILES } from '../constant/limits.ts'

const PDF_HEADER = [0x25, 0x50, 0x44, 0x46]

export type ValidationSuccess = {
  ok: true
  questions: string[]
}

export type ValidationFailure = {
  ok: false
  error: string
}

export async function validateExtractRequest(
  files: File[],
  questionsField: string | null,
): Promise<ValidationSuccess | ValidationFailure> {
  if (files.length === 0) {
    return { ok: false, error: 'At least one PDF is required.' }
  }

  if (files.length > MAX_FILES) {
    return { ok: false, error: 'At most 10 PDFs are allowed.' }
  }

  if (files.some((file) => file.size > MAX_FILE_BYTES)) {
    return { ok: false, error: 'Each PDF must be 25 MB or smaller.' }
  }

  const names = files.map((file) => file.name)
  if (new Set(names).size !== names.length) {
    return { ok: false, error: 'Filenames must be unique.' }
  }

  for (const file of files) {
    if (!(await isPdf(file))) {
      return { ok: false, error: 'Only PDF files are allowed.' }
    }
  }

  return parseQuestions(questionsField)
}

async function isPdf(file: File): Promise<boolean> {
  const header = new Uint8Array(await file.slice(0, PDF_HEADER.length).arrayBuffer())
  return PDF_HEADER.every((byte, index) => header[index] === byte)
}

function parseQuestions(questionsField: string | null): ValidationSuccess | ValidationFailure {
  if (questionsField === null || questionsField.trim() === '') {
    return { ok: false, error: 'Questions are required.' }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(questionsField)
  } catch {
    return { ok: false, error: 'Questions must be a JSON array of strings.' }
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    return { ok: false, error: 'At least one question is required.' }
  }

  if (!parsed.every((question) => typeof question === 'string' && question.trim() !== '')) {
    return { ok: false, error: 'Questions must be a JSON array of strings.' }
  }

  return { ok: true, questions: parsed }
}
