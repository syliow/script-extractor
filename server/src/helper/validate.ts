import { ERRORS } from '../constant/errors.ts'
import { MAX_FILE_BYTES, MAX_FILES } from '../constant/limits.ts'

// Checks the uploaded PDFs before any model call.
export async function validateExtractRequest(files: File[]): Promise<void> {
  if (files.length === 0) {
    throw new Error(ERRORS.NO_PDF)
  }

  if (files.length > MAX_FILES) {
    throw new Error(ERRORS.TOO_MANY_PDFS)
  }

  const filenames = files.map((file) => file.name)
  if (new Set(filenames).size !== filenames.length) {
    throw new Error(ERRORS.DUPLICATE_FILENAME)
  }

  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) {
      throw new Error(ERRORS.FILE_TOO_LARGE(file.name))
    }

    // Every PDF starts with the characters %PDF.
    const header = await file.slice(0, 4).text()
    if (header !== '%PDF') {
      throw new Error(ERRORS.NOT_PDF(file.name))
    }
  }
}
