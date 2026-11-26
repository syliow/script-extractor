import { MAX_FILE_BYTES, MAX_FILES } from '../constant/limits.ts'

// Checks the uploaded PDFs before any model call.
export async function validateExtractRequest(files: File[]): Promise<void> {
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
}
