import { MAX_FILE_BYTES, MAX_FILES } from '../constant/limits.ts'

export async function validateExtractRequest(files: File[], questionsField: string | null): Promise<string[]> {
  if (files.length === 0) {
    throw new Error('At least one PDF is required.')
  }
  if (files.length > MAX_FILES) {
    throw new Error('At most 10 PDFs are allowed.')
  }
  if (files.some((file) => file.size > MAX_FILE_BYTES)) {
    throw new Error('Each PDF must be 25 MB or smaller.')
  }
  if (new Set(files.map((file) => file.name)).size !== files.length) {
    throw new Error('Filenames must be unique.')
  }

  for (const file of files) {
    const header = new Uint8Array(await file.slice(0, 4).arrayBuffer())
    const isPdf = header[0] === 0x25 && header[1] === 0x50 && header[2] === 0x44 && header[3] === 0x46
    if (!isPdf) {
      throw new Error('Only PDF files are allowed.')
    }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(questionsField ?? '')
  } catch {
    parsed = null
  }

  if (
    !Array.isArray(parsed) ||
    parsed.length === 0 ||
    parsed.some((question) => typeof question !== 'string' || question.trim() === '')
  ) {
    throw new Error('Questions must be a JSON array of strings.')
  }

  return parsed
}
